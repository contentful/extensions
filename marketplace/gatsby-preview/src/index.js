import React from 'react';
import { render } from 'react-dom';

import { init, locations } from 'contentful-ui-extensions-sdk';

import Sidebar from './Sidebar';
import AppConfig from './AppConfig';

import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';

init(sdk => {
  const root = document.getElementById('root');

  if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    render(<Sidebar sdk={sdk} />, root);
  } else if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    render(<AppConfig sdk={sdk} />, root);
  }
});
