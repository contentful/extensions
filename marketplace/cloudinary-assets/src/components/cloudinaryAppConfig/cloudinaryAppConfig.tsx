import * as React from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';

interface Props {
  sdk: AppExtensionSDK;
}

export default class CloudinaryAppConfig extends React.Component<Props> {
  render() {
    return <div>Cloudinary App Config</div>;
  }
}
