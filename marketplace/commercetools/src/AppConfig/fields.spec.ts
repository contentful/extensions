import {
  getCompatibleFields,
  editorInterfacesToSelectedFields,
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

  describe('editorInterfacesToSelectedFields', () => {
    it('handles lack of editor interfaces gracefully', () => {
      const result = editorInterfacesToSelectedFields([], 'some-app');

      expect(result).toEqual({});
    });

    it('creates a map of selected fields from editor interface data', () => {
      const result = editorInterfacesToSelectedFields(
        [
          {
            sys: { contentType: { sys: { id: 'ct1' } } },
            controls: [
              { fieldId: 'foo', widgetNamespace: 'app', widgetId: 'some-app' },
              { fieldId: 'bar', widgetNamespace: 'app', widgetId: 'some-diff-app' }
            ]
          },
          {
            sys: { contentType: { sys: { id: 'ct2' } } },
            controls: []
          },
          {
            sys: { contentType: { sys: { id: 'ct3' } } }
          },
          {
            sys: { contentType: { sys: { id: 'ct4' } } },
            controls: [
              { fieldId: 'foo', widgetNamespace: 'builtin', widgetId: 'singleLine' },
              { fieldId: 'bar', widgetNamespace: 'app', widgetId: 'some-app' },
              { fieldId: 'baz', widgetNamespace: 'app', widgetId: 'some-app' }
            ]
          }
        ],
        'some-app'
      );

      expect(result).toEqual({
        ct1: ['foo'],
        ct4: ['bar', 'baz']
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
