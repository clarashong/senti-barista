// HomeScreen.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './HomeScreen.css';

function HomeScreen() {
  const navigate = useNavigate();
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  return (
    <div className="home-container"
        style={{backgroundImage: `url('/assets/backgrounds/bg_home.png')`}}>
      {!showLevelSelect ? (
        // First Page
        <div className="content top-left">
          <h1 className="game-title">Senti Barista</h1>
          <div className="button-container">
            <button 
              className="game-button play-button"
              onClick={() => setShowLevelSelect(true)}
            >
              Play Now
            </button>
          </div>
        </div>
      ) : (
        // Level Selection Page
        <div className="level-select-container">
          <div className="level-select-header">
            <button 
              className="back-button"
              onClick={() => setShowLevelSelect(false)}
            >
              ← Back
            </button>
            <h2>Select Game Mode</h2>
          </div>
          
          <div className="game-modes">
            <div className="game-mode-card" onClick={() => navigate('/levelselect')}>
              <h3>Story Mode</h3>
              <p>Play through different levels</p>
            </div>

            <div className="game-mode-card" onClick={() => navigate('/daily')}>
              <h3>Daily Challenge</h3>
              <p>New challenge every day</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
