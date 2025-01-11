import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { ingredients } from "./generatedIngredients";
import { custIngredients } from "./customerIngredients";


// env var validation 
const requiredEnvVars = [
    'REACT_APP_AWS_REGION',
    'REACT_APP_AWS_ACCESS_KEY_ID',
    'REACT_APP_AWS_SECRET_ACCESS_KEY'
];

const validateEnvVars = () => {
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }
};

// Call this when your application starts
validateEnvVars();

const client = new BedrockRuntimeClient({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    }
});

export async function generateIngredientList() {
    const previousIngredients = `Previously generated ingredients: '${JSON.stringify(ingredients)}'. 
       Please continue the list, with different ingredients from these.`;

    const prompt = `${previousIngredients} 
    
    Generate a list of unique ingredients that would be used to create drinks in a drink-creation game. 
    The response should be a list of JSON objects matching this exact structure:

    {
        name: (string - ingredient name lowercase), 
        sweetness: (number 0-10 - sweetness level from 0 to 10), 
        saltiness: (number 0-10 - saltiness level from 0 to 10), 
        sourness: (number 0-10 - sourness level from 0 to 10), 
        bitterness: (number 0-10 - bitterness level from 0 to 10), 
        umami: (number 0-10 - umami level from 0 to 10),
        rarity: (number 0-10 - how rarely the ingredient is used in drinks from 0 to 10), 
    }

    Please respond with only the list of JSON objects, no additional text.`;

    try {
        const input = {
            modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 3000,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt
                            }
                        ]
                    }
                ],
                temperature: 0.7
            })
        };

        const command = new InvokeModelCommand(input);
        const response = await client.send(command);
        
        // Parse the response
        const responseData = JSON.parse(new TextDecoder().decode(response.body));
        
        // Extract the content from the response
        const content = responseData.content[0].text;
        
        // Parse the JSON response
        const ingredientList = JSON.parse(content);
        
        return ingredientList;
    } catch (error) {
        console.error("Error generating ingredient list:", error);
        throw error;
    }
}

export async function generateCustomerIngredientList() {
    const prompt = `You must generate a valid JSON array of ingredient objects for a drink-creation game.
    Format your entire response as a single JSON array, starting with '[' and ending with ']'.

    Each ingredient object must follow this exact structure:
    {
        "name": "ingredient name",
        "sweetness": 0,
        "saltiness": 0,
        "sourness": 0,
        "bitterness": 0,
        "umami": 0,
        "rarity": 0
    }

    Here is the list of ingredient profiles to generate: [${custIngredients.toString()}]

    CRITICAL REQUIREMENTS:
    1. Response must start with '[' and end with ']'
    2. Use double quotes for all property names and string values
    3. Use numbers (0-10) for all numeric values
    4. Include all properties for each ingredient
    5. Ensure proper JSON formatting with commas between objects
    6. Do not include any text outside the JSON array
    7. Make sure to close all brackets and braces

    Example of correct formatting:
    [
        {
            "name": "coffee",
            "sweetness": 2,
            "saltiness": 0,
            "sourness": 4,
            "bitterness": 8,
            "umami": 1,
            "rarity": 3
        },
        {
            "name": "honey",
            "sweetness": 9,
            "saltiness": 0,
            "sourness": 1,
            "bitterness": 1,
            "umami": 0,
        "rarity": 2
        }
    ]`;

    try {
        const input = {
            modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 3000,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt
                            }
                        ]
                    }
                ],
                temperature: 0.7
            })
        };

        const command = new InvokeModelCommand(input);
        const response = await client.send(command);
        
        // Decode and log the raw response
        const rawResponse = new TextDecoder().decode(response.body);
        console.log("Raw response:", rawResponse);
        
        const responseData = JSON.parse(rawResponse);
        let content = responseData.content[0].text;
        
        // Log the content before processing
        console.log("Original content:", content);

        // Clean up the content
        content = content.trim();
        
        // Extract JSON array from the content
        let jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            // If no complete JSON array is found, try to fix common issues
            if (content.startsWith('[') && !content.endsWith(']')) {
                content = content + ']';
            }
            // Remove any text before [ and after ]
            content = content.replace(/^[\s\S]*?(\[[\s\S]*?\])[\s\S]*$/, '$1');
        } else {
            content = jsonMatch[0];
        }

        // Additional cleanup
        content = content
            .replace(/'/g, '"')  // Replace single quotes with double quotes
            .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // Add quotes to property names
            .replace(/,\s*([}\]])/g, '$1');  // Remove trailing commas

        console.log("Processed content:", content);

        // Try to parse the cleaned content
        let ingredientList;
        try {
            ingredientList = JSON.parse(content);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            throw new Error("Failed to parse JSON after cleanup");
        }

        // Validate the response
        return validateIngredientResponse(ingredientList);

    } catch (error) {
        console.error("Error generating ingredient list:", error);
        throw error;
    }
}

