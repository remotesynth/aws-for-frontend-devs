export const handler = async (event) => {
  // perform the operation
  // return a response once it is completed
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
