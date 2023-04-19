import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';

export async function handler(event) {
  try {
    const { username, password } = JSON.parse(event.body);
    console.log('username: ', username);

    const client = new CognitoIdentityProviderClient({ region: process.env.REGION });
    // NOTE: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/classes/admininitiateauthcommand.html
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        // SECRET_HASH: '' // TODO
      }
    };

    const command = new InitiateAuthCommand(params);
    const response = await client.send(command);
    console.log('login response: ', response);
    if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      throw new Error('New password required');
    }

    return response.AuthenticationResult.IdToken;
  }
  catch (err) {
    console.error('error name: ', err.name);
    // NOTE err.name === "NotAuthorizedException"
    let message = "Unauthorized";
    let statusCode = 401;

    if (err.name === 'UserNotConfirmedException') {
      message = "User not confirmed"
    }
    else if (err.name === "InvalidParameterException") {
      message = "Bad Input"
      statusCode = 400;
    }

    return {
      statusCode,
      body: message
    }
  }
}