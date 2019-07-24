import React from 'react';
import PropTypes from 'prop-types';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';

import Features from './Features';
import Connect from './Connect';
import Config from './Config';

const styles = {
  body: css({
    margin: '0 auto',
    padding: '0 40px',
    width: '70%'
  }),
  section: css({
    margin: '10px 0'
  }),
  featuresListItem: css({
    listStyleType: 'disc',
    marginLeft: tokens.spacingM
  })
};

export default class AppPage extends React.Component {
  static propTypes = {
    openAuth: PropTypes.func.isRequired,
    accessToken: PropTypes.string,
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      config: null
    };
  }

  async componentDidMount() {
    const { app } = this.props.sdk.platformAlpha;

    const currentParameters = await app.getParameters();

    this.setState({ config: currentParameters });

    app.onConfig(async () => {
      if (this.state.accessToken) {
        this.notifyError('You must be connected to Netlify to configure the app.');
        return false;
      }

      try {
        const currentParameters = await app.getParameters();
        const method = currentParameters ? 'update' : 'install';

        return {
          parameters: {
            optimizelyProjectId: this.state.config,
            somethingElse: 'test'
          }
        };
      } catch (err) {
        this.notifyError(err, 'There is a problem with the configuration, please try agian.');
      }
    });
  }

  notifyError = (err, fallbackMessage) => {
    let message = fallbackMessage || 'Operation failed.';
    if (typeof err === 'string') {
      message = err;
    } else if (err.useMessage && err.message) {
      message = err.message;
    }

    this.props.sdk.notifier.error(message);
  };

  render() {
    return (
      <div className={styles.body}>
        <div className={styles.section}>
          <Features />
        </div>

        <div className={styles.section}>
          {!this.props.accessToken ? <Connect openAuth={this.props.openAuth} /> : <Config />}
        </div>
      </div>
    );
  }
}
