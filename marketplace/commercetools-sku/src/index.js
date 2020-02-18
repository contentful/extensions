import './vendor/ct-picker.min';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue';

import { setup } from 'shared-sku-app';

import get from 'lodash/get';
import logo from './logo.svg';
import descriptor from '../extension.json';
import { dataTransformer } from './dataTransformer';

function makeCTA(fieldType) {
  return fieldType === 'Array' ? 'Select products' : 'Select a product';
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

const fetchProductPreviews = async function fetchProductPreviews(skus, config) {
  if (!skus.length) {
    return [];
  }

  const client = makeCommerceToolsClient({ parameters: { installation: config } });
  const requestBuilder = createRequestBuilder({ projectKey: config.projectKey });
  const uri = requestBuilder.productProjectionsSearch
    .parse({
      filter: [`variants.sku:${skus.map(sku => `"${sku}"`).join(',')}`]
    })
    .build();
  const response = await client.execute({ uri, method: 'GET' });
  if (response.statusCode === 200) {
    const products = response.body.results.map(dataTransformer(config));
    return products;
  }
  throw new Error(response.statusCode);
};

async function renderDialog(sdk) {
  const { projectKey, locale, clientId, clientSecret } = sdk.parameters.installation;

  const ID = 'dialog-root';
  const container = document.createElement('div');
  container.id = ID;
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  document.body.appendChild(container);

  const fieldTypeIsArray = get(sdk, ['parameters', 'invocation', 'fieldType']) === 'Array';

  const pickerOptions = {
    project: {
      projectKey,
      credentials: {
        clientId,
        clientSecret
      }
    },
    mode: 'embedded',
    searchLanguage: locale,
    selectionMode: fieldTypeIsArray ? 'multiple' : 'single',
    uiLocale: 'en-US',
    displayOptions: {
      showHeader: false,
      showCancelButton: false,
      showSelectButton: true
    }
  };

  const ctPicker = new window.CTPicker(pickerOptions, container);
  try {
    sdk.window.updateHeight(660);

    const result = await ctPicker.show();
    const skus = result.map(({ masterVariant: { sku } }) => sku);

    const persistedSkus = get(sdk, ['parameters', 'invocation', 'fieldValue'], []);

    // For single selection we want to replace the persisted SKU for the new one
    // For multi selection, we want to append the new results to the previous, keeping
    // only unique values.
    const finalSkus = fieldTypeIsArray ? [...new Set([...persistedSkus, ...skus])] : skus;
    sdk.close(finalSkus);
  } catch (error) {
    if (error !== 'cancel') {
      // Widget is going to throw if the user closes the product picking dialog
      // without selecting a product. We need to swallow these exceptions and throw the rest.
      throw new Error(error);
    }
  }

  sdk.window.startAutoResizer();
}

async function openDialog(sdk, currentValue, config) {
  const skus = await sdk.dialogs.openCurrentApp({
    allowHeightOverflow: true,
    position: 'center',
    title: makeCTA(sdk.field.type),
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: config,
    width: 1400
  });

  return Array.isArray(skus) ? skus : [];
}

function isDisabled(/* currentValue, config */) {
  // No restrictions need to be imposed as to when the field is disabled from the app's side
  return false;
}

setup({
  makeCTA,
  name: 'Commercetools',
  logo,
  description:
    'The Commercetools app allows editors to select products from their Commercetools account and reference them inside of Contentful entries.',
  color: '#213C45',
  parameterDefinitions: descriptor.parameters.installation,
  fetchProductPreviews,
  renderDialog,
  openDialog,
  isDisabled,
  validateParameters
});
