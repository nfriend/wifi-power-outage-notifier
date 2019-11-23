import * as rp from 'request-promise';

/**
 * Generates an IFTTT event
 * @param event The event to trigger ("power-on" or "power-off")
 * @param iftttKeys The IFTTT keys to notify
 */
export const createIftttEvent = async (
  event: 'power-on' | 'power-off',
  iftttKeys: string[],
) => {
  for (const key of iftttKeys) {
    const iftttUrl = `https://maker.ifttt.com/trigger/${event}/with/key/${key}`;
    console.info(`Sending POST request to IFTTT for event "${event}:"`);
    const iftttResult1 = await rp.post(iftttUrl);
    console.info('Response from IFTTT:', iftttResult1);
  }
};
