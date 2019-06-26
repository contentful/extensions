import 'whatwg-fetch';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { init, locations } from 'contentful-ui-extensions-sdk';

import { CommerceToolsField } from './field.js';
import { CommerceToolsDialog } from './dialog.js';

init(extension => {
  const installationParameters = extension.parameters.installation;
  extension.window.startAutoResizer();

  if (extension.location.is(locations.LOCATION_ENTRY_FIELD)) {
    ReactDOM.render(
      <CommerceToolsField
        extension={extension}
        parameters={installationParameters}
        isSingle={extension.field.type === 'Symbol'}
      />,
      document.getElementById('root')
    );
  } else if (extension.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(
      <CommerceToolsDialog
        extension={extension}
        parameters={installationParameters}
        isSingle={extension.parameters.invocation.isSingle}
      />,
      document.getElementById('root')
    );
  }
});
