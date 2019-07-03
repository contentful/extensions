import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { init } from 'contentful-ui-extensions-sdk';

import { App } from './app.js';

init(extension => {
  extension.window.startAutoResizer();

  ReactDOM.render(<App extension={extension} />, document.getElementById('root'));
});
