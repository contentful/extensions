import * as React from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';
import { init, locations } from 'contentful-ui-extensions-sdk';
import { Button } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import App from './app';
import AppSidebar from './app-sidebar';
import {
  IncorrectContentType,
  isValidContentType,
  MissingProjectId
} from './components/errors-messages';
import ConnectButton from './ConnectButton';
import OptimizelyClient from './optimizely-client';

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
  window.opener.postMessage({token});
  window.close();
}

const url = `https://app.optimizely.com/oauth2/authorize
?client_id=15687650042
&redirect_uri=${encodeURIComponent('http://localhost:1234')}
&response_type=token
&scopes=all`;

const TOKEN_KEY = 'optToken';

const styles = {
  connect: css({
    display: 'flex',
    alignItems: 'center',
  }),
};

export default class AppPage extends React.Component {
  constructor(props) {
    super(props);

    const token = window.localStorage.getItem(TOKEN_KEY);

    this.state = {
      client: token ? this.makeClient(token) : null,
    }

    this.listener = window.addEventListener(
      'message',
      event => {
        const { data, origin } = event;

        if (origin !== 'http://localhost:1234' || !data.token) {
          return;
        }


        window.localStorage.setItem(TOKEN_KEY, data.token);
        this.setState({client: this.makeClient(data.token)});
      },
      false
    );
  }

  componentDidMount() {
    if (!this.client) {
      const checkForToken = setInterval(() => {
        const token = window.localStorage.getItem(TOKEN_KEY);

        if (token) {
          this.setState({client: this.makeClient(token)});
          clearInterval(checkForToken);
        }
      }, 1000);
    }
  }

  makeClient = (token) => {
    return new OptimizelyClient({
      accessToken: token,
      project: this.props.sdk.parameters.installation.optimizelyProjectId,
      onReauth: () => {
        this.setState({client: null});
      }
    });
  }

  openAuth = () => {
    const WINDOW_OPTS = 'left=150,top=150,width=700,height=700';
    window.open(url, '', WINDOW_OPTS);
  };

  render() {
    const {state, props} = this;
    const {sdk} = props;
    const {client} = state; 
    const { location, parameters } = sdk;

    if (location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
      if (!parameters.installation.optimizelyProjectId) {
        return (<MissingProjectId />);
      }

      return (<AppSidebar sdk={sdk} />);
    }

    if (!client) {
      return (
        <Button onClick={this.openAuth} isFullWidth>
          <div className={styles.connect}>
            <ConnectButton />&nbsp;
            Connect with Optimizely
          </div>
        </Button>

      );
    }

    if (location.is(locations.LOCATION_ENTRY_EDITOR)) {
      const [valid, missingFields] = isValidContentType(sdk.contentType);

      if (!valid) {
        return (<IncorrectContentType sdk={sdk} missingFields={missingFields} />);
      }

      return (<App sdk={sdk} client={client} />);
    }
  }
}

init(sdk => {
  render(<AppPage sdk={sdk}/>, document.getElementById('root'));
});

// if (module.hot) {
//   module.hot.accept();
// }
