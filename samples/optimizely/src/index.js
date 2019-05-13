import * as React from 'react';
import { render } from 'react-dom';
import { init, locations } from './sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

import App from './app';

init(sdk => {
  if (sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
    render(<App sdk={sdk} />, document.getElementById('root'));
  }
});
