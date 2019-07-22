import * as React from 'react';
import { render } from 'react-dom';
import { init, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import App from './app';
import AppSidebar from './app-sidebar';
import {
  IncorrectContentType,
  isValidContentType,
  MissingProjectId
} from './components/errors-messages';
import AppPage from './AppPage/app-page';

function renderExtension(elem) {
  render(elem, document.getElementById('root'));
}

init(sdk => {
  const {location, parameters} = sdk;

  const project = parameters.installation.optimizelyProjectId;

  if (location.is(locations.LOCATION_ENTRY_EDITOR)) {
    return renderExtension(<AppPage />);
  }

  if (location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    return renderExtension(<AppSidebar sdk={sdk} client={client} />);
  }

  if (location.is(locations.LOCATION_ENTRY_EDITOR)) {
    if (!project) {
      return renderExtension(<MissingProjectId />);
    }

    const [valid, missingFields] = isValidContentType(sdk.contentType);

    if (!valid) {
      return renderExtension(<IncorrectContentType sdk={sdk} missingFields={missingFields} />);
    }

    return renderExtension(<App sdk={sdk} client={client} />);
  } 
});

// if (module.hot) {
//   module.hot.accept();
// }
