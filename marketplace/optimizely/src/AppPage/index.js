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

function stringifyContentTypeIds(ids) {
  if (!Array.isArray(ids)) {
    return '';
  }

  return ids.filter(x => x).join(',');
}

function configValid({ projectId, contentTypes }) {
  return (
    typeof projectId === 'string' &&
    projectId &&
    Object.keys(contentTypes).length > 0
  );
}

export default class AppPage extends React.Component {
  static propTypes = {
    openAuth: PropTypes.func.isRequired,
    accessToken: PropTypes.string,
    client: PropTypes.object,
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      config: {
        projectId: '',
        contentTypes: {}
      },
      allContentTypes: []
    };
  }

  async componentDidMount() {
    const { app } = this.props.sdk.platformAlpha;

    const currentParameters = await app.getParameters();
    const allContentTypes = await this.props.sdk.space.getContentTypes()
    const method = currentParameters ? 'update' : 'install';

    // eslint-disable-next-line
    if (currentParameters) {
      this.setState({
        config: {
          projectId: currentParameters.projectId,
          contentTypes: JSON.parse(currentParameters.contentTypes)
        }
      });
    }

    this.setState({
      allContentTypes: allContentTypes.items || []
    })

    app.onConfigure(async () => {
      if (!this.props.accessToken) {
        this.notifyError(`You must be connected to Optimizely to ${method} the app.`);
        return false;
      }

      const { config } = this.state;

      if (!configValid(config)) {
        this.notifyError(
          'The configuration is invalid. Please check that a project ID and content types are chosen.'
        );
        return false;
      }

      return {
        parameters: {
          projectId: config.projectId,
          contentTypes: JSON.stringify(config.contentTypes)
        }
      };
    });
  }

  updateConfig = (config) => {
    this.setState(state => ({
      config: {
        ...this.state.config,
        ...config
      }
    }))
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
          {!this.props.client ? 
            <Connect openAuth={this.props.openAuth} /> :
            <Config 
              client={this.props.client}  
              config={this.state.config} 
              updateConfig={this.updateConfig}
              allContentTypes={this.state.allContentTypes}
              sdk={this.props.sdk}
            />}
        </div>
      </div>
    );
  }
}
