import * as React from 'react';
import { render } from 'react-dom';
import { init, locations } from './sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import OptimizelyClient from './optimizely-client';
import App from './app';
import AppSidebar from './app-sidebar';
import {
  IncorrectContentType,
  isValidContentType,
  MissingProjectId
} from './components/errors-messages';

function renderExtension(elem) {
  render(elem, document.getElementById('root'));
}

init(sdk => {
  const project = sdk.parameters.installation.optimizelyProjectId;
  const client = new OptimizelyClient({
    sdk: sdk,
    project
  });
  if (sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
    if (!project) {
      return renderExtension(<MissingProjectId />);
    }
    const [valid, missingFields] = isValidContentType(sdk.contentType);
    if (valid) {
      return renderExtension(<App sdk={sdk} client={client} />);
    }
    return renderExtension(<IncorrectContentType sdk={sdk} missingFields={missingFields} />);
  } else if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    return renderExtension(<AppSidebar sdk={sdk} client={client} />);
  }
});

// if (module.hot) {
//   module.hot.accept();
// }
