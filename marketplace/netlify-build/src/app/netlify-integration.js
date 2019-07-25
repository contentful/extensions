import uniqBy from 'lodash.uniqby';

import * as NetlifyClient from './netlify-client';

import { PUBNUB_PUBLISH_KEY, PUBNUB_SUBSCRIBE_KEY } from '../constants';

const NETLIFY_HOOK_EVENTS = ['deploy_building', 'deploy_created', 'deploy_failed'];

function getPostPublishUrl(channel) {
  return `https://ps.pndsn.com/publish/${PUBNUB_PUBLISH_KEY}/${PUBNUB_SUBSCRIBE_KEY}/0/${channel}/0?store=1`;
}

export async function install({ config, accessToken }) {
  config = prepareConfig(config);

  // Create build hooks for all sites.
  const buildHookPromises = config.sites.map(siteConfig => {
    return NetlifyClient.createBuildHook(siteConfig.netlifySiteId, accessToken);
  });

  const buildHooks = await Promise.all(buildHookPromises);

  const updatedConfig = {
    sites: config.sites.map((siteConfig, i) => {
      return { ...siteConfig, buildHookId: buildHooks[i].id };
    })
  };

  // Create Netlify notification hooks for all sites.
  const netlifyHookPromises = uniqBy(updatedConfig.sites, s => s.netlifySiteId).reduce(
    (acc, siteConfig) => {
      const siteId = siteConfig.netlifySiteId;
      const url = getPostPublishUrl(siteId + siteConfig.buildHookId);

      const promisesForSite = NETLIFY_HOOK_EVENTS.map(event => {
        const hook = { event, url };
        return NetlifyClient.createNotificationHook(siteId, accessToken, hook);
      });

      return acc.concat([Promise.all(promisesForSite)]);
    },
    []
  );

  const netlifyHooks = await Promise.all(netlifyHookPromises);

  // Merge flattened notification hook IDs to configuration.
  updatedConfig.netlifyHookIds = netlifyHooks.reduce((acc, hooksForSite) => {
    return acc.concat(hooksForSite.map(h => h.id));
  }, []);

  return updatedConfig;
}

export async function update({ config, accessToken }) {
  config = prepareConfig(config);

  // Remove existing hooks.
  await removeExistingHooks({ config, accessToken });

  // Remove references to removed hooks from configuration.
  const updatedConfig = {
    sites: config.sites.map(siteConfig => {
      return { ...siteConfig, buildHookId: undefined };
    })
  };

  // Proceed as in the installation step.
  return install({ config: updatedConfig, accessToken });
}

function prepareConfig(config = {}) {
  const sites = (config.sites || []).map(siteConfig => {
    return { ...siteConfig, name: (siteConfig.name || '').trim() };
  });

  const netlifyHookIds = [...(config.netlifyHookIds || [])];

  validateSiteConfigs(sites);

  return { sites, netlifyHookIds };
}

function validateSiteConfigs(siteConfigs) {
  // At least one site needs to be configured.
  if (siteConfigs.length < 1) {
    throw makeError('Provide at least one site configuration.');
  }

  // Find all site configurations with incomplete information.
  const incomplete = siteConfigs.filter(siteConfig => {
    return !siteConfig.netlifySiteId || siteConfig.name.length < 1;
  });

  if (incomplete.length > 0) {
    throw makeError('Pick a Netlify site and provide a name for all configurations.');
  }

  // Display names must be unique.
  const uniqueNames = uniqBy(siteConfigs, config => config.name);

  if (uniqueNames.length !== siteConfigs.length) {
    throw makeError('Display names must be unique.');
  }
}

function makeError(message) {
  const err = new Error(message);
  err.useMessage = true;
  return err;
}

async function removeExistingHooks({ config, accessToken }) {
  const siteConfigs = config.sites || [];
  const netlifyHookIds = config.netlifyHookIds || [];

  // ...remove build hooks for it and...
  const buildHookRemovalPromises = siteConfigs.map(siteConfig => {
    const { netlifySiteId, buildHookId } = siteConfig;
    if (netlifySiteId && buildHookId) {
      return NetlifyClient.deleteBuildHook(netlifySiteId, buildHookId, accessToken);
    } else {
      return Promise.resolve();
    }
  });

  // ...remove Netlify hooks for it.
  const netlifyHookRemovalPromises = netlifyHookIds
    .filter(id => typeof id === 'string' && id.length > 0)
    .map(id => NetlifyClient.deleteNotificationHook(id, accessToken));

  const removalPromises = buildHookRemovalPromises.concat(netlifyHookRemovalPromises);

  try {
    await Promise.all(removalPromises);
  } catch (err) {
    // Failed removing some hooks. We can live with that.
  }
}
