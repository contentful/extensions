/* global gapi */

import * as React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from './utils';
import styles from './styles';
import {
  SkeletonImage,
  TextLink,
  SkeletonContainer,
  Paragraph
} from '@contentful/forma-36-react-components';

const CHART_HEIGHT = 200;
const externalUrlBase = 'https://analytics.google.com/analytics/web/#/report/content-pages';
const externalUrlPageQuery = '_r.drilldown=analytics.pagePath:';

export default class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeline: null,
      viewUrl: null
    };

    this.onSuccess = ({ data }) => this.props.onData(data);
  }

  shouldComponentUpdate(nextProps) {
    const { start, end } = this.props.range;
    const nextRange = nextProps.range;

    return !this.state.timeline || nextRange.start !== start || nextRange.end !== end;
  }

  async componentDidMount() {
    let viewUrl = '';

    try {
      const accounts = (await gapi.client.analytics.management.accountSummaries.list()) || [];
      viewUrl = this.getExternalUrl(accounts);
      // console.log(accounts)
    } catch (error) {
  this.props.sdk.notifier.error('Failed to load your Google Analytics data');
    }

    const timeline = new gapi.analytics.googleCharts.DataChart({
      reportType: 'ga',
      chart: {
        type: 'LINE',
        container: this.timeline,
        options: {
          width: '100%',
          height: CHART_HEIGHT,
          backgroundColor: 'transparent',
          legend: false
        }
      }
    });

    timeline.on('success', this.onSuccess);

    // eslint-disable-next-line
    this.setState({ timeline, viewUrl });
  }

  getExternalUrl(accounts) {
    for (const account of accounts.result.items) {
      for (const prop of account.webProperties) {
        for (const view of prop.profiles) {
          if (view.id === this.props.viewId) {
            const encodedPagePath = encodeURIComponent(this.props.pagePath).replace(/%/g, '~');
            return `${externalUrlBase}/a${account.id}w${prop.internalWebPropertyId}p${view.id}/${externalUrlPageQuery}${encodedPagePath}/`;
          }
        }
      }
    }

    return '';
  }

  render() {
    const { range, dimension, pagePath, viewId } = this.props;
    const { timeline, viewUrl } = this.state;
    const query = {
      ids: `ga:${viewId}`,
      dimensions: `ga:${dimension}`,
      metrics: 'ga:pageViews',
      filters: `ga:pagePath==${pagePath}`,
      'start-date': formatDate(range.start),
      'end-date': formatDate(range.end)
    };

    if (timeline) {
      timeline.set({ query }).execute();
    }

    return (
      <div>
        <div
          ref={c => {
            this.timeline = c;
          }}
          className={styles.timeline}
        />
        {timeline ? (
          <>
            <Paragraph className={styles.slug}>{pagePath}</Paragraph>
            {viewUrl ? (
              <TextLink href={viewUrl} target="blank" icon="ExternalLink">
                Open in Google Analytics
              </TextLink>
            ) : null}
          </>
        ) : (
          <SkeletonContainer>
            <SkeletonImage width={window.innerWidth} height={CHART_HEIGHT} />
          </SkeletonContainer>
        )}
      </div>
    );
  }
}

Timeline.propTypes = {
  viewId: PropTypes.string.isRequired,
  dimension: PropTypes.oneOf(['hour', 'date', 'week', 'month']).isRequired,
  pagePath: PropTypes.string.isRequired,
  range: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired
  }).isRequired,
  onData: PropTypes.func
};
