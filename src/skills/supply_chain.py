import os
import json
import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from google import genai
from google.genai import types

# Task 1: Environment & SDKs Initialization
# Ensure Firebase app initializes correctly if not already initialized
if not firebase_admin._apps:
    # This automatically picks up GOOGLE_APPLICATION_CREDENTIALS if set in the environment
    firebase_admin.initialize_app()

db = firestore.client()

# Task 2: Define the Simulated Inbound Payload
incoming_fem_drop = {
    "agent": "FEM Limited",
    "property_title": "5-Bedroom Detached Duplex, Lekki Phase 1",
    "asking_price_ngn": 250000000,
    "projected_usd_rent": 18000,
    "title_status": "Governor's Consent - Verified",
    "notes": "Owner relocating, highly motivated."
}

# Task 3: Build the Underwriter Agent
def evaluate_and_ingest(payload):
    print("Initiating Deal Evaluation via Gemini Underwriter Agent...")
    
    # Initialize the modern Gemini SDK client
    client = genai.Client()

    # The System Prompt as specified
    system_instruction = (
        "You are the Director of Acquisitions for Empathy Manor. "
        "Evaluate the following property data from our ground team. "
        "Current exchange rate is roughly 1378 NGN/USD. "
        "Calculate the USD acquisition cost and the Cash-on-Cash ROI. "
        'If the ROI is greater than 10% AND the title_status contains "Consent" or "C of O", '
        'respond with exactly: "APPROVED". Otherwise, respond with "REJECTED" and a brief reason.'
    )

    try:
        # Call the Gemini API with the system instructions and payload data
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=json.dumps(payload),
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        
        # Extract verbatim text string from GenAI Output
        verdict = response.text.strip()
        
        # Task 4: The Firebase Push pipeline
        if verdict.startswith("APPROVED"):
            # Enqueue payload transformations
            ingestion_payload = payload.copy()
            ingestion_payload["status"] = "Active"
            ingestion_payload["timestamp"] = datetime.datetime.utcnow().isoformat()
            
            # Map required frontend Deal Room fields cleanly
            ingestion_payload["title"] = payload["property_title"]
            
            # Commit to Firestore 
            doc_ref = db.collection("properties").document()
            doc_ref.set(ingestion_payload)
            
            print("✅ ASSET APPROVED & INGESTED. Deal Room Portal is now live for this property.")
            print(f"🔗 View Deal ID Generated: {doc_ref.id}")
        else:
            # Clean up reason payload if rejected
            reason = verdict.replace("REJECTED", "").strip(":. \n")
            if not reason:
                reason = "Did not meet strict ROI or Title verification thresholds."
            print(f"🚨 ASSET REJECTED BY AI: {reason}")
            
    except Exception as e:
        print(f"❌ PIPELINE ERROR: A critical failure occurred within the supply chain: {str(e)}")

if __name__ == "__main__":
    evaluate_and_ingest(incoming_fem_drop)
