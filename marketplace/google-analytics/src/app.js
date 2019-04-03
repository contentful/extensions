import React from 'react';
import PropTypes from 'prop-types';

import { Analytics } from './analytics.js';

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

  render() {
    const { isAuthorized, pagePath, hasSlug } = this.state;
    const { auth, entry, parameters } = this.props;
    if (!isAuthorized) {
      return null;
    }

    if (!hasSlug) {
      return <p>Slug field is not correctly defined.</p>;
    }

    if (!entry.getSys().publishedAt) {
      return <p>Nothing to analyze... entry is not published.</p>;
    }

    return (
      <section>
        <Analytics pagePath={pagePath} viewId={parameters.viewId} />
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
