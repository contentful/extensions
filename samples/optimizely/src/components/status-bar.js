import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { Icon } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { Status } from '../constants';

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

function StatusItem(props) {
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

StatusItem.propTypes = {
  children: PropTypes.string,
  active: PropTypes.bool
};

function StatusSeparator() {
  return <Icon className={styles.itemSeparator} icon="ChevronRight" size="small" color="muted" />;
}

export default function StatusBar(props) {
  const statuses = {
    [Status.SelectExperiment]: false,
    [Status.StartExperiment]: false,
    [Status.AddContent]: false,
    [Status.PublishVariations]: false
  };

  if (props.loaded) {
    switch (props.status) {
      case Status.SelectExperiment:
        break;
      case Status.AddContent:
        statuses[Status.SelectExperiment] = true;
        break;
      case Status.PublishVariations:
        statuses[Status.SelectExperiment] = true;
        statuses[Status.AddContent] = true;
        break;
      case Status.StartExperiment:
        statuses[Status.SelectExperiment] = true;
        statuses[Status.AddContent] = true;
        statuses[Status.PublishVariations] = true;
        break;
      case Status.Finished:
        statuses[Status.SelectExperiment] = true;
        statuses[Status.AddContent] = true;
        statuses[Status.PublishVariations] = true;
        statuses[Status.StartExperiment] = true;
        break;
    }
  }

  return (
    <div className={styles.container}>
      <StatusItem active={statuses[Status.SelectExperiment]}>Select experiment</StatusItem>
      <StatusSeparator />
      <StatusItem active={statuses[Status.AddContent]}>Add content</StatusItem>
      <StatusSeparator />
      <StatusItem active={statuses[Status.PublishVariations]}>
        Publish variations and experiment
      </StatusItem>
      <StatusSeparator />
      <StatusItem active={statuses[Status.StartExperiment]}>Start experiment</StatusItem>
    </div>
  );
}

StatusBar.propTypes = {
  loaded: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired
};
