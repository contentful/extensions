import * as React from 'react';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import * as crypto from 'sjcl';
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
    this.loadCloudinaryScript();
    this.props.sdk.window.updateHeight(window.outerHeight);
  }

  loadCloudinaryScript() {
    const cloudinary = (window as any).cloudinary;

    const hash = new crypto.hash.sha256();
    const now = Math.floor(Date.now() / 1000);
    const rawSignature = `cloud_name=${this.state.config.cloudName}&timestamp=${now}&username=${this.state.config.username}${this.state.config.apiKeySecret}`;
    const data = hash.update(rawSignature).finalize();
    const signature = crypto.codec.hex.fromBits(data);

    cloudinary.openMediaLibrary(
      {
        cloud_name: this.state.config.cloudName,
        api_key: this.state.config.apiKey,
        username: this.state.config.username,
        timestamp: now,
        signature,
        max_files: this.state.config.maxFiles,
        multiple: this.state.config.maxFiles > 1,
        inline_container: '#root',
        remove_header: true,
        asset: {
          resource_type: this.state.config.resourceType
        },
        folder: this.state.config.folder !== '/' ? { path: this.state.config.folder } : undefined
      },
      {
        insertHandler: data => {
          this.props.sdk.close(data);
        }
      }
    );
  }

  render() {
    return <span></span>;
  }
}
