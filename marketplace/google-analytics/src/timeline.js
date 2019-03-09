/* global gapi */

import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from './utils.js';

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeline: null
    };
  }
  componentDidMount() {
    this.setState({
      timeline: new gapi.analytics.googleCharts.DataChart({
        reportType: 'ga',
        chart: {
          type: 'LINE',
          container: this.timeline,
          options: {
            width: '100%',
            backgroundColor: '#f7f9fa'
          }
        }
      })
    });
  }
  render() {
    const { range, dimension, pagePath, viewId } = this.props;
    if (this.state.timeline) {
      this.state.timeline
        .set({
          query: {
            ...{
              ids: viewId,
              dimensions: `ga:${dimension}`,
              metrics: 'ga:sessions',
              filters: `ga:pagePath==${pagePath}`
            },
            'start-date': formatDate(range.start),
            'end-date': formatDate(range.end)
          }
        })
        .execute();
    }

    return <div ref={c => (this.timeline = c)} />;
  }
}

Timeline.propTypes = {
  viewId: PropTypes.string.isRequired,
  dimension: PropTypes.string.isRequired,
  pagePath: PropTypes.string.isRequired,
  range: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired
  }).isRequired
};

export { Timeline };
