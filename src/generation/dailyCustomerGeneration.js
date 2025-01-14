import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { example } from './exampleCustomers';

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

export async function generateCustomerProfile() {
    const previousCustomersContext = `Here is an example of a well-generated customer: ${JSON.stringify(example)}`

    const prompt = `Generate a unique and random customer profile for an abstract and sentiment-based drink shop game. 
    ${previousCustomersContext}
    The response should be one JSON object matching this exact structure:

    {
        name: (string - customer first name),
        age: (number 5-80),
        order: (string - a drink request based on a random emotion/sentiment or experience - for an easy-to-medium level),
        personality: (string - describing the customer - [adjective] and [adjective])
        taste: {
            sweetness: (number 0-100),
            saltiness: (number 0-100),
            sourness: (number 0-100),
            bitterness: (number 0-100),
            umami: (number 0-100)
        },
        likes: (array of minimum 10 strings - ingredients the customer personally likes - not based on the order),
        dislikes: (array of minimum 5 strings - ingredients the customer personally dislikes - not based on the order),
        theme: (array of minimum 10 strings - specific edible ingredients that match their order's theme. Must be different from likes),
        offTheme: (array of minimum 5 strings - specific edible ingredients that go against their order's. Must be different from dislikes),
        decoration: (empty array for now),
        feedback: {
            positive: (array of 1 possible positive feedback strings - in character as this customer),
            neutral: (array of 1 possible netural feedback strings - in character as this customer), 
            negative: (array of 1 possible negative feedback strings - in character as this customer)
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
            console.log('bad customer, trying again');
            return generateCustomerProfile(); 
        }
        console.log(customerProfile);
        return customerProfile;
    } catch (error) {
        console.error("Error generating customer profile:", error);
        throw error;
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

