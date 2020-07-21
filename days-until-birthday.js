const aws = require("aws-sdk");

const client = new aws.DynamoDB.DocumentClient();

const tableName = "CakeWalkUsers";

const getUser = async (userId) => {
  try {
    const dbResponse = await client
      .get({
        TableName: tableName,
        Key: {
          userId
        }
      })
      .promise();
    
    const item = dbResponse.Item;

    if (!item || typeof item !== "object") {
      throw new Error("MALFORMED");
    }
    
    return {
      status: "success",
      payload: item
    }
  } catch (err) {
    return {
      status: "error",
      payload: err
    };
  }
};

const daysUntilBirthDay = (birthDate) => {
  const birthDayThisYear = new Date(
    birthDate.split("-").map((chunk, index) => (index === 0 ? "2020" : chunk))
  );
  const diff =
    (birthDayThisYear.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;
  return Math.floor(diff);
};

exports.handler = async (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2));

  const body = JSON.parse(event.body);
  
  const response = {
    resolvedVariables: [],
    unresolvedVariables: [],
    context: event.context || {}
  };

  if (!body.variables) {
    return errorResponse({
      message: 'bad request',
      responseCode: 400,
      callback: callback
    });
  }

  if (!body.state) {
    return errorResponse({
      message: 'bad request',
      responseCode: 400,
      callback: callback
    });
  }

  for (const variable of body.variables) {
    let resolutionResponse = null;

    /**
     * Iterate over the input variables and try to resolve each of them.
     *
     * Note: This is the only other section that you'd need to update.
     */

    switch (variable.variableId) {
      case 'CWBirthdayCountdown':
        resolutionResponse = await getUser(body.context.userId);
        break;
      default:
        break;
    }

    // Variables can have single and multi value responses

    if (resolutionResponse && resolutionResponse.status === "success") {
      // Single value variable response

      response.resolvedVariables.push({
        variableId: variable.variableId,
        value: daysUntilBirthDay(resolutionResponse.payload.birthday)
      });
    } else {
      // If anything goes wrong, append the variableId to the
      // unresolvedVariables array and attach an optional failure reason

      response.unresolvedVariables.push({
        variableId: variable.variableId,
        reason: resolutionResponse ? resolutionResponse.payload : 'unhandled failure'
      });
    }
  }

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
