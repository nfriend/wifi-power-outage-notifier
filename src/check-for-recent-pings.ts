import { getStatus, setStatus } from './persistence';

export const checkForRecentPings = async () => {
  const iftttKeys = JSON.parse(process.env.IFTTT_KEYS);
  const awsDynamoRegion = process.env.AWS_DYNAMO_REGION;

  console.log('iftttKeys:', iftttKeys);
  console.log('awsDynamoRegion:', awsDynamoRegion);

  const status = await getStatus();

  if (status) {
    await setStatus({
      lastPing: Date.now(),
      outage: !status.outage,
    });
  } else {
    await setStatus({
      lastPing: Date.now(),
      outage: true,
    });
  }
};
