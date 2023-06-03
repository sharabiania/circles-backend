import { LoggerService, DbService } from '../../core/src/services/index.js';
import { EventModel } from '../../core/src/models/event.model.js';
import { v4 as uuidv4 } from 'uuid';

export async function handler(event) {
  const logger = new LoggerService('CreateEventHandler');

  try {
    const claims = event.requestContext.authorizer.jwt.claims;  
    const username = claims['cognito:username'];  
    const { title, description, location, datetime } = JSON.parse(event.body);

    const db = new DbService(process.env.DB_TABLE_NAME, process.env.REGION);

    const pk = `EVENT#${uuidv4()}`;
    const sk = `EVENT#${datetime}`;
    const eventModel = new EventModel(
      title, description, location, datetime, 
      username, 
      new Date().toISOString()
    );

    const res = await db.putItem(pk, sk, eventModel);  
    return res;
  }
  catch (ex) {
    logger.error(ex);
  }
}

