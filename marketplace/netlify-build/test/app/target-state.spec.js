import {
  editorInterfacesToEnabledContentTypes,
  enabledContentTypesToTargetState
} from '../../src/app/target-state';

describe('target-state', () => {
  describe('editorInterfacesToEnabledContentTypes', () => {
    it('returns an empty array if there are no editor interfaces in a space', () => {
      const enabledContentTypes = editorInterfacesToEnabledContentTypes([], 'some-app');

      expect(enabledContentTypes).toEqual([]);
    });

    it('returns an array of content types with sidebar using app', () => {
      const enabledContentTypes = editorInterfacesToEnabledContentTypes(
        [
          {
            sys: { contentType: { sys: { id: 'ct1' } } },
            // "some-app" app in the sidebar - enabled.
            sidebar: [{ widgetNamespace: 'app', widgetId: 'some-app' }]
          },
          {
            sys: {
              contentType: { sys: { id: 'ct1' } },
              // "some-app" app in controls and editor but not in sidebar - not enabled.
              controls: [{ fieldId: 'title', widgetNamespace: 'app', widgetId: 'some-app' }],
              editor: {
                widgetNamespace: 'app',
                widgetId: 'some-app'
              }
            }
          },
          {
            sys: { contentType: { sys: { id: 'ct3' } } },
            sidebar: [
              { widgetNamespace: 'extension', widgetId: 'some-ext' },
              { widgetNamespace: 'builtin-sidebar', widgetId: 'publish-button' },
              // "some-app" app deep in the sidebar - still enabled.
              { widgetNamespace: 'app', widgetId: 'some-app' }
            ]
          },
          {
            sys: { contentType: { sys: { id: 'ct4' } } },
            sidebar: [
              { widgetNamespace: 'app', widgetId: 'some-diff-app' },
              // "some-app" ID is used for an extension, not an app - not enabled.
              { widgetNamespace: 'extension', widgetId: 'some-app' }
            ]
          }
        ],
        'some-app'
      );

      expect(enabledContentTypes).toEqual(['ct1', 'ct3']);
    });
  });

  describe('enabledContentTypesToTargetState', () => {
    it('returns target state for enabled content types', () => {
      const contentTypes = [
        ['ct1', 'Content Type no 1'],
        ['ct2', 'Content Type no 2'],
        ['ct3', 'Content Type no 3']
      ];

      const enabled = ['ct1', 'ct3'];

      const targetState = enabledContentTypesToTargetState(contentTypes, enabled);

      expect(targetState).toEqual({
        EditorInterface: {
          ct1: { sidebar: { position: 2 } },
          ct2: {},
          ct3: { sidebar: { position: 2 } }
        }
      });
    });
  });
});
