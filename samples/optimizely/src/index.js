import * as React from 'react';
import { render } from 'react-dom';
import { init, locations } from './sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import OptimizelyClient from './optimizely-client';

import App from './app';

init(sdk => {
  if (sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
    const client = new OptimizelyClient({
      sdk: sdk,
      project: sdk.parameters.installation.optimizelyProjectId
    });
    render(<App sdk={sdk} client={client} />, document.getElementById('root'));
  }
});

// if (module.hot) {
//   module.hot.accept();
// }
