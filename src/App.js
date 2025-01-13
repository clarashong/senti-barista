import React from 'react';
import Level from './components/Level';
import { GameProvider } from './context/GameContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import LevelSelect from './screens/LevelSelect';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/levelselect" element={<LevelSelect />} />
        <Route 
          path="/game" 
          element={
            <GameProvider>
              <Level />
            </GameProvider>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
