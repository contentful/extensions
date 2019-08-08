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
    fields: [{ id: 'foo', name: 'FOO', type: 'Text' }]
  },
  {
    sys: { id: 'ct3' },
    name: 'CT3',
    fields: [{ id: 'bar', name: 'BAR', type: 'Object' }, { id: 'baz', name: 'BAZ', type: 'Object' }]
  }
];

describe('fields', () => {
  describe('getCompatibleFields', () => {
    it('returns map of compatible fields', () => {
      const result = getCompatibleFields(contentTypes);

      expect(result).toEqual({
        ct1: [{ id: 'y', name: 'Y', type: 'Object' }],
        ct2: [],
        ct3: [
          { id: 'bar', name: 'BAR', type: 'Object' },
          { id: 'baz', name: 'BAZ', type: 'Object' }
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
            controls: [{ fieldId: 'foo' }]
          },
          ct2: { controls: [] },
          ct3: {},
          ct4: {
            controls: [{ fieldId: 'bar' }, { fieldId: 'baz' }]
          }
        }
      });

      expect(result).toEqual({
        ct1: ['foo'],
        ct4: ['bar', 'baz']
      });
    });
  });

  describe('selectedFieldsToTargetState', () => {
    it('converts selected field map to target state', () => {
      const result = selectedFieldsToTargetState(contentTypes, {
        ct1: ['y'],
        ct3: ['bar']
      });

      expect(result).toEqual({
        EditorInterface: {
          ct1: { controls: [{ fieldId: 'y' }] },
          ct2: {},
          ct3: { controls: [{ fieldId: 'bar' }] }
        }
      });
    });
  });
});
