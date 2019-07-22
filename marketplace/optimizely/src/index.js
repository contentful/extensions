import * as React from 'react';
import { render } from 'react-dom';
import { init, locations } from 'contentful-ui-extensions-sdk';
import OptimizelyClient from './optimizely-client';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import App from './app';
import AppSidebar from './app-sidebar';
import {
  IncorrectContentType,
  isValidContentType,
  MissingProjectId
} from './components/errors-messages';

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


export default class AppPage extends React.Component {
  constructor(props) {
    super(props);

    const token = window.localStorage.getItem('optToken');

    this.client = null;

    if (token) {
      this.makeClient(token);
    }

    this.state = {
      accessToken: token,
    };

    this.listener = window.addEventListener(
      'message',
      event => {
        const { data, origin } = event;

        if (origin !== 'http://localhost:1234' || !data.token) {
          return;
        }


        window.localStorage.setItem('optToken', data.token);
        this.makeClient(data.token);
        this.setState({accessToken: data.token});
      },
      false
    );
  }

  makeClient = (token) => {
    this.client = new OptimizelyClient({
      accessToken: token,
      project: this.props.sdk.parameters.installation.optimizelyProjectId
    });
  }

  openAuth = () => {
    const WINDOW_OPTS = 'left=150,top=150,width=700,height=700';
    window.open(url, '', WINDOW_OPTS);
  };

  render() {
    const {sdk} = this.props;
    const { accessToken } = this.state;

    if (!accessToken) {
      return <button onClick={this.openAuth}>connect</button>;
    }

    const { location, parameters } = sdk;

    const project = parameters.installation.optimizelyProjectId;
    const {client} = this;

    if (location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
      return (<AppSidebar sdk={sdk} client={client} />);
    }

    if (location.is(locations.LOCATION_ENTRY_EDITOR)) {
      if (!project) {
        return (<MissingProjectId />);
      }

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
