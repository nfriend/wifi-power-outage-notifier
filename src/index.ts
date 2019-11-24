import { checkForRecentPings } from './check-for-recent-pings';
import { ping } from './ping';

module.exports.checkForRecentPings = async () => {
  await checkForRecentPings();

  return {
    statusCode: 200,
    body: 'checkForRecentPings executed successfully!',
  };
};

module.exports.ping = async () => {
  await ping();

  return {
    statusCode: 200,
    body: 'ping executed successfully!',
  };
};
