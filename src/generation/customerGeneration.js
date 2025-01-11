import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
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

async function generateCustomerProfile(context) {
    const previousCustomersContext = `Previously generated customers: ${JSON.stringify(customers + context)}. 
       Please generate a unique customer profile, whose order is unique and different from these.`;

    const prompt = `${previousCustomersContext} 
    
    Generate a unique customer profile for an abstract and sentiment-based drink shop game. 
    The response should be a JSON object matching this exact structure:

    {
        name: (string - customer name),
        age: (number 5-80),
        order: (string describing what they want, should be a sentiment-based drink request - for a very easy level),
        personality: (string - brief personality description for the customer)
        taste: {
            sweetness: (number 0-100),
            saltiness: (number 0-100),
            sourness: (number 0-100),
            bitterness: (number 0-100),
            umami: (number 0-100)
        },
        likes: (array of minimum 10 strings - ingredients they personally like - not based on the order),
        dislikes: (array of minimum 5 strings - ingredients they personally dislike - not based on the order),
        theme: (array of minimum 10 strings - specific edible ingredients that match their order's theme that are different from likes),
        offTheme: (array of minimum 5 strings - specific edible ingredients that go against their order's theme that are different from dislikes),
        decoration: (empty array for now),
        feedback: {
            positive: (array of 2 possible positive feedback strings - in character as this customer),
            neutral: (array of 2 possible netural feedback strings - in character as this customer), 
            negative: (array of 2 possible negative feedback strings - in character as this customer)
        }
    }

    Note: The sum of all taste values (sweetness, saltiness, sourness, bitterness, umami) must equal 100.
    Please respond with only the JSON object, no additional text.`;

    try {
        const input = {
            modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
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
        const customerProfile = JSON.parse(content);
        
        // Validate that taste values sum to 100
        const tasteSum = Object.values(customerProfile.taste).reduce((a, b) => a + b, 0);
        if (tasteSum !== 100) {
            throw new Error("Taste values do not sum to 100");
        }

        // Validate required fields
        if (!customerProfile.name || 
            !customerProfile.order || 
            !customerProfile.taste || 
            !Array.isArray(customerProfile.likes) ||
            !Array.isArray(customerProfile.dislikes) ||
            !Array.isArray(customerProfile.theme) ||
            !Array.isArray(customerProfile.offTheme) ||
            !Array.isArray(customerProfile.decoration) ||
            !customerProfile.feedback?.positive ||
            !customerProfile.feedback?.negative) {
            throw new Error("Missing required fields in customer profile");
        }
        
        return customerProfile;
    } catch (error) {
        console.error("Error generating customer profile:", error);
        throw error;
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateMultipleCustomers(times) {
    let customers = [];
    for (let i = 0; i < times; i++) {
        try {
            const customer = await generateCustomerProfile(customers);
            customers.push(customer);
            if (i < times - 1) {
                await delay(1000);
            }
        } catch (error) {
            console.error(`Error generating customer ${i+1}:`, error);
        }
    }
    return customers;
}    