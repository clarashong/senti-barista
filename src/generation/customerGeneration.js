import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ 
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
});

const customerSchema = {
    type: "function",
    function: {
        name: "generateCustomer",
        description: "Generate a unique customer profile for a abstract and sentiment-based drink shop game. The taste preferences must add up to exactly 100.",
        parameters: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Customer's full name"
                },
                order: {
                    type: "string",
                    description: "The customer's verbal drink order or request for an easy difficulty level."
                },
                taste: {
                    type: "object",
                    description: "Customer's taste preferences. All values must be integers and sum to exactly 100",
                    properties: {
                        sweetness: {
                            type: "integer",
                            minimum: 0,
                            maximum: 100,
                            description: "Preference for sweet flavors (0-100)"
                        },
                        bitterness: {
                            type: "integer",
                            minimum: 0,
                            maximum: 100,
                            description: "Tolerance for bitter flavors (0-100)"
                        },
                        sourness: {
                            type: "integer",
                            minimum: 0,
                            maximum: 100,
                            description: "Preference for sour/acidic flavors (0-100)"
                        },
                        saltiness: {
                            type: "integer",
                            minimum: 0,
                            maximum: 100,
                            description: "Preference for salty flavors (0-100)"
                        },
                        umami: {
                            type: "integer",
                            minimum: 0,
                            maximum: 100,
                            description: "Preference for savory flavors (0-100)"
                        }
                    },
                    required: ["sweetness", "bitterness", "sourness", "saltiness", "umami"]
                },
                likes: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "List of ingredients or flavors the customer enjoys",
                    minItems: 10,
                    maxItems: 15
                },
                dislikes: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "List of ingredients or flavors the customer dislikes",
                    minItems: 10,
                    maxItems: 15
                },
                theme: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "Ingredients that match the customer's order",
                    minItems: 10,
                    maxItems: 15
                },
                offTheme: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "Ingredients that don't match the customer's order",
                    minItems: 10,
                    maxItems: 15
                },
                feedback: {
                    type: "object",
                    properties: {
                        positive: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            description: "Positive feedback phrases the customer might say",
                            minItems: 2,
                            maxItems: 4
                        },
                        negative: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            description: "Negative feedback phrases the customer might say",
                            minItems: 2,
                            maxItems: 4
                        }
                    },
                    required: ["positive", "negative"]
                }
            },
            required: ["name", "order", "taste", "likes", "dislikes", "theme", "offTheme", "feedback"]
        }
    }
};

async function generateCustomerProfile() {
    const messages = [
        {
            role: "user",
            content: "Generate a unique customer profile for a abstract and sentiment-based drink shop game. Make sure the customer has interesting preferences and a distinct personality."
        }
    ];

    const input = {
        modelId: "anthropic.claude-3-sonnet-20240229-v1:0",  // Updated model ID
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            anthropic_version: "bedrock-2024-02-29",  // Updated version
            max_tokens: 1000,
            temperature: 0.7,
            messages: messages,
            system: "You are a helpful assistant that generates customer profiles for a coffee shop game.",
            tools: [{ 
                type: "tool",
                name: "generateCustomer",  // Added required name field
                description: "Generate a unique customer profile for a abstract and sentiment-based drink shop game. The taste preferences must add up to exactly 100.",
                input_schema: {  // Changed from "parameters" to "input_schema"
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Customer's full name"
                        },
                        order: {
                            type: "string",
                            description: "The customer's verbal drink order or request for an easy difficulty level."
                        },
                        taste: {
                            type: "object",
                            description: "Customer's taste preferences. All values must be integers and sum to exactly 100",
                            properties: {
                                sweetness: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 100,
                                    description: "Preference for sweet flavors (0-100)"
                                },
                                bitterness: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 100,
                                    description: "Tolerance for bitter flavors (0-100)"
                                },
                                sourness: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 100,
                                    description: "Preference for sour/acidic flavors (0-100)"
                                },
                                saltiness: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 100,
                                    description: "Preference for salty flavors (0-100)"
                                },
                                umami: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 100,
                                    description: "Preference for savory flavors (0-100)"
                                }
                            },
                            required: ["sweetness", "bitterness", "sourness", "saltiness", "umami"]
                        },
                        likes: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            description: "List of ingredients or flavors the customer enjoys",
                            minItems: 10,
                            maxItems: 15
                        },
                        dislikes: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            description: "List of ingredients or flavors the customer dislikes",
                            minItems: 10,
                            maxItems: 15
                        },
                        theme: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            description: "Ingredients that match the customer's order",
                            minItems: 10,
                            maxItems: 15
                        },
                        offTheme: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            description: "Ingredients that don't match the customer's order",
                            minItems: 10,
                            maxItems: 15
                        },
                        feedback: {
                            type: "object",
                            properties: {
                                positive: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    },
                                    description: "Positive feedback phrases the customer might say",
                                    minItems: 2,
                                    maxItems: 4
                                },
                                negative: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    },
                                    description: "Negative feedback phrases the customer might say",
                                    minItems: 2,
                                    maxItems: 4
                                }
                            },
                            required: ["positive", "negative"]
                        }
                    },
                    required: ["name", "order", "taste", "likes", "dislikes", "theme", "offTheme", "feedback"]
                },
                display_width_px: 500,  // Added required field
                display_height_px: 300   // Added required field
            }]
        })
    };
    

    try {
        const command = new InvokeModelCommand(input);
        const response = await client.send(command);
        const responseData = JSON.parse(new TextDecoder().decode(response.body));
        
        // Extract the generated customer data from the tool calls
        if (responseData.tool_calls && responseData.tool_calls.length > 0) {
            const customerData = JSON.parse(responseData.tool_calls[0].parameters);
            return customerData;
        }
        
        return null;
    } catch (error) {
        console.error("Error details:", {
            message: error.message,
            name: error.name,
            code: error.$metadata?.httpStatusCode,
            requestId: error.$metadata?.requestId,
            cfId: error.$metadata?.cfId,
            body: error.response?.body
        });
        throw error;
    }
}

// Example usage
export async function generateMultipleCustomers(count) {
    const customers = [];
    for (let i = 0; i < count; i++) {
        const customer = await generateCustomerProfile();
        if (customer) {
            customers.push(customer);
        }
    }
    return customers;
}



