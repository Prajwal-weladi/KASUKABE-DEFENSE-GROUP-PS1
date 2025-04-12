# Music Popularity Predictor

A modern web application that predicts the popularity of songs on music streaming platforms using machine learning.

## Features

- Interactive UI with sliders and controls for inputting song features
- Real-time prediction of song popularity based on audio characteristics
- Detailed analysis and feedback on the song's potential
- Responsive design that works on desktop and mobile

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion for animations
- **Backend**: Flask Python API
- **Machine Learning**: Pre-trained model (spotify_popularity_model.pkl)

## Setup Instructions

### Prerequisites

- Node.js and npm/bun for the frontend
- Python 3.7+ for the backend
- The pre-trained model file: `spotify_popularity_model.pkl`

### Backend Setup

1. Make sure you have the required Python packages:
   ```
   pip install -r requirements.txt
   ```

2. Place the `spotify_popularity_model.pkl` file in the root directory

3. Start the Flask server:
   ```
   python app.py
   ```
   The server will run on http://localhost:5000

### Frontend Setup

1. Install dependencies:
   ```
   bun install
   ```

2. Start the development server:
   ```
   bun run dev
   ```
   The frontend will run on http://localhost:5173

## How It Works

1. Enter your track and artist name
2. Adjust the various audio feature sliders to match your song
3. Click "Generate Prediction" to see the popularity score
4. Review the analysis and suggestions

## API Endpoints

- `POST /predict` - Send song features to get a popularity prediction

## Model Features

The model uses the following feature groups:

- **Audio Characteristics**: danceability, energy, valence, tempo, loudness
- **Vocal/Instrumental**: speechiness, acousticness, instrumentalness, liveness, explicit
- **Musical Composition**: key, mode, time_signature
- **Metadata Identity**: track_w2v, album_w2v, artists_w2v, track_g_w2v
<<<<<<< HEAD
- **Duration**: duration_ms
=======
- **Duration**: duration_ms

## License

MIT
>>>>>>> f358b47 (somto)
