import { StackContext, Api } from "sst/constructs";

export function API({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /api/event": "packages/functions/src/get-events.handler"
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
