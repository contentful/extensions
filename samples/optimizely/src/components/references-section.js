import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Heading, TextLink, Tooltip } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  heading: css({
    marginBottom: tokens.spacingL
  }),
  container: css({
    display: 'flex',
    marginBottom: `-${tokens.spacingM}`
  }),
  item: css({
    marginRight: tokens.spacingM,
    marginBottom: tokens.spacingM
  })
};

function ReferenceItem(props) {
  return (
    <div className={styles.item}>
      <Tooltip content={`${props.entry.contentTypeName}`} place="bottom">
        <TextLink onClick={props.onClick}>{props.entry.title}</TextLink>
      </Tooltip>
    </div>
  );
}
ReferenceItem.propTypes = {
  entry: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

export default function ReferencesSection(props) {
  const onItemClick = id => () => {
    props.sdk.navigator.openEntry(id, {
      slideIn: true
    });
  };

  return (
    <React.Fragment>
      <Heading element="h2" className={styles.heading}>
        Referenced in:
      </Heading>
      <div className={styles.container}>
        {props.references.map((entry, index) => (
          <React.Fragment key={entry.id}>
            <ReferenceItem entry={entry} onClick={onItemClick(entry.id)} />
            {index !== props.references.length - 1 && ', '}
          </React.Fragment>
        ))}
      </div>
    </React.Fragment>
  );
}

ReferencesSection.propTypes = {
  references: PropTypes.array,
  sdk: PropTypes.object.isRequired
};

ReferencesSection.defaultProps = {
  references: []
};
