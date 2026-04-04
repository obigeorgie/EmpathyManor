import os
from google import genai
from dotenv import load_dotenv

load_dotenv('.env.local')

def fetch_metrics():
    """
    Interfaces with the X and LinkedIn APIs to extract the latest engagement telemetry.
    (Mocked for this implementation).
    """
    print("📡 Fetching real-time engagement telemetry from X and LinkedIn...")
    return {
        "X_metrics": {
            "views": 4500,
            "likes": 12,
            "reposts": 2,
            "comments": 1
        },
        "LinkedIn_metrics": {
            "impressions": 8200,
            "likes": 115,
            "reposts": 14,
            "comments": 28
        }
    }

def analyze_and_optimize(metrics: dict):
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY is missing in environment variables.")
        
    client = genai.Client(api_key=gemini_api_key)
    
    prompt = f"""
You are an elite Social Media Analyst. Review the engagement metrics for our recent NGN/USD real estate arbitrage posts. Output a strict, 3-bullet point optimization strategy for the next post (e.g., move the ROI calculation higher, use shorter sentences, etc.).

Raw Telemetry Metrics:
{metrics}
"""
    
    print("🧠 Analyzing metrics and generating optimization strategy via Gemini...")
    
    response = client.models.generate_content(
        model='gemini-2.5-flash', 
        contents=prompt
    )
    
    optimization_text = response.text.strip()
    
    # Ensure output directory exists and save
    os.makedirs("output", exist_ok=True)
    out_path = os.path.join("output", "optimizations.txt")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(optimization_text)
        
    print(f"✅ Saved optimization strategy to {out_path}:")
    print("-" * 40)
    print(optimization_text)
    print("-" * 40)

if __name__ == "__main__":
    current_metrics = fetch_metrics()
    analyze_and_optimize(current_metrics)
