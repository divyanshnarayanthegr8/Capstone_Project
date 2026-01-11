import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import requests

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"response": "No message received."})

    # Gemini API endpoint and payload
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
    headers = {"Content-Type": "application/json"}
    payload = {
    "contents": [{"parts": [{"text": f"{user_message}\n\nPlease answer in under 100 words."}]}]
    }
    params = {"key": GEMINI_API_KEY}

    try:
        api_response = requests.post(url, headers=headers, params=params, json=payload)
        api_response.raise_for_status()
        gemini_reply = api_response.json()["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        gemini_reply = f"Error: {str(e)}"

    return jsonify({"response": gemini_reply})

if __name__ == "__main__":
    app.run(debug=False)
