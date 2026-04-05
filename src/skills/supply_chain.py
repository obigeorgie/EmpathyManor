import os
import json
import datetime
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore
from google import genai
from dotenv import load_dotenv

# Load Environment
load_dotenv('.env.local')

# Initialize Firebase (Only if not already initialized)
if not firebase_admin._apps:
    # Assuming you have a serviceAccountKey.json, or using default credentials
    # cred = credentials.Certificate("path/to/serviceAccountKey.json")
    # firebase_admin.initialize_app(cred)
    firebase_admin.initialize_app() 

db = firestore.client()

# Initialize API
app = FastAPI(title="Empathy Manor Intake API")

# Define the expected data from Tally
class FEMPayload(BaseModel):
    property_title: str
    asking_price_ngn: int
    projected_usd_rent: int
    title_status: str
    notes: str = ""

# The API Security Key (Set this in your .env.local file: TALLY_WEBHOOK_SECRET="your_custom_secret")
WEBHOOK_SECRET = os.environ.get("TALLY_WEBHOOK_SECRET", "default_secret_please_change")

@app.post("/ingest")
async def evaluate_and_ingest(payload: FEMPayload, x_api_key: str = Header(None)):
    # 1. Security Check
    if x_api_key != WEBHOOK_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized request")

    # 2. Setup AI Underwriter
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=gemini_api_key)
    
    prompt = f"""
    You are the Director of Acquisitions for Empathy Manor. Evaluate this property data.
    Exchange rate: ~1378 NGN/USD. 
    Calculate USD acquisition cost and Cash-on-Cash ROI. 
    If ROI is > 10% AND title_status contains 'Consent' or 'C of O', respond EXACTLY with: 'APPROVED'. 
    Otherwise, respond with 'REJECTED' and the reason.
    
    Data: {payload.model_dump_json()}
    """
    
    # 3. AI Evaluation
    response = client.models.generate_content(
        model='gemini-2.5-flash', 
        contents=prompt
    )
    decision = response.text.strip()
    
    # 4. Routing the Decision
    if decision.startswith("APPROVED"):
        doc_ref = db.collection("properties").document()
        doc_data = payload.model_dump()
        doc_data["timestamp"] = firestore.SERVER_TIMESTAMP
        doc_data["status"] = "Active"
        doc_ref.set(doc_data)
        
        print(f"✅ ASSET APPROVED & INGESTED. ID: {doc_ref.id}")
        return {"status": "success", "message": "Asset approved and pushed to Deal Room", "id": doc_ref.id}
    else:
        print(f"🚨 ASSET REJECTED BY AI: {decision}")
        return {"status": "rejected", "message": decision}

if __name__ == "__main__":
    import uvicorn
    # Runs the server on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)