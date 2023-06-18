import { BucketService, LoggerService } from "../../core/src/services";

export async function handler(event) {
  const logger = new LoggerService('GetImageHandler');
  logger.debug('ali is testing...');
  try {
    const bucketService = new BucketService(process.env.BUCKET_NAME);
    const key = event.pathParameters.key;
    const data = await bucketService.getEventImage(key);
    logger.debug('hello key is: ', key);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/jpeg'
      },
      body: data,
      isBase64Encoded: true
    };
  }
  catch (ex) {
    logger.error(ex);
    return ex;
  }
}