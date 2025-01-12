import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import './Level.css';

function Level({ levelNumber = 1 }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [score, setScore] = useState(null);
    
    const {
        currentLevel,
        setCurrentLevel,
        selectedIngredients,
        setSelectedIngredients,
        decorations,
        setDecorations,
        getCurrentCustomer,
        calculateScore,
        availableDecorations
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

    const checkAnswers = () => {
        setScore(calculateScore); 
    }

    // Navigation functions
    const nextPage = () => {
        if (currentPage < 4) {
            setCurrentPage(currentPage + 1);
        }
        if (currentPage === 3) {
            checkAnswers();
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getDrinkImage = (ingredients) => {
        const filledCount = selectedIngredients.filter(str => str.trim() !== '').length; // count filled strings
        if (filledCount < 0 || filledCount > 4) {
            return 'drink_0.png'
        }
        return 'drink_' + filledCount + '.png';
    };
    
    // image transitions
    const [currentImage, setCurrentImage] = useState(getDrinkImage(selectedIngredients));
    const [nextImage, setNextImage] = useState(getDrinkImage(selectedIngredients));
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Add this useEffect to handle the image transitions
    useEffect(() => {
        const newImage = getDrinkImage(selectedIngredients);
        if (newImage !== currentImage) {
            setNextImage(newImage);
            setIsTransitioning(true);
            
            const timer = setTimeout(() => {
                setCurrentImage(newImage);
                setIsTransitioning(false);
            }, 500); // Match this duration with CSS transition
            
            return () => clearTimeout(timer);
        }
    }, [selectedIngredients]);
    
    const getDecoratedDrinkImage = () => {
        if (decorations.length == 0) return 'drink_4.png'; 
        return 'drink_' + decorations[0] + '.png';
    };

    const getFeedback = () => {
        let numberScore = parseInt(score.total)
        if (numberScore < 20) return customer.feedback.negative[0];
        if (numberScore < 40) return customer.feedback.negative[1];
        if (numberScore < 60) return customer.feedback.neutral[0]; 
        if (numberScore < 80) return customer.feedback.neutral[1];
        if (numberScore < 90) return customer.feedback.positive[0];
        return customer.feedback.positive[1];
    };

    const orderPopup = () => {
        return (
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                backgroundColor: '#F5F5F5',
                padding: '15px',
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                maxWidth: '200px',
                zIndex: 1000,
                marginLeft: '3%'
            }}>
                <p style={{
                    margin: 0,
                    color: '#5F422B',
                    fontWeight: 'bold'
                }}>
                    {customer.order}
                </p>
                
                {/* Circular icon */}
                <div style={{
                    position: 'absolute',
                    bottom: '-35px',
                    left: '-35px',
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#F5F5F5', 
                    border: 'solid',
                    borderRadius: '50%',
                    borderColor: '#408c75',
                    borderWidth: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden' // ensures the image stays within the circular div
                }}>
                    <img
                        src = 'assets/game/customers/timmy.png'
                        style = {{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}></img>
                </div>
            </div>
        );
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
                            marginBottom: '0px', 
                            color: '#5F422B',
                            fontWeight: 800
                        }}>
                            Level {levelNumber}
                        </h1>

                        {/* 2. Customer name's order */}
                        <h2 style={{ 
                            textAlign: 'center', 
                            marginBottom: '30px',
                            color: '#5F422B' 
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
                            <div
                                style={{
                                    width: '250px',
                                    height: '250px',
                                    borderRadius: '50%',
                                    backgroundColor: '#F5F5F5', // whitesmoke 
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden' // ensures the image stays within the circular div
                                }}
                            >
                                <img 
                                    src='/assets/game/customers/timmy.png'
                                    alt="Customer headshot"
                                    className="customer-headshot"
                                    style={{
                                        width: '240px',
                                        height: '240px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>

                            {/* Order speech bubble */}
                            <div style={{ 
                                position: 'relative',
                                backgroundColor: '#F5F5F5',
                                border: 'none',
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
                                    borderRight: '20px solid #F5F5F5'
                                }}></div>
                                <p style={{ 
                                    margin: 0,
                                    color: '#5F422B',
                                    fontWeight: 'bold'
                                }}>{customer.order}</p>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="ingredients-page">
                        <h1 style={{ textAlign: 'center',
                            color: '#5F422B',
                            marginBottom: '60px'
                            }}>Create Your Drink</h1>
                        {orderPopup()}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '40px',
                            marginTop: '20px'
                        }}>
                            {/* Drink Preview */}
                            <div style={{
                                width: '300px',
                                height: '300px',
                                position: 'relative',  // Important for stacking images
                                backgroundColor: '#F5F5F5',
                                borderRadius: '20px'
                            }}>
                                {/* Bottom (old) image */}
                                <img 
                                    src={'/assets/game/drink/' + currentImage}
                                    alt="Current Drink"
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                                {/* Top (new) image */}
                                <img 
                                    src={'/assets/game/drink/' + nextImage}
                                    alt="Next Drink"
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        opacity: isTransitioning ? 1 : 0,
                                        transition: 'opacity 0.5s ease-in-out'
                                    }}
                                />
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
                        <h1 style={{
                            textAlign: 'center',
                            color: '#5F422B',
                            marginBottom: '60px' }}>
                                Decorate Your Drink
                        </h1>
                        {orderPopup()}

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
                                border: 'none',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img src = {'assets/game/drink/' + getDecoratedDrinkImage()}></img>
                            </div>
                            {/* Decorations grid */}
                            <div style={{
                                width: '300px',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)', // Changed to 3 columns for better layout
                                gap: '10px',
                                alignContent: 'start'
                            }}>
                                {availableDecorations.map(decoration => (
                                    <button
                                        key={decoration}
                                        onClick={() => handleDecorationSelect(decoration)}
                                        style={{
                                            aspectRatio: '1', // Makes the button square
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '10px',
                                            backgroundColor: decorations.includes(decoration) ? '#408c75' : '#F5F5F5',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            color: decorations.includes(decoration) ? 'white' : '#5F422B',
                                            transition: 'all 0.3s ease',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <img
                                            key={decoration}
                                            src={'/assets/game/decorations/' + decoration + '.png'}
                                            width='75px'>
                                        </img>
                                        <span style={{ 
                                            fontSize: '14px',
                                            textAlign: 'center',
                                            wordWrap: 'break-word'
                                        }}>
                                            {decoration}
                                        </span>
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
                        <h1 style={{ 
                            textAlign: 'center', 
                            marginBottom: '20px',
                            color: '#5F422B' 
                        }}>Drink Results</h1>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            gap: '30px',
                            marginBottom: '30px' 
                        }}>
                            {/* Image placeholder */}
                            <div
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    backgroundColor: '#F5F5F5', // whitesmoke 
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden' // ensures the image stays within the circular div
                                }}
                            >
                                <img 
                                    src='/assets/game/customers/timmy.png'
                                    alt="Customer headshot"
                                    className="customer-headshot"
                                    style={{
                                        width: '90px',
                                        height: '90px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>

                            {/* Feedback speech bubble */}
                            <div style={{ 
                                position: 'relative',
                                backgroundColor: '#F5F5F5',
                                border: 'none',
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
                                    borderRight: '20px solid #F5F5F5'
                                }}></div>
                                <p style={{ 
                                    margin: 0,
                                    color: '#5F422B',
                                }}>{getFeedback()}</p>
                            </div>
                        </div>
                        
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'stretch',
                            gap: '10px',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            {/* Left section - Image and Ingredients */}
                            <div style={{
                                flex: '0 1 auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                width: '300px',
                                height: '300px'
                            }}>
                                {/* Drink image placeholder */}
                                <div style={{
                                    width: '300px',
                                    height: '300px',
                                    backgroundColor: '#F5F5F5',
                                    border: 'none',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundImage: `url('/assets/game/drink/drink_dandelion.png')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}>
                                    {/* Ingredients list */}
                                    <div style={{
                                        width: '100%', // Match image width exactly
                                        height: '100%',
                                        boxSizing: 'border-box', // Include padding in width calculation
                                        padding: '20px',
                                        backgroundColor: '#F5F5F5CC',
                                        border: 'none',
                                        borderRadius: '20px',
                                        alignSelf: 'flex-start',
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        whiteSpace: 'normal'
                                    }}>
                                        <h3 style={{ 
                                            marginBottom: '10px',
                                            color: '#5F422B' 
                                            }}>Ingredients:</h3>
                                        {selectedIngredients.map((ingredient, index) => (
                                                <p 
                                                    key={index} 
                                                    style={{
                                                    marginBottom: '0px',
                                                    color: '#5F422B',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {ingredient}
                                                </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
            
                            {/* Middle section - Report Card */}
                            <div style={{
                                flex: '0 1 auto',
                                backgroundColor: '#fff',
                                padding: '20px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '350px',
                                maxHeight: '300px'
                            }}>
                                <h3 style={{ 
                                    marginBottom: '10px' ,
                                    color: '#5F422B'
                                    }}>Final Grade</h3>
                                
                                {/* Overall grade circle */}
                                <div style={{
                                    width: '75px',
                                    height: '75px',
                                    borderRadius: '50%',
                                    backgroundColor: '#408c75',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    marginBottom: '20px'
                                }}>
                                    {score.total || '90'}%
                                </div>

                                {/* Category grades */}
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px',
                                    textColor: '#5F422B'
                                }}>
                                    {[
                                        { category: 'Creativity', score: score.creativity },
                                        { category: 'Theme', score: score.theme },
                                        { category: 'Taste', score: score.taste }
                                    ].map((item, index) => (
                                        <div key={item.category} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '10px 15px',
                                            backgroundColor: '#f8f8f8',
                                            borderRadius: '8px'
                                        }}>
                                            <span style={{ 
                                                fontSize: '16px',
                                                color: '#333'
                                            }}>
                                                {item.category}
                                            </span>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px'
                                            }}>
                                                <div style={{
                                                    width: '100px',
                                                    height: '8px',
                                                    backgroundColor: '#e0e0e0',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${item.score}%`,
                                                        height: '100%',
                                                        backgroundColor: '#71c39f',
                                                        borderRadius: '4px'
                                                    }} />
                                                </div>
                                                <span style={{
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    color: '#408c75',
                                                    minWidth: '45px'
                                                }}>
                                                    {item.score}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
        backgroundColor: '#F5F5F5',
        borderRadius: '20px',
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
                        backgroundColor: '#71c39f',
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
                        disabled={currentPage === 1 || currentPage === 4}
                        style={{
                            padding: '10px 20px',
                            cursor: currentPage === 1 || currentPage === 4 ? 'not-allowed' : 'pointer',
                            backgroundColor: currentPage === 1 || currentPage === 4 ? '#e0e0e0' : '#408c75',
                            border: 'none',
                            borderRadius: '5px',
                            color: 'white',
                            fontSize: '16px', 
                            fontWeight: 'bold'
                        }}
                    >
                        Previous
                    </button>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === 4}
                        style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            backgroundColor: currentPage === 4 ? '#5F422B' : '#408c75',
                            border: 'none',
                            borderRadius: '5px',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold'
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
