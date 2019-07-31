import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { Icon } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { Status } from './constants';
import { getEntryStatus } from './utils';

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

const checkStatuses = (statuses, experiment, variations, entries) => {
  if (!experiment) {
    return statuses;
  }

  statuses[Status.SelectExperiment] = true;
  if (experiment.status === 'running') {
    statuses[Status.StartExperiment] = true;
  }
  if (variations) {
    const allAdded = variations.length === experiment.variations.length;
    statuses[Status.AddContent] = allAdded;

    if (allAdded) {
      const allVariationsArePublished = variations.reduce((prev, item) => {
        const entry = entries[item.sys.id];
        if (!entry) {
          return prev && false;
        }
        return prev && getEntryStatus(entry.sys) === 'published';
      }, true);

      if (allVariationsArePublished) {
        statuses[Status.PublishVariations] = true;
      }
    }
  }
  return statuses;
};

export default function StatusBar(props) {
  let statuses = {
    [Status.SelectExperiment]: false,
    [Status.StartExperiment]: false,
    [Status.AddContent]: false,
    [Status.PublishVariations]: false
  };

  if (props.loaded) {
    statuses = checkStatuses(statuses, props.experiment, props.variations, props.entries);
  }

  return (
    <div className={styles.container}>
      <StatusItem active={statuses[Status.SelectExperiment]}>Select experiment</StatusItem>
      <StatusSeparator />
      <StatusItem active={statuses[Status.AddContent]}>Add content</StatusItem>
      <StatusSeparator />
      <StatusItem active={statuses[Status.PublishVariations]}>Publish variations</StatusItem>
      <StatusSeparator />
      <StatusItem active={statuses[Status.StartExperiment]}>Start experiment</StatusItem>
    </div>
  );
}

StatusBar.propTypes = {
  loaded: PropTypes.bool.isRequired,
  experiment: PropTypes.object,
  variations: PropTypes.array,
  entries: PropTypes.object
};
