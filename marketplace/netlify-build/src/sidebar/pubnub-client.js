import PubNub from 'pubnub';

import { PUBNUB_PUBLISH_KEY, PUBNUB_SUBSCRIBE_KEY } from '../constants';

const isObject = val => typeof val === 'object' && val !== null && !Array.isArray(val);

function timetokenToDate(timetoken) {
  // timetokens arrive as strings
  timetoken = parseInt(timetoken, 10);
  // timetoken is 17-digit precision unix time,
  // hence 10e6 division for regular unix time
  const unix = Math.round(timetoken / 10e6);
  // JavaScript uses milliseconds, hence *1000
  return new Date(unix * 1000);
}

function normalize(message, timetoken, normalizeFn) {
  if (!isObject(message) || typeof timetoken !== 'string') {
    return null;
  }

  const normalized = normalizeFn(message);
  if (isObject(normalized)) {
    return { ...normalized, t: timetokenToDate(timetoken) };
  } else {
    return null;
  }
}

export function createPubSub(channel, normalizeFn) {
  const channels = [channel];
  const state = { listeners: [] };

  return {
    start,
    addListener: fn => state.listeners.push(fn),
    publish,
    getHistory,
    stop
  };

  function start() {
    state.instance = new PubNub({
      publishKey: PUBNUB_PUBLISH_KEY,
      subscribeKey: PUBNUB_SUBSCRIBE_KEY
    });

    state.mainListener = {
      message: ({ message, timetoken }) => {
        const normalized = normalize(message, timetoken, normalizeFn);
        if (isObject(normalized)) {
          state.listeners.forEach(fn => fn(normalized));
        }
      }
    };

    state.instance.addListener(state.mainListener);
    state.instance.subscribe({ channels });
  }

  function publish(message) {
    return state.instance.publish({
      message,
      channel,
      storeInHistory: true
    });
  }

  async function getHistory(count = 25) {
    const res = await state.instance.history({ channel, count, stringifiedTimeToken: true });

    return (res.messages || [])
      .map(({ timetoken, entry }) => normalize(entry, timetoken, normalizeFn))
      .filter(isObject)
      .reverse();
  }

  function stop() {
    if (state.instance) {
      state.instance.removeListener(state.mainListener);
      state.listeners = [];
      state.instance.unsubscribe({ channels });
    }
  }
}
