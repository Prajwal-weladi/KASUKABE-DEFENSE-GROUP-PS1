import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaSearch, FaMusic, FaExclamationTriangle, FaStar } from 'react-icons/fa';

// Define the API base URL - update this based on where your backend is running
const API_BASE_URL = 'http://localhost:5000';

// Define interfaces for our data structures
interface Track {
  artists: string;
  album_name: string;
  track_name: string;
  track_genre: string;
  danceability: number;
  energy: number;
  tempo: number;
  key: number;
  loudness: number;
  time_signature: number;
  explicit: number;
  artists_w2v: number;
  album_w2v: number;
  track_w2v: number;
  track_g_w2v: number;
}

interface PredictionResult {
  prediction: number;
  trackName: string;
  artistName: string;
  success: boolean;
  message?: string;
}

interface ApiStatus {
  api: string;
  dataset: string;
  llm: string;
  model: string;
}

const SongFinder: React.FC = () => {
  const [trackName, setTrackName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [trackData, setTrackData] = useState<Track | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [fetchingPrediction, setFetchingPrediction] = useState<boolean>(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [apiConnectionError, setApiConnectionError] = useState<string | null>(null);

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  // Function to check API status
  const checkApiStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/`);
      if (response.data && response.data.status) {
        setApiStatus(response.data.status);
        setApiConnectionError(null);
      }
    } catch (err) {
      console.error('API connection error:', err);
      setApiConnectionError('Could not connect to the backend API. Make sure it is running.');
    }
  };

  // Function to find a track by name using the backend API
  const findTrack = async () => {
    if (!trackName.trim()) {
      setError('Please enter a track name');
      return;
    }

    setLoading(true);
    setError(null);
    setTrackData(null);
    setPrediction(null);
    setPredictionError(null);

    try {
      // Call the backend API to find the track
      const response = await axios.post(`${API_BASE_URL}/find-track`, { trackName });

      if (response.data && response.data.success && response.data.track) {
        setTrackData(response.data.track);
        // After finding track data, get prediction
        getPrediction(response.data.track);
      } else {
        setError(response.data.error || 'No results found. Please check the song name and try again.');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'Error finding the track. Please try again.');
      } else {
        setError('Error connecting to the server. Please try again later.');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to get a prediction from the Flask API
  const getPrediction = async (track: Track) => {
    setFetchingPrediction(true);
    setPredictionError(null);

    try {
      // Create the payload expected by the Flask API
      const payload = {
        trackName: track.track_name,
        artistName: track.artists,
        danceability: track.danceability,
        energy: track.energy,
        tempo: track.tempo,
        key: track.key,
        loudness: track.loudness,
        time_signature: track.time_signature,
        explicit: track.explicit,
        artists_w2v: track.artists_w2v,
        album_w2v: track.album_w2v,
        track_w2v: track.track_w2v,
        track_g_w2v: track.track_g_w2v
      };

      // Call the backend API to get the prediction
      const response = await axios.post(`${API_BASE_URL}/predict`, payload);

      if (response.data && response.data.success) {
        setPrediction(response.data);
      } else {
        setPredictionError(response.data.error || 'Failed to get prediction. Please try again.');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setPredictionError(err.response.data.error || 'Failed to get prediction. Please try again.');
      } else {
        setPredictionError('Error connecting to the server. Please try again later.');
      }
      console.error('Prediction error:', err);
    } finally {
      setFetchingPrediction(false);
    }
  };

  // Helper function to determine if a genre is "popular"
  const isPopularGenre = (genre: string): boolean => {
    const popularGenres = ['pop', 'rock', 'hip hop', 'r&b', 'dance', 'edm'];
    return popularGenres.some(g => genre.toLowerCase().includes(g));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      findTrack();
    }
  };

  // Render a table with the track data
  const renderTrackDetails = () => {
    if (!trackData) return null;

    const keyMapping: Record<number, string> = {
      0: 'C',
      1: 'C#/Db',
      2: 'D',
      3: 'D#/Eb',
      4: 'E',
      5: 'F',
      6: 'F#/Gb',
      7: 'G',
      8: 'G#/Ab',
      9: 'A',
      10: 'A#/Bb',
      11: 'B'
    };

    // Format track details for display
    const formattedDetails = [
      { label: 'Artist', value: trackData.artists },
      { label: 'Album', value: trackData.album_name },
      { label: 'Track', value: trackData.track_name },
      { label: 'Genre', value: trackData.track_genre },
      { label: 'Danceability', value: trackData.danceability.toFixed(3) },
      { label: 'Energy', value: trackData.energy.toFixed(3) },
      { label: 'Tempo (BPM)', value: trackData.tempo.toFixed(1) },
      { label: 'Key', value: keyMapping[trackData.key] || trackData.key.toString() },
      { label: 'Loudness (dB)', value: trackData.loudness.toFixed(2) },
      { label: 'Time Signature', value: `${trackData.time_signature}/4` },
      { label: 'Explicit', value: trackData.explicit ? 'Yes' : 'No' }
    ];

    return (
      <div className="mt-8 bg-gray-700/50 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-purple-400 mb-4">Song Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody>
              {formattedDetails.map((detail, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-800/30' : ''}>
                  <td className="px-4 py-3 font-semibold text-gray-300 w-1/3">{detail.label}</td>
                  <td className="px-4 py-3 text-white">{detail.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h4 className="text-xl font-semibold text-purple-400 mb-3">Advanced Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Artists Word2Vec</div>
              <div className="text-lg">{trackData.artists_w2v.toFixed(6)}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Album Word2Vec</div>
              <div className="text-lg">{trackData.album_w2v.toFixed(6)}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Track Word2Vec</div>
              <div className="text-lg">{trackData.track_w2v.toFixed(6)}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Track Genre Word2Vec</div>
              <div className="text-lg">{trackData.track_g_w2v.toFixed(6)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the prediction results
  const renderPredictionResults = () => {
    if (!prediction) return null;

    return (
      <div className="mt-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-purple-400 mb-4">Popularity Prediction</h3>

        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-8 w-48 h-48 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full animate-pulse"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
                {Math.round(prediction.prediction)}
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-xl ${
                      i < Math.round(prediction.prediction / 20)
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2 text-gray-300">Popularity Score</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-2 text-purple-400">Analysis</h4>
            <p className="text-gray-300">
              {prediction.prediction < 30 && "This track may have limited appeal. Consider adjusting the energy or danceability to make it more engaging."}
              {prediction.prediction >= 30 && prediction.prediction < 60 && "This track has moderate appeal. It has potential but might need some refinement in certain areas."}
              {prediction.prediction >= 60 && "This track has high potential for popularity! It has the characteristics of songs that tend to perform well on streaming platforms."}
            </p>
          </div>

          {trackData && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-2 text-purple-400">Key Factors</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="bg-purple-500/30 text-purple-200 text-xs px-2 py-1 rounded mr-2 mt-0.5">DANCE</span>
                  {trackData.danceability > 0.7
                    ? "High danceability score suggests this track has a strong rhythmic element that appeals to listeners."
                    : "Consider increasing the danceability to make this track more engaging for listeners."}
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500/30 text-purple-200 text-xs px-2 py-1 rounded mr-2 mt-0.5">ENERGY</span>
                  {trackData.energy > 0.7
                    ? "This track's high energy level is likely to engage listeners and perform well on streaming platforms."
                    : "The energy level is moderate to low, which may limit its appeal for certain audiences."}
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500/30 text-purple-200 text-xs px-2 py-1 rounded mr-2 mt-0.5">GENRE</span>
                  {isPopularGenre(trackData.track_genre)
                    ? `The ${trackData.track_genre} genre typically performs well with mainstream audiences.`
                    : `The ${trackData.track_genre} genre may have a more niche appeal.`}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render API status information
  const renderApiStatus = () => {
    if (apiConnectionError) {
      return (
        <div className="mt-4 bg-yellow-900/30 border border-yellow-700 text-white p-4 rounded-lg flex items-start">
          <FaExclamationTriangle className="text-xl text-yellow-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <p>{apiConnectionError}</p>
            <p className="text-sm mt-1">Using mock data for demonstration purposes.</p>
          </div>
        </div>
      );
    }

    if (!apiStatus) return null;

    const getStatusColor = (status: string) => {
      return status === 'running' || status === 'loaded' || status === 'initialized'
        ? 'text-green-400'
        : 'text-red-400';
    };

    return (
      <div className="mt-4 bg-gray-800/50 p-3 rounded-lg text-sm">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <span className="mr-1">API:</span>
            <span className={getStatusColor(apiStatus.api)}>{apiStatus.api}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">Dataset:</span>
            <span className={getStatusColor(apiStatus.dataset)}>{apiStatus.dataset}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">LLM:</span>
            <span className={getStatusColor(apiStatus.llm)}>{apiStatus.llm}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">Model:</span>
            <span className={getStatusColor(apiStatus.model)}>{apiStatus.model}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8 shadow-xl"
    >
      <div className="flex items-center justify-center mb-6">
        <FaMusic className="text-3xl text-purple-500 mr-3" />
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Song Finder by Track Name
        </h2>
      </div>

      <div className="text-gray-300 mb-6">
        <p>This tool finds song details based on the <strong>track name</strong> you provide, then predicts its popularity score.</p>
        <p className="text-sm text-gray-400 mt-2">Enter the name of a song to search for it in our database.</p>
      </div>

      {renderApiStatus()}

      <div className="relative mt-6">
        <input
          type="text"
          value={trackName}
          onChange={(e) => setTrackName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter the song name (e.g., Shape of You)"
          className="w-full bg-gray-700 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
        />
        <button
          onClick={findTrack}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
          disabled={loading}
        >
          <FaSearch />
        </button>
      </div>

      {loading && (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-purple-300">Searching for song...</span>
        </div>
      )}

      {error && (
        <div className="mt-8 bg-red-900/30 border border-red-700 text-white p-4 rounded-lg flex items-start">
          <FaExclamationTriangle className="text-xl text-red-400 mr-3 mt-1 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {renderTrackDetails()}

      {fetchingPrediction && !prediction && (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-purple-300">Calculating popularity score...</span>
        </div>
      )}

      {predictionError && (
        <div className="mt-8 bg-red-900/30 border border-red-700 text-white p-4 rounded-lg flex items-start">
          <FaExclamationTriangle className="text-xl text-red-400 mr-3 mt-1 flex-shrink-0" />
          <div>{predictionError}</div>
        </div>
      )}

      {renderPredictionResults()}

      <div className="mt-8 text-sm text-gray-500">
        <p>* Made by Kasukabe Defense Group</p>
        <p className="mt-1"></p>
      </div>
    </motion.div>
  );
};

export default SongFinder;
