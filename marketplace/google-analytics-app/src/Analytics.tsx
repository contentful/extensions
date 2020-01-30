import * as React from 'react';
import { Option, Select, DisplayText, Paragraph } from '@contentful/forma-36-react-components';

import Timeline from './Timeline';
import styles from './styles';
import { formatLargeNumbers, DAY_IN_MS, getDateRangeInterval } from './utils';
import { RangeOption, AnalyticsProps, AnalyticsState } from './typings';

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
    today,
    startEnd: {
      start: new Date(today - DAY_IN_MS * range.startDaysAgo),
      end: new Date(today - DAY_IN_MS * range.endDaysAgo)
    }
  };
}

export default class Analytics extends React.Component<AnalyticsProps, AnalyticsState> {
  constructor(props) {
    super(props);
    this.state = {
      totalPageViews: 0,
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

  updateTotalPageViews(data) {
    const totalPageViews = data.rows.reduce((acc, { c }) => acc + c[1].v, 0);

    this.setState({ totalPageViews });
  }

  render() {
    const { rangeOptionIndex, totalPageViews, startEnd } = this.state;
    const { pagePath, viewId, sdk, gapi } = this.props;
    const dimension = getDateRangeInterval(startEnd.start, startEnd.end);
    const formattedPageViews = formatLargeNumbers(totalPageViews);

    return (
      <>
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
          onData={d => this.updateTotalPageViews(d)}
          pagePath={pagePath}
          range={startEnd}
          dimension={dimension}
          sdk={sdk}
          gapi={gapi}
          // remove 'ga:' prefix from view id
          viewId={viewId.replace(/^ga:/, '')}
        />
      </>
    );
  }
}
