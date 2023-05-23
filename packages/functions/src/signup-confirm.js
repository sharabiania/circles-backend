// NOTE: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/classes/signupcommand.html
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import

export async function handler(event) {
  try {
    const client = new CognitoIdentityProviderClient({ region: process.env.REGION });
    const { username, confirmationCode } = JSON.parse(event.body);
    const input = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      // SecretHash: '' // TODO
      Username: username,
      ConfirmationCode: confirmationCode,
    };

    const command = new ConfirmSignUpCommand(input);
    const response = await client.send(command);
    console.info('Confirm Response: ', response);
    return {
      statusCode: 200,
      body: 'user is confirmed'
    };
  }
  catch (err) {
    console.error('error name: ', err.name);
    console.error('Sign Up Error: ', err.message);
    let body = "Internal server error";
    let statusCode = 500;

    if (err.name === "SerializationException") {
      body = err.message;
      statusCode = 400;
    }
    else if (err.name === "NotAuthorizedException") {
      statusCode = 500;
    }
    else if (err.name === "CodeMismatchException") {
      body = err.message;
      statusCode = 401;
    }
    else if (err.name === "AliasExistsException") {
      body = err.message;
    }

    return {
      statusCode,
      body
    }
  }
}