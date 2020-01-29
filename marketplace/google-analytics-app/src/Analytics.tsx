import * as React from 'react';
import PropTypes from 'prop-types';
import { Option, Select, DisplayText, Paragraph } from '@contentful/forma-36-react-components';

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

const INITIAL_RANGE_INDEX = 2;

function getRangeDates(rangeOptionIndex) {
  const range = RANGE_OPTIONS[rangeOptionIndex];
  const today = new Date();

  return {
    range,
    today,
    startEnd: {
      start: new Date(today - DAY_IN_MS * range.startDaysAgo),
      end: new Date(today - DAY_IN_MS * range.endDaysAgo)
    }
  };
}

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
      totalPageViews: '',
      rangeOptionIndex: INITIAL_RANGE_INDEX,
      ...getRangeDates(INITIAL_RANGE_INDEX)
    };
  }

  handleRangeChange(rangeOptionIndex: string) {
    rangeOptionIndex = parseInt(rangeOptionIndex, 10);

    this.setState({
      rangeOptionIndex,
      ...getRangeDates(rangeOptionIndex)
    });
  }

  updateTotal(data) {
    const totalPageViews = data.rows.reduce((acc, { c }) => acc + c[1].v, 0);

    this.setState({ totalPageViews });
  }

  render() {
    const { rangeOptionIndex, totalPageViews, range, startEnd } = this.state;
    const { pagePath, viewId } = this.props;
    const nDays = range.startDaysAgo - range.endDaysAgo;
    const dimension = nDays > 28 ? 'week' : nDays > 4 ? 'date' : 'hour';

    const formattedPageViews =
      totalPageViews >= 1_000_000
        ? Math.round(totalPageViews / 100_000) / 10 + 'm'
        : totalPageViews >= 1_000
        ? Math.round(totalPageViews / 100) / 10 + 'k'
        : totalPageViews;

    return (
      <React.Fragment>
        <div className={styles.header}>
          <div>
            <DisplayText size="large">{formattedPageViews}</DisplayText>
            <Paragraph>Pageviews</Paragraph>
          </div>
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
        <Timeline
          onData={d => this.updateTotal(d)}
          pagePath={pagePath}
          range={startEnd}
          dimension={dimension}
          // remove 'ga:' prefix from view id
          viewId={viewId.replace(/^ga:/, '')}
        />
      </React.Fragment>
    );
  }
}

Analytics.propTypes = {
  pagePath: PropTypes.string.isRequired,
  viewId: PropTypes.string.isRequired
};
