import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import { FormLabel } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import ReferenceField from './ReferenceField.es6';

const styles = {
  referenceForm: css({
    marginTop: tokens.spacingM
  }),
  referenceGrid: css({
    display: 'grid',
    gridTemplateColumns: '15rem 15rem',
    gridColumnGap: '1rem'
  })
};

ReferenceForm.propTypes = {
  fields: PropTypes.object.isRequired,
  allContentTypes: PropTypes.array.isRequired,
  selectedContentType: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default function ReferenceForm({ allContentTypes, selectedContentType, fields, onSelect }) {
  if (!fields) return null;
  const contentTypeEntity = allContentTypes.find(ct => ct.sys.id === selectedContentType);
  const ids = Object.keys(fields);

  return (
    <section className={styles.referenceForm}>
      <FormLabel htmlFor="">Reference Fields</FormLabel>
      <section className={styles.referenceGrid}>
        <div className={styles.referenceColumn}>
          {ids
            .filter((_, ind) => ind % 2 === 0)
            .map(id => (
              <ReferenceField
                key={id}
                id={id}
                contentType={contentTypeEntity}
                checked={fields[id]}
                onSelect={onSelect}
              />
            ))}
        </div>
        <div className={styles.referenceColumn}>
          {ids
            .filter((_, ind) => ind % 2 === 1)
            .map(id => (
              <ReferenceField
                key={id}
                id={id}
                contentType={contentTypeEntity}
                checked={fields[id]}
                onSelect={onSelect}
              />
            ))}
        </div>
      </section>
    </section>
  );
}

function isLinkToEntry(fieldOrItems) {
  return fieldOrItems.type === 'Link' && fieldOrItems.linkType === 'Entry';
}

export function isReferenceFieldLinkingToEntry(field) {
  return isLinkToEntry(field) || (field.type === 'Array' && isLinkToEntry(field.items));
}

export function getReferenceFieldsLinkingToEntry(contentType) {
  return contentType.fields.filter(isReferenceFieldLinkingToEntry);
}

export function hasReferenceFieldsLinkingToEntry(contentType) {
  return getReferenceFieldsLinkingToEntry(contentType).length > 0;
}
