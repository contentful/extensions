export const EVENT_TRIGGERED = 'triggered';
export const EVENT_TRIGGER_FAILED = 'trigger-failed';

export const CONTENTFUL_EVENTS = [EVENT_TRIGGERED, EVENT_TRIGGER_FAILED];

const EVENT_BUILD_STARTED = 'build-started';
const EVENT_BUILD_READY = 'build-ready';
const EVENT_BUILD_FAILED = 'build-failed';

export const NETLIFY_EVENTS = [EVENT_BUILD_STARTED, EVENT_BUILD_READY, EVENT_BUILD_FAILED];

export const NETLIFY_STATE_TO_EVENT = {
  uploaded: EVENT_BUILD_STARTED,
  building: EVENT_BUILD_STARTED,
  ready: EVENT_BUILD_READY,
  error: EVENT_BUILD_FAILED
};

export const PUBLISH_KEY = 'pub-c-a99421b9-4f21-467b-ac0c-d0292824e8e1';
export const SUBSCRIBE_KEY = 'sub-c-3992b1ae-f7c9-11e8-adf7-5a5b31762c0f';
