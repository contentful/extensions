import React from 'react';
import PropTypes from 'prop-types';
import { TextLink } from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  container: css({
    marginTop: tokens.spacingM
  }),
  item: css({
    marginBottom: tokens.spacingXs
  })
};

export default function VariationSelect(props) {
  return (
    <div className={styles.container}>
      {props.duplicate && (
        <div className={styles.item}>
          <TextLink icon="Copy" disabled onClick={props.onDuplicateClick}>
            Duplicate {props.duplicate}
          </TextLink>
        </div>
      )}
      <div className={styles.item}>
        <TextLink icon="Plus" disabled onClick={props.onCreateClick}>
          Create entry and link
        </TextLink>
      </div>
      <div className={styles.item}>
        <TextLink icon="Link" onClick={props.onLinkExistingClick}>
          Link an existing entry
        </TextLink>
      </div>
    </div>
  );
}

VariationSelect.propTypes = {
  duplicate: PropTypes.string,
  onLinkExistingClick: PropTypes.func.isRequired,
  onCreateClick: PropTypes.func.isRequired,
  onDuplicateClick: PropTypes.func.isRequired
};