// Validation helper function remains the same
function validateIngredientResponse(list) {
    if (!Array.isArray(list)) {
        throw new Error('Response must be an array');
    }

    const requiredFields = ['name', 'sweetness', 'saltiness', 'sourness', 'bitterness', 'umami', 'rarity'];
    
    list.forEach((item, index) => {
        // Check all required fields exist
        requiredFields.forEach(field => {
            if (!(field in item)) {
                throw new Error(`Missing required field "${field}" in item ${index}`);
            }
        });
        
        // Validate types
        if (typeof item.name !== 'string') {
            throw new Error(`Name must be a string in item ${index}`);
        }
        
        // Validate numeric fields
        ['sweetness', 'saltiness', 'sourness', 'bitterness', 'umami', 'rarity'].forEach(field => {
            if (typeof item[field] !== 'number') {
                throw new Error(`${field} must be a number in item ${index}`);
            }
            if (item[field] < 0 || item[field] > 10) {
                throw new Error(`${field} must be between 0 and 10 in item ${index}`);
            }
        });
    });
    
    return list;
}


// export async function generateCustomerIngredientList() {
//     const previousIngredients = `Previously generated ingredients: '${JSON.stringify(ingredients)}'. 
//        Please continue the list, with different ingredients from these.`;

//     const prompt = `${previousIngredients} 
    
//     Generate a list of ingredients that would be used to create drinks in a drink-creation game. 
//     Here is the list of ingredient profiles that I need: [${custIngredients.toString()}]
//     The response should be a list of JSON objects matching this exact structure:
//     {
//         name: (string - ingredient name lowercase), 
//         sweetness: (number 0-10 - sweetness level from 0 to 10), 
//         saltiness: (number 0-10 - saltiness level from 0 to 10), 
//         sourness: (number 0-10 - sourness level from 0 to 10), 
//         bitterness: (number 0-10 - bitterness level from 0 to 10), 
//         umami: (number 0-10 - umami level from 0 to 10),
//         rarity: (number 0-10 - how rarely the ingredient is used in drinks from 0 to 10) 
//     }

//     Please respond with only the list of JSON objects, no additional text.`;

//     try {
//         const input = {
//             modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
//             contentType: "application/json",
//             accept: "application/json",
//             body: JSON.stringify({
//                 anthropic_version: "bedrock-2023-05-31",
//                 max_tokens: 3000,
//                 messages: [
//                     {
//                         role: "user",
//                         content: [
//                             {
//                                 type: "text",
//                                 text: prompt
//                             }
//                         ]
//                     }
//                 ],
//                 temperature: 0.7
//             })
//         };

//         const command = new InvokeModelCommand(input);
//         const response = await client.send(command);
        
//         // Parse the response
//         const responseData = JSON.parse(new TextDecoder().decode(response.body));
        
//         // Extract the content from the response
//         const content = responseData.content[0].text;
        
//         // Parse the JSON response
//         const ingredientList = JSON.parse(content);
        
//         return ingredientList;
//     } catch (error) {
//         console.error("Error generating ingredient list:", error);
//         throw error;
//     }
// }

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateIngredientData(times) {
    let ingredientData = []; 
    for (let i = 0; i < times; i++) {
        try {
            const ingredientList = await generateIngredientList();
            if (i < times - 1) {
                await delay(1000);
            }
            ingredientData.append(ingredientList); 
        } catch (error) {
            console.error(`Error generating ingredient list ${i+1}:`, error);
        }
    }
    return ingredientData;
}    
