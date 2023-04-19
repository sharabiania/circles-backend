import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";


import { v4 as uuidv4 } from 'uuid';

const mockEvents: any[] = [
  {
    title: "Starlight Soiree",
    description: "Join us for a night of elegance and sophistication at our Starlight Soiree. Dance the night away under the stars while enjoying delicious hors d'oeuvres and refreshing cocktails.",
    location: "555 Ocean Ave, Seaside Heights, CA"
  },
  {
    title: "Enchanted Garden Gala",
    description: "Experience the magic of an Enchanted Garden Gala. Stroll through a lush garden setting, indulge in delectable food and drink, and dance the night away with friends and loved ones.",
    location: "789 Market St, Cityville, NY"
  },
  {
    title: "Midnight Masquerade",
    description: "Unleash your inner mystery and indulge in the allure of a Midnight Masquerade. Savor enticing treats, sip on delicious drinks, and dance the night away in your finest attire.",
    location: "456 Park Rd, Lakeside, FL"
  },
  {
    title: "Crystal Ball Celebration",
    description: "Join us for a night of enchantment and magic at our Crystal Ball Celebration. Dress to impress, sip on champagne, and enjoy the company of good friends as you dance the night away.",
    location: "321 High St, Mountain View, CA"
  },
  {
    title: "Harvest Moon Festival",
    description: "Celebrate the season with our Harvest Moon Festival. Savor delicious fall-inspired food and drink, enjoy live music, and participate in fun activities for the whole family.",
    location: "The Main Stage at the Coachella Music and Arts Festival"
  }
];


for (let x of mockEvents) {
  x.id = uuidv4();
  x.date = (new Date()).toISOString();
}


export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (event) => {
  const claims = event.requestContext.authorizer.jwt.claims;
  console.log('type of claims: ', typeof claims);
  console.log('jwt claims: ', claims);
  
  const username = claims['cognito:username'];
  const userId = claims.sub;
  const email = claims.email;

  return {
    statusCode: 200,
    body: JSON.stringify(mockEvents)
  };
};
