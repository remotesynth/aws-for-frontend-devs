import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  let message = '';
  // perform the operation
  const command = new GetCommand({
    TableName: process.env.DYNAMO_TABLE_NAME,
    Key: {
      id: 'message1',
    },
  });
  const data = await docClient.send(command);
  message = data.Item.Message;
  // return a response once it is completed
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    body: {
      message: message,
    },
  };
  return response;
};
