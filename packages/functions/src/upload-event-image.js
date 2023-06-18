const { LoggerService, DbService, BucketService } = require("../../core/src/services");

export async function handler(event) {
  const logger = new LoggerService("UploadEventImageHandler");
  const db = new DbService(process.env.DB_TABLE_NAME, process.env.REGION);
  const bucketService = new BucketService(process.env.BUCKET_NAME);
  const eventId = event.pathParameters.id;
  const dbResult = await db.getItem(db.getEventPK(eventId), db.getEventSK());
  logger.debug('db result: ', dbResult);
  const eventItem = dbResult[0];
  if (!eventItem)
    throw `Event with id ${eventId} not found`;
  try {
    // Get the image data from the request body
    const imageData = event.body;    
    const imageBuffer = Buffer.from(imageData, "base64");    
    const filename = `${eventId}_${Date.now()}.jpg`;
    const uploadedKey = await bucketService.uploadEventImage(filename, imageBuffer);
              

    // TODO: update record in the database.
    if (!eventItem.img_src || !Array.isArray(eventItem.img_src)) {
      eventItem.img_src = [];
    }
    eventItem.img_src.push(uploadedKey);
    logger.debug('updateing this item: ', eventItem);
    const dbUpdateResult = await db.updateItem(
      db.getEventPK(eventItem.id), 
      db.getEventSK(eventItem.datetime), 
      eventItem);
      logger.debug('db update result: ', dbUpdateResult);
    return dbUpdateResult;
    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Image uploaded successfully' })
    };
  } catch (ex) {
    // Return an error response if any error occurs
    logger.error(ex)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error uploading image', error: ex })
    };
  }
};
