import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import './index.css';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { init, locations } from 'contentful-ui-extensions-sdk';

import { Sidebar } from './sidebar.js';
import { DetailsDialog } from './details-dialog.js';

init(extension => {
  extension.window.startAutoResizer();

  const rootElm = document.getElementById('root');

  if (extension.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    ReactDOM.render(<Sidebar extension={extension} />, rootElm);
  } else if (extension.location.is(locations.LOCATION_DIALOG)) {
    const { dialog } = extension.parameters.invocation;
    if (dialog === 'details') {
      ReactDOM.render(<DetailsDialog extension={extension} />, rootElm);
    }
  }
});
