import os
import json
from google import genai
from dotenv import load_dotenv

# Task 1: Setup the Environment
load_dotenv('.env.local')

# Task 2: Define the Case Study Input
dummy_property_data = {
    "location": "Magodo GRA Phase 2, Lagos",
    "purchase_price_ngn": 150000000,
    "current_exchange_rate": 1378,
    "projected_annual_rent_usd": 12000,
    "property_type": "4-Bedroom Semi-Detached Duplex"
}

# Task 3: Build the Rosie Marketer Function
def generate_case_study(property_data: dict):
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY is missing in environment variables.")
        
    client = genai.Client(api_key=gemini_api_key)
    
    prompt = f"""
You are Rosie, the AI Marketing Director for Empathy Manor. Your job is to take raw property data and write a high-converting, analytical LinkedIn post/Twitter thread aimed at Nigerian diaspora physicians in the US. Highlight the math: calculate the USD purchase price based on the exchange rate, then calculate the massive Cash-on-Cash ROI. The tone should be sharp, professional, and urgent. Do not use cringey emojis or marketing fluff. The final sentence MUST be a call to action: "DM me 'MAGODO' to access the verified Deal Room and full diligence file."

Raw Property Data:
{json.dumps(property_data, indent=2)}
"""
    
    print("🤖 Rosie is calculating the arbitrage yield and drafting the case study...\n")
    
    response = client.models.generate_content(
        model='gemini-2.5-flash', 
        contents=prompt
    )
    
    print("=" * 60)
    print("📈 AI-GENERATED MARKETING ASSET")
    print("=" * 60)
    print(response.text.strip())
    print("=" * 60)

if __name__ == "__main__":
    generate_case_study(dummy_property_data)
