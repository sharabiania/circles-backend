import { DynamoDBClient, ScanCommand, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { LoggerService } from './logger.service';

export class DbService {
  constructor(tableName, region) {
    this.client = new DynamoDBClient({ region: region });
    this.tableName = tableName;
    this.logger = new LoggerService('DbService');
  }
  async putItem(pk, sk, payload) {

    try {
      
      const command = new PutItemCommand({
        TableName: this.tableName,
        Item: {
          pk: { S: pk },
          sk: { S: sk },
          data: { S: JSON.stringify(payload) },
        }
      });
      const res = await this.client.send(command);
      return res;
    }
    catch (ex) {
      this.logger.error(ex);
    }
  }

  async scanItems(pkBeginsWith, skBeginsWith) {
    try {

      const command = new ScanCommand({
        TableName: this.tableName,
        // KeyConditionExpression: "",
        FilterExpression: "begins_with(pk, :pk) and begins_with(sk, :sk)",
        ExpressionAttributeValues: {
          ":pk": { S: pkBeginsWith },
          ":sk": { S: skBeginsWith },
        },
      });
      const data = await this.client.send(command);
      const unmarshalledItems = data.Items.map(item => JSON.parse(unmarshall(item).data));
      return unmarshalledItems;
    }
    catch (ex) {
      this.logger.error(ex);
    }
  }

  
  async getItem(partitionKey) {
    console.log(partitionKey);
    try {

      const command = new GetItemCommand({
        TableName: this.tableName,
        Key: {
          pk: { S: partitionKey }
          // sk: { S: } // THIS IS REQUIRED
          // SEE: https://stackoverflow.com/questions/25886403/dynamodb-the-provided-key-element-does-not-match-the-schema
        }
      });
      const data = await this.client.send(command);
      return data;
      const unmarshalledItems = data.Items.map(item => JSON.parse(unmarshall(item).data));
      return unmarshalledItems;
    }
    catch (ex) {
      console.log(JSON.stringify(ex));
      this.logger.error(ex);
    }
  }

  getEventPK = (id = "") => `EVENT#${id}`;
  getEventSK = (datetime = "") => `EVENT#${datetime}`;
  getMasterPK = (id = "") => `MASTER#${id}`;
  getMasterSK = (username = "") => `MASTER#${username}`
}