import {
  currentStateToEnabledContentTypes,
  enabledContentTypesToTargetState
} from '../../src/app/target-state';

describe('target-state', () => {
  describe('currentStateToEnabledContentTypes', () => {
    it('returns an empty array if there are no editor interfaces in target state', () => {
      const enabledContentTypes = currentStateToEnabledContentTypes({});

      expect(enabledContentTypes).toEqual([]);
    });

    it('returns an array of content types with sidebar defined', () => {
      const enabledContentTypes = currentStateToEnabledContentTypes({
        EditorInterface: {
          ct1: {
            sidebar: { position: 2 }
          },
          ct2: {
            editor: true
          },
          ct3: {
            sidebar: { position: 8 },
            editor: true
          }
        }
      });

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
