import {
  getCompatibleFields,
  currentStateToSelectedFields,
  selectedFieldsToTargetState
} from './fields';

const contentTypes = [
  {
    sys: { id: 'ct1' },
    name: 'CT1',
    fields: [{ id: 'x', name: 'X', type: 'Symbol' }, { id: 'y', name: 'Y', type: 'Object' }]
  },
  {
    sys: { id: 'ct2' },
    name: 'CT2',
    fields: [
      { id: 'foo', name: 'FOO', type: 'Text' },
      { id: 'z', name: 'Z', type: 'Array', items: { type: 'Symbol' } }
    ]
  },
  {
    sys: { id: 'ct3' },
    name: 'CT3',
    fields: [
      { id: 'bar', name: 'BAR', type: 'Object' },
      { id: 'baz', name: 'BAZ', type: 'Object' },
      { id: 'd', name: 'D', type: 'Array', items: { type: 'Symbol' } },
      { id: 'a', name: 'A', type: 'Symbol' }
    ]
  }
];

describe('fields', () => {
  describe('getCompatibleFields', () => {
    it('returns map of compatible fields', () => {
      const result = getCompatibleFields(contentTypes);

      expect(result).toEqual({
        ct1: [{ id: 'x', name: 'X', type: 'Symbol' }],
        ct2: [{ id: 'z', name: 'Z', type: 'Array', items: { type: 'Symbol' } }],
        ct3: [
          { id: 'd', name: 'D', type: 'Array', items: { type: 'Symbol' } },
          { id: 'a', name: 'A', type: 'Symbol' }
        ]
      });
    });
  });

  describe('currentStateToSelectedFields', () => {
    it('handles lack of editor interfaces gracefully', () => {
      const result = currentStateToSelectedFields({});

      expect(result).toEqual({});
    });

    it('creates a map of selected fields from editor interface data', () => {
      const result = currentStateToSelectedFields({
        EditorInterface: {
          ct1: {
            controls: [{ fieldId: 'x' }]
          },
          ct2: { controls: [] },
          ct3: {},
          ct4: {
            controls: [{ fieldId: 'a' }, { fieldId: 'd' }]
          }
        }
      });

      expect(result).toEqual({
        ct1: ['x'],
        ct4: ['a', 'd']
      });
    });
  });

  describe('selectedFieldsToTargetState', () => {
    it('converts selected field map to target state', () => {
      const result = selectedFieldsToTargetState(contentTypes, {
        ct1: ['x'],
        ct3: ['a']
      });

      expect(result).toEqual({
        EditorInterface: {
          ct1: { controls: [{ fieldId: 'x' }] },
          ct2: {},
          ct3: { controls: [{ fieldId: 'a' }] }
        }
      });
    });
  });
});
