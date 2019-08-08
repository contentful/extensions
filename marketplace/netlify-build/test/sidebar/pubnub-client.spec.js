import PubNub from 'pubnub';
jest.mock('pubnub');

import { createPubSub } from '../../src/sidebar/pubnub-client';

const timetoken = '15641267505310000000';
const timetoken2 = '15641267509990000000';

const entries = [
  { timetoken, entry: { test: true } },
  { timetoken: timetoken2, entry: { hello: 'world' } }
];

const normalizeFn = obj => {
  return Object.keys(obj).reduce((acc, key) => {
    return { ...acc, [key.toUpperCase()]: obj[key] };
  }, {});
};

describe('pubnub-client', () => {
  let pubNubMock;

  beforeEach(() => {
    pubNubMock = {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      publish: jest.fn(() => Promise.resolve('PUBNUB PUBLISH RESULT')),
      history: jest.fn(() => Promise.resolve('PUBNUB HISTORY RESULT'))
    };

    PubNub.mockImplementation(() => pubNubMock);
  });

  describe('start', () => {
    it('creates a PubNub instance, registers a listener and subscribes to a channel', () => {
      const pubsub = createPubSub('channel', x => x);

      pubsub.start();

      expect(PubNub).toHaveBeenCalledTimes(1);
      expect(PubNub).toHaveBeenCalledWith({
        publishKey: expect.any(String),
        subscribeKey: expect.any(String)
      });

      expect(pubNubMock.addListener).toHaveBeenCalledTimes(1);
      expect(pubNubMock.addListener).toHaveBeenCalledWith({
        message: expect.any(Function)
      });

      expect(pubNubMock.subscribe).toHaveBeenCalledTimes(1);
      expect(pubNubMock.subscribe).toHaveBeenCalledWith({
        channels: ['channel']
      });
    });
  });

  describe('publish', () => {
    it('publishes a message', async () => {
      const pubsub = createPubSub('channel', x => x);

      pubsub.start();

      const result = await pubsub.publish({ test: true });

      expect(pubNubMock.publish).toHaveBeenCalledTimes(1);
      expect(pubNubMock.publish).toHaveBeenCalledWith({
        message: { test: true },
        channel: 'channel',
        storeInHistory: true
      });

      expect(result).toBe('PUBNUB PUBLISH RESULT');
    });
  });

  describe('stop', () => {
    it('removes listeners and unsubscribes from a channel', () => {
      const pubsub = createPubSub('channel', x => x);

      pubsub.start();
      pubsub.stop();

      expect(pubNubMock.removeListener).toHaveBeenCalledTimes(1);
      expect(pubNubMock.removeListener).toHaveBeenCalledWith({
        message: expect.any(Function)
      });

      expect(pubNubMock.unsubscribe).toHaveBeenCalledTimes(1);
      expect(pubNubMock.unsubscribe).toHaveBeenCalledWith({
        channels: ['channel']
      });
    });

    it('does nothing if was not started yet', () => {
      const pubsub = createPubSub('channel', x => x);

      pubsub.stop();

      expect(pubNubMock.removeListener).not.toHaveBeenCalled();
      expect(pubNubMock.unsubscribe).not.toHaveBeenCalled();
    });
  });

  describe('addListener', () => {
    it('registers a function to be called on message', () => {
      const pubsub = createPubSub('channel', x => x);
      const listener = jest.fn();
      pubsub.addListener(listener);
      pubsub.start();
      const onMessage = pubNubMock.addListener.mock.calls[0][0].message;

      onMessage({ message: { test: true }, timetoken: '15641267505310000000' });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        test: true,
        t: expect.any(Date)
      });
    });

    it('calls registered listener with a normalized message', () => {
      const pubsub = createPubSub('channel', normalizeFn);
      const listener = jest.fn();
      pubsub.addListener(listener);
      pubsub.start();
      const onMessage = pubNubMock.addListener.mock.calls[0][0].message;

      onMessage({ message: { test: true, hello: 'world' }, timetoken: '15641267505310000000' });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        TEST: true,
        HELLO: 'world',
        t: expect.any(Date)
      });
    });

    it('does not call registered listener for an invalid message', () => {
      const pubsub = createPubSub('channel', x => x);
      const listener = jest.fn();
      pubsub.addListener(listener);
      pubsub.start();
      const onMessage = pubNubMock.addListener.mock.calls[0][0].message;

      onMessage({ message: 'MESSAGE IS WRONG', timetoken });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('getHistory', () => {
    it('gets PubNub history for a channel', () => {
      const pubsub = createPubSub('channel', x => x);
      pubsub.start();
      pubsub.getHistory();

      expect(pubNubMock.history).toHaveBeenCalledTimes(1);
      expect(pubNubMock.history).toHaveBeenCalledWith({
        channel: 'channel',
        count: 25,
        stringifiedTimeToken: true
      });
    });

    it('returns history in reverse order', async () => {
      pubNubMock.history.mockImplementation(() => Promise.resolve({ messages: entries }));

      const pubsub = createPubSub('channel', x => x);
      pubsub.start();

      const history = await pubsub.getHistory();

      expect(history).toEqual([
        { t: expect.any(Date), hello: 'world' },
        { t: expect.any(Date), test: true }
      ]);
    });

    it('returns history with normalization', async () => {
      pubNubMock.history.mockImplementation(() => Promise.resolve({ messages: entries }));

      const pubsub = createPubSub('channel', normalizeFn);
      pubsub.start();

      const history = await pubsub.getHistory();

      expect(history).toEqual([
        { t: expect.any(Date), HELLO: 'world' },
        { t: expect.any(Date), TEST: true }
      ]);
    });
  });
});
