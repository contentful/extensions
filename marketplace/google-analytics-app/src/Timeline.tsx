import * as React from 'react';
import { formatDate } from './utils';
import styles from './styles';
import {
  SkeletonImage,
  TextLink,
  SkeletonContainer,
  Paragraph
} from '@contentful/forma-36-react-components';
import { TimelineProps, TimelineState, ChartData, AccountsSummary, DataChart } from './typings';

const CHART_HEIGHT = 200;
const externalUrlBase = 'https://analytics.google.com/analytics/web/#/report/content-pages';
const externalUrlPageQuery = '_r.drilldown=analytics.pagePath:';

export default class Timeline extends React.Component<TimelineProps, TimelineState> {
  timeline!: HTMLElement;
  dataChart!: DataChart;

  onSuccess = ({ data }: { data: ChartData }) => {
    this.setState({ loading: false });
    this.props.onData(data);
  };

  onError = ({ error }: { error: Error }) => {
    this.setState({ loading: false });
    this.props.sdk.notifier.error(
      `Google Analytics App couldn't get load your page view data (${error.message})`
    );
    this.props.onError();
  };

  constructor(props: TimelineProps) {
    super(props);
    this.state = {
      viewUrl: '',
      loading: true
    };
  }

  async componentDidMount() {
    let viewUrl = '';
    const { sdk, gapi } = this.props;

    try {
      const accounts = (await gapi.client.analytics.management.accountSummaries.list()) || [];
      viewUrl = this.getExternalUrl(accounts);
    } catch (e) {
      const error = e.result ? e.result.error : e;
      sdk.notifier.error(
        `Google Analytics App couldn't get a link to your dashboard (${error.message})`
      );
    }

    const dataChart = new gapi.analytics.googleCharts.DataChart({
      reportType: 'ga',
      chart: {
        type: 'LINE',
        container: this.timeline,
        options: {
          width: window.innerWidth,
          height: CHART_HEIGHT,
          backgroundColor: 'transparent',
          legend: 'none',
          margin: 0
        }
      }
    });

    dataChart.on('success', this.onSuccess);
    dataChart.on('error', this.onError);

    // eslint-disable-next-line
    this.setState({ viewUrl });
    this.dataChart = dataChart;
    this.updateTimeline();
  }

  componentDidUpdate(prevProps: TimelineProps) {
    const chartQueryKeys = ['dimensions', 'start', 'end', 'pagePath'] as const;

    for (const key of chartQueryKeys) {
      if (this.props[key] !== prevProps[key]) {
        this.updateTimeline();
        break;
      }
    }
  }

  updateTimeline() {
    if (!this.dataChart) {
      return;
    }

    const { dimensions, start, end, pagePath, viewId } = this.props;

    const query = {
      ids: `ga:${viewId}`,
      dimensions: `ga:${dimensions}`,
      metrics: 'ga:pageViews',
      filters: `ga:pagePath==${pagePath}`,
      'start-date': formatDate(start),
      'end-date': formatDate(end)
    };

    this.dataChart.set({ query }).execute();
    this.setState({ loading: true });
    this.props.onQuery();
  }

  getExternalUrl(accounts: AccountsSummary) {
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
    const { pagePath } = this.props;
    const { loading, viewUrl } = this.state;

    return (
      <div className={styles.timeline}>
        <div
          ref={(c: HTMLDivElement) => {
            this.timeline = c;
          }}
          className={`${loading ? styles.invisible : ''} ${styles.timelineChart}`}
        />
        <SkeletonContainer className={loading ? styles.timelineSkeleton : styles.hidden}>
          <SkeletonImage width={window.innerWidth} height={CHART_HEIGHT} />
        </SkeletonContainer>
        {this.dataChart ? (
          <>
            <Paragraph className={styles.slug}>{pagePath}</Paragraph>
            {viewUrl ? (
              <TextLink href={viewUrl} target="blank" icon="ExternalLink">
                Open in Google Analytics
              </TextLink>
            ) : null}
          </>
        ) : null}
      </div>
    );
  }
}
