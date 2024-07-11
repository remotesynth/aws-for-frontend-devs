export const handler = async (event) => {
  // perform the operation
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
      message: 'You successfully called the Lambda from a function URL!',
    },
  };
  return response;
};
