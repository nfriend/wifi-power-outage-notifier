import { createIftttEvent } from './create-ifttt-event';
import { getCurrentDate } from './get-current-date';
import { getIftttKeys } from './get-ifttt-keys';
import { getStatus, setStatus } from './persistence';

export const checkForRecentPings = async (): Promise<void> => {
  const status = await getStatus();

  if (status) {
    const fiveMinsAgo = getCurrentDate().subtract(5, 'minutes');
    if (status.lastPing.isBefore(fiveMinsAgo) && !status.outage) {
      await createIftttEvent('power-off', getIftttKeys());
      await setStatus({
        ...status,
        outage: true,
      });
    }
  }
};
