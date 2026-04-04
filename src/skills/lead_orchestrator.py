import os
import json
import logging
import requests
from dataclasses import dataclass, asdict
from typing import Optional, Dict, Any, List

from dotenv import load_dotenv
load_dotenv('.env.local')

from google import genai
import firebase_admin
from firebase_admin import credentials, firestore

# Configure rigorous logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("LeadOrchestrator")


# === TASK 1: Create the Universal State Object ===

@dataclass
class NormalizedLead:
    name: str
    job_title: str
    location: str
    bio_context: str
    source: str # e.g., 'NPI', 'LinkedIn', 'Google'

@dataclass
class LeadState:
    """Standardized JSON-serializable wrapper passed down the agent pipeline."""
    normalized_data: NormalizedLead
    quality_score: Optional[int] = None
    reasoning: Optional[str] = None
    firebase_id: Optional[str] = None


# === TASK 2: Build the NPI Scout (The Adapter) ===

def run_npi_scout(city: str, state: str, taxonomy_desc: str) -> List[NormalizedLead]:
    """
    Makes a GET request to the public NPI API and returns a list of NormalizedLead objects.
    """
    logger.info(f"NPI Scout: Searching {taxonomy_desc} in {city}, {state}...")
    
    url = f"https://npiregistry.cms.hhs.gov/api/?version=2.1&city={city}&state={state}&taxonomy_description={taxonomy_desc}&limit=50"
    
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    
    normalized_leads = []
    results = data.get("results", [])
    
    for row in results:
        basic = row.get("basic", {})
        first_name = basic.get("first_name", "")
        last_name = basic.get("last_name", "")
        
        taxonomies = row.get("taxonomies", [])
        job_t = taxonomies[0].get("desc", "Unknown") if len(taxonomies) > 0 else "Unknown"
        
        addresses = row.get("addresses", [])
        address_c = addresses[0].get("city", "Unknown") if len(addresses) > 0 else "Unknown"
        address_s = addresses[0].get("state", "Unknown") if len(addresses) > 0 else "Unknown"
        
        new_lead = NormalizedLead(
            name=f"{first_name} {last_name}".strip(),
            job_title=job_t,
            location=f"{address_c}, {address_s}",
            bio_context="Verified US Medical License via NPI Registry",
            source="NPI"
        )
        normalized_leads.append(new_lead)
        
    logger.info(f"NPI Scout: Successfully parsed {len(normalized_leads)} standardized records.")
    return normalized_leads


# === DOWNSTREAM AGENTS ===

def run_deal_analyst(state: LeadState) -> LeadState:
    """
    Calls Gemini API to evaluate unstructured `normalized_data` against Magodo arbitrage criteria.
    Updates the state with `quality_score` and `reasoning`.
    """
    if not state.normalized_data:
        raise ValueError("Analyst requires state to have populated 'normalized_data'")
        
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY is missing in environment variables.")
        
    client = genai.Client(api_key=gemini_api_key)
    
    prompt = f"""
    You are an elite Real Estate Analyst for Empathy Manor. Your job is to filter scraped lead data to find high-net-worth Nigerian diaspora professionals (e.g., physicians, tech founders) based in the US or UK.

    We are pitching a high-ticket real estate arbitrage opportunity in Magodo GRA Phase 2 (Lagos).

    Evaluate the provided JSON data. Assign a quality_score from 1 to 10 based on these criteria:

    10/10: Explicitly Nigerian name/identity AND high-income profession (Surgeon, Specialist, Founder, Executive).

    7/10: Likely African diaspora AND high-income profession OR Explicitly Nigerian but medium-income profession.

    3/10: High-income profession but zero obvious ties to the diaspora (Do not pitch Nigerian real estate blindly).

    1/10: Low-income profession or invalid data.
    
    Normalized Lead Data:
    {json.dumps(asdict(state.normalized_data), indent=2)}

    Return ONLY a JSON object: {{"quality_score": <number>, "reasoning": "<1 sentence explanation>"}}.
    """
    
    response = client.models.generate_content(model='gemini-2.5-pro', contents=prompt)
    
    try:
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
                
        analysis = json.loads(raw_text.strip())
        state.quality_score = int(analysis.get("quality_score", 0))
        state.reasoning = analysis.get("reasoning", "No valid reasoning parsed.")
        logger.info(f"DealAnalyst: Scored {state.normalized_data.name} -> {state.quality_score}/10")
    except (json.JSONDecodeError, ValueError) as parse_err:
        raise RuntimeError(f"Failed to parse or interpret Gemini response: {str(parse_err)} | Raw Text: {response.text}")
        
    return state


