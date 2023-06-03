import { DbService, LoggerService } from '../../core/src/services/index.js';

const handler = async (event) => {

  const logger = new LoggerService('GetMastersHandler');

  try {
    const db = new DbService(process.env.DB_TABLE_NAME, process.env.REGION);
    const res = await db.scanItems(db.getMasterPK(), db.getMasterSK());
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

export { handler };
