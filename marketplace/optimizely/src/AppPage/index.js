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
    client: PropTypes.object,
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      config: {
        optimizelyProjectId: '',
        contentTypes: {}
      },
      allContentTypes: []
    };
  }

  async componentDidMount() {
    const { app } = this.props.sdk.platformAlpha;

    const currentParameters = await app.getParameters();
    const { items: allContentTypes = [] } = await this.props.sdk.space.getContentTypes();
    const method = currentParameters ? 'update' : 'install';

    const enabledContentTypes = this.findEnabledContentTypes(allContentTypes);

    // eslint-disable-next-line
    this.setState(prevState => ({
      allContentTypes,
      config: {
        contentTypes: enabledContentTypes,
        optimizelyProjectId: currentParameters
          ? currentParameters.optimizelyProjectId
          : prevState.optimizelyProjectId
      }
    }));

    app.onConfigure(async () => {
      if (!this.props.accessToken) {
        this.props.sdk.notifier.error(`You must be connected to Optimizely to ${method} the app.`);
        return false;
      }

      const { config } = this.state;

      if (!config.optimizelyProjectId) {
        this.props.sdk.notifier.error(
          'You must provide an Optimizely project id in order to run experiments!'
        );
        return false;
      }

      const res = await this.saveEnabledContentTypes(
        this.state.config.contentTypes,
        allContentTypes
      );
      this.props.sdk.space
        .getContentTypes()
        .then(data => this.setState({ allContentTypes: data.items }));

      if (!res) {
        this.props.sdk.notifier.error('Something went wrong, please try again.');
        return false;
      }

      return {
        parameters: {
          optimizelyProjectId: config.optimizelyProjectId
        }
      };
    });
  }

  saveEnabledContentTypes = async (contentTypes, allContentTypes) => {
    const copyAllCts = JSON.parse(JSON.stringify(allContentTypes));
    const output = [];

    for (const ct of copyAllCts) {
      let hasChanges = false;

      for (const contentField of ct.fields) {
        const validations =
          contentField.type === 'Array' ? contentField.items.validations : contentField.validations;
        const index = validations.findIndex(v => v.linkContentType);

        if (index > -1) {
          const linkValidations = validations[index];
          const indexOfVariationContainer = linkValidations.linkContentType.indexOf(
            'variationContainer'
          );

          const fieldsToEnable = contentTypes[ct.sys.id] || {};

          if (indexOfVariationContainer === -1 && fieldsToEnable[contentField.id]) {
            linkValidations.linkContentType.push('variationContainer');
            hasChanges = true;
          }

          if (
            indexOfVariationContainer > -1 &&
            (!Object.keys(contentTypes).includes(ct.sys.id) || !fieldsToEnable[contentField.id])
          ) {
            linkValidations.linkContentType = linkValidations.linkContentType.filter(
              lct => lct !== 'variationContainer'
            );
            hasChanges = true;
          }

          if (hasChanges) {
            output.push(ct);
          }
        }
      }
    }

    if (!output.length) {
      return true;
    }

    const updates = output.map(ct => {
      return this.props.sdk.space.updateContentType({
        ...ct,
        sys: { id: ct.sys.id, version: ct.sys.version }
      });
    });

    try {
      await Promise.all(updates);
      return true;
    } catch (e) {
      return false;
    }
  };

  findEnabledContentTypes = (allContentTypes = []) => {
    return allContentTypes.reduce((acc, ct) => {
      const output = {};

      for (const field of ct.fields) {
        if (field.type === 'Array' && field.items.linkType === 'Entry') {
          output[field.id] = field.items.validations.some(val =>
            val.linkContentType.includes('variationContainer')
          );
          continue;
        }

        if (field.type === 'Link' && field.linkType === 'Entry') {
          output[field.id] =
            field.validations.length === 0 ||
            field.validations.some(val => val.linkContentType.includes('variationContainer'));
        }
      }

      const keys = Object.keys(output);

      if (keys.some(key => output[key])) {
        return { ...acc, [ct.sys.id]: output };
      }

      return acc;
    }, {});
  };

  updateConfig = config => {
    this.setState(state => ({
      config: {
        ...state.config,
        ...config
      }
    }));
  };

  render() {
    return (
      <div className={styles.body}>
        <div className={styles.section}>
          <Features />
        </div>

        <div className={styles.section}>
          {!this.props.client ? (
            <Connect openAuth={this.props.openAuth} />
          ) : (
            <Config
              client={this.props.client}
              config={this.state.config}
              updateConfig={this.updateConfig}
              allContentTypes={this.state.allContentTypes}
              sdk={this.props.sdk}
            />
          )}
        </div>
      </div>
    );
  }
}
