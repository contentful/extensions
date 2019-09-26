import React, { Component } from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash.camelcase';
import { Heading, Typography, Paragraph } from '@contentful/forma-36-react-components';

import { ConfigurationContent } from './ConfigurationContent';
import { InstallationContent } from './InstallationContent';
import { Divider } from '../Divider';
import { styles } from './styles';

const APP_INSTALLATION_STATE = {
  LOADING: 'LOADING',
  INSTALLED: 'INSTALLED',
  NOT_INSTALLED: 'NOT_INSTALLED'
};

function convertToAppInstallationState(appIsInstalled) {
  return appIsInstalled ? APP_INSTALLATION_STATE.INSTALLED : APP_INSTALLATION_STATE.NOT_INSTALLED;
}

export class AppView extends Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    allContentTypesIds: [],
    appInstallationState: APP_INSTALLATION_STATE.LOADING,
    contentTypeId: camelCase('Image Wrapper'),
    contentTypeName: 'Image Wrapper'
  };

  async componentDidMount() {
    const { sdk } = this.props;
    const { app } = sdk.platformAlpha;

    const appIsInstalled = await app.isInstalled();

    const allContentTypes = await sdk.space.getContentTypes();
    const allContentTypesIds = allContentTypes.items.map(({ sys: { id } }) => id);

    // Following eslint error is caused due to using async/await
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      appInstallationState: convertToAppInstallationState(appIsInstalled),
      allContentTypesIds
    });

    if (!appIsInstalled) {
      app.onConfigure(this.installApp);
    }
  }

  installApp = async () => {
    const { allContentTypesIds, contentTypeId, contentTypeName } = this.state;

    if (!contentTypeName) {
      this.props.sdk.notifier.error('Provide a name for the content type.');
      return false;
    }

    const isContentTypeIdTaken = allContentTypesIds.includes(contentTypeId);
    if (isContentTypeIdTaken) {
      this.props.sdk.notifier.error(
        `ID "${contentTypeId}" is taken. Try a different name for the content type`
      );
      return false;
    }

    const { sdk } = this.props;
    const contentType = await sdk.space
      .createContentType({
        sys: {
          id: contentTypeId
        },
        name: contentTypeName,
        fields: [
          {
            id: 'title',
            name: 'Title',
            required: true,
            type: 'Symbol'
          },
          {
            id: 'image',
            name: 'Image',
            required: true,
            type: 'Link',
            linkType: 'Asset'
          },
          {
            id: 'imageMetadata',
            name: 'Image metadata',
            required: true,
            type: 'Object'
          }
        ]
      })
      .catch(() =>
        this.props.sdk.notifier.error(`Failed to create content type "${contentTypeName}"`)
      );

    // Set the newly created content type's state to "Published"
    await sdk.space
      .updateContentType(contentType)
      .catch(() =>
        this.props.sdk.notifier.error(`Failed to publish content type "${contentTypeName}"`)
      );

    // TODO: hack that determines when the app has been successfully installed.
    // To be done away with once the post installation hook is implemented.
    const appIsInstalledInterval = setInterval(async () => {
      const appIsInstalled = await sdk.platformAlpha.app.isInstalled();

      if (
        appIsInstalled &&
        this.state.appInstallationState === APP_INSTALLATION_STATE.NOT_INSTALLED
      ) {
        this.setState({ appInstallationState: convertToAppInstallationState(appIsInstalled) });
        clearInterval(appIsInstalledInterval);
      }
    }, 100);

    return {
      targetState: {
        EditorInterface: {
          [contentType.sys.id]: {
            controls: [
              {
                fieldId: 'imageMetadata',
                settings: {
                  imageFieldId: 'image'
                }
              }
            ]
          }
        }
      }
    };
  };

  setContentTypeName = ({ target: { value } }) =>
    this.setState({
      contentTypeId: camelCase(value),
      contentTypeName: value
    });

  render() {
    const { appInstallationState, allContentTypesIds, contentTypeId, contentTypeName } = this.state;

    return (
      <>
        <div className={styles.background} />
        <div className={styles.body}>
          <Typography>
            <Heading className={styles.heading}>About Image Wrapper</Heading>
            <Paragraph>
              This app assists you in managing image uploads that need to have metadata associated
              with them (e.g. a focal point for better cropping, tags, alt text).
            </Paragraph>
            <Divider />
            {appInstallationState === APP_INSTALLATION_STATE.INSTALLED && <ConfigurationContent />}
            {appInstallationState === APP_INSTALLATION_STATE.NOT_INSTALLED && (
              <InstallationContent
                allContentTypesIds={allContentTypesIds}
                contentTypeId={contentTypeId}
                contentTypeName={contentTypeName}
                setContentTypeName={this.setContentTypeName}
              />
            )}
          </Typography>
        </div>
        <div className={styles.logo}>
          <img src="https://image.flaticon.com/icons/svg/189/189089.svg" alt="logo" />
        </div>
      </>
    );
  }
}
