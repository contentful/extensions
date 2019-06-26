import * as React from 'react';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { ExtensionParameters } from '../../interface';

interface Props {
  sdk: DialogExtensionSDK;
}

interface State {
  config: ExtensionParameters;
}

export default class CloudinaryDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      config: props.sdk.parameters.invocation as any
    };
  }

  componentDidMount() {
    const cloudinary = this.loadCloudinaryScript();
    cloudinary.show();
    this.props.sdk.window.updateHeight(window.outerHeight);
  }

  loadCloudinaryScript() {
    const cloudinary = (window as any).cloudinary;

    const options = {
      cloud_name: this.state.config.cloudName,
      api_key: this.state.config.apiKey,
      max_files: this.state.config.maxFiles,
      multiple: this.state.config.maxFiles > 1,
      inline_container: '#root',
      remove_header: true
    };

    return cloudinary.createMediaLibrary(options, {
      insertHandler: data => {
        this.props.sdk.close(data);
      }
    });
  }

  render() {
    return <span></span>;
  }
}
