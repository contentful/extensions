import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { Icon } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  note: css({
    marginBottom: tokens.spacingL
  }),
  container: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1000
  }),
  item: css({
    display: 'flex',
    alignItems: 'center',
    fontSize: tokens.fontSizeM,
    color: tokens.colorTextMid
  }),
  itemSeparator: css({
    marginLeft: tokens.spacingM,
    marginRight: tokens.spacingM
  }),
  itemIcon: css({
    marginRight: tokens.spacingS
  })
};

function Status(props) {
  return (
    <div className={styles.item}>
      <Icon
        className={styles.itemIcon}
        icon={props.active ? 'CheckCircle' : 'InfoCircle'}
        color={props.active ? 'positive' : 'muted'}
        size="small"
      />
      <span>{props.children}</span>
    </div>
  );
}

Status.propTypes = {
  children: PropTypes.string,
  active: PropTypes.bool
};

function StatusSeparator() {
  return <Icon className={styles.itemSeparator} icon="ChevronRight" size="small" color="muted" />;
}

export default function StatusBar(props) {
  if (!props.loaded) {
    return (
      <div className={styles.container}>
        <Status>Select experiment</Status>
        <StatusSeparator />
        <Status>Add content</Status>
        <StatusSeparator />
        <Status>Publish variations</Status>
        <StatusSeparator />
        <Status>Start experiment</Status>
      </div>
    );
  }

  return (
    <React.Fragment>
      {/* <Note title="Running experiment" className={styles.note}>
        Changes can affect results. <TextLink>Read more</TextLink>
      </Note> */}
      <div className={styles.container}>
        <Status active>Select experiment</Status>
        <StatusSeparator />
        <Status active>Add content</Status>
        <StatusSeparator />
        <Status active>Publish variations</Status>
        <StatusSeparator />
        <Status>Start experiment</Status>
      </div>
    </React.Fragment>
  );
}

StatusBar.propTypes = {
  loaded: PropTypes.bool.isRequired
};
