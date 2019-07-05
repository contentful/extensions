import { format, distanceInWordsToNow } from 'date-fns';

import {
  EVENT_TRIGGERED,
  EVENT_TRIGGER_FAILED,
  CONTENTFUL_EVENTS,
  EVENT_BUILD_STARTED,
  EVENT_BUILD_READY,
  EVENT_BUILD_FAILED,
  NETLIFY_EVENTS,
  NETLIFY_STATE_TO_EVENT
} from './contstants';

function isValidNetlifyMessage(msg, siteId) {
  return msg.site_id === siteId && NETLIFY_STATE_TO_EVENT[msg.state];
}

function normalizeNetlifyMessage(msg, siteId) {
  const event = NETLIFY_STATE_TO_EVENT[msg.state];

  return {
    event,
    siteId,
    buildId: msg.id,
    error: msg.error_message
  };
}

function isValidContentfulMessage(msg) {
  return msg.contentful && CONTENTFUL_EVENTS.includes(msg.event);
}

function normalizeContentfulMessage(msg, users) {
  const user = (users || []).find(u => u.sys.id === msg.userId);
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : null;

  const normalized = { ...msg, userName };
  delete normalized.contentful;

  return normalized;
}

export function normalizeMessage(netlifySiteId, users, msg) {
  if (isValidNetlifyMessage(msg, netlifySiteId)) {
    return normalizeNetlifyMessage(msg, netlifySiteId);
  }

  if (isValidContentfulMessage(msg)) {
    return normalizeContentfulMessage(msg, users);
  }

  return null;
}

export function isOutOfOrder(msg, previousMessages) {
  if (msg.event !== EVENT_BUILD_STARTED) {
    return false;
  }

  return !!previousMessages.find(({ event, buildId }) => {
    const doneAlready = [EVENT_BUILD_FAILED, EVENT_BUILD_READY].includes(event);
    const sameBuild = buildId === msg.buildId;
    return doneAlready && sameBuild;
  });
}

export function isDuplicate(msg, previousMessages) {
  if (!NETLIFY_EVENTS.includes(msg.event)) {
    return false;
  }

  return !!previousMessages.find(({ event, buildId }) => {
    return event === msg.event && buildId === msg.buildId;
  });
}

function createFormattedTimeString(date) {
  const d = new Date(date);

  return `${distanceInWordsToNow(d)} ago at ${format(d, 'h:mm:ss A')}`;
}

export function messageToState(msg) {
  const formattedTime = createFormattedTimeString(msg.t);

  if (msg.event === EVENT_TRIGGERED) {
    let info = `Triggered ${formattedTime}.`;
    if (msg.userName) {
      info = `Triggered by ${msg.userName} ${formattedTime}.`;
    }

    return {
      status: 'Triggering...',
      busy: true,
      ok: true,
      info
    };
  }

  if (msg.event === EVENT_TRIGGER_FAILED) {
    return {
      busy: false,
      ok: false,
      info: 'Try again! If the problem persists make sure the Netlify site still exists.'
    };
  }

  if (msg.event === EVENT_BUILD_STARTED) {
    return {
      status: 'Building...',
      busy: true,
      ok: true
    };
  }

  if (msg.event === EVENT_BUILD_READY) {
    return {
      busy: false,
      ok: true,
      info: `Last built ${formattedTime}.`
    };
  }

  if (msg.event === EVENT_BUILD_FAILED) {
    return {
      busy: false,
      ok: false,
      info: msg.error || 'Unknown error. Try again!'
    };
  }

  return {};
}
