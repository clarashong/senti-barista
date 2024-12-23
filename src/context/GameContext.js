import React, { createContext, useState, useContext } from 'react';
import { customers } from '../data/customers';
import { levels } from '../data/levels';

const GameContext = createContext();

export function GameProvider({ children }) {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [selectedIngredients, setSelectedIngredients] = useState(["","","",""]);
    const [decorations, setDecorations] = useState([]);

    // Get current customer based on level
    const getCurrentCustomer = () => {
        const level = levels.find(l => l.level === currentLevel);
        return customers.find(c => c.id === level.customerId);
    };

    // Calculate score based on ingredients and decorations
    const calculateScore = () => {
        const customer = getCurrentCustomer();
        let score = 0;
        
        // Check ingredients
        const correctIngredients = customer.expectedIngredients.filter(
            ing => selectedIngredients.includes(ing)
        );
        score += (correctIngredients.length / customer.expectedIngredients.length) * 70;

        // Check if decoration matches preference
        if (customer.attributes.temperaturePreference === "cold" && 
            !decorations.includes("Whipped Cream")) {
            score += 30;
        }

        return Math.round(score);
    };

    const value = {
        currentLevel,
        setCurrentLevel,
        score,
        setScore,
        selectedIngredients,
        setSelectedIngredients,
        decorations,
        setDecorations,
        getCurrentCustomer,
        calculateScore
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
