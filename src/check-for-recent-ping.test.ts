import moment = require('moment');
import { checkForRecentPings } from './check-for-recent-pings';
import { createIftttEvent } from './create-ifttt-event';
import { WiFiPowerStatus } from './persistence';

const mockCurrentDate = {
  year: 2019,
  month: 11,
  day: 24,
  hour: 9,
  minute: 58,
  second: 0,
};

let mockStatus: WiFiPowerStatus = { lastPing: undefined, outage: undefined };
jest.mock('./persistence', () => ({
  getStatus: jest.fn().mockImplementation(() => Promise.resolve(mockStatus)),
  setStatus: jest.fn().mockResolvedValue(() => Promise.resolve()),
}));

jest.mock('./create-ifttt-event', () => ({
  createIftttEvent: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./get-current-date', () => ({
  getCurrentDate: () => moment(mockCurrentDate),
}));

const mockIftttKeys = ['key1', 'key2'];
jest.mock('./get-ifttt-keys', () => ({
  getIftttKeys: () => mockIftttKeys,
}));

describe('checkForRecentPings', () => {
  it('sends an IFTTT notification if the last ping was more than 5 minutes ago', async () => {
    mockStatus = {
      lastPing: moment({
        ...mockCurrentDate,
        minute: 48,
      }),
      outage: false,
    };

    await checkForRecentPings();

    expect(createIftttEvent).toHaveBeenCalledWith('power-off', mockIftttKeys);
  });
});

describe('checkForRecentPings', () => {
  it('does not send an IFTTT notification if the last ping was more than 5 minutes ago but the outage was already known', async () => {
    mockStatus = {
      lastPing: moment({
        ...mockCurrentDate,
        minute: 48,
      }),
      outage: true,
    };

    await checkForRecentPings();

    expect(createIftttEvent).not.toHaveBeenCalled();
  });
});

describe('checkForRecentPings', () => {
  it('does not send an IFTTT notification if the last ping was less than 5 minutes ago', async () => {
    mockStatus = {
      lastPing: moment({
        ...mockCurrentDate,
        minute: 55,
      }),
      outage: false,
    };

    await checkForRecentPings();

    expect(createIftttEvent).not.toHaveBeenCalled();
  });
});
