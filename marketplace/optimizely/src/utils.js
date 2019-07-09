import get from 'lodash.get';

export const getEntryStatus = sys => {
  if (sys.archivedVersion) {
    return 'archived';
  } else if (sys.publishedVersion) {
    if (sys.version > sys.publishedVersion + 1) {
      return 'changed';
    } else {
      return 'published';
    }
  } else {
    return 'draft';
  }
};

export const getAdditionalEntryInformation = (entry, allContentTypes, defaultLocale) => {
  const contentTypeId = get(entry, ['sys', 'contentType', 'sys', 'id']);
  const contentType = allContentTypes.find(contentType => contentType.sys.id === contentTypeId);
  if (!contentType) {
    throw new Error(`Content type #${contentTypeId} is not present`);
  }

  const displayField = contentType.displayField;
  const descriptionFieldType = contentType.fields
    .filter(field => field.id !== displayField)
    .find(field => field.type === 'Text');

  const description = descriptionFieldType
    ? get(entry, ['fields', descriptionFieldType.id, defaultLocale], '')
    : '';
  const title = get(entry, ['fields', displayField, defaultLocale], 'Untitled');
  const status = getEntryStatus(entry.sys);

  return {
    title,
    description,
    contentType: contentType.name,
    status
  };
};
