import { DynamoDBClient, ScanCommand,   
  PutItemCommand, 
  UpdateItemCommand,
  QueryCommand,
   } from '@aws-sdk/client-dynamodb';
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

  
  async getItem(partitionKey, skBeginsWith) {
    
    try {
     
      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'pk = :partitionKey AND begins_with(sk, :skBeginsWith)',
        ExpressionAttributeValues: {
          ':partitionKey': { S: partitionKey },
          ':skBeginsWith': { S: skBeginsWith }
        }
      });
      
      const data = await this.client.send(command);      
      
      const unmarshalledItems = data.Items.map(item => JSON.parse(unmarshall(item).data));
      return unmarshalledItems;
    }
    catch (ex) {
      console.log(JSON.stringify(ex));
      this.logger.error(ex);
    }
  }

  async updateItem(pk, sk, item) {
   this.logger.debug('pk, sk: ', pk, sk);
    try {
      const command = new UpdateItemCommand({
        TableName: this.tableName,
        Key: {
          pk: { S: pk },
          sk: { S: sk },
        },
        UpdateExpression: 'SET #dataName = :dataValue',
        ExpressionAttributeNames: {
          '#dataName': 'data'
        },
        ExpressionAttributeValues: {
          ':dataValue': { S: JSON.stringify(item) }
        }
      });
      const result = await this.client.send(command);
      this.logger.debug('db result: ', result);
      return result;
    }
    catch(ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  getEventPK = (id = "") => `EVENT#${id}`;
  getEventSK = (datetime = "") => `EVENT#${datetime}`;
  getMasterPK = (id = "") => `MASTER#${id}`;
  getMasterSK = (username = "") => `MASTER#${username}`
}