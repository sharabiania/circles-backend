export async function handler(event) {
  
  const claims = event.requestContext.authorizer.jwt.claims;
  console.log('type of claims: ', typeof claims);
  console.log('jwt claims: ', claims);
  
  const username = claims['cognito:username'];
  return {
    statusCode: 501,
    body: "this method is not implemented"
  }
}