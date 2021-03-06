import { createIftttEvent } from './create-ifttt-event';
import { getCurrentDate } from './get-current-date';
import { getIftttKeys } from './get-ifttt-keys';
import { info } from './log';
import { getStatus, setStatus } from './persistence';

export const ping = async (): Promise<void> => {
  const status = await getStatus();

  if (status && status.outage) {
    await createIftttEvent('power-on', getIftttKeys());

    info(
      'The WiFi or power has been restored! An IFTTT notification has been triggered.',
    );
  } else {
    info('No existing outage detected.');
  }

  await setStatus({
    lastPing: getCurrentDate(),
    outage: false,
  });

  info('Ping successfully recorded');
};
