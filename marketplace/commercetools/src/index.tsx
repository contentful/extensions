import './vendor/ct-picker.min.js';
import 'es6-promise/auto';

import * as React from 'react';
import { render } from 'react-dom';
import { renderDialog } from './renderDialog';

import {
  init,
  locations,
  FieldExtensionSDK,
  DialogExtensionSDK,
  AppExtensionSDK
} from 'contentful-ui-extensions-sdk';

import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';

import Field from './Editor/Field';
import AppConfig from './AppConfig/AppConfig';

init(sdk => {
  const root = document.getElementById('root');

  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    renderDialog(sdk as DialogExtensionSDK);
  }

  if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    render(<Field sdk={sdk as FieldExtensionSDK} />, root);
  }

  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    render(<AppConfig sdk={sdk as AppExtensionSDK} />, root);
  }
});
