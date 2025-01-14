import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { generateCustomerProfile } from "../generation/dailyCustomerGeneration";

const client = new DynamoDBClient({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export const getCustomerByDate = async () => {
  const today = new Date().toISOString().split('T')[0];

  const scanParams = {
    TableName: 'Customers',
    FilterExpression: '#dateAttr = :today',
    ExpressionAttributeNames: {
      '#dateAttr': 'date'
    },
    ExpressionAttributeValues: {
      ':today': today
    }
  };

  try {
    const result = await docClient.send(new ScanCommand(scanParams));
    
    if (!result.Items || result.Items.length === 0) {
      const newCustomer = await generateCustomerProfile();
      console.log(newCustomer);
      newCustomer.date = today;
      newCustomer.id = Date.now().toString(); // Add unique id using timestamp
      newCustomer.assets = {headshot : "assets/game/customers/mystery.png"}

      const putParams = {
        TableName: 'Customers',
        Item: newCustomer
      };

      await docClient.send(new PutCommand(putParams));
      return [newCustomer];
    }

    return result.Items;
  } catch (error) {
    console.error('Error fetching/creating customer:', error);
    throw error;
  }
};

export default getCustomerByDate;
