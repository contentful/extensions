import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@contentful/forma-36-react-components';

import styles from './styles';

export default class NetlifyConnection extends Component {
  static propTypes = {
    connected: PropTypes.bool.isRequired,
    email: PropTypes.string,
    netlifyCounts: PropTypes.shape({
      buildable: PropTypes.number.isRequired,
      unavailable: PropTypes.number.isRequired
    }),
    onConnectClick: PropTypes.func.isRequired
  };

  render() {
    return this.props.connected ? this.renderConnectionInfo() : this.renderConnectButton();
  }

  renderConnectButton() {
    return (
      <div className={styles.section}>
        <h3>Netlify account</h3>
        <p>
          Connect your Netlify account so you can trigger builds and view statuses in the Contentful
          Web App.
        </p>
        <Button buttonType="primary" onClick={this.props.onConnectClick}>
          Connect account
        </Button>
      </div>
    );
  }

  renderConnectionInfo() {
    const { unavailable, buildable } = this.props.netlifyCounts;

    return (
      <div className={styles.section}>
        <h3>Netlify account</h3>
        <p>
          Netlify account: <code>{this.props.email}</code>.
        </p>
        {unavailable > 0 && (
          <p>
            {unavailable} sites we can’t build (no Continuous Deployment configuration).{' '}
            <a href="https://app.netlify.com/" target="_blank" rel="noopener noreferrer">
              View more on Netlify
            </a>
          </p>
        )}
        {buildable > 0 && <p>{buildable} sites can be built</p>}
        {buildable < 1 && (
          <p>
            There are no sites we can build. Navigate to the{' '}
            <a href="https://app.netlify.com/" target="_blank" rel="noopener noreferrer">
              Netlify
            </a>{' '}
            to create one!
          </p>
        )}
      </div>
    );
  }
}
