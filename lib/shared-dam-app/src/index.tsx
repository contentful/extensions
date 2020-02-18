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

import Field from './Editor/Field';
import AppConfig from './AppConfig/AppConfig';

import { Integration } from './interfaces';

export function setup(integration: Integration) {
  init(sdk => {
    const root = document.getElementById('root');

    if (sdk.location.is(locations.LOCATION_DIALOG)) {
      integration.renderDialog(sdk as DialogExtensionSDK);
    }

    if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
      render(
        <Field
          sdk={sdk as FieldExtensionSDK}
          cta={integration.cta}
          logo={integration.logo}
          makeThumbnail={integration.makeThumbnail}
          openDialog={integration.openDialog}
          isDisabled={integration.isDisabled}
        />,
        root
      );
    }

    if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
      render(
        <AppConfig
          name={integration.name}
          sdk={sdk as AppExtensionSDK}
          parameterDefinitions={integration.parameterDefinitions}
          validateParameters={integration.validateParameters}
          logo={integration.logo}
          color={integration.color}
          description={integration.description}
        />,
        root
      );
    }
  });
}
