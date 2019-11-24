import { createIftttEvent } from './create-ifttt-event';
import { getCurrentDate } from './get-current-date';
import { getIftttKeys } from './get-ifttt-keys';
import { getStatus, setStatus } from './persistence';

export const ping = async (): Promise<void> => {
  const status = await getStatus();

  if (status && status.outage) {
    await createIftttEvent('power-on', getIftttKeys());
  }

  await setStatus({
    lastPing: getCurrentDate(),
    outage: false,
  });
};
