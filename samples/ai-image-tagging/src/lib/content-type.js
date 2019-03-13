
const findField = (fieldSelectorFn, fieldNameIncludes) => (contentType) => {
  const possibleFields = fieldSelectorFn(contentType);

  if (possibleFields.length === 0) {
    return null
  } else if (possibleFields.length > 1) {
    const topCandidates = possibleFields.filter(
      field => field.name.toLowerCase().includes(fieldNameIncludes) ||
        field.id.toLowerCase().includes(fieldNameIncludes)
    );

    if (topCandidates.length > 0) {
      return topCandidates[0].id
    }
  }

  return possibleFields[0].id
};

export const getAssetFields = contentType => contentType.fields.filter(
  field => field.linkType === 'Asset' && field.id,
);

export const getTagFields = contentType =>  contentType.fields.filter(
  field => field.type === 'Array' && field.items.type === 'Symbol' && field.id,
);

export const findImageField = findField(
  getAssetFields,
  'image',
);

export const findTagsField = findField(
  getTagFields,
  'tag',
);
