const readCsvParam = csv =>
  (csv || '')
    .split(',')
    .map(val => val.trim())
    .filter(val => val.length > 0);

export function configToParameters(config) {
  const flat = {
    notificationHookIds: config.netlifyHookIds,
    ...config.sites.reduce((acc, site) => {
      return {
        buildHookIds: (acc.buildHookIds || []).concat([site.buildHookId]),
        names: (acc.names || []).concat([site.name]),
        siteIds: (acc.siteIds || []).concat([site.netlifySiteId]),
        siteNames: (acc.siteNames || []).concat([site.netlifySiteName]),
        siteUrls: (acc.siteUrls || []).concat([site.netlifySiteUrl])
      };
    }, {})
  };

  return Object.keys(flat).reduce((acc, key) => {
    return { ...acc, [key]: flat[key].join(',') };
  }, {});
}

export function parametersToConfig(parameters) {
  parameters = parameters || {};
  const buildHookIds = readCsvParam(parameters.buildHookIds);
  const names = readCsvParam(parameters.names);
  const siteIds = readCsvParam(parameters.siteIds);
  const siteNames = readCsvParam(parameters.siteNames);
  const siteUrls = readCsvParam(parameters.siteUrls);

  return {
    netlifyHookIds: readCsvParam(parameters.notificationHookIds),
    sites: buildHookIds.map((buildHookId, i) => {
      return {
        buildHookId,
        name: names[i],
        netlifySiteId: siteIds[i],
        netlifySiteName: siteNames[i],
        netlifySiteUrl: siteUrls[i]
      };
    })
  };
}
