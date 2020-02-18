import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import tokens from '@contentful/forma-36-tokens';
import { Typography, Heading, Paragraph, Icon } from '@contentful/forma-36-react-components';

const styles = {
  auth: css({
    display: 'flex',
    justifyContent: 'center'
  }),
  button: css({
    backgroundColor: '#00ad9e',
    color: '#fff',
    padding: '12px 80px',
    outline: 'none',
    borderRadius: '6px',
    border: '1px solid #e9ebeb',
    borderBottom: '1px solid #e1e2e4',
    boxShadow: '0 2px 4px 0 rgba(14,30,37,.12)',
    cursor: 'pointer',
    fontSize: '16px',
    boxSizing: 'border-box'
  }),
  splitter: css({
    marginTop: tokens.spacingL,
    marginBottom: tokens.spacingL,
    border: 0,
    height: '1px',
    backgroundColor: tokens.colorElementMid
  }),
  connectAgain: css({
    marginTop: tokens.spacingXs,
    textAlign: 'center',
    color: tokens.colorTextLight
  }),
  connectAgainIcon: css({
    fill: tokens.colorTextLight,
    marginRight: tokens.spacingXs,
    verticalAlign: 'middle'
  })
};

export default class NetlifyConnection extends React.Component {
  static propTypes = {
    connected: PropTypes.bool.isRequired,
    hasConfig: PropTypes.bool.isRequired,
    email: PropTypes.string,
    netlifyCounts: PropTypes.shape({
      buildable: PropTypes.number.isRequired,
      unavailable: PropTypes.number.isRequired
    }),
    onConnectClick: PropTypes.func.isRequired
  };

  render() {
    return (
      <Typography>
        <Heading>Connect Netlify</Heading>
        {this.props.connected ? this.renderConnectionInfo() : this.renderConnectButton()}
        {!this.props.connected && this.props.hasConfig ? this.renderConnectAgainInfo() : null}
      </Typography>
    );
  }

  renderConnectAgainInfo() {
    return (
      <Paragraph className={styles.connectAgain}>
        <Icon icon="Lock" className={styles.connectAgainIcon} />
        Connect account to make changes
      </Paragraph>
    );
  }

  renderConnectButton() {
    return (
      <>
        <Paragraph>
          Connect your Netlify account so you can trigger builds and view statuses in the Contentful
          Web App.
        </Paragraph>
        <div className={styles.auth}>
          <button onClick={this.props.onConnectClick} className={styles.button}>
            Connect account
          </button>
        </div>
      </>
    );
  }

  getSitePlural = count => {
    return count === 1 ? 'site' : 'sites';
  };

  renderConnectionInfo() {
    const { unavailable, buildable } = this.props.netlifyCounts;

    return (
      <>
        <Paragraph>
          Netlify account: <strong>{this.props.email}</strong>
        </Paragraph>
        {unavailable > 0 && (
          <Paragraph>
            There are {unavailable} {this.getSitePlural(unavailable)} we can’t build because they
            are not configured to use continuous deployment.{' '}
            <a href="https://app.netlify.com/" target="_blank" rel="noopener noreferrer">
              View more on Netlify
            </a>
            .
          </Paragraph>
        )}
        {buildable < 1 && (
          <Paragraph>
            You don&rsquo;t have any sites set up to be built on your account. Head over to{' '}
            <a href="https://app.netlify.com/" target="_blank" rel="noopener noreferrer">
              Netlify
            </a>{' '}
            to create one!
          </Paragraph>
        )}
        <hr className={styles.splitter} />
      </>
    );
  }
}
