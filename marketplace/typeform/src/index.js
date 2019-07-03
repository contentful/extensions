import 'core-js/stable/array/find-index';
import 'core-js/stable/promise';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { init } from 'contentful-ui-extensions-sdk';

import { App } from './app.js';

init(sdk => {
  sdk.window.startAutoResizer();
  const { installation, instance } = sdk.parameters;

  const parameters = {
    accessToken: installation.accessToken,
    workspaceId: instance.workspaceId || installation.workspaceId
  };

  ReactDOM.render(
    <App sdk={sdk} parameters={parameters} isRequired={sdk.field.required} />,
    document.getElementById('root')
  );
});
