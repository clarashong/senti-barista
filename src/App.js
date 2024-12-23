import React from 'react';
import Level from './components/Level';
import { GameProvider } from './context/GameContext';

function App() {
    return (
        <GameProvider>
            <div className="App" style={{
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
            }}>
                <Level />
            </div>
        </GameProvider>
    );
}

export default App;