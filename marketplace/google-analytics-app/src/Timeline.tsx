/* global gapi */

import * as React from 'react';

import { formatDate } from './utils';
import styles from './styles';
import {
  SkeletonImage,
  TextLink,
  SkeletonContainer,
  Paragraph
} from '@contentful/forma-36-react-components';
import { TimelineProps, TimelineState } from './typings';

const CHART_HEIGHT = 200;
const externalUrlBase = 'https://analytics.google.com/analytics/web/#/report/content-pages';
const externalUrlPageQuery = '_r.drilldown=analytics.pagePath:';

export default class Timeline extends React.Component<TimelineProps, TimelineState> {
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
    const { sdk } = this.props;

    try {
      const accounts = (await gapi.client.analytics.management.accountSummaries.list()) || [];
      viewUrl = this.getExternalUrl(accounts);
    } catch (e) {
      const error = e.result ? e.result.error : e;
      sdk.notifier.error(
        `Google Analytics App couldn't get a link to your dashboard (${error.message})`
      );
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
    timeline.on('error', ({ error }: { error: Error }) => {
      sdk.notifier.error(
        `Google Analytics App couldn't get load your page view data (${error.message})`
      );
    });

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
