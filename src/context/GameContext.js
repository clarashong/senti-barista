import React, { createContext, useState, useContext, useEffect } from 'react';
import { customers } from '../data/customers';
import { levels } from '../data/levels';
import { ingredients } from '../generation/generatedIngredients';
import { availableDecorations } from '../data/decorations';
import { useLocation } from 'react-router-dom';
import { getMultipleIngredients } from '../scripts/ingredients_DB';

const GameContext = createContext();

export function GameProvider({ children }) {
    
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [selectedIngredients, setSelectedIngredients] = useState(["","","",""]);
    const [decorations, setDecorations] = useState([]);
    const [bonus, setBonus] = useState([]);
    
    const location = useLocation();
    const levelId = location.state?.levelId;

    let ingredientDataResponse = {
        found: [],
        missing: [],
        total: 0,
        foundCount: 0,
        missingCount: 0
    };
    
    // Get current customer based on level
    const getCurrentCustomer = () => {
        return customers.find(c => c.id === levelId);
    };

    const getLikePoints = (customer) => {
        let points = 0; 
        selectedIngredients.forEach((ingredient) => {
            if (ingredient) {
                if (customer["likes"].find(i => i === ingredient)) {
                    points += 5; 
                    let feedback = "+ Taste + : " + customer.name+ " really likes " + ingredient; 
                    //setBonus(prevBonus => [...prevBonus, feedback])
                }
                if (customer["dislikes"].find(i => i === ingredient)) {
                    points -= 7; 
                    let feedback = "- Taste - : " + customer.name+ " really hates " + ingredient; 
                    //setBonus(prevBonus => [...prevBonus, feedback])
                }
            }
        });
        return points; 
    };

    // Loop through selected ingredients and check against customer preferences
    const getTasteScore = (customer) => {
        if (!customer || !selectedIngredients || !ingredientDataResponse?.found) return 0;

        let tasteScore = 0;
        let distribution = {sweetness: 0, saltiness: 0, sourness: 0, bitterness: 0, umami: 0}
        // get the distribution of ingredients 
        selectedIngredients.forEach((ingredient) => {
            ingredient = ingredientDataResponse.found.find(i => i.name === ingredient.toLowerCase());
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
        let score = Math.max(0, Math.round(100 - Math.sqrt(meanSquareError))); 
        score += getLikePoints(customer); 
        return Math.min(Math.max(0, score), 100); 
    };      

    const getCreativityScore = (customer) => {
        let scale = 10; 
        let totalRarity = 0; 
        selectedIngredients.forEach(ingredient => {
            if (ingredient) {
                console.log(ingredientDataResponse.found)
                ingredient = ingredientDataResponse.found.find(i => i.name === ingredient.toLowerCase());
                if (ingredient) {
                    totalRarity += ingredient.rarity; 
                } else {
                    totalRarity += 10; // neutral-low rarity // not in database
                }
            }
        });
        return Math.min(100, Math.round(totalRarity * 100 / scale)); // creativity score
    }; 

    const getThemeScore = (customer) => {
        let themeScore = 50; // neutral score
        if (selectedIngredients.filter(Boolean).length === 0) return 0; 
        selectedIngredients.forEach((ingredient) => {
            // ingredient in database 
            if (ingredientDataResponse.found.find(i => i.name === ingredient.toLowerCase())) {
                if (customer["theme"].includes(ingredient)) {
                    themeScore += 25; 
                    let feedback = "+ theme + : " + ingredient + "is super on-theme.";
                    //setBonus(prevBonus => [...prevBonus, feedback])
                }
                if (customer["offTheme".includes(ingredient)]) {
                    themeScore -= 15; 
                    let feedback = "+ theme + : " + ingredient + "is off-theme.";
                    //setBonus(prevBonus => [...prevBonus, feedback])
                }
            }
        })
        return Math.min(100, themeScore);
    }

    // Calculate score based on ingredients and decorations
    const calculateScore = async () => {
        const customer = getCurrentCustomer();
        const response = await getMultipleIngredients(selectedIngredients);
        console.log(response);
        if (!response || !response.found) {
            return { creativity: 0, taste: 0, theme: 0, total: 0 };
        }
        ingredientDataResponse = response; 
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
        bonus,
        setBonus,
        getCurrentCustomer,
        calculateScore,
        availableDecorations
    };

    return (
        <GameContext.Provider value={value}>
            <div className="App" style={{
                minHeight: '100vh',
                backgroundColor: '#dfc98a',
                backgroundImage: `url('/assets/backgrounds/bg_levels.png')`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed'
            }}>
                {children}
            </div>
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
