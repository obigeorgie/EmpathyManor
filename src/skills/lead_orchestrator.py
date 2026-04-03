import os
import json
import logging
from dataclasses import dataclass
from typing import Optional, Dict, Any

from dotenv import load_dotenv
load_dotenv('.env.local')

from google import generativeai as genai
from apify_client import ApifyClient
import firebase_admin
from firebase_admin import credentials, firestore

# Configure rigorous logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("LeadOrchestrator")


# === TASK 1: Define the State Object ===
@dataclass
class LeadState:
    """Standardized JSON-serializable state representing an extracted lead."""
    query_or_url: str
    raw_data: Optional[Dict[str, Any]] = None
    quality_score: Optional[int] = None
    reasoning: Optional[str] = None
    firebase_id: Optional[str] = None


# === TASK 2: Build the Three Agent Functions ===

def run_lead_scout(query_or_url: str) -> LeadState:
    """
    Triggers Apify, extracts profile data, and returns state with `raw_data`.
    """
    logger.info(f"LeadScout: Starting extraction for {query_or_url}")
    
    apify_token = os.environ.get("APIFY_API_TOKEN")
    if not apify_token:
        raise ValueError("APIFY_API_TOKEN is missing in environment variables.")
        
    client = ApifyClient(apify_token)
    
    # Defaulting to an example actor, substitute with the correct one if needed
    actor_id = os.environ.get("APIFY_ACTOR_ID", "jloire/linkedin-profile-scraper") 
    run_input = {
        "urls": [query_or_url],
        "searchStringsArray": [query_or_url]
    }
    
    logger.info(f"LeadScout: Calling Apify Actor {actor_id}...")
    run = client.actor(actor_id).call(run_input=run_input)
    
    dataset_client = client.dataset(run["defaultDatasetId"])
    dataset_items = dataset_client.list_items().items
    
    if not dataset_items:
        raise ValueError("Apify scan returned empty results for the provided query/URL.")
        
    raw_data = dataset_items[0]
    logger.info("LeadScout: Profiling successful. Raw data extracted.")
    
    return LeadState(
        query_or_url=query_or_url,
        raw_data=raw_data
    )


def run_deal_analyst(state: LeadState) -> LeadState:
    """
    Calls Gemini API to evaluate unstructured `raw_data` against Magodo arbitrage criteria.
    Updates the state with `quality_score` and `reasoning`.
    """
    logger.info("DealAnalyst: Commencing deal arbitrage evaluation.")
    
    if not state.raw_data:
        raise ValueError("Analyst requires state to have populated 'raw_data'")
        
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY is missing in environment variables.")
        
    genai.configure(api_key=gemini_api_key)

    # Using the current leading edge model contextually
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    prompt = f"""
    You are an expert Real Estate Deal Analyst specializing in Magodo arbitrage criteria.
    Evaluate the following LinkedIn profile data to determine if this individual is a qualified lead 
    (focusing on high net worth indicators, interest in real estate, or investment capital).
    
    Raw Profile Data:
    {json.dumps(state.raw_data, indent=2)}
    
    Respond STRICTLY in JSON format with exactly the following schema:
    {{
        "quality_score": <int between 1-10, where 10 is the strongest fit>,
        "reasoning": "<string explaining why they match the Magodo arbitrage criteria>"
    }}
    """
    
    logger.info("DealAnalyst: Sending prompt to Gemini...")
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
        )
    )
    
    try:
        analysis = json.loads(response.text)
        state.quality_score = int(analysis.get("quality_score", 0))
        state.reasoning = analysis.get("reasoning", "No valid reasoning parsed.")
        logger.info(f"DealAnalyst: Scoring complete. Quality Score: {state.quality_score}/10")
    except (json.JSONDecodeError, ValueError) as parse_err:
        raise RuntimeError(f"Failed to parse or interpret Gemini response: {str(parse_err)} | Raw Text: {response.text}")
        
    return state


def run_vault_manager(state: LeadState) -> LeadState:
    """
    Takes the scored state. If quality_score >= 7, logs in to Firebase and pushes the lead
    to the 'empathy_leads' collection, then maps back the 'firebase_id'.
    """
    logger.info(f"VaultManager: Validating eligibility. Current Score: {state.quality_score}")
    
    if state.quality_score is None:
        raise ValueError("VaultManager cannot process an un-scored LeadState.")
        
    if state.quality_score < 7:
        logger.info(f"VaultManager: Lead rejected. Score {state.quality_score} < 7. Halting persistence.")
        return state
        
    logger.info("VaultManager: Lead accepted. Establishing secure channel to Firebase...")
    
    if not firebase_admin._apps:
        # Initialize Firebase securely using default configuration patterns
        creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        if creds_path:
            cred = credentials.Certificate(creds_path)
            firebase_admin.initialize_app(cred)
        else:
            firebase_admin.initialize_app()
            
    db = firestore.client()
    
    # Constructing the payload for persistence
    document_data = {
        "queryOrUrl": state.query_or_url,
        "rawData": state.raw_data,
        "qualityScore": state.quality_score,
        "reasoning": state.reasoning,
        "status": "ingested",
        "createdAt": firestore.SERVER_TIMESTAMP
    }
    
    try:
        collection_ref = db.collection("empathy_leads")
        _, doc_ref = collection_ref.add(document_data)
        
        state.firebase_id = doc_ref.id
        logger.info(f"VaultManager: Lead securely pushed to Empathy Vault. Doc ID: {state.firebase_id}")
    except Exception as e:
        raise RuntimeError(f"Firestore Insertion Error: {str(e)}")
        
    return state


# === TASK 3: Build the Orchestrator (The Main Loop) ===

def process_lead(query_or_url: str) -> Optional[LeadState]:
    """
    Process an individual lead URL or query through the multi-agent orchestration pipeline.
    Rigorous failure bounds gracefully halt downstream processing upon any agent's failure.
    """
    logger.info(f"--- ORCHESTRATOR: Initiating sequence for {query_or_url} ---")
    state = None
    
    # Step 1: Engage Lead Scout (Apify Extraction)
    try:
        state = run_lead_scout(query_or_url)
    except Exception as e:
        logger.error(f"🚨 Orchestrator HALTED [LeadScout]: Failed to extract data. Details: {str(e)}")
        # Halting execution; ensuring we don't blindly pass empty state forward.
        return None

    # Step 2: Engage Deal Analyst (Gemini Analysis)
    try:
        state = run_deal_analyst(state)
    except Exception as e:
        logger.error(f"🚨 Orchestrator HALTED [DealAnalyst]: Failed to evaluate deal criteria. Details: {str(e)}")
        return state 

    # Step 3: Engage Vault Manager (Firestore Persistence)
    try:
        state = run_vault_manager(state)
    except Exception as e:
        logger.error(f"🚨 Orchestrator HALTED [VaultManager]: Failed to commit lead to vault. Details: {str(e)}")
        return state
        
    logger.info(f"✅ ORCHESTRATOR: Execution successfully finalized! Firebase DB ID: {state.firebase_id}")
    return state

if __name__ == "__main__":
    import sys
    # Small test loop for manual execution
    if len(sys.argv) > 1:
        target_input = sys.argv[1]
        process_lead(target_input)
    else:
        logger.warning("No input provided. Usage: python lead_orchestrator.py <query_or_url>")
