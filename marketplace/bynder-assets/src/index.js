import React from 'react';
import ReactDOM from 'react-dom';

import { init, locations } from 'contentful-ui-extensions-sdk';

import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';

import BynderDialog from './BynderDialog';
import Field from './Field';
import AppConfig from './AppConfig';

init(sdk => {
  const root = document.getElementById('root');

  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(<BynderDialog sdk={sdk} />, root);
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    ReactDOM.render(<Field sdk={sdk} />, root);
  } else if (sdk.location.is(locations.LOCATION_APP)) {
    ReactDOM.render(<AppConfig sdk={sdk} />, root);
  }
});
