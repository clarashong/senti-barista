import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
    DynamoDBDocumentClient, 
    BatchWriteCommand, 
    ScanCommand,
    BatchGetCommand 
} from "@aws-sdk/lib-dynamodb";
import { ingredients } from '../generation/generatedIngredients';

// Validate environment variables
// Add to your required environment variables
const requiredEnvVars = [
    'REACT_APP_AWS_REGION',
    'REACT_APP_AWS_ACCESS_KEY_ID',
    'REACT_APP_AWS_SECRET_ACCESS_KEY',
];

// Use environment variable for table name
const TABLE_NAME = process.env.DYNAMO_INGREDIENTS_TABLE || 'Ingredients';

const validateEnvVars = () => {
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            console.log(`Missing required environment variable: ${envVar}`);
        }
    }
};

// Call this when your application starts
validateEnvVars();

// Create DynamoDB client
const client = new DynamoDBClient({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    }
});

const docClient = DynamoDBDocumentClient.from(client);
// Update the uploadIngredients function to use TABLE_NAME
async function uploadIngredients() {
    const chunkSize = 25;
    const chunks = [];
    let totalItems = ingredients.length;
    let uploadedItems = 0;
    let failedItems = 0;
    
    console.log(`Starting upload of ${totalItems} ingredients to ${TABLE_NAME}...`);
    
    for (let i = 0; i < ingredients.length; i += chunkSize) {
        chunks.push(ingredients.slice(i, i + chunkSize));
    }

    for (const [index, chunk] of chunks.entries()) {
        const params = {
            RequestItems: {
                [TABLE_NAME]: chunk.map(ingredient => ({  // Use TABLE_NAME here
                    PutRequest: {
                        Item: {
                            ...ingredient,
                            id: ingredient.name.replace(/\s+/g, '-').toLowerCase()
                        }
                    }
                }))
            }
        };

        try {
            const command = new BatchWriteCommand(params);
            const result = await docClient.send(command);
            
            uploadedItems += chunk.length;
            console.log(`Progress: ${uploadedItems}/${totalItems} items (Chunk ${index + 1}/${chunks.length})`);
            
            if (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0) {
                const unprocessedCount = result.UnprocessedItems[TABLE_NAME]?.length || 0;  // Use TABLE_NAME here
                console.log(`Warning: ${unprocessedCount} items unprocessed in chunk ${index + 1}`);
                failedItems += unprocessedCount;
                await handleUnprocessedItems(result.UnprocessedItems);
            }
        } catch (error) {
            console.error('Error uploading chunk:', error);
            failedItems += chunk.length;
            throw error;
        }
    }

    // Verify count in DynamoDB
    try {
        const scanCommand = new ScanCommand({
            TableName: TABLE_NAME,  // Use TABLE_NAME here
            Select: 'COUNT'
        });
        const countResult = await docClient.send(scanCommand);
        console.log(`Items in ${TABLE_NAME}: ${countResult.Count}`);
        console.log(`Expected items: ${totalItems}`);
        
        if (countResult.Count === totalItems - failedItems) {
            console.log('✅ Item count matches expected total');
        } else {
            console.warn('⚠️ Item count mismatch');
        }
    } catch (error) {
        console.error('Error verifying count:', error);
    }

    const summary = {
        totalItems,
        uploadedItems: uploadedItems - failedItems,
        failedItems,
        success: failedItems === 0
    };

    console.log('Upload Summary:', {
        'Table Name': TABLE_NAME,
        'Total Items': summary.totalItems,
        'Successfully Uploaded': summary.uploadedItems,
        'Failed Items': summary.failedItems,
        'Status': summary.success ? 'SUCCESS' : 'COMPLETED WITH ERRORS'
    });

    return summary;
}

// Modify the handleUnprocessedItems function to track retries
async function handleUnprocessedItems(unprocessedItems, maxRetries = 3) {
    let retryCount = 0;
    let items = unprocessedItems;

    while (Object.keys(items).length > 0 && retryCount < maxRetries) {
        retryCount++;
        console.log(`Retry attempt ${retryCount} for unprocessed items...`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));

        try {
            const command = new BatchWriteCommand({
                RequestItems: items
            });
            const result = await docClient.send(command);
            items = result.UnprocessedItems || {};
            
            if (Object.keys(items).length === 0) {
                console.log(`Successfully processed items on retry ${retryCount}`);
            }
        } catch (error) {
            console.error(`Error in retry ${retryCount}:`, error);
            if (retryCount === maxRetries) throw error;
        }
    }
}

// Usage in your application:
async function handleUpload() {
    try {
        const result = await uploadIngredients();
        if (result.success) {
            console.log('✅ Upload completed successfully!');
        } else {
            console.warn('⚠️ Upload completed with some errors');
        }
        
        // You can also verify the count in DynamoDB
        try {
            const scanCommand = {
                TableName: 'Ingredients',
                Select: 'COUNT'
            };
            const countResult = await docClient.send(new ScanCommand(scanCommand));
            console.log(`Items in DynamoDB table: ${countResult.Count}`);
            console.log(`Expected items: ${result.totalItems}`);
            
            if (countResult.Count === result.totalItems) {
                console.log('✅ Item count matches expected total');
            } else {
                console.warn('⚠️ Item count mismatch');
            }
        } catch (error) {
            console.error('Error verifying count:', error);
        }
    } catch (error) {
        console.error('❌ Upload failed:', error);
    }
}

export async function getMultipleIngredients(ingredientNames) {
    // Convert all ingredient names to lowercase for consistency
    const requestedIds = ingredientNames.map(name => name.toLowerCase());
    const keys = requestedIds.filter(name => (name !== "")).map(name => ({ name }));  

    const params = {
        RequestItems: {
            ['Ingredients']: {
                Keys: keys
            }
        }
    };

    try {
        const command = new BatchGetCommand(params);
        const response = await docClient.send(command);
        
        // Get the results for your table
        const results = response.Responses['Ingredients'];
        
        // Find missing ingredients by comparing requested vs received
        const foundNames = results.map(item => item.name);
        const missingNames = requestedIds.filter(name => !foundNames.includes(name));
        
        // Handle any unprocessed keys
        if (response.UnprocessedKeys && Object.keys(response.UnprocessedKeys).length > 0) {
            console.warn('Some items were not processed:', response.UnprocessedKeys);
        }

        if (missingNames.length > 0) {
            // console.log('Some ingredients were not found:', 
            //     missingNames.map(name => ingredientNames[requestedIds.indexOf(name)])
            // );
        }
        return {
            found: results,
            missing: missingNames.map(name => ingredientNames[requestedIds.indexOf(name)]),
            total: ingredientNames.length,
            foundCount: results.length,
            missingCount: missingNames.length
        };
    } catch (error) {
        // console.log('Error details:', {
        //     message: error.message,
        //     name: error.name,
        //     code: error.$metadata?.httpStatusCode,
        //     requestId: error.$metadata?.requestId
        // });
    }
}

export { uploadIngredients };
