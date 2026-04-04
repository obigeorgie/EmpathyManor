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

# Task 3: Build the Deal Marketer Function
def generate_case_study(property_data: dict):
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY is missing in environment variables.")
        
    client = genai.Client(api_key=gemini_api_key)
    
    # Read optimizations if they exist
    optimization_context = ""
    optimizations_path = os.path.join("output", "optimizations.txt")
    if os.path.exists(optimizations_path):
        with open(optimizations_path, "r", encoding="utf-8") as f:
            optimizations = f.read()
        optimization_context = f"Apply these optimization strategies from our last analysis:\n{optimizations}\n\n"
    
    prompt = f"""
You are writing a high-converting, analytical LinkedIn post/Twitter thread aimed at Nigerian diaspora physicians in the US.
You must write the post impersonating the Managing Partner. It must start exactly with: 'Nnamdi, Managing Partner here.' Do not mention AI or being an AI.

Highlight the math: calculate the USD purchase price based on the exchange rate, then calculate the massive Cash-on-Cash ROI. The tone should be sharp, professional, and urgent. Do not use cringey emojis or marketing fluff. 

{optimization_context}

The final sentence MUST be a call to action: "DM me 'MAGODO' to access the verified Deal Room and full diligence file."

Raw Property Data:
{json.dumps(property_data, indent=2)}
"""
    
    print("📈 Analyzing the deal and drafting the case study...")
    
    response = client.models.generate_content(
        model='gemini-2.5-flash', 
        contents=prompt
    )
    
    final_post = response.text.strip()
    print("=" * 60)
    print(final_post)
    print("=" * 60)
    
    # Save the output
    os.makedirs("output", exist_ok=True)
    out_path = os.path.join("output", "latest_post.txt")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(final_post)
        
    print(f"✅ Saved generated post to {out_path}")

if __name__ == "__main__":
    generate_case_study(dummy_property_data)
