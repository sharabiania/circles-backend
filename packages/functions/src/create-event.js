import { LoggerService, DbService } from '../../core/src/services/index.js';
import { EventModel } from '../../core/src/models/event.model.js';
import { v4 as uuidv4 } from 'uuid';

export async function handler(event) {
  const logger = new LoggerService('CreateEventHandler');

  try {
    const claims = event.requestContext.authorizer.jwt.claims;
    const username = claims['cognito:username'];
    const userId = claims['sub'];
    const { title, description, location, datetime } = JSON.parse(event.body);

    const db = new DbService(process.env.DB_TABLE_NAME, process.env.REGION);
    
    const masterResult = await db.getItem(db.getMasterPK(userId), db.getMasterSK());
    if (masterResult.length === 0)
      return { statusCode: 404, body: 'master not found'}

    const masterItem = masterResult[0];

    const eventModel = new EventModel(
      uuidv4(),
      title, description, location, datetime, "",
      new Date().toISOString(),
      userId,
    );

    

    const res = await db.putItem(
      db.getEventPK(eventModel.id),
      db.getEventSK(masterItem.id),
      eventModel);
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

