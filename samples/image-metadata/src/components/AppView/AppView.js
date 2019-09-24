import React, { Component } from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash.camelcase';
import { Heading, Typography, Paragraph } from '@contentful/forma-36-react-components';

import { ConfigurationContent } from './ConfigurationContent';
import { InstallationContent } from './InstallationContent';
import { Divider } from '../Divider';
import { styles } from './styles';

export class AppView extends Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    allContentTypesIds: [],
    appIsInstalled: null,
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
    this.setState({ appIsInstalled, allContentTypesIds });

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
        `Id "${contentTypeId}" is taken. Try a different name for the content type`
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

    this.setState({ appIsInstalled: true });

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
    const { appIsInstalled, allContentTypesIds, contentTypeId, contentTypeName } = this.state;

    return (
      <>
        <div className={styles.background} />
        <div className={styles.body}>
          <div>
            <Typography>
              <Heading className={styles.heading}>About Image Wrapper</Heading>
              <Paragraph>
                This app assists you in managing image uploads that need to have metadata associated
                with them (e.g. a focal point for better cropping, tags, alt text).
              </Paragraph>
              <Divider />
              {appIsInstalled && <ConfigurationContent />}
              {!appIsInstalled && (
                <InstallationContent
                  allContentTypesIds={allContentTypesIds}
                  contentTypeId={contentTypeId}
                  contentTypeName={contentTypeName}
                  setContentTypeName={this.setContentTypeName}
                />
              )}
            </Typography>
          </div>
        </div>
        <div className={styles.logo}>
          <img src="https://image.flaticon.com/icons/svg/189/189089.svg" alt="logo" />
        </div>
      </>
    );
  }
}
