const channelName = (prefix, entrySys) => [
  prefix,
  entrySys.space.sys.id,
  entrySys.environment.sys.id,
  entrySys.id,
].join('!');

export default async function createPubNubClient({
  PubNub,
  publishKey,
  subscribeKey,
  channelPrefix,
  entrySys,
  onChange,
}) {
  const pubnub = new PubNub({ publishKey, subscribeKey, ssl: true });
  const channel = channelName(channelPrefix, entrySys);
  const state = { log: [] };

  function addToLog({ entry, timetoken }) {
    const validEntry = entry && typeof entry.id === 'string';
    const validTimetoken = typeof timetoken === 'string';
    const newEntry = !state.log.find(cur => cur.id === entry.id);


    if (validEntry && validTimetoken && newEntry) {
      // Timetoken is a 17-digit precision unix time (UTC)
      const t = parseInt(timetoken.slice(0, timetoken.length - 4), 10);
      const item = { ...entry, t };
      state.log = state.log.concat([item]);
      state.log.sort((a, b) => b.t - a.t);
      return true;
    }
    return false;
  }

  // Prepopulate the log with history.
  const { messages } = await pubnub.history({
    channel,
    count: 25,
    stringifiedTimeToken: true,
  });

  messages.forEach(addToLog);

  // Add more messages as they come.
  pubnub.addListener({
    message: ({ message, timetoken }) => {
      const wasAdded = addToLog({ entry: message, timetoken });
      if (wasAdded) {
        onChange(state.log);
      }
    },
  });
  pubnub.subscribe({ channels: [channel] });

  return {
    log: state.log,
    publish: message => pubnub.publish({ channel, message }),
    disconnect: () => pubnub.unsubscribe({ channels: [channel] }),
  };
}
