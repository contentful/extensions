const getField = (contentType, fieldId) =>
  contentType.fields.find(field => field.id === fieldId);

export const isCompatibleImageField = (contentType, fieldId) => {
  const field = getField(contentType, fieldId);

  return !!(field && field.linkType === 'Asset');
};

export const isCompatibleTagField = (contentType, fieldId) => {
  const field = getField(contentType, fieldId);

  return !!(field && field.type === 'Array' && field.items.type === 'Symbol');
};
