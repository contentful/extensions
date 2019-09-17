import {
  NETLIFY_CLIENT_ID,
  NETLIFY_API_BASE,
  NETLIFY_AUTHORIZE_ENDPOINT,
  NETLIFY_AUTH_WINDOW_OPTS,
  NETLIFY_AUTH_POLL_INTERVAL
} from '../constants';

async function request(method, url, accessToken, body) {
  const headers = method === 'POST' ? { 'Content-Type': 'application/json' } : {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  body = typeof body === 'object' ? JSON.stringify(body) : '';
  body = method === 'GET' ? undefined : body;

  const res = await fetch(NETLIFY_API_BASE + url, { method, headers, body });

  if (res.ok) {
    return res.status === 204 ? null : res.json();
  } else {
    throw new Error('Non-2xx response.');
  }
}

const post = request.bind(null, 'POST');
const get = request.bind(null, 'GET');

function openAuthorizationWindow(ticketId) {
  const url = `${NETLIFY_AUTHORIZE_ENDPOINT}?response_type=ticket&ticket=${ticketId}`;
  return window.open(url, '', NETLIFY_AUTH_WINDOW_OPTS);
}

function rescheduleTicketAuthorizationCheck(ticketId, deferred) {
  setTimeout(() => {
    checkTicketAuthorization(ticketId, deferred);
  }, NETLIFY_AUTH_POLL_INTERVAL);
}

async function checkTicketAuthorization(ticketId, deferred) {
  try {
    const body = await get(`/oauth/tickets/${ticketId}`);

    if (body.authorized) {
      deferred.cb(null, body.id);
    } else if (!deferred.cancelled) {
      rescheduleTicketAuthorizationCheck(ticketId, deferred);
    }
  } catch (err) {
    deferred.cb(err);
  }
}

function waitForTicketAuthorization(ticketId, cb) {
  const deferred = { cb, cancelled: false };
  checkTicketAuthorization(ticketId, deferred);

  return () => {
    deferred.cancelled = true;
  };
}

async function exchangeTicketForToken(ticketId) {
  const { access_token, email } = await post(`/oauth/tickets/${ticketId}/exchange`);
  return { token: access_token, email };
}

export async function createTicket() {
  const { id } = await post(`/oauth/tickets?client_id=${NETLIFY_CLIENT_ID}`);
  return id;
}

export function getAccessTokenWithTicket(ticketId, cb) {
  const authWindow = openAuthorizationWindow(ticketId);

  const cancel = waitForTicketAuthorization(ticketId, (err, authorizedTicketId) => {
    authWindow.close();

    if (err) {
      cb(err);
    } else if (authorizedTicketId) {
      exchangeTicketForToken(authorizedTicketId).then(token => cb(null, token), err => cb(err));
    }
  });

  return cancel;
}

// Actions requiring a Netlify access token:

export async function listSites(accessToken) {
  // Get all accounts the user has access to.
  const accounts = await get('/accounts', accessToken);

  // Get sites for each account.
  const sitesForAccounts = await Promise.all(
    accounts.map(account => {
      return get(`/${account.slug}/sites?page=1&per_page=100`, accessToken);
    })
  );

  // Flatten sites to a single list (site names are globally unique).
  const sites = sitesForAccounts.reduce((acc, accountSites) => {
    return [...acc, ...accountSites];
  }, []);

  // Filter out sites with no build configuration.
  const buildable = sites.filter(site => {
    const settings = site.build_settings;
    return null !== settings && typeof settings === 'object';
  });

  return {
    sites: buildable,
    counts: {
      buildable: buildable.length,
      unavailable: sites.length - buildable.length
    }
  };
}

export function createBuildHook(siteId, accessToken) {
  return post(`/sites/${siteId}/build_hooks`, accessToken, {
    title: 'Contentful integration'
  });
}

export function deleteBuildHook(siteId, hookId, accessToken) {
  return request('DELETE', `/sites/${siteId}/build_hooks/${hookId}`, accessToken);
}

export function createNotificationHook(siteId, accessToken, { event, url }) {
  return post('/hooks', accessToken, {
    site_id: siteId,
    event,
    data: { url }
  });
}

export function deleteNotificationHook(hookId, accessToken) {
  return request('DELETE', `/hooks/${hookId}`, accessToken);
}
