import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';
import { Button } from '@contentful/forma-36-react-components';

const styles = {
  container: css({
    backgroundColor: tokens.colorElementLightest,
    border: `1px solid ${tokens.colorElementMid}`,
    borderBottomLeftRadius: '2px',
    borderBottomRightRadius: '2px',
    borderTop: 'none'
  }),
  row: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacingM
  }),
  statItemsContainer: css({
    display: 'flex'
  }),
  statItem: css({
    marginRight: tokens.spacingM
  }),
  statItemValue: css({
    fontSize: tokens.fontSizeXl,
    color: tokens.colorTextDark
  }),
  statItemLabel: css({
    fontSize: tokens.fontSizeM,
    color: tokens.colorTextLight
  })
};

function StatItem(props) {
  return (
    <div className={styles.statItem}>
      <div className={styles.statItemValue}>{props.value}</div>
      <div className={styles.statItemLabel}>{props.label}</div>
    </div>
  );
}

StatItem.propTypes = {
  value: PropTypes.any,
  label: PropTypes.string
};

function getPercent(value) {
  return Math.floor(value * 1000) / 10;
}

export default function VariationStats(props) {
  const visitorsCount = get(props.experimentResults, [
    'results',
    'reach',
    'variations',
    props.variationId,
    'count'
  ]);
  const visitorsReach = get(props.experimentResults, [
    'results',
    'reach',
    'variations',
    props.variationId,
    'variation_reach'
  ]);
  const url = get(props.experimentResults, ['url']);
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.statItemsContainer}>
          <StatItem
            value={typeof visitorsCount === 'number' ? visitorsCount : '-'}
            label="visitors"
          />
          <StatItem
            value={typeof visitorsReach === 'number' ? `${getPercent(visitorsReach)}%` : '-'}
            label="visitors"
          />
        </div>
        <Button buttonType="muted" href={url} target="_blank">
          See all results
        </Button>
      </div>
    </div>
  );
}

VariationStats.propTypes = {
  variationId: PropTypes.any,
  experimentResults: PropTypes.shape({
    results: PropTypes.object,
    url: PropTypes.string.isRequired
  })
};
