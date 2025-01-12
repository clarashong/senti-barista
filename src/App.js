import React from 'react';
import Level from './components/Level';
import { GameProvider } from './context/GameContext';

function App() {
    return (
        <GameProvider>
            <div className="App" style={{
                minHeight: '100vh',
                backgroundColor: '#dfc98a'
            }}>
                <Level />
            </div>
        </GameProvider>
    );
}

export default App;