import React from 'react';
import PropTypes from 'prop-types';

import { Typography, Heading, Paragraph, Button } from '@contentful/forma-36-react-components';

import styles from './styles';

export default class NetlifyConnection extends React.Component {
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
    return (
      <Typography className={styles.section}>
        <Heading>Netlify account</Heading>
        {this.props.connected ? this.renderConnectionInfo() : this.renderConnectButton()}
      </Typography>
    );
  }

  renderConnectButton() {
    return (
      <>
        <Paragraph>
          Connect your Netlify account so you can trigger builds and view statuses in the Contentful
          Web App.
        </Paragraph>
        <Paragraph>
          <Button buttonType="primary" onClick={this.props.onConnectClick}>
            Connect account
          </Button>
        </Paragraph>
      </>
    );
  }

  renderConnectionInfo() {
    const { unavailable, buildable } = this.props.netlifyCounts;

    return (
      <>
        <Paragraph>
          Netlify account: <code>{this.props.email}</code>.
        </Paragraph>
        {unavailable > 0 && (
          <Paragraph>
            There are {unavailable} sites we can’t build because they are not configured to use
            continuous deployment.{' '}
            <a href="https://app.netlify.com/" target="_blank" rel="noopener noreferrer">
              View more on Netlify
            </a>
            .
          </Paragraph>
        )}
        {buildable > 0 && <Paragraph>{buildable} sites can be built.</Paragraph>}
        {buildable < 1 && (
          <Paragraph>
            There are no sites that can be built. Navigate to{' '}
            <a href="https://app.netlify.com/" target="_blank" rel="noopener noreferrer">
              Netlify
            </a>{' '}
            to create one!
          </Paragraph>
        )}
      </>
    );
  }
}
