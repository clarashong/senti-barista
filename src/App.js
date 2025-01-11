import React from 'react';
import Level from './components/Level';
import { GameProvider } from './context/GameContext';
import { generateMultipleCustomers }  from './generation/customerGeneration';
import { generateIngredientList } from './generation/ingredientGeneration';
import { generateCustomerIngredientList } from './generation/ingredientGeneration';
import { getCustomerIngredients } from './scripts/printingData';
import { formatIngredients } from './scripts/printingData';

// // Generate customers once when the app loads
// generateMultipleCustomers(1)
// .then(customers => console.log(JSON.stringify(customers, null, 2)))
// .catch(error => console.error(error));

// generateIngredientList()
// .then(ingredients => console.log(JSON.stringify(ingredients, null, 2)))
// .catch(error => console.error(error))

// generateCustomerIngredientList()
// .then(ingredients => console.log(JSON.stringify(ingredients, null, 2)))
// .catch(error => console.error(error))

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
