import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@contentful/forma-36-react-components';

import { Timeline } from './Timeline';
import { formatDate } from './utils';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const TODAY = new Date();
const TIMELINE_DIMENSIONS = [
  { label: 'Day', value: 'date' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
];

export default class Analytics extends React.Component<{
  // sdk: SidebarExtensionSDK;
  pagePath: string;
  viewId: string;
}> {
  constructor(props) {
    super(props);
    this.state = {
      range: {
        start: new Date(TODAY - DAY_IN_MS * 14),
        end: TODAY
      },
      dimension: 'date'
    };
  }

  handleDateChange({ target }) {
    const { range } = this.state;
    range[target.name] = target.valueAsDate;
    this.setState({
      range
    });
  }

  handleDimensionChange({ target }) {
    this.setState({
      dimension: target.value
    });
  }

  render() {
    const { range, dimension } = this.state;
    const { pagePath, viewId } = this.props;

    return (
      <React.Fragment>
        <div className="range">
          <label>
            From
            <input
              name="start"
              type="date"
              onChange={this.handleDateChange.bind(this)}
              value={formatDate(range.start)}
            />
          </label>
          <label>
            To
            <input
              name="end"
              type="date"
              onChange={this.handleDateChange.bind(this)}
              value={formatDate(range.end)}
              max={formatDate(TODAY)}
            />
          </label>
        </div>
        <div className="dimensions">
          {TIMELINE_DIMENSIONS.map(dimension => {
            const isActive = dimension.value === this.state.dimension;
            return (
              <label key={dimension.value} className={isActive ? 'is-active' : ''}>
                {dimension.label}
                <input
                  type="radio"
                  name="dimension"
                  value={dimension.value}
                  onChange={this.handleDimensionChange.bind(this)}
                  checked={isActive}
                />
              </label>
            );
          })}
        </div>
        <Timeline pagePath={pagePath} range={range} dimension={dimension} viewId={viewId} />
        <div className="info">
          <Icon icon="InfoCircle" /> {pagePath}
        </div>
      </React.Fragment>
    );
  }
}

Analytics.propTypes = {
  pagePath: PropTypes.string.isRequired,
  viewId: PropTypes.string.isRequired
  // sdk: PropTypes.object.isRequired
};
