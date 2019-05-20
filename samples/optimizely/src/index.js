import * as React from 'react';
import { render } from 'react-dom';
import { init, locations } from './sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import OptimizelyClient from './optimizely-client';
import App from './app';
import IncorrectContentType, { isValidContentType } from './components/incorrect-content-type';

function renderExtension(elem) {
  render(elem, document.getElementById('root'));
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
    const [valid, missingFields] = isValidContentType(sdk.contentType);
    if (valid) {
      const client = new OptimizelyClient({
        sdk: sdk,
        project: sdk.parameters.installation.optimizelyProjectId
      });
      renderExtension(<App sdk={sdk} client={client} />);
    } else {
      renderExtension(<IncorrectContentType sdk={sdk} missingFields={missingFields} />);
    }
  }
});

// if (module.hot) {
//   module.hot.accept();
// }
