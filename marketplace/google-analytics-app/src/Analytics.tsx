import * as React from 'react';
import { Select, DisplayText, Paragraph } from '@contentful/forma-36-react-components';

import Timeline from './Timeline';
import styles from './styles';
import { formatLargeNumbers, DAY_IN_MS, getDateRangeInterval } from './utils';
import { RangeOption, AnalyticsProps, AnalyticsState, ChartData } from './typings';

const RANGE_OPTIONS: RangeOption[] = [
  { label: 'Last 7 days', startDaysAgo: 7, endDaysAgo: 0 },
  { label: 'Last 28 days', startDaysAgo: 28, endDaysAgo: 0 },
  { label: 'Last 90 days', startDaysAgo: 90, endDaysAgo: 0 }
];

const INITIAL_RANGE_INDEX = 0;

function getRangeDates(rangeOptionIndex: number) {
  const range = RANGE_OPTIONS[rangeOptionIndex];
  const today = new Date().valueOf();

  return {
    startEnd: {
      start: new Date(today - DAY_IN_MS * range.startDaysAgo),
      end: new Date(today - DAY_IN_MS * range.endDaysAgo)
    }
  };
}

export default class Analytics extends React.Component<AnalyticsProps, AnalyticsState> {
  constructor(props: AnalyticsProps) {
    super(props);
    this.state = {
      totalPageViews: 0,
      rangeOptionIndex: INITIAL_RANGE_INDEX,
      ...getRangeDates(INITIAL_RANGE_INDEX),
      loading: true
    };
  }

  handleRangeChange(value: string) {
    const rangeOptionIndex = parseInt(value, 10);

    this.setState({
      rangeOptionIndex,
      ...getRangeDates(rangeOptionIndex)
    });
  }

  updateTotalPageViews(data: ChartData) {
    const totalPageViews = data.rows.reduce((acc, { c }) => acc + c[1].v, 0);

    this.setState({ totalPageViews });
  }

  render() {
    const {
      rangeOptionIndex,
      totalPageViews,
      startEnd: { start, end },
      loading
    } = this.state;
    const { pagePath, viewId, sdk, gapi } = this.props;
    const dimensions = getDateRangeInterval(start, end);
    const formattedPageViews = formatLargeNumbers(totalPageViews);

    return (
      <>
        <div className={styles.header}>
          <div className={loading ? styles.pageViewsLoading : styles.pageViews}>
            <DisplayText size="large">{formattedPageViews}</DisplayText>
            <Paragraph>Pageviews</Paragraph>
          </div>
          <Select
            name="range"
            value={`${rangeOptionIndex}`}
            onChange={event => this.handleRangeChange((event.target as HTMLSelectElement).value)}>
            {RANGE_OPTIONS.map((r, index) => (
              <option key={index} value={`${index}`}>
                {r.label}
              </option>
            ))}
          </Select>
        </div>
        <Timeline
          onData={(d: ChartData) => {
            this.updateTotalPageViews(d);
            this.setState({ loading: false });
          }}
          onQuery={() => this.setState({ loading: true })}
          onError={() => this.setState({ loading: false })}
          pagePath={pagePath}
          start={start}
          end={end}
          dimensions={dimensions}
          sdk={sdk}
          gapi={gapi}
          // remove 'ga:' prefix from view id
          viewId={viewId.replace(/^ga:/, '')}
        />
      </>
    );
  }
}
