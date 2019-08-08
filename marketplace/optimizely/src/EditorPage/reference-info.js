import get from 'lodash.get';
import intersection from 'lodash.intersection';

export const COMBINED_LINK_VALIDATION_ALL = 'ALL';
export const COMBINED_LINK_VALIDATION_INTERSECTION = 'INTERSECTION';
export const COMBINED_LINK_VALIDATION_CONFLICT = 'CONFLICT';

const isEntryLink = f => get(f, ['linkType']) === 'Entry';

// Find all field IDs in an entry given that are linking to the
// variation container.
function findLinkingFieldIds(entry, ct, variationContainerId) {
  // For every field...
  return (ct.fields || []).reduce((acc, field) => {
    const locales = Object.keys(get(entry, ['fields', field.id], {}));

    // For every locale in this field...
    const found = !!locales.find(locale => {
      const value = get(entry, ['fields', field.id, locale]);

      // If the field-locale is a single Entry refenrence, check
      // if it links to the container.
      if (isEntryLink(field)) {
        return get(value, ['sys', 'id']) === variationContainerId;
      }

      // If the field-locale is an array of Entry references, check
      // if at least one item links to the container.
      if (field.type === 'Array' && isEntryLink(field.items) && Array.isArray(value)) {
        return !!value.find(item => get(item, ['sys', 'id']) === variationContainerId);
      }

      // In any other case we're sure we're not linking to the
      // variation container.
      return false;
    });

    if (found) {
      // It is possible we link a single container from the same field
      // twice (for example from different locales). We only add it to the
      // list if it's not there yet.
      return acc.includes(field.id) ? acc : acc.concat([field.id]);
    }

    return acc;
  }, []);
}

// Depending on a field type (Array vs Link) validations are stored
// in a different place.
function getValidationsPath(field) {
  if (field.type === 'Link') {
    return ['validations'];
  }

  if (field.type === 'Array' && isEntryLink(field.items)) {
    return ['items', 'validations'];
  }

  throw new Error('Invalid field type.');
}

// The format used for `linkContentType` validations is not historically
// uniform. We used to allow strings and null values.
function normalizeLinkContentTypeValidation(
  linkContentTypeValidation,
  variationContainerContentTypeId
) {
  const ctIds = linkContentTypeValidation.linkContentType;

  // If the valalidation value is a string, cast it to an array.
  // We want to filter out the variation container content type ID.
  if (typeof ctIds === 'string' && ctIds !== variationContainerContentTypeId) {
    return [ctIds];
  }

  // If validation value is already an array only do the variation
  // container content type.
  if (Array.isArray(ctIds)) {
    return ctIds.filter(ctId => ctId !== variationContainerContentTypeId);
  }

  return [];
}

// We need to distinguish between not having validations defined
// and having empty validations. For this reason we introduce additional
// `hasLinkValidation` boolean flag.
function prepareFieldLinkValidations(field, variationContainerContentTypeId) {
  const validations = get(field, getValidationsPath(field), []);
  const linkContentTypeValidation = validations.find(v => v && v.linkContentType);

  if (!linkContentTypeValidation) {
    return { hasLinkValidation: false };
  }

  return {
    hasLinkValidation: true,
    linkContentTypes: normalizeLinkContentTypeValidation(
      linkContentTypeValidation,
      variationContainerContentTypeId
    )
  };
}

// Reference info for an entry is a list of its reference fields
// including ID, name and link validation information.
function prepareReferenceInfoForEntry(
  entry,
  ct,
  variationContainerId,
  variationContainerContentTypeId
) {
  return findLinkingFieldIds(entry, ct, variationContainerId).map(fieldId => {
    const field = (ct.fields || []).find(f => f.id === fieldId);

    return {
      id: field.id,
      name: field.name,
      ...prepareFieldLinkValidations(field, variationContainerContentTypeId)
    };
  });
}

// Combined link validations (of fields in a single entry or across
// multiple entries) are:
// - intersection of valid link content types if at least one link
//   content type validation is defined
// - conflicting if intersection results in an empty array
// - all content types otherwise
function combineLinkValidations(linkValidations, ctMap) {
  const getCtName = ctId => get(ctMap, [ctId, 'name'], 'Untitled');

  if (linkValidations.length > 0) {
    const linkValidationsIntersection = intersection(...linkValidations);
    if (linkValidationsIntersection.length > 0) {
      return {
        combinedLinkValidationType: COMBINED_LINK_VALIDATION_INTERSECTION,
        linkContentTypes: linkValidationsIntersection,
        linkContentTypeNames: linkValidationsIntersection.map(getCtName)
      };
    }

    return { combinedLinkValidationType: COMBINED_LINK_VALIDATION_CONFLICT };
  }

  const allContentTypeIds = Object.keys(ctMap);
  return {
    combinedLinkValidationType: COMBINED_LINK_VALIDATION_ALL,
    linkContentTypes: allContentTypeIds,
    linkContentTypeNames: allContentTypeIds.map(getCtName)
  };
}

// Combine link validations for all fields in a single entry.
function combineLinkValidtionsForEntry(entryReferenceInfo, ctMap) {
  const linkValidations = entryReferenceInfo
    .filter(info => info.hasLinkValidation)
    .map(info => info.linkContentTypes);

  return combineLinkValidations(linkValidations, ctMap);
}

// Combine link validations for all entries.
function combineLinkValidationsForReferences(references, ctMap) {
  const hasConflict = !!references.find(
    ref => ref.combinedLinkValidationType === COMBINED_LINK_VALIDATION_CONFLICT
  );

  // If there's at least one conflict combination is conflicting too.
  if (hasConflict) {
    return { combinedLinkValidationType: COMBINED_LINK_VALIDATION_CONFLICT };
  }

  const linkValidations = references
    .filter(ref => ref.combinedLinkValidationType === COMBINED_LINK_VALIDATION_INTERSECTION)
    .map(ref => ref.linkContentTypes);

  // Use the regular algorithm otherwise for all intersections.
  return combineLinkValidations(linkValidations, ctMap);
}

export default function prepareReferenceInfo({
  contentTypes,
  entries,
  variationContainerId,
  variationContainerContentTypeId,
  defaultLocale
}) {
  const ctMap = contentTypes.reduce((acc, ct) => ({ ...acc, [ct.sys.id]: ct }), {});

  const references = entries.map(entry => {
    const ctId = get(entry, ['sys', 'contentType', 'sys', 'id']);
    const ct = ctMap[ctId];

    const entryReferenceInfo = prepareReferenceInfoForEntry(
      entry,
      ct,
      variationContainerId,
      variationContainerContentTypeId
    );

    return {
      id: entry.sys.id,
      title: get(entry, ['fields', ct.displayField, defaultLocale], 'Untitled'),
      contentTypeName: ct.name,
      referencedFromFields: entryReferenceInfo.map(f => f.name),
      ...combineLinkValidtionsForEntry(entryReferenceInfo, ctMap)
    };
  });

  return {
    references,
    ...combineLinkValidationsForReferences(references, ctMap)
  };
}
