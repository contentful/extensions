import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import { init, locations } from 'contentful-ui-extensions-sdk';

import NeflifySidebar from './netlify-sidebar';
import NetlifyAppConfig from './netlify-app-config';

import '@contentful/forma-36-react-components/dist/styles.css';

init(sdk => {
  const root = document.getElementById('root');

  if (sdk.location.is(locations.LOCATION_APP)) {
    ReactDOM.render(<NetlifyAppConfig sdk={sdk} />, root);
  } else if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    ReactDOM.render(<NeflifySidebar sdk={sdk} />, root);
  }
});
