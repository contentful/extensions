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

export function getCompatibleFields(contentTypes: ContentType[]): CompatibleFields {
  return contentTypes.reduce((acc, ct) => {
    return {
      ...acc,
      [ct.sys.id]: (ct.fields || []).filter(field => field.type === 'Object')
    };
  }, {});
}
