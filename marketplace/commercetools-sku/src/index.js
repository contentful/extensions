import { setup } from 'shared-dam-app';

import logo from './logo.svg';
import descriptor from '../extension.json';

const CTA = 'Select a Commercetools product';

function makeThumbnail(resource, config) {
  console.log('GOT', resource, config);

  return ['', ''];
}

function renderDialog(sdk) {
  const container = document.createElement('div');
  container.innerHTML = `hello world`;
  document.body.appendChild(container);

  // sdk.close()
  sdk.window.updateHeight(window.outerHeight);
}

async function openDialog(sdk, currentValue, config) {
  const maxFiles = config.maxFiles - currentValue.length;

  const result = await sdk.dialogs.openExtension({
    position: 'center',
    title: CTA,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: { ...config, maxFiles },
    width: 1400
  });

  if (result && Array.isArray(result.assets)) {
    return result.assets;
  } else {
    return [];
  }
}

function isDisabled(/* currentValue, config */) {
  return false;
}

function validateParameters(parameters) {
  if (parameters.projectKey.length < 1) {
    return 'Provide your Commercetools project key.';
  }

  if (parameters.clientId.length < 1) {
    return 'Provide your Commercetools client ID.';
  }

  if (parameters.clientSecret.length < 1) {
    return 'Provide your Commercetools client secret.';
  }

  if (parameters.apiEndpoint.length < 1) {
    return 'Provide the Commercetools API endpoint.';
  }

  if (parameters.authApiEndpoint.length < 1) {
    return 'Provide the Commercetools auth API endpoint.';
  }

  if (parameters.locale.length < 1) {
    return 'Provide the Commercetools data locale.';
  }

  return null;
}

setup({
  cta: CTA,
  name: 'Commercetools',
  logo,
  description:
    'The Commercetools app is a widget that allows editors to select products from their Commercetools account. Select a product from Commercetools that you want your entry to reference.',
  color: '#213C45',
  parameterDefinitions: descriptor.parameters.installation,
  makeThumbnail,
  renderDialog,
  openDialog,
  isDisabled,
  validateParameters
});
