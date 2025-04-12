from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
import os
from flask_cors import CORS
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
import sqlite3

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Check if dataset exists
DATASET_PATH = "spotify_tracks.csv"
if not os.path.exists(DATASET_PATH):
    print(f"Warning: Dataset file {DATASET_PATH} not found. Song search will not work.")

# Initialize the LLM
try:
    llm = ChatGroq(
        temperature=0,
        groq_api_key='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',
        model_name="llama-3.3-70b-versatile"
    )
    print("LLM initialized successfully!")
except Exception as e:
    print(f"Warning: Could not initialize LLM. Error: {e}")
    llm = None

# Load trained model for popularity prediction
MODEL_PATH = "spotify_popularity_model_new.pkl"
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully!")
except FileNotFoundError:
    print(f"Warning: Model file {MODEL_PATH} not found. Predictions will not work.")
    model = None

# Define columns required for the dataset
required_columns = [
    'artists', 'album_name', 'track_name', 'track_genre', 'danceability', 'energy',
    'tempo', 'key', 'loudness', 'time_signature', 'explicit',
    'artists_w2v', 'album_w2v', 'track_w2v', 'track_g_w2v'
]

# Columns needed for prediction
feature_cols = [
    'danceability', 'energy', 'tempo', 'key', 'loudness',
    'time_signature', 'explicit', 'artists_w2v', 'album_w2v',
    'track_w2v', 'track_g_w2v'
]

# Create in-memory SQLite database
conn = None

def load_dataset():
    """Load the dataset into an in-memory SQLite database"""
    global conn

    if not os.path.exists(DATASET_PATH):
        return False

    try:
        # Read the dataset
        df = pd.read_csv(DATASET_PATH)

        # Filter only required columns
        if all(col in df.columns for col in required_columns):
            df = df[required_columns]
        else:
            missing_cols = [col for col in required_columns if col not in df.columns]
            print(f"Warning: Missing columns in dataset: {missing_cols}")
            return False

        # Create in-memory SQLite database
        conn = sqlite3.connect(":memory:", check_same_thread=False)
        df.to_sql("tracks", conn, if_exists='replace', index=False)

        print(f"Dataset loaded successfully with {len(df)} tracks!")
        return True
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return False

# Load the dataset when the app starts
dataset_loaded = load_dataset()

@app.route('/find-track', methods=['POST'])
def find_track():
    """Find a track by name using LLM"""
    data = request.json

    if not data or not data.get('trackName'):
        return jsonify({"error": "No track name provided"}), 400

    track_name = data.get('trackName').strip()

    if not dataset_loaded or conn is None:
        return jsonify({"error": "Dataset not loaded"}), 500

    if not llm:
        return jsonify({"error": "LLM not initialized"}), 500

    try:
        # Construct the prompt for the LLM
        prompt = f"""
You are a data scientist. You have access to a dataset in a SQLite table called `tracks` with the following columns:
{', '.join(required_columns)}

Generate an SQL query to retrieve **all the columns** for the song with track_name = "{track_name}".
Return only exact matches, and at most one row.

SQL Query:
"""

        # Get the SQL query from the LLM
        response = llm.invoke([HumanMessage(content=prompt)])
        sql_query = response.content.strip().split("```sql")[-1].split("```")[0].strip()

        # Execute the query
        result_df = pd.read_sql(sql_query, conn)

        if result_df.empty:
            # If exact match fails, try a more flexible search
            fuzzy_prompt = f"""
You are a data scientist. You have access to a dataset in a SQLite table called `tracks` with the following columns:
{', '.join(required_columns)}

Generate an SQL query to find songs that have a title similar to "{track_name}".
Use LIKE operator or any SQLite pattern matching to find close matches.
Return at most 1 row - the closest match.

SQL Query:
"""
            fuzzy_response = llm.invoke([HumanMessage(content=fuzzy_prompt)])
            fuzzy_sql = fuzzy_response.content.strip().split("```sql")[-1].split("```")[0].strip()

            result_df = pd.read_sql(fuzzy_sql, conn)

            if result_df.empty:
                return jsonify({"error": "No matching tracks found"}), 404

        # Convert the first row to a dictionary
        track_data = result_df.iloc[0].to_dict()

        # Ensure all numeric values are properly formatted
        for col in track_data:
            if isinstance(track_data[col], (np.integer, np.floating)):
                track_data[col] = float(track_data[col])

        return jsonify({"track": track_data, "success": True})

    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/predict', methods=['POST'])
def predict():
    """Predict the popularity of a song based on its features"""
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        # Extract track and artist name
        track_name = data.get("trackName", "Untitled")
        artist_name = data.get("artistName", "Unknown Artist")

        # Extract all the features
        input_values = {
            "danceability": float(data.get("danceability", 0.420)),
            "energy": float(data.get("energy", 0.166)),
            "tempo": float(data.get("tempo", 7.48)),
            "key": int(data.get("key", 1)),
            "loudness": float(data.get("loudness", -17.23)),
            "time_signature": int(data.get("time_signature", 4)),
            "explicit": int(data.get("explicit", 0)),
            "artists_w2v": float(data.get("artists_w2v", 0.0015)),
            "album_w2v": float(data.get("album_w2v", 0.087)),
            "track_w2v": float(data.get("track_w2v", 0.0131)),
            "track_g_w2v": float(data.get("track_g_w2v", 0.00185)),
        }

        # Convert to DataFrame
        input_df = pd.DataFrame([input_values])

        # Make prediction
        if model is None:
            # If model is not loaded, return a dummy prediction
            prediction = 100.0
            return jsonify({
                "prediction": prediction,
                "trackName": track_name,
                "artistName": artist_name,
                "success": True,
                "message": "Model not found. Using dummy prediction."
            })

        # Make prediction with the model
        prediction = float(model.predict(input_df)[0])

        return jsonify({
            "prediction": prediction,
            "trackName": track_name,
            "artistName": artist_name,
            "success": True
        })

    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/')
def home():
    """Home endpoint to verify the API is running"""

    # Check the status of components
    status = {
        "api": "running",
        "dataset": "loaded" if dataset_loaded else "not loaded",
        "llm": "initialized" if llm is not None else "not initialized",
        "model": "loaded" if model is not None else "not loaded"
    }

    return jsonify({
        "message": "Music Search and Prediction API is running!",
        "status": status
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
