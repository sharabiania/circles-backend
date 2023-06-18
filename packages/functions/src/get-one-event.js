import { DbService, LoggerService } from '../../core/src/services/index.js';

export async function handler(event) {

  const logger = new LoggerService('GetEventsHandler');  
  const { id } = event.pathParameters;
  try {
    if (!id) throw 'id is requred in the path parameter';
    const db = new DbService(process.env.DB_TABLE_NAME, process.env.REGION);
    const res = await db.getItem(db.getEventPK(id), db.getEventSK());
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
