import { customers } from '../generation/generatedCustomers';
import { ingredients } from '../generation/generatedIngredients';

// prints all ingredients involved in customer profile
export function getCustomerIngredients() {
    let ingredients = new Set(); 
    for (const customer of customers) {
        for (const i of customer.likes) {
            ingredients.add(i.toLowerCase()); 
        }
        for (const i of customer.dislikes) {
            ingredients.add(i.toLowerCase()); 
        }
        for (const i of customer.theme) {
            ingredients.add(i.toLowerCase()); 
        }
        for (const i of customer.offTheme) {
            ingredients.add(i.toLowerCase()); 
        }
    }
    return ingredients; 
}

export function formatIngredients() {
    let usedIngredients = new Set(); // set of previously generated ingredients - to be filled
    let ingredientsList = ingredients; 
    for (let i of ingredientsList) {
        i.name = i.name.toLowerCase(); 
        usedIngredients.add(i.name); 
    }
    let custIngredients = getCustomerIngredients(); 
    for (let i of custIngredients) {
        if (usedIngredients.has(i.name)) {
            custIngredients.delete(i.name); 
        }
    }
    console.log(ingredientsList); 
    console.log(usedIngredients); 
    console.log(custIngredients); 
}