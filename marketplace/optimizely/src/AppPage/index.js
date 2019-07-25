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

function parseContentTypeIds(idString) {
  return idString.trim().split(',');
}

function configValid({ projectId, contentTypeIds }) {
  return (
    typeof projectId === 'string' &&
    projectId &&
    Array.isArray(contentTypeIds) &&
    contentTypeIds.every(id => typeof id === 'string')
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
        contentTypeIds: []
      },
      allContentTypes: []
    };
  }

  async componentDidMount() {
    const { app } = this.props.sdk.platformAlpha;

    const currentParameters = await app.getParameters();
    const method = currentParameters ? 'update' : 'install';

    // eslint-disable-next-line
    if (currentParameters) {
      this.setState({
        config: {
          projectId: currentParameters.projectId,
          contentTypeIds: parseContentTypeIds(currentParameters.contentTypeIds || '')
        }
      });
    }

    const allContentTypes = await this.props.sdk.space.getContentTypes()
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
          contentTypeIds: stringifyContentTypeIds(config.contentTypeIds)
        }
      };
    });
  }

  updateConfig = (projectId, contentTypeIds) => {
    this.setState({
      config: {
        projectId,
        contentTypeIds
      }
    });
  };

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
