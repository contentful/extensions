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
