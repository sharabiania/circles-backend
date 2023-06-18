import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { LoggerService } from "./logger.service";

export class BucketService {
  constructor(bucketName) {
    this.bucketName = bucketName;
    this.client = new S3Client();
    this.logger = new LoggerService('BucketService');
  }

  async uploadEventImage(filename, imageBuffer) {
    const key = `event-images/${filename}`;
  
    // Create the PutObject command
    const putObjectCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: imageBuffer
    });

    // Upload the image to S3
    const s3result = await this.client.send(putObjectCommand);
    this.logger.debug('s3 result: ', s3result);
    return key;
  }

  async getEventImage(filename) {
    const key = `event-images/${filename}`;
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });

    const data = await this.client.send(command);
    this.logger.debug('======= getItem data ======== ');
    const base64Image = data.Body.transformToString();
    // Buffer.from(data.Body.transformToByteArray()).toString('base64');

    // return base64Image;
    return base64Image;
  }


}