import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';
import { Note } from '@contentful/forma-36-react-components';

const styles = {
  container: css({
    margin: tokens.spacingL
  })
};

const requiredFields = [
  {
    id: 'experimentTitle',
    type: 'Symbol'
  },
  { id: 'experimentId', type: 'Symbol' },
  { id: 'experimentKey', type: 'Symbol' },
  { id: 'meta', type: 'Object' },
  { id: 'variations', type: 'Array' }
];

export function isValidContentType(contentType) {
  const missing = [];

  requiredFields.forEach(item => {
    const exists = contentType.fields.find(
      field => field.id === item.id && field.type === item.type
    );
    if (!exists) {
      missing.push(item);
    }
  });

  return [missing.length === 0, missing];
}

export function MissingProjectId() {
  return (
    <div className={styles.container}>
      <Note noteType="negative">
        Please, set <strong>Optimizely Project ID</strong> in Extension settings.
      </Note>
    </div>
  );
}

export function IncorrectContentType(props) {
  const title = `Extension "${props.sdk.ids.extension}" cannot be assigned to this content type`;
  return (
    <div className={styles.container}>
      <Note noteType="negative" title={title}>
        <div>
          <strong>Required:</strong>{' '}
          {requiredFields.map(item => `${item.id} (${item.type})`).join(', ')}
        </div>
        <div>
          <strong>Missing:</strong>{' '}
          {props.missingFields.map(item => `${item.id} (${item.type})`).join(',')}
        </div>
      </Note>
    </div>
  );
}

IncorrectContentType.propTypes = {
  missingFields: PropTypes.array.isRequired,
  sdk: PropTypes.shape({
    ids: PropTypes.shape({
      extension: PropTypes.string
    }).isRequired
  }).isRequired
};
