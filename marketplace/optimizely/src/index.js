import * as React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { init, locations } from '../../../../ui-extensions-sdk';
import './index.css';
import EditorPage from './EditorPage';
import Sidebar from './Sidebar';
import { IncorrectContentType, isValidContentType, MissingProjectId } from './errors-messages';
import OptimizelyClient from './optimizely-client';
import AppPage from './AppPage';
import '@contentful/forma-36-react-components/dist/styles.css';

function getAccessTokenFromHash(hash) {
  return (
    hash
      .slice(1)
      .split('&')[0]
      .split('=')[1] || null
  );
}

// we can use this for the oauth endpoint,
// if there is a hash with an access token, we will report it and close the page
if (location.hash) {
  const token = getAccessTokenFromHash(location.hash);
  window.opener.postMessage({ token });
  window.close();
}

const HOST = 'http://localhost:1234';

const url = `https://app.optimizely.com/oauth2/authorize
?client_id=15687650042
&redirect_uri=${encodeURIComponent(HOST)}
&response_type=token
&scopes=all`;

const TOKEN_KEY = 'optToken';

export default class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.shape({
      contentType: PropTypes.object.isRequired,
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

    this.state = {
      client: token ? this.makeClient(token) : null,
      accessToken: token
    };

    this.listener = window.addEventListener(
      'message',
      event => {
        const { data, origin } = event;

        if (origin !== HOST || !data.token) {
          return;
        }

        window.localStorage.setItem(TOKEN_KEY, data.token);
        this.setState({ client: this.makeClient(data.token), accessToken: data.token });
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

    if (location.is(locations.LOCATION_APP)) {
      return (
        <AppPage
          openAuth={this.openAuth}
          accessToken={this.state.accessToken}
          sdk={this.props.sdk}
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

      return <EditorPage sdk={sdk} client={client} />;
    }
  }
}

init(sdk => {
  render(<App sdk={sdk} />, document.getElementById('root'));
});

// if (module.hot) {
//   module.hot.accept();
// }
