import PubNub from 'pubnub';

function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

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

export function createPubSub(channel, normalizeFn, publishKey, subscribeKey) {
  const channels = [channel];
  const state = { listeners: [] };

  return {
    start,
    addListener: fn => state.listeners.push(fn),
    publish,
    getHistory,
    stop
  };

  async function start() {
    state.instance = new PubNub({
      publishKey: publishKey,
      subscribeKey: subscribeKey
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
    return new Promise((resolve, reject) => {
      state.instance.publish(
        {
          message,
          channel,
          storeInHistory: true
        },
        (status, res) => {
          if (status.error) {
            reject(status);
          } else {
            resolve(res);
          }
        }
      );
    });
  }

  function getHistory(count = 25) {
    return new Promise((resolve, reject) => {
      state.instance.history(
        {
          channel,
          count,
          stringifiedTimeToken: true
        },
        (status, res) => {
          if (status.error) {
            reject(status);
          } else {
            const history = (res.messages || [])
              .map(({ timetoken, entry }) => normalize(entry, timetoken, normalizeFn))
              .filter(isObject)
              .reverse();

            resolve(history);
          }
        }
      );
    });
  }

  function stop() {
    if (state.instance) {
      state.instance.removeListener(state.mainListener);
      state.listeners = [];
      state.instance.unsubscribe({ channels });
    }
  }
}
