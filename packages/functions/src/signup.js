// NOTE: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/classes/signupcommand.html
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import


// TODO: create a pre-signup lambda to check if the email already
// exists.
export async function handler(event) {
  try {
    const client = new CognitoIdentityProviderClient({ region: process.env.REGION });
    const { username, email, password } = JSON.parse(event.body);
    const input = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      // SecretHash: '' // TODO
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email }
      ]
    };

    const command = new SignUpCommand(input);
    const response = await client.send(command);
    console.info('SignUp Response: ', response);
    return {
      statusCode: 201,
      body: 'user is created'
    };
  }
  catch (err) {  
    console.error('error name: ', err.name);
    console.error('Sign Up Error: ', err.message);
    let body = "Internal server error";
    let statusCode = 500;

    if (err.name === "UsernameExistsException") {
      body = "user already exists";
    }
    else if (
      err.name === "InvalidParameterException" ||
      err.name === "InvalidPasswordException"
    ) {
      body = err.message;
    }

    return {
      statusCode,
      body
    }
  }
}