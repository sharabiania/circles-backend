import { LoggerService, DbService } from '../../core/src/services/index.js';
import { EventModel } from '../../core/src/models/event.model.js';
import { v4 as uuidv4 } from 'uuid';

export async function handler(event) {
  const logger = new LoggerService('JoinEventHandler');
  try {
    const { id: eventId } = event.pathParameters;
    const claims = event.requestContext.authorizer.jwt.claims;
    // const username = claims['cognito:username'];
    const userId = claims['sub']
    
    const db = new DbService(process.env.DB_TABLE_NAME, process.env.REGION);
    const eventItems = await db.getItem(db.getEventPK(eventId), db.getEventSK());
    if (eventItems.length === 0) return { statusCode: 404, body: 'Event not found' };
    
    
    const eventItem = eventItems[0];
    if(!eventItem.joinRequests)
      eventItem.joinRequests = [];
    eventItem.joinRequests.push(userId);
    const res = await db.updateItem(db.getEventPK(eventId), db.getEventSK(eventItem.created_by), eventItem);
    
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

