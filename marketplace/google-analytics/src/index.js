/* global gapi */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { init } from 'contentful-ui-extensions-sdk';

import { App } from './app.js';

init(({ entry, parameters, window }) => {
  window.startAutoResizer();

  gapi.analytics.ready(() => {
    ReactDOM.render(
      <App auth={gapi.analytics.auth} entry={entry} parameters={parameters.instance} />,
      document.getElementById('root')
    );
  });
});

// Enabling hot reload
if (module.hot) {
  module.hot.accept();
}