def run_vault_manager(state: LeadState) -> LeadState:
    """
    Takes the scored state. If quality_score >= 7, logs in to Firebase and pushes the lead
    to the 'empathy_leads' collection, then maps back the 'firebase_id'.
    """
    logger.info(f"VaultManager: Lead {state.normalized_data.name} meets threshold. Persisting to database...")
    
    if not firebase_admin._apps:
        creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        if creds_path:
            cred = credentials.Certificate(creds_path)
            firebase_admin.initialize_app(cred)
        else:
            firebase_admin.initialize_app()
            
    db = firestore.client()
    
    # Constructing the payload for persistence using the clean Normalized schema
    document_data = {
        "normalizedData": asdict(state.normalized_data),
        "qualityScore": state.quality_score,
        "reasoning": state.reasoning,
        "status": "ingested",
        "createdAt": firestore.SERVER_TIMESTAMP
    }
    
    try:
        collection_ref = db.collection("empathy_leads")
        _, doc_ref = collection_ref.add(document_data)
        
        state.firebase_id = doc_ref.id
        logger.info(f"VaultManager: Successfully persisted {state.normalized_data.name}. Doc ID: {state.firebase_id}")
    except Exception as e:
        raise RuntimeError(f"Firestore Insertion Error: {str(e)}")
        
    return state


# === TASK 3: Update the Orchestrator Main Loop ===

def process_lead():
    """
    Orchestrates the ETL batch processing logic retrieving bulk items from our adapter
    and mapping them consecutively via downstream analysis tools into our data vault.
    """
    logger.info("--- ORCHESTRATOR: Initiating Bulk Deal Analysis Pipeline ---")
    
    # Step 1: Engage Lead Scout (Adapter Selection)
    try:
        # Note: We are hardcoding this specific execution block for the NPI logic test.
        leads = run_npi_scout(city="Tampa", state="FL", taxonomy_desc="Surgery")
    except Exception as e:
        logger.error(f"🚨 Orchestrator HALTED [LeadScout]: Failed to extract data. Details: {str(e)}")
        return
        
    logger.info(f"Orchestrator: Queued {len(leads)} candidates for Deal Analysis.")

    # Loop through the parsed items 
    for npi_lead in leads:
        logger.info(f"> Processing Candidate: {npi_lead.name}")
        state = LeadState(normalized_data=npi_lead)
        
        # Step 2: Engage Deal Analyst (Gemini Analysis)
        try:
            state = run_deal_analyst(state)
        except Exception as e:
            logger.error(f"  └── 🚨 Analyst Exception for {npi_lead.name}: {str(e)}")
            continue 

        # Step 3: Engage Vault Manager (Firestore Persistence)
        if state.quality_score is not None and state.quality_score >= 7:
            try:
                state = run_vault_manager(state)
            except Exception as e:
                logger.error(f"  └── 🚨 VaultManager Exception for {npi_lead.name}: {str(e)}")
                continue
        else:
            logger.info(f"  └── Orchestrator: Candidate {npi_lead.name} bypassed. Score: {state.quality_score}")
            
    logger.info(f"✅ ORCHESTRATOR: Batch job successfully concluded.")

if __name__ == "__main__":
    # Test execution
    process_lead()
