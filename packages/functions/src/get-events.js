import { DbService, LoggerService } from '../../core/src/services/index.js';

export const handler = async (event) => {
  // const claims = event.requestContext.authorizer.jwt.claims;
  // console.log('type of claims: ', typeof claims);
  // console.log('jwt claims: ', claims);

  // const username = claims['cognito:username'];
  // const userId = claims.sub;
  // const email = claims.email;
  const logger = new LoggerService('GetEventsHandler');
  
  try {
    const db = new DbService(process.env.DB_TABLE_NAME, process.env.REGION);
    const res = await db.scanItems(db.getEventPK(), db.getEventSK());
    return {
      statusCode: 200,
      body: JSON.stringify(res)
    };
  }
  catch (ex) {
    logger.error(ex);
    return {
      statusCode: 500,
      body: JSON.stringify(ex)
    };
  }
  
};
