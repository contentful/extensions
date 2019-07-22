import React from 'react';
import PropTypes from 'prop-types';

import connectButton from './ConnectButton.svg';
const WINDOW_OPTS = 'left=150,top=150,width=700,height=700';

const url = `https://app.optimizely.com/oauth2/authorize
?client_id=15687650042
&redirect_uri=${encodeURIComponent('http://localhost:1234')}
&response_type=token
&scopes=all`;

function getAccessTokenFromHash(hash) {
  return (
    hash
      .slice(1)
      .split('&')[0]
      .split('=')[1] || null
  );
}

export default class AppPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: '',
    };

    this.authWindow = () => {};

    this.listener = window.addEventListener(
      'message',
      event => {
        const { data, origin } = event;

        if (origin !== 'http://localhost:1234' || !data.hash) {
          return;
        }

        const accessToken = getAccessTokenFromHash(data.hash);

        if (typeof token !== 'string') {
          return;
        }

        this.setState({accessToken});
      },
      false
    );
  }

  openAuth = () => {
    window.open(url, '', WINDOW_OPTS);
  };

  render() {
    const { accessToken } = this.state;

    if (!accessToken) {
      return <button onClick={this.openAuth}>{connectButton}</button>;
    }

    return <div>App Page</div>;
  }
}
