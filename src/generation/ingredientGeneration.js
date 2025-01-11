import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { ingredients } from "./generatedIngredients";
import { customers } from "./generatedCustomers"; 


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
    Generate entries (no duplicates) for all and only the ingredients listed in the "likes", "dislikes", "theme", "offtheme" categories 
    in this customer list: ${JSON.stringify(customers)}

    The response should be a list of JSON objects matching this exact structure:

    {
        name: (string - ingredient name), 
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
