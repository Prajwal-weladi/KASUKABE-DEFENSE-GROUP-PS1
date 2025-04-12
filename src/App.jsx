import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReactSlider from 'react-slider';
<<<<<<< HEAD
import { FaMusic, FaStar, FaPlay, FaVolumeUp, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import './App.css';

function App() {
=======
import { FaMusic, FaStar, FaPlay, FaVolumeUp, FaCheck, FaExclamationTriangle, FaChartLine, FaInfoCircle, FaHistory } from 'react-icons/fa';
import './App.css';
import History from './History';

function App() {
  const [activeSection, setActiveSection] = useState('predictor');
>>>>>>> f358b47 (somto)
  const [formData, setFormData] = useState({
    trackName: '',
    artistName: '',
    danceability: 0.5,
    energy: 0.5,
<<<<<<< HEAD
    valence: 0.5,
    tempo: 120,
    loudness: -10,
    speechiness: 0.1,
    acousticness: 0.1,
    instrumentalness: 0.05,
    liveness: 0.2,
    explicit: 0,
    key: 0,
    mode: 1,
=======
    tempo: 120,
    loudness: -10,
    explicit: 0,
    key: 0,
>>>>>>> f358b47 (somto)
    time_signature: 4,
    track_w2v: 0.5,
    album_w2v: 0.5,
    artists_w2v: 0.5,
    track_g_w2v: 0.5,
<<<<<<< HEAD
    duration_ms: 200000,
=======
>>>>>>> f358b47 (somto)
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSliderChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked ? 1 : 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitted(true);

    try {
<<<<<<< HEAD
      // API URL (replace with your actual backend URL when deployed)
      const apiUrl = 'http://localhost:5000/predict';

=======
      const apiUrl = 'http://localhost:5000/predict';
>>>>>>> f358b47 (somto)
      const response = await axios.post(apiUrl, formData);

      if (response.data.success) {
        setPrediction(response.data);
      } else {
        setError(response.data.error || 'An error occurred');
      }
    } catch (err) {
      setError(err.message || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const keyMapping = {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
<<<<<<< HEAD
      <div className="container mx-auto px-4 py-10">
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            <FaMusic className="inline mr-3" />
            Music Popularity Predictor
          </h1>
          <p className="text-xl text-gray-300">Predict how popular your song will be on Spotify!</p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 rounded-lg p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Input Your Song Details</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple-400">Basic Information</h3>

                  <div className="space-y-2">
                    <label className="block text-gray-300">Track Name</label>
                    <input
                      type="text"
                      name="trackName"
                      value={formData.trackName}
                      onChange={handleChange}
                      placeholder="Enter track name"
                      className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-300">Artist Name</label>
                    <input
                      type="text"
                      name="artistName"
                      value={formData.artistName}
                      onChange={handleChange}
                      placeholder="Enter artist name"
                      className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Audio Characteristics */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple-400">Audio Characteristics</h3>

                  <div className="slider-container">
                    <label className="block text-gray-300">Danceability: {formData.danceability.toFixed(2)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.danceability}
                      onChange={value => handleSliderChange('danceability', value)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div className="slider-container">
                    <label className="block text-gray-300">Energy: {formData.energy.toFixed(2)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.energy}
                      onChange={value => handleSliderChange('energy', value)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div className="slider-container">
                    <label className="block text-gray-300">Valence (Positivity): {formData.valence.toFixed(2)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.valence}
                      onChange={value => handleSliderChange('valence', value)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div className="slider-container">
                    <label className="block text-gray-300">Tempo (BPM): {formData.tempo.toFixed(0)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.tempo}
                      onChange={value => handleSliderChange('tempo', value)}
                      min={60}
                      max={200}
                      step={1}
                    />
                  </div>

                  <div className="slider-container">
                    <label className="block text-gray-300">Loudness (dB): {formData.loudness.toFixed(1)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.loudness}
                      onChange={value => handleSliderChange('loudness', value)}
                      min={-30}
                      max={0}
                      step={0.1}
                    />
                  </div>
                </div>

                {/* Vocal/Instrumental Features */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple-400">Vocal & Instrumental Features</h3>

                  <div className="slider-container">
                    <label className="block text-gray-300">Speechiness: {formData.speechiness.toFixed(2)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.speechiness}
                      onChange={value => handleSliderChange('speechiness', value)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div className="slider-container">
                    <label className="block text-gray-300">Acousticness: {formData.acousticness.toFixed(2)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.acousticness}
                      onChange={value => handleSliderChange('acousticness', value)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div className="slider-container">
                    <label className="block text-gray-300">Instrumentalness: {formData.instrumentalness.toFixed(2)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.instrumentalness}
                      onChange={value => handleSliderChange('instrumentalness', value)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div className="slider-container">
                    <label className="block text-gray-300">Liveness: {formData.liveness.toFixed(2)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.liveness}
                      onChange={value => handleSliderChange('liveness', value)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="inline-flex items-center text-gray-300">
                      <input
                        type="checkbox"
                        name="explicit"
                        checked={formData.explicit === 1}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 text-purple-500"
                      />
                      <span className="ml-2">Explicit Content</span>
                    </label>
                  </div>
                </div>

                {/* Musical Composition */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple-400">Musical Composition</h3>

                  <div className="space-y-2">
                    <label className="block text-gray-300">Key</label>
                    <select
                      name="key"
                      value={formData.key}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Object.entries(keyMapping).map(([value, name]) => (
                        <option key={value} value={value}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-300">Mode</label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="0">Minor</option>
                      <option value="1">Major</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-300">Time Signature</label>
                    <select
                      name="time_signature"
                      value={formData.time_signature}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="3">3/4</option>
                      <option value="4">4/4</option>
                      <option value="5">5/4</option>
                      <option value="6">6/8</option>
                    </select>
                  </div>
                </div>

                {/* Advanced Features */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple-400">Advanced Features</h3>

                  <div className="slider-container">
                    <label className="block text-gray-300">Track Word2Vec: {formData.track_w2v.toFixed(2)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.track_w2v}
                      onChange={value => handleSliderChange('track_w2v', value)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div className="slider-container">
                    <label className="block text-gray-300">Album Word2Vec: {formData.album_w2v.toFixed(2)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.album_w2v}
                      onChange={value => handleSliderChange('album_w2v', value)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div className="slider-container">
                    <label className="block text-gray-300">Artists Word2Vec: {formData.artists_w2v.toFixed(2)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.artists_w2v}
                      onChange={value => handleSliderChange('artists_w2v', value)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div className="slider-container">
                    <label className="block text-gray-300">Track Genre Word2Vec: {formData.track_g_w2v.toFixed(2)}</label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      value={formData.track_g_w2v}
                      onChange={value => handleSliderChange('track_g_w2v', value)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="slider-container">
                  <label className="block text-gray-300">Duration (ms): {Math.round(formData.duration_ms)}</label>
                  <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="slider-thumb"
                    trackClassName="slider-track"
                    value={formData.duration_ms}
                    onChange={value => handleSliderChange('duration_ms', value)}
                    min={60000}
                    max={600000}
                    step={1000}
                  />
                  <div className="text-sm text-gray-400">
                    {Math.floor(formData.duration_ms / 60000)}:{Math.floor((formData.duration_ms % 60000) / 1000).toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating prediction...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FaPlay className="mr-2" /> Generate Prediction
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Prediction Results</h2>

            {!submitted && (
              <div className="flex flex-col items-center justify-center h-full text-center p-10">
                <FaMusic className="text-6xl text-gray-500 mb-4" />
                <p className="text-xl text-gray-400">Complete the form and generate a prediction to see results</p>
              </div>
            )}

            {submitted && error && (
              <div className="bg-red-900/50 border border-red-700 text-white p-4 rounded-lg flex items-start">
                <FaExclamationTriangle className="text-xl text-red-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold">Error!</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {submitted && prediction && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold">{prediction.trackName}</h3>
                    <p className="text-gray-400">by {prediction.artistName}</p>
                  </div>

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

                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-2 text-purple-400">Key Factors</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center">
                          <FaVolumeUp className="text-purple-400 mr-2" />
                          {formData.energy > 0.7 ? "High energy - energetic tracks often perform well" : "Consider increasing the energy for more appeal"}
                        </li>
                        <li className="flex items-center">
                          <FaCheck className="text-purple-400 mr-2" />
                          {formData.danceability > 0.6 ? "Good danceability - rhythmic songs tend to be popular" : "Increasing danceability might improve reception"}
                        </li>
                        <li className="flex items-center">
                          <FaCheck className="text-purple-400 mr-2" />
                          Duration: {formData.duration_ms > 240000 ? "Track is on the longer side, which may affect streaming counts" : "Good track length for streaming"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4 text-center text-sm text-gray-500">
                  <p>* This prediction is based on a machine learning model and should be used as a guide only</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
=======
      <nav className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FaMusic className="text-2xl text-purple-500" />
              <span className="ml-2 text-xl font-semibold">Music Predictor</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection('predictor')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'predictor'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-purple-600/20'
                }`}
              >
                <FaChartLine className="inline mr-2" />
                Predict
              </button>
              <button
                onClick={() => setActiveSection('history')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'history'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-purple-600/20'
                }`}
              >
                <FaHistory className="inline mr-2" />
                Recom
              </button>
              <button
                onClick={() => setActiveSection('about')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'about'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-purple-600/20'
                }`}
              >

                <FaInfoCircle className="inline mr-2" />
                About
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        {activeSection === 'predictor' ? (
          <>
            <motion.header
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                <FaMusic className="inline mr-3" />
                Music Popularity Predictor
              </h1>
              <p className="text-xl text-gray-300">Predict how popular your song will be on Spotify!</p>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-800 rounded-lg p-6 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Input Your Song Details</h2>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-purple-400">Basic Information</h3>

                      <div className="space-y-2">
                        <label className="block text-gray-300">Track Name</label>
                        <input
                          type="text"
                          name="trackName"
                          value={formData.trackName}
                          onChange={handleChange}
                          placeholder="Enter track name"
                          className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-gray-300">Artist Name</label>
                        <input
                          type="text"
                          name="artistName"
                          value={formData.artistName}
                          onChange={handleChange}
                          placeholder="Enter artist name"
                          className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-purple-400">Audio Characteristics</h3>

                      <div className="slider-container">
                        <label className="block text-gray-300">Danceability: {formData.danceability.toFixed(2)}</label>
                        <ReactSlider
                          className="horizontal-slider"
                          thumbClassName="slider-thumb"
                          trackClassName="slider-track"
                          value={formData.danceability}
                          onChange={value => handleSliderChange('danceability', value)}
                          min={0}
                          max={1}
                          step={0.01}
                        />
                      </div>

                      <div className="slider-container">
                        <label className="block text-gray-300">Energy: {formData.energy.toFixed(2)}</label>
                        <ReactSlider
                          className="horizontal-slider"
                          thumbClassName="slider-thumb"
                          trackClassName="slider-track"
                          value={formData.energy}
                          onChange={value => handleSliderChange('energy', value)}
                          min={0}
                          max={1}
                          step={0.01}
                        />
                      </div>

                      <div className="slider-container">
                        <label className="block text-gray-300">Tempo (BPM): {formData.tempo.toFixed(0)}</label>
                        <ReactSlider
                          className="horizontal-slider"
                          thumbClassName="slider-thumb"
                          trackClassName="slider-track"
                          value={formData.tempo}
                          onChange={value => handleSliderChange('tempo', value)}
                          min={60}
                          max={200}
                          step={1}
                        />
                      </div>

                      <div className="slider-container">
                        <label className="block text-gray-300">Loudness (dB): {formData.loudness.toFixed(1)}</label>
                        <ReactSlider
                          className="horizontal-slider"
                          thumbClassName="slider-thumb"
                          trackClassName="slider-track"
                          value={formData.loudness}
                          onChange={value => handleSliderChange('loudness', value)}
                          min={-30}
                          max={0}
                          step={0.1}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="inline-flex items-center text-gray-300">
                          <input
                            type="checkbox"
                            name="explicit"
                            checked={formData.explicit === 1}
                            onChange={handleCheckboxChange}
                            className="form-checkbox h-5 w-5 text-purple-500"
                          />
                          <span className="ml-2">Explicit Content</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-purple-400">Musical Composition</h3>

                      <div className="space-y-2">
                        <label className="block text-gray-300">Key</label>
                        <select
                          name="key"
                          value={formData.key}
                          onChange={handleChange}
                          className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {Object.entries(keyMapping).map(([value, name]) => (
                            <option key={value} value={value}>{name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-gray-300">Time Signature</label>
                        <select
                          name="time_signature"
                          value={formData.time_signature}
                          onChange={handleChange}
                          className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="3">3/4</option>
                          <option value="4">4/4</option>
                          <option value="5">5/4</option>
                          <option value="6">6/8</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-purple-400">Advanced Features</h3>

                      <div className="slider-container">
                        <label className="block text-gray-300">Track Word2Vec: {formData.track_w2v.toFixed(6)}</label>
                        <ReactSlider
                          className="horizontal-slider"
                          thumbClassName="slider-thumb"
                          trackClassName="slider-track"
                          value={formData.track_w2v}
                          onChange={value => handleSliderChange('track_w2v', value)}
                          min={0}
                          max={1}
                          step={0.000001}
                        />
                      </div>

                      <div className="slider-container">
                        <label className="block text-gray-300">Album Word2Vec: {formData.album_w2v.toFixed(6)}</label>
                        <ReactSlider
                          className="horizontal-slider"
                          thumbClassName="slider-thumb"
                          trackClassName="slider-track"
                          value={formData.album_w2v}
                          onChange={value => handleSliderChange('album_w2v', value)}
                          min={0}
                          max={1}
                          step={0.000001}
                        />
                      </div>

                      <div className="slider-container">
                        <label className="block text-gray-300">Artists Word2Vec: {formData.artists_w2v.toFixed(6)}</label>
                        <ReactSlider
                          className="horizontal-slider"
                          thumbClassName="slider-thumb"
                          trackClassName="slider-track"
                          value={formData.artists_w2v}
                          onChange={value => handleSliderChange('artists_w2v', value)}
                          min={0}
                          max={1}
                          step={0.000001}
                        />
                      </div>

                      <div className="slider-container">
                        <label className="block text-gray-300">Track Genre Word2Vec: {formData.track_g_w2v.toFixed(6)}</label>
                        <ReactSlider
                          className="horizontal-slider"
                          thumbClassName="slider-thumb"
                          trackClassName="slider-track"
                          value={formData.track_g_w2v}
                          onChange={value => handleSliderChange('track_g_w2v', value)}
                          min={0}
                          max={1}
                          step={0.000001}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating prediction...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <FaPlay className="mr-2" /> Generate Prediction
                          </span>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gray-800 rounded-lg p-6 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Prediction Results</h2>

                {!submitted && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-10">
                    <FaMusic className="text-6xl text-gray-500 mb-4" />
                    <p className="text-xl text-gray-400">Complete the form and generate a prediction to see results</p>
                  </div>
                )}

                {submitted && error && (
                  <div className="bg-red-900/50 border border-red-700 text-white p-4 rounded-lg flex items-start">
                    <FaExclamationTriangle className="text-xl text-red-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">Error!</h3>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {submitted && prediction && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold">{prediction.trackName}</h3>
                        <p className="text-gray-400">by {prediction.artistName}</p>
                      </div>

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

                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h4 className="font-semibold text-lg mb-2 text-purple-400">Key Factors</h4>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                              <FaVolumeUp className="text-purple-400 mr-2" />
                              {formData.energy > 0.7 ? "High energy - energetic tracks often perform well" : "Consider increasing the energy for more appeal"}
                            </li>
                            <li className="flex items-center">
                              <FaCheck className="text-purple-400 mr-2" />
                              {formData.danceability > 0.6 ? "Good danceability - rhythmic songs tend to be popular" : "Increasing danceability might improve reception"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 text-center text-sm text-gray-500">
                      <p>* This prediction is based on a machine learning model and should be used as a guide only</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        ) : activeSection === 'history' ? (
          <History />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Performance Matrix
            </h2>

            <div className="space-y-8 text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-purple-400"></h3>
                  <p className="mb-4">
                  Mean Absolute Error (MAE): 10.540942636278196  <br/>
                  Root Mean Squared Error (RMSE): 14.622529481732757
                  </p>
                </div>

                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src="/images/Pearsoncoeff.png"
                    alt="Feature Correlation Matrix"
                    className="w-full h-auto"
                  />
                  <div className="bg-gray-700/90 p-3 text-center text-sm">
                    <p>Feature correlation analysis for song popularity prediction</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src="/images/con_matrix.png"
                    alt="Classification Confusion Matrix"
                    className="w-full h-auto"
                  />
                  <div className="bg-gray-700/90 p-3 text-center text-sm">
                    <p>Confusion matrix showing model prediction accuracy</p>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-purple-400"></h3>
                  R² Score: 0.5667139805689663  <br/>
Accuracy: 0.82  <br/>
Precision: 0.80 <br/>
Recall: 0.32

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-purple-400"></h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                  AUC Score: 0.8400 <br/>
                  Gini: 0.6800783828443351
                  </ul>
                </div>

                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src="/images/AUC-ROC.png"
                    alt="AUC-ROC Curve"
                    className="w-full h-auto"
                  />
                  <div className="bg-gray-700/90 p-3 text-center text-sm">
                    <p>ROC curve showing model performance metrics</p>
                  </div>
                </div>
              </div>

              
            </div>
          </motion.div>
        )}
>>>>>>> f358b47 (somto)
      </div>
    </div>
  );
}

export default App;
