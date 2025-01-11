import React from 'react';
import Level from './components/Level';
import { GameProvider } from './context/GameContext';
import { generateMultipleCustomers }  from './generation/customerGeneration';

// Generate customers once when the app loads
generateMultipleCustomers(1)
.then(customers => console.log(JSON.stringify(customers, null, 2)))
.catch(error => console.error(error));

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
