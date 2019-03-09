import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@contentful/forma-36-react-components';

import { Timeline } from './timeline.js';
import { formatDate } from './utils.js';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const TODAY = new Date();
const TIMELINE_DIMENSIONS = [
  { label: 'Day', value: 'date' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
];
const CLIENT_ID = '318721834234-s3td95ohvub1bkksn3aicimnltvmtts8.apps.googleusercontent.com';

class App extends React.Component {
  constructor(props) {
    super(props);
    const { parameters, entry } = props;
    const { prefix, slugId } = parameters;
    const hasSlug = slugId in entry.fields;

    const pagePath = hasSlug
      ? `/${prefix ? `${prefix}/` : ''}${entry.fields[slugId].getValue()}/`
      : '';
    this.state = {
      isAuthorized: false,
      hasSlug,
      range: {
        start: new Date(TODAY - DAY_IN_MS * 14),
        end: TODAY
      },
      dimension: 'date',
      pagePath
    };
  }

  componentDidMount() {
    const { auth } = this.props;
    auth.on('signIn', () => this.setState({ isAuthorized: true }));
    auth.on('signOut', () => this.setState({ isAuthorized: false }));
    auth.authorize({
      container: 'auth-button',
      clientid: CLIENT_ID
    });
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
    const { range, dimension, isAuthorized, pagePath, hasSlug } = this.state;
    const { auth, entry, parameters } = this.props;
    if (!isAuthorized) {
      return <p>Not logged in</p>;
    }

    if (!hasSlug) {
      return <p>Slug field is not correctly defined.</p>;
    }

    if (!entry.getSys().publishedAt) {
      return <p>Nothing to analyze... entry is not published.</p>;
    }

    return (
      <section>
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
        <Timeline
          pagePath={pagePath}
          range={range}
          dimension={dimension}
          viewId={parameters.viewId}
        />
        <div className="info">
          <Icon icon="InfoCircle" /> {pagePath}
        </div>
        <div className="signout">
          <button type="button" onClick={() => auth.signOut()}>
            sign out
          </button>
        </div>
      </section>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
  parameters: PropTypes.object.isRequired,
  entry: PropTypes.object.isRequired
};

export { App };
