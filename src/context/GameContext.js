import React, { createContext, useState, useContext } from 'react';
import { customers } from '../data/customers';
import { levels } from '../data/levels';
import { ingredients } from '../data/ingredients';

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

    // Loop through selected ingredients and check against customer preferences
    const getTasteScore = (customer) => {
        let tasteScore = 0;
    
        let distribution = {sweetness: 0, saltiness: 0, sourness: 0, bitterness: 0, umami: 0}
        // get the distribution of ingredients 
        selectedIngredients.forEach((ingredient) => {
            ingredient = ingredients.find(i => i.name === ingredient);
            if (ingredient) {
                distribution.sweetness += ingredient.sweetness;
                distribution.saltiness += ingredient.saltiness;
                distribution.sourness += ingredient.sourness;
                distribution.bitterness += ingredient.bitterness;   
                distribution.umami += ingredient.umami; 
            }
        });
        let total = distribution.sweetness + distribution.saltiness + distribution.sourness + distribution.bitterness + distribution.umami;
        if (total === 0) return 0; // case, no ingredients entered
        let totalSquareError = 0; 
        Object.entries(distribution).forEach(([taste, score]) => {
            score = score * 100 / total; // scales it to a score% 
            totalSquareError += Math.pow(score - customer.taste[taste], 2);
        });
        
        let meanSquareError = totalSquareError / 5; 
        return Math.max(0, Math.round(100 - Math.sqrt(meanSquareError))); 
    };      

    const getCreativityScore = (customer) => {
        let scale = 10; 
        let totalRarity = 0; 
        selectedIngredients.forEach(ingredient => {
            ingredient = ingredients.find(i => i.name === ingredient);
            if (ingredient) {
                totalRarity += ingredient.rarity;
            }
        });
        return Math.round(totalRarity * 100 / scale); // creativity score
    }; 

    const getThemeScore = (customer) => {
        let themeScore = 50; // neutral score
        customer.theme.forEach(ing => {
            if (selectedIngredients.includes(ing)) {
                themeScore += 20;
            }
        });
        customer.offTheme.forEach(ing => {
            if (selectedIngredients.includes(ing)) {
                themeScore -= 15;
            }
        });
        return themeScore;
    }

    // Calculate score based on ingredients and decorations
    const calculateScore = () => {
        const customer = getCurrentCustomer();
        let score = {creativity: getCreativityScore(customer), taste: getTasteScore(customer), theme: getThemeScore(customer)};
        score.total = Math.round((score.creativity + score.taste + score.theme) / 3);
        return score; 
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
