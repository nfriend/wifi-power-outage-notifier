import { Marshaller } from '@aws/dynamodb-auto-marshaller';
import * as AWS from 'aws-sdk';
import moment from 'moment';

AWS.config.update({ region: process.env.AWS_DYNAMO_REGION });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const TABLE_NAME = 'wifiPowerOutageNotifierTable';
const KEY_NAME = 'wifiPowerStatus';

const marshaller = new Marshaller();

export interface WiFiPowerStatus {
  lastPing: moment.Moment;
  outage: boolean;
}

interface RawWiFiPowerStatus {
  lastPing: number;
  outage: boolean;
}

export const getStatus = () => {
  return new Promise<WiFiPowerStatus>((resolve, reject) => {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        CONFIG_KEY: { S: KEY_NAME },
      },
      ProjectionExpression: 'CONFIG_VALUE',
    };

    ddb.getItem(params, (err, data) => {
      if (err) {
        console.error(
          'An error occurred while getting the current WiFi/power status from the database:',
          err,
        );

        reject(err);
      } else {
        const rawStatus = (marshaller.unmarshallItem(data.Item)
          .CONFIG_VALUE as unknown) as RawWiFiPowerStatus;

        const status: WiFiPowerStatus = {
          ...rawStatus,
          lastPing: moment(rawStatus.lastPing),
        };

        console.info(
          'Successfully fetched the current WiFi/power status from the database:',
          status,
        );

        resolve(status);
      }
    });
  });
};

export const setStatus = (status: WiFiPowerStatus) => {
  return new Promise<void>((resolve, reject) => {
    const rawStatus: RawWiFiPowerStatus = {
      ...status,
      lastPing: status.lastPing.valueOf(),
    };

    const params = {
      TableName: TABLE_NAME,
      Item: marshaller.marshallItem({
        CONFIG_KEY: KEY_NAME,
        CONFIG_VALUE: rawStatus,
      }),
    };

    ddb.putItem(params, err => {
      if (err) {
        console.error(
          'An error occurred while updating the current WiFi/power status in the database:',
          err,
        );
        reject(err);
      } else {
        console.info(
          'Successfully updated the WiFi/power status in the database:',
          status,
        );
        resolve();
      }
    });
  });
};
