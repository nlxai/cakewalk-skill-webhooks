const aws = require("aws-sdk");

const client = new aws.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2));
  
  let body = JSON.parse(event.body);
  
  let response = {
    context: event.context || {}
  };

  if (!body.state || !body.context) {
    return errorResponse({
      message: 'bad request',
      responseCode: 400,
      callback: callback
    });
  }
  
  await client
      .put({
        TableName: "CakeWalkUsers",
        Item: {
          userId: body.context.userId,
          birthday: body.state.BirthDate.value
        }
      })
      .promise();

  return successResponse({
    body: response,
    callback: callback
  });
};
/**
 * NO NEED TO TOUCH ANYTHING BELOW
 */

const successResponse = ({
  body,
  callback
}) => {
  callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
};
const errorResponse = ({
  message,
  responseCode,
  callback
}) => {
  callback(null, {
    statusCode: responseCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      errorMessage: message,
      responseCode: responseCode
    })
  });
};
