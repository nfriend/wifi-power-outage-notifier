import { createIftttEvent } from './create-ifttt-event';
import { getCurrentDate } from './get-current-date';
import { getIftttKeys } from './get-ifttt-keys';
import { getStatus, setStatus } from './persistence';

export const checkForRecentPings = async (): Promise<void> => {
  const status = await getStatus();

  if (status) {
    const fiveMinsAgo = getCurrentDate().subtract(5, 'minutes');
    if (status.lastPing.isBefore(fiveMinsAgo)) {
      if (!status.outage) {
        await createIftttEvent('power-off', getIftttKeys());
        await setStatus({
          ...status,
          outage: true,
        });

        console.info(
          'WiFi or power outage detected! An IFTTT notification has been triggered.',
        );
      } else {
        console.info(
          'WiFi or power outage was detected, but a notification has already been sent for this outage.',
        );
      }
    } else {
      console.info('No WiFi or power outage detected');
    }
  } else {
    console.info(
      'No existing status found in the database. No action had been taken.',
    );
  }
};
