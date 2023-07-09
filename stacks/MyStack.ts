import { StackContext, Api, Bucket, Cognito, Table } from "sst/constructs";


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

  // Create S3 Bucket
  const bucket = new Bucket(stack, 'circles-bucket')

  // Create DynamoDB Table
  const table = new Table(stack, 'circles', {
    fields: {
      pk: "string",
      sk: "string",
      data: "string" // TODO: can we make this a Map ?
    },
    primaryIndex: { partitionKey: "pk", sortKey: 'sk' }
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
          handler: "packages/functions/src/get-events.handler",
          environment: {
            DB_TABLE_NAME: table.tableName,
            REGION: stack.region
          },
          permissions: [table] // TODO: limit the permission to dynamodb:Query
        }
      },
      "GET /api/event/{id}": {
        function: {
          functionName: getResourceName('getOneEventHandler'),
          description: 'api handler to one event by id',
          handler: "packages/functions/src/get-one-event.handler",
          environment: {
            DB_TABLE_NAME: table.tableName,
            REGION: stack.region
          },
          permissions: [table] // TODO: limit the permission to dynamodb:Query
        }
      },
      "POST /api/event/{id}/join": {
        function: {
          functionName: getResourceName('joinEventHandler'),
          description: 'api handler send a request to join an event.',
          handler: "packages/functions/src/join-event.handler",
          environment: {
            DB_TABLE_NAME: table.tableName,
            REGION: stack.region
          },
          permissions: [table] // TODO: limit the permission
        }
      },
      "POST /api/event/{id}/cancel": {
        function: {
          functionName: getResourceName('cancelJoinRequestHandler'),
          description: 'api handler cancel a join request to an event.',
          handler: "packages/functions/src/cancel-join-event.handler",
          environment: {
            DB_TABLE_NAME: table.tableName,
            REGION: stack.region
          },
          permissions: [table] // TODO: limit the permission
        }
      },            
      "POST /api/event" : {
        function: {
          functionName: getResourceName('createEventHandler'),
          description: 'api handler to create a new event',
          handler: "packages/functions/src/create-event.handler",
          environment: {
            DB_TABLE_NAME: table.tableName,
            REGION: stack.region
          },
          permissions: [table] // TODO: limit the permission to dynamodb:PutItem
        }
      },
      "POST /api/event/{id}/image" : {
        function: {
          functionName: getResourceName('uploadEventImage'),
          description: 'api handler upload event image.',
          handler: "packages/functions/src/upload-event-image.handler",
          environment: {
            DB_TABLE_NAME: table.tableName,
            REGION: stack.region,
            BUCKET_NAME: bucket.bucketName,
          },
          permissions: [table, bucket] // TODO: limit the permission to dynamodb:PutItem
        }
      },
      "GET /api/images/{key}" : {
        function: {
          functionName: getResourceName('getImage'),
          description: 'api handler get an image from S3 based on key',
          handler: "packages/functions/src/get-image.handler",
          environment: {
            DB_TABLE_NAME: table.tableName,
            REGION: stack.region,
            BUCKET_NAME: bucket.bucketName,
          },
          permissions: [table, bucket] // TODO: limit the permission to dynamodb:PutItem
        }
      },
      "GET /api/master": {
        function: {
          functionName: getResourceName('getMastersHandler'),
          description: 'api handler to get all masters',
          handler: "packages/functions/src/get-masters.handler",
          environment: {
            DB_TABLE_NAME: table.tableName,
            REGION: stack.region
          },
          permissions: [table] // TODO: limit the permission to dynamodb:Scan
        },
      },
      "POST /api/master": {
        function: {
          functionName: getResourceName('createMasterHandler'),
          description: 'api handler to create a new master',
          handler: "packages/functions/src/create-master.handler",
          environment: {
            DB_TABLE_NAME: table.tableName,
            REGION: stack.region
          },
          permissions: [table] // TODO: limit the permission to dynamodb:PutItem
        }
      },
      
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
