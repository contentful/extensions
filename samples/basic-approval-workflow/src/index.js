import React from 'react';
import ReactDOM from 'react-dom';

import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-tokens/dist/css/index.css';

import { init, locations } from 'contentful-ui-extensions-sdk';

import Sidebar from './sidebar';
import Dialog from './dialog';

init((sdk) => {
  const root = document.getElementById('root');

  if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    ReactDOM.render(<Sidebar sdk={sdk} />, root);
  } else if (sdk.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(<Dialog sdk={sdk} />, root);
  }
});

if (module.hot) {
  module.hot.accept();
}
