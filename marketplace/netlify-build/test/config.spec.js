import { configToParameters, parametersToConfig } from '../src/config';

const config = {
  netlifyHookIds: ['hook1', 'hook2'],
  sites: [
    {
      buildHookId: 'bh1',
      name: 'Site 1',
      netlifySiteId: 'id1',
      netlifySiteName: 'foo-bar',
      netlifySiteUrl: 'https://foo-bar.netlify.com'
    },
    {
      buildHookId: 'bh2',
      name: 'Site 2',
      netlifySiteId: 'id2',
      netlifySiteName: 'bar-baz',
      netlifySiteUrl: 'https://bar-baz.netlify.com'
    }
  ]
};

const parameters = {
  notificationHookIds: 'hook1,hook2',
  buildHookIds: 'bh1,bh2',
  names: 'Site 1,Site 2',
  siteIds: 'id1,id2',
  siteNames: 'foo-bar,bar-baz',
  siteUrls: 'https://foo-bar.netlify.com,https://bar-baz.netlify.com'
};

describe('config', () => {
  describe('configToParameters', () => {
    it('translates internal config format to extension parameters', () => {
      expect(configToParameters(config)).toEqual(parameters);
    });
  });

  describe('paramtersToConfig', () => {
    it('translates extension parameters to internal config format', () => {
      expect(parametersToConfig(parameters)).toEqual(config);
    });

    it('trims whitespace, ignores empty', () => {
      expect(
        parametersToConfig({
          ...parameters,
          names: '    Site 1   ,,   Site 2,,,,'
        })
      ).toEqual(config);
    });
  });
});
