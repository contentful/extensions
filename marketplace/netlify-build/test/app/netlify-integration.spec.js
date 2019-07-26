import * as NetlifyIntegration from '../../src/app/netlify-integration';
import * as NetlifyClient from '../../src/app/netlify-client';
jest.mock('../../src/app/netlify-client');

describe('netlify-integration', () => {
  beforeEach(() => {
    NetlifyClient.createBuildHook.mockImplementation(() => {
      return Promise.resolve({ id: 'build-hook-id-1' });
    });

    [1, 2, 3].forEach(i => {
      NetlifyClient.createNotificationHook.mockImplementationOnce(() => {
        return Promise.resolve({ id: `notification-hook-id-${i}` });
      });
    });
  });

  describe('install', () => {
    it('creates build and notification hooks', async () => {
      const config = await NetlifyIntegration.install({
        config: {
          sites: [
            {
              name: 'Site 1',
              netlifySiteId: 'id1',
              netlifySiteName: 'foo-bar',
              netlifySiteUrl: 'https://foo-bar.netlify.com'
            }
          ]
        },
        accessToken: 'token'
      });

      expect(NetlifyClient.createBuildHook).toHaveBeenCalledTimes(1);
      expect(NetlifyClient.createBuildHook).toHaveBeenCalledWith('id1', 'token');

      expect(NetlifyClient.createNotificationHook).toHaveBeenCalledTimes(3);

      ['deploy_building', 'deploy_created', 'deploy_failed'].forEach(event => {
        expect(NetlifyClient.createNotificationHook).toHaveBeenCalledWith('id1', 'token', {
          event,
          url: expect.stringMatching(/id1build-hook-id-1/) // channel is site ID + build hook ID
        });
      });

      expect(config).toEqual({
        netlifyHookIds: [
          'notification-hook-id-1',
          'notification-hook-id-2',
          'notification-hook-id-3'
        ],
        sites: [
          {
            buildHookId: 'build-hook-id-1',
            name: 'Site 1',
            netlifySiteId: 'id1',
            netlifySiteName: 'foo-bar',
            netlifySiteUrl: 'https://foo-bar.netlify.com'
          }
        ]
      });
    });

    it('validates config', () => {
      const configs = [
        [{ sites: [] }, expect.stringMatching(/at least one/)],
        [{ sites: [{ netlifySiteId: 'x', name: '' }] }, expect.stringMatching(/provide a name/)],
        [
          { sites: [{ netlifySiteId: 'x', name: 'x' }, { netlifySiteId: 'y', name: 'x' }] },
          expect.stringMatching(/must be unique/)
        ]
      ];

      expect.assertions(3);

      configs.forEach(async ([config, expected]) => {
        try {
          await NetlifyIntegration.install({ config });
        } catch (err) {
          expect(err.message).toEqual(expected);
        }
      });
    });
  });

  describe('update', () => {
    it('removes existing hooks and continues as in installation', () => {
      const notificationHooks = [
        'notification-hook-id-1',
        'notification-hook-id-2',
        'notification-hook-id-3'
      ];

      NetlifyIntegration.update({
        config: {
          netlifyHookIds: notificationHooks,
          sites: [
            {
              buildHookId: 'build-hook-id-1',
              name: 'Site 1',
              netlifySiteId: 'id1',
              netlifySiteName: 'foo-bar',
              netlifySiteUrl: 'https://foo-bar.netlify.com'
            }
          ]
        },
        accessToken: 'token'
      });

      expect(NetlifyClient.deleteBuildHook).toHaveBeenCalledTimes(1);
      expect(NetlifyClient.deleteBuildHook).toHaveBeenCalledWith('id1', 'build-hook-id-1', 'token');

      expect(NetlifyClient.deleteNotificationHook).toHaveBeenCalledTimes(3);
      notificationHooks.forEach(id => {
        expect(NetlifyClient.deleteNotificationHook).toHaveBeenCalledWith(id, 'token');
      });

      // do the regular installation...
      expect(NetlifyClient.createBuildHook).toHaveBeenCalledTimes(1);
      expect(NetlifyClient.createNotificationHook).toHaveBeenCalledTimes(3);
    });
  });
});
