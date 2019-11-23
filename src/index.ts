import { checkForRecentPings } from './check-for-recent-pings';

module.exports.checkForRecentPings = async () => {
  await checkForRecentPings();

  return {
    statusCode: 200,
    body: 'checkForRecentPings executed successfully!',
  };
};

module.exports.ping = async () => {
  console.log('ping is executing');

  const iftttKeys = JSON.parse(process.env.IFTTT_KEYS);
  const awsDynamoRegion = process.env.AWS_DYNAMO_REGION;

  console.log('iftttKeys:', iftttKeys);
  console.log('awsDynamoRegion:', awsDynamoRegion);

  return {
    statusCode: 200,
    body: 'ping executed successfully!',
  };
};
