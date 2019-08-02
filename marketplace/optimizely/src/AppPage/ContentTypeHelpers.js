import { hasReferenceFieldsLinkingToEntry } from './ReferenceForm';
import { VARIATION_CONTAINER_ID } from './constants';

export function getContentTypesNotAddedYet(all, added) {
  return all.filter(ct => isContentTypeValidSelection(ct, added));
}

export function isContentTypeAlreadyAdded(contentType, addedContentTypes) {
  return addedContentTypes.includes(contentType.sys.id);
}

export function isContentTypeValidSelection(contentType, addedContentTypes) {
  return (
    contentType.sys.id !== VARIATION_CONTAINER_ID &&
    !isContentTypeAlreadyAdded(contentType, addedContentTypes) &&
    hasReferenceFieldsLinkingToEntry(contentType)
  );
}
