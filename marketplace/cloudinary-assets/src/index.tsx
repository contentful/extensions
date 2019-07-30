import 'es6-promise/auto';

import * as React from 'react';
import { render } from 'react-dom';

import {
  init,
  locations,
  FieldExtensionSDK,
  DialogExtensionSDK,
  AppExtensionSDK
} from 'contentful-ui-extensions-sdk';

import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';

import CloudinaryDialog from './components/cloudinaryDialog/cloudinaryDialog';
import CloudinaryField from './components/cloudinaryField/cloudinaryField';
import ClodudinaryAppConfig from './components/cloudinaryAppConfig/cloudinaryAppConfig';

init(sdk => {
  const root = document.getElementById('root');

  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    render(<CloudinaryDialog sdk={sdk as DialogExtensionSDK} />, root);
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    render(<CloudinaryField sdk={sdk as FieldExtensionSDK} />, root);
  } else if (sdk.location.is(locations.LOCATION_APP)) {
    render(<ClodudinaryAppConfig sdk={sdk as AppExtensionSDK} />, root);
  }
});
