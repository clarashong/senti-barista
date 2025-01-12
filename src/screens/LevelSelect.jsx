// LevelSelect.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './LevelSelect.css';
import { customers } from '../data/customers';

function LevelSelect() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCardClick = (levelId) => {
    console.log(levelId); 
    navigate('/game', {
        state: { levelId: levelId}
    });
  };

  const handleNext = () => {
    if (currentIndex < customers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="level-select-page">
      <div className="header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back
        </button>
        <h2>Select Level</h2>
      </div>

      <div className="carousel-container">
        <button 
          className="carousel-button prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ←
        </button>

        <div className="carousel-viewport">
          <div 
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {customers.map((level) => (
              <div 
                key={level.id}
                className="level-card"
                onClick={() => handleCardClick(level.id)}
              >
                <div className="level-content">
                  <h2>Level {level.id}</h2>
                  <div className="customer-image-container">
                    <img 
                      src={level.assets.headshot} 
                      alt={level.name}
                      className="customer-image"
                    />
                  </div>
                  <div className="customer-info">
                    <h4>{level.name}</h4>
                    <p>{level.personality}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="carousel-button next"
          onClick={handleNext}
          disabled={currentIndex === customers.length - 1}
        >
          →
        </button>
      </div>
    </div>
  );
}

export default LevelSelect;
