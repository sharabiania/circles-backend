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

    const eventModel = new EventModel(
      title, description, location, datetime, "",
      new Date().toISOString(),
      username, 
    );

    const res = await db.putItem(db.getEventPK(uuidv4()), db.getEventSK(datetime), eventModel);  
    return res;
  }
  catch (ex) {
    logger.error(ex);
    return {
      statusCode: 500,
      body: ex
    }
  }
}

