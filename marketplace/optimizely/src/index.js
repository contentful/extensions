import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { init, locations } from 'contentful-ui-extensions-sdk';
import './index.css';
import EditorPage from './EditorPage';
import Sidebar from './Sidebar';
import { IncorrectContentType, isValidContentType, MissingProjectId } from './errors-messages';
import OptimizelyClient from './optimizely-client';
import AppPage from './AppPage';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import 'whatwg-fetch';

function parseHash(hash) {
  return hash
    .slice(1)
    .split('&')
    .reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      acc[key] = value;
      return acc;
    }, {});
}

function getTokenExpirationTime(expires) {
  return Date.now() + parseInt(expires, 10) * 1000;
}

// we can use this for the oauth endpoint,
// if there is a hash with an access token, we will report it and close the page
if (window.location.hash) {
  const { access_token = null, expires_in = null } = parseHash(window.location.hash);
  const expireTime = getTokenExpirationTime(expires_in);

  window.opener.postMessage({ token: access_token, expires: expireTime }, '*');
  window.close();
}

const OPTIMIZELY_CLIENT_APP_ID = '15687650042';
const HOST = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

const url = `https://app.optimizely.com/oauth2/authorize
?client_id=${OPTIMIZELY_CLIENT_APP_ID}
&redirect_uri=${window.encodeURIComponent(HOST)}
&response_type=token
&scopes=all`;

const TOKEN_KEY = 'optToken';
const TOKEN_EXPIRATION = 'optExpire';

export default class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.shape({
      contentType: PropTypes.object,
      location: PropTypes.shape({
        is: PropTypes.func.isRequired
      }),
      parameters: PropTypes.shape({
        installation: PropTypes.shape({
          optimizelyProjectId: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);

    const token = window.localStorage.getItem(TOKEN_KEY);
    const expires = window.localStorage.getItem(TOKEN_EXPIRATION);

    this.state = {
      client: token ? this.makeClient(token) : null,
      accessToken: token,
      expires
    };

    this.listener = window.addEventListener(
      'message',
      event => {
        const { data, origin } = event;
        const { token, expires } = data;

        if (`${origin}${window.location.pathname}` !== HOST || !token) {
          return;
        }

        window.localStorage.setItem(TOKEN_KEY, token);
        window.localStorage.setItem(TOKEN_EXPIRATION, expires);
        this.setState({ client: this.makeClient(data.token), accessToken: token, expires });
      },
      false
    );
  }

  makeClient = token => {
    return new OptimizelyClient({
      accessToken: token,
      project: this.props.sdk.parameters.installation.optimizelyProjectId,
      onReauth: () => {
        this.setState({ client: null });
      }
    });
  };

  openAuth = () => {
    const WINDOW_OPTS = 'left=150,top=150,width=700,height=700';
    window.open(url, '', WINDOW_OPTS);
  };

  render() {
    const { state, props } = this;
    const { sdk } = props;
    const { client } = state;
    const { location, parameters } = sdk;

    if (location.is(locations.LOCATION_APP_CONFIG)) {
      return (
        <AppPage
          openAuth={this.openAuth}
          accessToken={this.state.accessToken}
          sdk={this.props.sdk}
          client={this.state.client}
        />
      );
    }

    if (location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
      if (!parameters.installation.optimizelyProjectId) {
        return <MissingProjectId />;
      }

      return <Sidebar sdk={sdk} />;
    }

    if (location.is(locations.LOCATION_ENTRY_EDITOR)) {
      const [valid, missingFields] = isValidContentType(sdk.contentType);

      if (!valid) {
        return <IncorrectContentType sdk={sdk} missingFields={missingFields} />;
      }

      return (
        <EditorPage
          sdk={sdk}
          client={client}
          openAuth={this.openAuth}
          expires={this.state.expires}
        />
      );
    }
  }
}

init(sdk => {
  render(<App sdk={sdk} />, document.getElementById('root'));
});
