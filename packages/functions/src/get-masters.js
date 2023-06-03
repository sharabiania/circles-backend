import { v4 as uuidv4 } from 'uuid';

const mockMasters = [
    {
      title: 'Master 1',
      location: 'Toronto',
    },
    {
      title: 'Master 2',
      location: 'Montreal',
    },
    {
      title: 'Master 3',
      location: 'Ottawa',
    },
    {
      title: 'Master 4',
      location: 'Vancouver',
    },
  ];

for (let x of mockMasters) {
  x.id = uuidv4();
}

const handler = async (event) => {
  const claims = event.requestContext.authorizer.jwt.claims;
  console.log('type of claims: ', typeof claims);
  console.log('jwt claims: ', claims);
  
  const username = claims['cognito:username'];
  const userId = claims.sub;
  const email = claims.email;

  return {
    statusCode: 200,
    body: JSON.stringify(mockMasters)
  };
};

export { handler };
