import os
import json
import logging
from typing import Dict, Any, List

# Apify Client
from apify_client import ApifyClient

# Google Generative AI (Gemini)
import google.generativeai as genai

# Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Configuration & Initialization ---

# Initialize Apify Client
# Requires APIFY_API_TOKEN environment variable
APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN")
if APIFY_API_TOKEN:
    apify_client = ApifyClient(APIFY_API_TOKEN)
else:
    logger.warning("APIFY_API_TOKEN environment variable is not set.")
    apify_client = None

# Initialize Gemini API
# Requires GEMINI_API_KEY environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY environment variable is not set.")

# Initialize Firebase Admin
# Requires FIREBASE_SERVICE_ACCOUNT_KEY path to the credentials JSON
FIREBASE_CREDS_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
if FIREBASE_CREDS_PATH and os.path.exists(FIREBASE_CREDS_PATH):
    try:
        cred = credentials.Certificate(FIREBASE_CREDS_PATH)
        # Check if already initialized to avoid errors if imported multiple times
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        db = firestore.client()
    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin SDK: {e}")
        db = None
else:
    logger.warning("FIREBASE_SERVICE_ACCOUNT_KEY not set or invalid. Firebase will not be initialized.")
    db = None


def scrape_linkedin_profiles(query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Triggers an Apify LinkedIn Search Actor to find profiles based on a query.
    Waits for the run to complete and fetches the resulting dataset.
    """
    if not apify_client:
        logger.error("ApifyClient not initialized. Check APIFY_API_TOKEN.")
        return []

    logger.info(f"Starting Apify LinkedIn scrape for query: '{query}'")
    
    # We use a placeholder generic actor ID as specified
    actor_id = "apify/linkedin-search-scraper"
    
    # Prepare the Actor input
    run_input = {
        "queries": [query],
        "maxResults": max_results
    }

    try:
        # Run the Actor and wait for it to finish
        run = apify_client.actor(actor_id).call(run_input=run_input)
        
        # Fetch and return Actor results from the run's dataset
        dataset_items = apify_client.dataset(run["defaultDatasetId"]).list_items().items
        logger.info(f"Successfully scraped {len(dataset_items)} profiles.")
        return dataset_items
    except Exception as e:
        logger.error(f"Apify scraping failed: {e}")
        return []


def score_profile_with_gemini(profile: Dict[str, Any]) -> Dict[str, Any]:
    """
    Passes profile bio, job title, and location to Gemini API.
    Evaluates against Magodo real estate arbitrage criteria (High Net Worth, Diaspora, Professional).
    Uses a strict system prompt to force a JSON object return: 
    {"quality_score": <1-10>, "reasoning": "<short string>"}
    """
    if not GEMINI_API_KEY:
        logger.error("Gemini API not configured. Check GEMINI_API_KEY.")
        return {"quality_score": 0, "reasoning": "Gemini API not configured."}

    bio = profile.get("summary", "") or profile.get("about", "")
    job_title = profile.get("headline", "") or profile.get("jobTitle", "")
    location = profile.get("location", "")
    
    prompt = f"""
    Evaluate the following professional profile against the "Magodo Real Estate Arbitrage" criteria.
    Criteria: We are looking for High Net Worth Individuals, Diaspora members (Nigerians living abroad), and highly skilled Professionals who might invest in premium Real Estate in Lagos, Nigeria.
    
    Profile Data:
    - Job Title: {job_title}
    - Location: {location}
    - Bio: {bio}
    
    Return EXACTLY a valid JSON object (no markdown, no extra text) with the following structure:
    {{"quality_score": <1-10>, "reasoning": "<short explanation why they fit or don't fit>"}}
    """
    
    try:
        # Using Gemini 1.5 Flash for fast reasoning
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        
        result_text = response.text.strip()
        
        # Strip potential markdown code blocks if the model ignores the instruction
        if result_text.startswith("```"):
            lines = result_text.split("\n")
            if len(lines) > 1:
                result_text = "\n".join(lines[1:])
            if result_text.endswith("```"):
                result_text = "\n".join(result_text.split("\n")[:-1])
                 
        result_json = json.loads(result_text)
        return {
            "quality_score": int(result_json.get("quality_score", 0)),
            "reasoning": result_json.get("reasoning", "")
        }
    except Exception as e:
        logger.error(f"Gemini scoring failed for profile {profile.get('fullName', 'Unknown')}: {e}")
        return {"quality_score": 0, "reasoning": f"Scoring failed: {str(e)}"}


def push_lead_to_firestore(profile: Dict[str, Any], evaluation: Dict[str, Any]) -> str:
    """
    Takes a scraped profile and its Gemini evaluation, constructs a Lead object, 
    and writes it to the 'empathy_leads' collection in Firestore.
    """
    if not db:
        raise ValueError("Firestore client not initialized. Check Firebase Service Account.")

    # Construct the final Lead object matching the interface
    # Assuming profile might have 'fullName', 'company', 'email', 'url'
    name = profile.get("fullName", "")
    if not name:
        name = f"{profile.get('firstName', '')} {profile.get('lastName', '')}".strip()
    
    company = profile.get("company", "")
    if not company:
        # Sometimes company is nested or not present under 'company'
        company = "Unknown"
        
    email = profile.get("email", "No Email Provided")
    linkedin_url = profile.get("url", "")
    
    # Map back to TS interface: (id, name, company, score, status)
    # Adding quality_score, contact, reasoning for completeness
    score = evaluation.get("quality_score", 0)
    
    lead_data = {
        "name": name.strip() or "Unknown Profile",
        "company": company.strip(),
        "contact": email,
        "linkedinUrl": linkedin_url,
        "status": "New",
        "score": score,
        "quality_score": score,
        "reasoning": evaluation.get("reasoning", ""),
        "location": profile.get("location", ""),
        "jobTitle": profile.get("headline", "")
    }

    try:
        # Add to empathy_leads collection
        doc_ref = db.collection('empathy_leads').add(lead_data)
        # add() returns a tuple (update_time, document_ref)
        doc_id = doc_ref[1].id
        
        # Update the document to include its generated ID to match TS `id: string` interface
        db.collection('empathy_leads').document(doc_id).update({"id": doc_id})
        
        logger.info(f"Successfully saved lead '{name}' to Firestore with ID: {doc_id}")
        return doc_id
    except Exception as e:
        logger.error(f"Failed to push lead '{name}' to Firestore: {e}")
        raise e


def generate_leads(query: str, max_results: int = 5):
    """
    Main function to execute the full data ingestion pipeline:
    1. Scrape Apify
    2. Score with Gemini
    3. Push to Firestore
    """
    logger.info(f"Starting lead generation pipeline for query: '{query}'")
    
    profiles = scrape_linkedin_profiles(query, max_results=max_results)
    
    success_count = 0
    fail_count = 0
    
    for profile in profiles:
        name = profile.get("fullName", profile.get("firstName", "Unknown Profile"))
        try:
            # Score profile
            logger.info(f"Scoring profile: {name}...")
            evaluation = score_profile_with_gemini(profile)
            logger.info(f"Score for {name}: {evaluation.get('quality_score')} - {evaluation.get('reasoning')}")
            
            # Push to Firestore
            if db:
                push_lead_to_firestore(profile, evaluation)
                success_count += 1
            else:
                logger.warning("Firestore not initialized, skipping database write.")
                fail_count += 1
            
        except Exception as e:
            # Robust try/except so one failure doesn't stop the whole batch
            logger.error(f"Error processing profile '{name}': {e}")
            fail_count += 1
            continue
            
    logger.info(f"Pipeline complete. Successfully processed: {success_count}, Failed: {fail_count}")


if __name__ == "__main__":
    # Example usage when run directly
    sample_query = "Nigerian Doctor Atlanta"
    logger.info(f"Running standalone pipeline with sample query: '{sample_query}'")
    generate_leads(sample_query, max_results=3)
