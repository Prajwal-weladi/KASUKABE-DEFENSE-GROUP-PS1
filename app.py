from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load trained model
try:
    model = joblib.load("spotify_popularity_model_new.pkl")
    print("Model loaded successfully!")
except FileNotFoundError:
    print("Warning: Model file not found. Predictions will not work.")
    model = None

<<<<<<< HEAD
# Define feature groups (same as used in training)
feature_groups = {
    "audio_characteristics": ['danceability', 'energy', 'valence', 'tempo', 'loudness'],
    "vocal_instrumental": ['speechiness', 'acousticness', 'instrumentalness', 'liveness', 'explicit'],
    "musical_composition": ['key', 'mode', 'time_signature'],
    "metadata_identity": ['track_w2v', 'album_w2v', 'artists_w2v', 'track_g_w2v'],
    "duration_popularity": ['duration_ms']
}
=======
feature_cols = ['danceability', 'energy',  
                'tempo', 
                'key', 'loudness', 'time_signature', 'explicit',
                'artists_w2v', 'album_w2v', 'track_w2v', 'track_g_w2v']

>>>>>>> f358b47 (somto)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        # Extract track and artist name
        track_name = data.get("trackName", "Untitled")
        artist_name = data.get("artistName", "Unknown Artist")

        # Extract all the features
        input_values = {
<<<<<<< HEAD
            "danceability": float(data.get("danceability", 0.5)),
            "energy": float(data.get("energy", 0.5)),
            "valence": float(data.get("valence", 0.5)),
            "tempo": float(data.get("tempo", 120)),
            "loudness": float(data.get("loudness", -10)),
            "speechiness": float(data.get("speechiness", 0.1)),
            "acousticness": float(data.get("acousticness", 0.1)),
            "instrumentalness": float(data.get("instrumentalness", 0.05)),
            "liveness": float(data.get("liveness", 0.2)),
            "explicit": int(data.get("explicit", 0)),
            "key": int(data.get("key", 0)),
            "mode": int(data.get("mode", 1)),
            "time_signature": int(data.get("time_signature", 4)),
            "track_w2v": float(data.get("track_w2v", 0.5)),
            "album_w2v": float(data.get("album_w2v", 0.5)),
            "artists_w2v": float(data.get("artists_w2v", 0.5)),
            "track_g_w2v": float(data.get("track_g_w2v", 0.5)),
            "duration_ms": float(data.get("duration_ms", 200000))
        }

        # Convert individual features into grouped format
        grouped_input = {group: np.mean([input_values[feat] for feat in features])
                        for group, features in feature_groups.items()}

        # Convert to DataFrame
        input_df = pd.DataFrame([grouped_input])
=======
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
>>>>>>> f358b47 (somto)

        # Make prediction
        if model is None:
            # If model is not loaded, return a dummy prediction
            prediction = 65.0
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
    return "Music Popularity Prediction API is running!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
