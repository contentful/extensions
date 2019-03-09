import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { init } from 'contentful-ui-extensions-sdk';

import { App } from './app.js';

init(extension => {
  const root = document.getElementById('root');

  ReactDOM.render(<App extension={extension} />, root);
});

// Enabling hot reload
if (module.hot) {
  module.hot.accept();
}
