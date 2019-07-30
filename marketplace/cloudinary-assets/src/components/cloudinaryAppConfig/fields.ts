import get from 'lodash.get';

interface Field {
  id: string;
  name: string;
  type: string;
}

export interface ContentType {
  sys: { id: string };
  name: string;
  fields?: Field[];
}

export type CompatibleFields = Record<string, Field[]>;
export type SelectedFields = Record<string, string[] | undefined>;
type EditorInterfaceState = { controls?: { fieldId: string }[] };

export function getCompatibleFields(contentTypes: ContentType[]): CompatibleFields {
  return contentTypes.reduce((acc, ct) => {
    return {
      ...acc,
      [ct.sys.id]: (ct.fields || []).filter(field => field.type === 'Object')
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
