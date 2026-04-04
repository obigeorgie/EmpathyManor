import os
import tweepy
import requests
from dotenv import load_dotenv

load_dotenv('.env.local')

def read_latest_post():
    post_path = os.path.join("output", "latest_post.txt")
    if not os.path.exists(post_path):
        raise FileNotFoundError("Latest post output not found. Please run the Deal Marketer first.")
    with open(post_path, "r", encoding="utf-8") as f:
        return f.read().strip()

def post_to_x(text: str):
    """
    Posts the translated NGN/USD case study to X.
    Uses tweepy.Client authenticated via TWITTER_BEARER_TOKEN (and requires write tokens if executing physically).
    """
    print("🐦 Initiating API request to X...")
    bearer_token = os.environ.get("TWITTER_BEARER_TOKEN")
    
    # Needs consumer keys and user access tokens for write permissions in a full production setting
    client = tweepy.Client(
        bearer_token=bearer_token,
        consumer_key=os.environ.get("TWITTER_API_KEY", "dummy"),
        consumer_secret=os.environ.get("TWITTER_API_SECRET", "dummy"),
        access_token=os.environ.get("TWITTER_ACCESS_TOKEN", "dummy"),
        access_token_secret=os.environ.get("TWITTER_ACCESS_SECRET", "dummy")
    )
    
    try:
        # In a real environment, this uncommented line executes the post:
        # response = client.create_tweet(text=text)
        # print(f"✅ Successfully posted to X. Tweet ID: {response.data['id']}")
        print("✅ Successfully established tweepy.Client and queued simulated X post.")
    except Exception as e:
        print(f"❌ Failed to post to X: {e}")

def post_to_linkedin(text: str):
    """
    Posts the case study to LinkedIn via the ugcPosts REST endpoints.
    """
    print("💼 Initiating API request to LinkedIn...")
    access_token = os.environ.get("LINKEDIN_ACCESS_TOKEN")
    linkedin_urn = os.environ.get("LINKEDIN_AUTHOR_URN", "urn:li:person:YOUR_ID")
    
    url = "https://api.linkedin.com/v2/ugcPosts"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }
    
    payload = {
        "author": linkedin_urn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": text
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }
    
    try:
        # In a real environment, uncomment to execute the POST request:
        # response = requests.post(url, headers=headers, json=payload)
        # response.raise_for_status()
        # print("✅ Successfully posted to LinkedIn.")
        print("✅ Successfully built LinkedIn ugcPosts payload and queued simulated POST request.")
    except Exception as e:
        print(f"❌ Failed to post to LinkedIn: {e}")

if __name__ == "__main__":
    post_text = read_latest_post()
    post_to_x(post_text)
    post_to_linkedin(post_text)
