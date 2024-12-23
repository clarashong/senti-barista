import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

function Level({ levelNumber = 1 }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [score, setScore] = useState(null);

    const { 
        currentLevel,
        ingredients,
        selectedIngredients,
        setSelectedIngredients,
        decorations,
        setDecorations,
        getCurrentCustomer,
        loading,
        error
    } = useGame();

    const customer = getCurrentCustomer(); 
    // Handle ingredient change
    const handleIngredientChange = (index, value) => {
        const newIngredients = [...selectedIngredients];
        newIngredients[index] = value;
        setSelectedIngredients(newIngredients);
    };

    // Check if all ingredients are filled
    const areAllIngredientsFilled = () => {
        return selectedIngredients.every(ingredient => ingredient.trim() !== '');
    };

    // Handle decoration selection
    const handleDecorationSelect = (decoration) => {
        if (decorations.includes(decoration)) {
            // Remove decoration if already selected
            setDecorations([]);
        } else {
            // Replace any existing decoration with the new one
            setDecorations([decoration]);
        }
    };

    // Navigation functions
    const nextPage = () => {
        if (currentPage < 4) {
            setCurrentPage(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Render different pages based on currentPage
    const renderPage = () => {
        switch (currentPage) {
            // In the renderPage function, modify case 1:
            case 1:
                return (
                    <div className="order-page" style={{ textAlign: 'center' }}>
                        {/* 1. Level heading */}
                        <h1 style={{ 
                            textAlign: 'center', 
                            marginBottom: '10px' 
                        }}>
                            Level {levelNumber}
                        </h1>

                        {/* 2. Customer name's order */}
                        <h2 style={{ 
                            textAlign: 'center', 
                            marginBottom: '30px' 
                        }}>
                            {customer.name}'s Order
                        </h2>

                        {/* 3. Image and order container */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            gap: '30px',
                            marginBottom: '30px' 
                        }}>
                            {/* Image placeholder */}
                            <div style={{ 
                                width: '200px', 
                                height: '200px', 
                                backgroundColor: '#f0f0f0', 
                                border: '1px solid #ccc',
                                borderRadius: '8px'
                            }}>
                                {/* Customer image will go here */}
                            </div>

                            {/* Order speech bubble */}
                            <div style={{ 
                                position: 'relative',
                                backgroundColor: '#fff',
                                border: '2px solid #ccc',
                                borderRadius: '20px',
                                padding: '20px',
                                maxWidth: '300px'
                            }}>
                                {/* Speech bubble pointer */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '0',
                                    height: '0',
                                    borderTop: '10px solid transparent',
                                    borderBottom: '10px solid transparent',
                                    borderRight: '20px solid #ccc'
                                }}></div>
                                <p style={{ margin: 0 }}>{customer.order}</p>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                case 2:
                    return (
                        <div className="ingredients-page">
                            <h2 style={{ textAlign: 'center' }}>Create Your Drink</h2>
                            
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '40px',
                                marginTop: '20px'
                            }}>
                                {/* Drink image placeholder */}
                                <div style={{
                                    width: '300px',
                                    height: '300px',
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <p>Drink Preview</p>
                                </div>

                                {/* Ingredients inputs */}
                                <div className="ingredients-form" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '300px'
                                }}>
                                    {selectedIngredients.map((ingredient, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                                            placeholder={`Ingredient ${index + 1}`}
                                            style={{
                                                margin: '10px 0',
                                                padding: '15px',
                                                width: '100%',
                                                borderRadius: '5px',
                                                border: '1px solid #ccc',
                                                fontSize: '16px'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );

            case 3:
                return (
                    <div className="decorations-page">
                        <h2 style={{ textAlign: 'center' }}>Decorate Your Drink</h2>
                        
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '40px',
                            marginTop: '20px'
                        }}>
                            {/* Drink image placeholder */}
                            <div style={{
                                width: '300px',
                                height: '300px',
                                backgroundColor: '#f0f0f0',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <p>Drink Preview</p>
                            </div>
            
                            {/* Decorations grid */}
                            <div style={{
                                width: '300px',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '15px',
                                alignContent: 'start'
                            }}>
                                {['Whipped Cream', 'Chocolate Drizzle', 'Caramel Drizzle', 'Cinnamon', 'Sprinkles'].map(decoration => (
                                    <button
                                        key={decoration}
                                        onClick={() => handleDecorationSelect(decoration)}
                                        style={{
                                            padding: '15px 10px',
                                            backgroundColor: decorations.includes(decoration) ? '#4CAF50' : '#e0e0e0',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            color: decorations.includes(decoration) ? 'white' : 'black',
                                            transition: 'all 0.3s ease',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {decoration}
                                    </button>
                                ))}
                            </div>
                        </div>
            
                        {/* Optional: Selected decoration summary */}
                        <div style={{
                            textAlign: 'center',
                            marginTop: '20px'
                        }}>
                        </div>
                    </div>
                );
                                                    
            case 4:
                return (
                    <div className="results-page">
                        <h2>Drink Results</h2>
                        <div className="results-content">
                            <h3>Final Score: {score || '90'}%</h3>
                            <div className="drink-summary">
                                <h4>Your Drink Contains:</h4>
                                <ul>
                                    {selectedIngredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                </ul>
                                <h4>Decorations:</h4>
                                <ul>
                                    {decorations.map((decoration, index) => (
                                        <li key={index}>{decoration}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };
    // Add fixed positioning container for progress bar and buttons
    const fixedBottomStyle = {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    };

    // Add padding to main content to prevent overlap with fixed bottom bar
    const contentStyle = {
        paddingBottom: '120px' 
    };

    return (
        <div style={{ 
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative'
        }}>
            <div style={contentStyle}>
                {renderPage()}
            </div>

            <div style={fixedBottomStyle}>
                {/* Progress bar */}
                <div className="progress-bar" style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: '#e0e0e0',
                    marginBottom: '20px',
                    borderRadius: '5px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${(currentPage / 4) * 100}%`,
                        height: '100%',
                        backgroundColor: '#4CAF50',
                        transition: 'width 0.3s ease'
                    }}/>
                </div>

                {/* Navigation buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <button
                        onClick={previousPage}
                        disabled={currentPage === 1}
                        style={{
                            padding: '10px 20px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            backgroundColor: currentPage === 1 ? '#e0e0e0' : '#4CAF50',
                            border: 'none',
                            borderRadius: '5px',
                            color: 'white'
                        }}
                    >
                        Previous
                    </button>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === 4}
                        style={{
                            padding: '10px 20px',
                            cursor: currentPage === 4 ? 'not-allowed' : 'pointer',
                            backgroundColor: currentPage === 4 ? '#e0e0e0' : '#4CAF50',
                            border: 'none',
                            borderRadius: '5px',
                            color: 'white'
                        }}
                    >
                        {currentPage === 4 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );

    
}

export default Level;
