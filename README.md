# Cake Walk Skill Webhooks

AWS Lambda webhooks for the Cake Walk Alexa skill implemented in NLX Studio.

## Webhooks

### Store Birthday

The [store-birthday.js](store-birthday.js) webhook stores a user's date of birth, along with their Alexa user ID.

#### Deployment

In NLX Studio, create a new *action* called `CWStoreBirthday`. Once your action is ready, click on the CloudFormation deploy link and replace the code in the generated Lambda function to the code in this repository.

When the CloudFormation template is deployed, you can retrieve the webhook invocation URL from the template outputs and set it on the webhook inside NLX Studio.

### Days Until Birthday

The [days-until-birthday.js](days-until-birthday.js) webhook retrieves the number of days left until the user's birthday from the DynamoDB table. Users are identified by their Alexa user ID.

#### Deployment

In NLX Studio, create a new *variable* called `CWDaysUntilBirthday`. Once your action is ready, click on the CloudFormation deploy link and replace the code in the generated Lambda function to the code in this repository.

When the CloudFormation template is deployed, you can retrieve the webhook invocation URL from the template outputs and set it on the webhook inside NLX Studio.

## License

MIT.
