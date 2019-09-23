import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Heading, Typography, Paragraph, TextField } from '@contentful/forma-36-react-components';

import { ConfigurationContent } from './ConfigurationContent';
import { InstallationContent } from './InstallationContent';
import { Divider } from '../Divider';
import { styles } from './styles';

export class AppView extends Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    appIsInstalled: null,
    demoContentTypeName: ''
  };

  async componentDidMount() {
    const { app } = this.props.sdk.platformAlpha;

    const appIsInstalled = await app.isInstalled();

    this.setState({ appIsInstalled });

    if (!appIsInstalled) {
      app.onConfigure(this.installApp);
    }
  }

  installApp = async () => {
    const { demoContentTypeName } = this.state;

    if (!demoContentTypeName) {
      this.props.sdk.notifier.error('Provide a name for the demo content type');
      return false;
    }

    const { sdk } = this.props;
    const contentType = await sdk.space.createContentType({
      name: this.state.demoContentTypeName,
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

  setDemoContentTypeName = evt => this.setState({ demoContentTypeName: evt.target.value });

  render() {
    const { appIsInstalled } = this.state;

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
                  demoContentTypeName={this.state.demoContentTypeName}
                  setDemoContentTypeName={this.setDemoContentTypeName}
                />
              )}
            </Typography>
          </div>
        </div>
        <div className={styles.logo}>
          <img src="https://image.flaticon.com/icons/svg/189/189089.svg" />
        </div>
      </>
    );
  }
}
