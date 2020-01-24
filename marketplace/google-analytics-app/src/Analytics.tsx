import * as React from 'react';
import PropTypes from 'prop-types';
import { Option, Select } from '@contentful/forma-36-react-components';

import Timeline from './Timeline';
import styles from './styles';

interface RangeOption {
  label: string;
  startDaysAgo: number;
  endDaysAgo: number;
}

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const RANGE_OPTIONS: RangeOption[] = [
  { label: 'Today', startDaysAgo: 1, endDaysAgo: 0 },
  { label: 'Yesterday', startDaysAgo: 2, endDaysAgo: 1 },
  { label: 'Last 7 days', startDaysAgo: 7, endDaysAgo: 0 },
  { label: 'Last 28 days', startDaysAgo: 28, endDaysAgo: 0 },
  { label: 'Last 90 days', startDaysAgo: 90, endDaysAgo: 0 }
];

export default class Analytics extends React.Component<
  {
    pagePath: string;
    viewId: string;
  },
  {
    rangeOptionIndex: number;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      rangeOptionIndex: 2
    };
  }

  handleRangeChange(rangeOptionIndex: string) {
    this.setState({
      rangeOptionIndex: parseInt(rangeOptionIndex, 10)
    });
  }

  render() {
    const { rangeOptionIndex } = this.state;
    const { pagePath, viewId } = this.props;
    const range = RANGE_OPTIONS[rangeOptionIndex];
    const today = new Date();

    const startEnd = {
      start: new Date(today - DAY_IN_MS * range.startDaysAgo),
      end: new Date(today - DAY_IN_MS * range.endDaysAgo)
    };

    const nDays = range.startDaysAgo - range.endDaysAgo;
    const dimension = nDays > 28 ? 'week' : nDays > 4 ? 'date' : 'hour';

    return (
      <React.Fragment>
        <div className={styles.header}>
          <Select
            name="range"
            value={`${rangeOptionIndex}`}
            onChange={event => this.handleRangeChange(event.target.value)}>
            {RANGE_OPTIONS.map((r, index) => (
              <Option key={index} value={`${index}`}>
                {r.label}
              </Option>
            ))}
          </Select>
        </div>
        <Timeline pagePath={pagePath} range={startEnd} dimension={dimension} viewId={viewId} />
        <div className="info">{pagePath}</div>
      </React.Fragment>
    );
  }
}

Analytics.propTypes = {
  pagePath: PropTypes.string.isRequired,
  viewId: PropTypes.string.isRequired
};
