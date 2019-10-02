export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

export const getField = (contentType, fieldId) =>
  contentType.fields.find(field => field.id === fieldId);

export const isCompatibleImageField = field => !!(field && field.linkType === 'Asset');
