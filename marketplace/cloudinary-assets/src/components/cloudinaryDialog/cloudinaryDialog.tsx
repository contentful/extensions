import * as React from 'react';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { ExtensionParameters } from '../AppConfig/parameters';

interface Props {
  sdk: DialogExtensionSDK;
}

export default class CloudinaryDialog extends React.Component<Props> {
  componentDidMount() {
    const cloudinary = this.loadCloudinaryScript();
    cloudinary.show();
    this.props.sdk.window.updateHeight(window.outerHeight);
  }

  loadCloudinaryScript() {
    // eslint-disable-next-line
    const cloudinary = (window as any).cloudinary;
    const config = this.props.sdk.parameters.invocation as ExtensionParameters;

    const options = {
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      max_files: config.maxFiles,
      multiple: config.maxFiles > 1,
      inline_container: '#root',
      remove_header: true
    };

    return cloudinary.createMediaLibrary(options, {
      // eslint-disable-next-line
      insertHandler: (data: any) => {
        this.props.sdk.close(data);
      }
    });
  }

  render() {
    return <span />;
  }
}
