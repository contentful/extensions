import React from 'react';
import PropTypes from 'prop-types';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { Heading, Typography, Paragraph } from '@contentful/forma-36-react-components';

import Connect from './Connect';
import Config from './Config';
import OptimizelyLogo from './OptimizelyLogo';
import SectionSplitter from '../EditorPage/subcomponents/section-splitter';
import { VARIATION_CONTAINER_ID } from './constants';

const styles = {
  body: css({
    height: 'auto',
    minHeight: '65vh',
    margin: '0 auto',
    marginTop: tokens.spacingXl,
    padding: `${tokens.spacingXl} ${tokens.spacing2Xl}`,
    maxWidth: tokens.contentWidthText,
    backgroundColor: tokens.colorWhite,
    zIndex: '2',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '2px'
  }),
  background: css({
    display: 'block',
    position: 'absolute',
    zIndex: '-1',
    top: '0',
    width: '100%',
    height: '300px',
    backgroundColor: '#bcc3ca'
  }),
  featuresListItem: css({
    listStyleType: 'disc',
    marginLeft: tokens.spacingM
  }),
  light: css({
    color: tokens.colorTextLight,
    marginTop: tokens.spacingM
  }),
  logo: css({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: tokens.spacingXl,
    marginBottom: tokens.spacingXl
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
    const { space, app } = this.props.sdk;

    const [currentParameters, { items: allContentTypes = [] }] = await Promise.all([
      app.getParameters(),
      space.getContentTypes({ order: 'name', limit: 1000 })
    ]);

    const enabledContentTypes = this.findEnabledContentTypes(allContentTypes);

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(
      prevState => ({
        allContentTypes,
        config: {
          contentTypes: enabledContentTypes,
          optimizelyProjectId: currentParameters
            ? currentParameters.optimizelyProjectId
            : prevState.optimizelyProjectId
        }
      }),
      () => app.setReady()
    );

    app.onConfigure(this.configureApp);
  }

  configureApp = async () => {
    if (!this.props.accessToken) {
      this.props.sdk.notifier.error(`You must be connected to Optimizely to configure the app.`);
      return false;
    }

    const { config } = this.state;

    if (!config.optimizelyProjectId) {
      this.props.sdk.notifier.error(
        'You must provide an Optimizely project id in order to run experiments!'
      );
      return false;
    }

    const needsVariationContainerInSpace = !this.state.allContentTypes.find(
      ct => ct.sys.id === VARIATION_CONTAINER_ID
    );

    if (needsVariationContainerInSpace) {
      await this.createVariationContainerContentType();
    }

    const res = await this.saveEnabledContentTypes(
      this.state.config.contentTypes,
      this.state.allContentTypes
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
      },
      targetState: {
        EditorInterface: {
          [VARIATION_CONTAINER_ID]: { editor: true, sidebar: { position: 0 } }
        }
      }
    };
  };

  createVariationContainerContentType = async () => {
    const variationContainer = await this.props.sdk.space.createContentType({
      sys: {
        id: VARIATION_CONTAINER_ID
      },
      name: 'Variation Container',
      displayField: 'experimentTitle',
      fields: [
        {
          id: 'experimentTitle',
          name: 'Experiment title',
          type: 'Symbol'
        },
        {
          id: 'experimentId',
          name: 'Experiment ID',
          type: 'Symbol'
        },
        {
          id: 'meta',
          name: 'Meta',
          type: 'Object'
        },
        {
          id: 'variations',
          name: 'Variations',
          type: 'Array',
          items: {
            type: 'Link',
            validations: [],
            linkType: 'Entry'
          }
        },
        {
          id: 'experimentKey',
          name: 'Experiment Key',
          type: 'Symbol'
        }
      ]
    });

    await this.props.sdk.space.updateContentType(variationContainer);
  };

  saveEnabledContentTypes = async (contentTypes, allContentTypes) => {
    const copyAllCts = JSON.parse(JSON.stringify(allContentTypes));
    const output = [];

    for (const ct of copyAllCts) {
      let hasChanges = false;

      for (const contentField of ct.fields) {
        const validations =
          contentField.type === 'Array' ? contentField.items.validations : contentField.validations;
        const index = (validations || []).findIndex(v => v.linkContentType);

        if (index > -1) {
          const linkValidations = validations[index];
          const includesVariationContainer = linkValidations.linkContentType.includes(
            VARIATION_CONTAINER_ID
          );

          const fieldsToEnable = contentTypes[ct.sys.id] || {};

          if (!includesVariationContainer && fieldsToEnable[contentField.id]) {
            linkValidations.linkContentType.push(VARIATION_CONTAINER_ID);
            hasChanges = true;
          }

          if (
            includesVariationContainer &&
            (!Object.keys(contentTypes).includes(ct.sys.id) || !fieldsToEnable[contentField.id])
          ) {
            linkValidations.linkContentType = linkValidations.linkContentType.filter(
              lct => lct !== VARIATION_CONTAINER_ID
            );
            hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        output.push(ct);
      }
    }

    if (!output.length) {
      return true;
    }

    const updates = output.map(ct => {
      return this.props.sdk.space.updateContentType(ct);
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
            val.linkContentType.includes(VARIATION_CONTAINER_ID)
          );
          continue;
        }

        if (field.type === 'Link' && field.linkType === 'Entry') {
          output[field.id] =
            field.validations.length === 0 ||
            field.validations.some(val => val.linkContentType.includes(VARIATION_CONTAINER_ID));
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
      <>
        <div className={styles.background} />
        <div className={styles.body}>
          <div>
            <Typography>
              <Heading>Connect Optimizely</Heading>
              {!this.props.client ? (
                <Connect openAuth={this.props.openAuth} />
              ) : (
                <>
                  <Paragraph>You&rsquo;re currently connected to Optimizely.</Paragraph>
                  <Paragraph className={styles.light}>
                    This access token is valid for 2 hours – after this you must reauthorize with
                    Optimizely.
                  </Paragraph>
                </>
              )}
            </Typography>
          </div>
          {!!this.props.client && (
            <>
              <SectionSplitter />
              <Config
                client={this.props.client}
                config={this.state.config}
                updateConfig={this.updateConfig}
                allContentTypes={this.state.allContentTypes}
                sdk={this.props.sdk}
              />
            </>
          )}
        </div>
        <div className={styles.logo}>
          <OptimizelyLogo />
        </div>
      </>
    );
  }
}
