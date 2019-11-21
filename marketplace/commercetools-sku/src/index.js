// import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue';

import { setup, renderSkuPicker } from 'shared-sku-app';

import logo from './logo.svg';
import descriptor from '../extension.json';

const CTA = 'Select a Commercetools product';

function makeCommerceToolsClient({
  parameters: {
    installation: { apiEndpoint, authApiEndpoint, projectKey, clientId, clientSecret }
  }
}) {
  const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: authApiEndpoint,
    projectKey: projectKey,
    credentials: {
      clientId: clientId,
      clientSecret: clientSecret
    }
  });

  const httpMiddleware = createHttpMiddleware({
    host: apiEndpoint
  });

  const queueMiddleware = createQueueMiddleware({
    concurrency: 5
  });

  return createClient({
    middlewares: [authMiddleware, httpMiddleware, queueMiddleware]
  });
}

function makeThumbnail(resource, config) {
  console.log('GOT', resource, config);

  return ['', ''];
}

async function renderDialog(sdk) {
  const request = {
    uri: `/${sdk.parameters.installation.projectKey}/products`,
    method: 'GET'
  };

  const client = makeCommerceToolsClient(sdk);

  const ID = 'dialog-root';
  const container = document.createElement('div');
  container.id = ID;
  document.body.appendChild(container);

  renderSkuPicker(ID, {
    sdk,
    onSearch: async search => {
      console.log('Search:', search);
      const response = await client.execute(request);
      if (response.statusCode === 200) {
        console.log('Res:', response);
        return response.body.results;
      }
      throw new Error(response.statusCode);
    }
  });

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
