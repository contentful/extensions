import { hasReferenceFieldsLinkingToEntry } from './ReferenceForm';
import constants from './constants';

export function getContentTypesNotAddedYet(all, added) {
  return all.filter(ct => isContentTypeValidSelection(ct, added));
}

export function isContentTypeAlreadyAdded(contentType, addedContentTypes) {
  return addedContentTypes.includes(contentType.sys.id);
}

export function isContentTypeValidSelection(contentType, addedContentTypes) {
  return (
    contentType.sys.id !== constants.VARIATION_CONTAINER_CT_ID &&
    !isContentTypeAlreadyAdded(contentType, addedContentTypes) &&
    hasReferenceFieldsLinkingToEntry(contentType)
  );
}
