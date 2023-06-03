import { LoggerService, DbService } from '../../core/src/services/index.js';
import { MasterModel } from '../../core/src/models/index.js';
import { v4 as uuidv4 } from 'uuid';

export async function handler(event) {
  const logger = new LoggerService('CreateMasterHandler');

  try {
    const claims = event.requestContext.authorizer.jwt.claims;
    const username = claims['cognito:username'];
    const { fullname, location } = JSON.parse(event.body);
    const masterModel = new MasterModel(
      uuidv4(),
      fullname, location, "",
      new Date().toISOString(),
      username
    );
    const db = new DbService(process.env.DB_TABLE_NAME, process.env.REGION);
    const res = await db.putItem(
      db.getMasterPK(masterModel.id),
      db.getMasterSK(username),
      masterModel
    );
    return res;
  }
  catch (ex) {
    logger.error(ex);
    return {
      statusCode: 500,
      body: ex //JSON.stringify(ex)
    }
  }
}

