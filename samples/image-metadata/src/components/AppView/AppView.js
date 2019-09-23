import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Heading, Typography, Paragraph } from '@contentful/forma-36-react-components';

import { Divider } from '../Divider';
import { styles } from './styles';

export class AppView extends Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    spaceContentTypes: []
  };

  async componentDidMount() {
    const { app } = this.props.sdk.platformAlpha;

    const spaceContentTypes = await this.props.sdk.space.getContentTypes();

    this.setState({
      spaceContentTypes
    });

    const appIsInstalled = await app.isInstalled();

    if (!appIsInstalled) {
      app.onConfigure(this.installApp);
    }
  }

  installApp = async () => {
    const { sdk } = this.props;
    const contentType = await sdk.space.createContentType({
      name: 'Image Wrapper',
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
    });

    // Set the newly created content type's state to "Published"
    await sdk.space.updateContentType(contentType);

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

  render() {
    return (
      <>
        <div className={styles.background} />
        <div className={styles.body}>
          <div>
            <Typography>
              <Heading>Image metadata app</Heading>
              <Paragraph>
                This app facilitates the enhancement of your uploaded images with different sorts of
                metadata. At the moment, it enables you to set a focal point for your uploaded image
                to achieve better cropping of the asset among different devices.
              </Paragraph>
            </Typography>
          </div>
          <Divider />
        </div>
        <div className={styles.logo}>
          <img src="https://image.flaticon.com/icons/svg/189/189089.svg" />
        </div>
      </>
    );
  }
}
