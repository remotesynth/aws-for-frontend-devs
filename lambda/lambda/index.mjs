export const handler = async (event) => {
  // perform the operation
  // return a response once it is completed
  const response = {
    statusCode: 200,
    body: {
      message: 'You successfully called the Lambda from a function URL!',
    },
  };
  return response;
};
