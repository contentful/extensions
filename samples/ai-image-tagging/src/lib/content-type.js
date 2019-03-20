export const getField = (contentType, fieldId) =>
  contentType.fields.find(field => field.id === fieldId);

export const isCompatibleImageField = (field) => !!(field && field.linkType === 'Asset');

export const isCompatibleTagField = (field) => !!(field && field.type === 'Array' && field.items.type === 'Symbol');

export const getContentTypeUrl = (contentType) => {
  const spaceId = contentType.sys.space.sys.id;
  const contentTypeId = contentType.sys.id;

  return `https://app.contentful.com/spaces/${spaceId}/content_types/${contentTypeId}/sidebar_configuration`
};
