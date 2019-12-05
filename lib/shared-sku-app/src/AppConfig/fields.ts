import get from 'lodash.get';

interface FieldItems {
  type: string;
}

interface Field {
  id: string;
  name: string;
  type: string;
  items?: FieldItems;
}

export interface ContentType {
  sys: { id: string };
  name: string;
  fields?: Field[];
}

export type CompatibleFields = Record<string, Field[]>;
export type SelectedFields = Record<string, string[] | undefined>;
type EditorInterfaceState = { controls?: { fieldId: string }[] };

function isCompatibleField(field: Field) {
  const isArray = field.type === 'Array';
  return field.type === 'Symbol' || (isArray && (field.items as FieldItems).type === 'Symbol');
}

export function getCompatibleFields(contentTypes: ContentType[]): CompatibleFields {
  return contentTypes.reduce((acc, ct) => {
    return {
      ...acc,
      [ct.sys.id]: (ct.fields || []).filter(isCompatibleField)
    };
  }, {});
}

export function currentStateToSelectedFields(currentState: Record<string, any>): SelectedFields {
  const eiState = get(currentState, ['EditorInterface'], {}) as Record<
    string,
    EditorInterfaceState
  >;

  return Object.keys(eiState).reduce((acc, ctId) => {
    const { controls } = eiState[ctId];

    if (controls && controls.length > 0) {
      return { ...acc, [ctId]: controls.map(c => c.fieldId) };
    } else {
      return acc;
    }
  }, {});
}

export function selectedFieldsToTargetState(
  contentTypes: ContentType[],
  selectedFields: SelectedFields
) {
  return {
    EditorInterface: contentTypes.reduce((acc, ct) => {
      const { id } = ct.sys;
      const fields = selectedFields[id] || [];
      const targetState =
        fields.length > 0 ? { controls: fields.map(fieldId => ({ fieldId })) } : {};

      return { ...acc, [id]: targetState };
    }, {})
  };
}
