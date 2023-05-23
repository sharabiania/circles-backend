import { StackContext, Api, Cognito } from "sst/constructs";


export function API({ stack }: StackContext) {

  const getResourceName = (name: string) => `${stack.stage}-${name}`;

  // Create User Pool
  const auth = new Cognito(stack, "auth", {
    login: ["email", "username"],
    cdk: {
      userPoolClient: {
        authFlows: {
          userPassword: true
        }
      }
    }
  });

  // Create API
  const api = new Api(stack, "api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId]
        }
      }
    },
    defaults: {
      authorizer: "jwt"
    },
    routes: {
      "GET /": {
        authorizer: "none",
        function: {
          functionName: getResourceName('getApiStatus'),
          description: 'this is a test lambda function to handle the public api call',
          handler: "packages/functions/src/lambda.handler",
        }
      },
      "POST /api/login": {
        authorizer: "none",
        function: {
          functionName: getResourceName('loginHandler'),
          description: 'handler to login to Cognito and return JWT token',
          handler: "packages/functions/src/login.handler",
          environment: {
            REGION: stack.region,
            COGNITO_CLIENT_ID: auth.userPoolClientId
          }
        }
      },
      "POST /api/signup": {
        authorizer: "none",
        function: {
          functionName: getResourceName('signupHandler'),
          description: 'handler to signup a new user in Cognito',
          handler: "packages/functions/src/signup.handler",
          environment: {
            REGION: stack.region,
            COGNITO_CLIENT_ID: auth.userPoolClientId
          }
        }
      },
      "POST /api/signup/confirm": {
        authorizer: "none",
        function: {
          functionName: getResourceName('confirmSignUpHandler'),
          description: 'handler to confirm user signup',
          handler: "packages/functions/src/signup-confirm.handler",
          environment: {
            REGION: stack.region,
            COGNITO_CLIENT_ID: auth.userPoolClientId
          }
        }
      },
      "GET /api/event": {
        function: {
          functionName: getResourceName('getEventsHandler'),
          description: 'api handler to get all events',
          handler: "packages/functions/src/get-events.handler"
        }
      },   
      "POST /api/event" : {
        function: {
          functionName: getResourceName('createEventHandler'),
          description: 'api handler to create a new event',
          handler: "packages/functions/src/create-event.handler"
        }
      }
    },
  });

  // allowing authenticated users to access API
  auth.attachPermissionsForAuthUsers(stack, [api]);

  // Show the API endpoint and other info in the output

  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    CognitoIdentityProviderId: auth.cognitoIdentityPoolId
  });
}
