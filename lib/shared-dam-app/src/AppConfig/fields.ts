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

interface Control {
  fieldId: string;
  widgetNamespace: string;
  widgetId: string;
}

export interface EditorInterface {
  sys: { contentType: { sys: { id: string } } };
  controls?: Control[];
}

export type CompatibleFields = Record<string, Field[]>;
export type SelectedFields = Record<string, string[] | undefined>;

export function getCompatibleFields(contentTypes: ContentType[]): CompatibleFields {
  return contentTypes.reduce((acc, ct) => {
    return {
      ...acc,
      [ct.sys.id]: (ct.fields || []).filter(field => field.type === 'Object')
    };
  }, {});
}

export function editorInterfacesToSelectedFields(
  eis: EditorInterface[],
  appId?: string
): SelectedFields {
  return eis.reduce((acc, ei) => {
    const ctId = get(ei, ['sys', 'contentType', 'sys', 'id']);
    const fieldIds = get(ei, ['controls'], [])
      .filter(control => control.widgetNamespace === 'app' && control.widgetId === appId)
      .map(control => control.fieldId)
      .filter(fieldId => typeof fieldId === 'string' && fieldId.length > 0);

    if (ctId && fieldIds.length > 0) {
      return { ...acc, [ctId]: fieldIds };
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
