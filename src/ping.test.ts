import moment = require('moment');
import { createIftttEvent } from './create-ifttt-event';
import { setStatus, WiFiPowerStatus } from './persistence';
import { ping } from './ping';

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

describe('ping', () => {
  it('sends an IFTTT notification if there was previously an existing outage', async () => {
    mockStatus = {
      lastPing: moment(mockCurrentDate),
      outage: true,
    };

    await ping();

    expect(createIftttEvent).toHaveBeenCalledWith('power-on', mockIftttKeys);
  });

  it('does not send an IFTTT notification if there was not an existing outage', async () => {
    mockStatus = {
      lastPing: moment(mockCurrentDate),
      outage: false,
    };

    await ping();

    expect(createIftttEvent).not.toHaveBeenCalled();
  });

  it('saves the current status to the database', async () => {
    const expectedStatus = {
      lastPing: moment(mockCurrentDate),
      outage: false,
    };

    await ping();

    expect(setStatus).toHaveBeenCalledWith(expectedStatus);
  });
});
