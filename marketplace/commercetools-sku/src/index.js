import { memoizePromise } from './memoizePromise';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue';

import { setup, renderSkuPicker } from 'shared-sku-app';

import logo from './logo.svg';
import descriptor from '../extension.json';
import { dataTransformer } from './dataTransformer';

function makeCTA(fieldType) {
  return fieldType === 'Array' ? 'Select products' : 'Select a product';
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

const fetchProductPreviews = memoizePromise(async function fetchProductPreviews(skus, config) {
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

  return dataTransformer({}); // return empty product
});

async function renderDialog(sdk) {
  const { projectKey, locale } = sdk.parameters.installation;

  const client = makeCommerceToolsClient(sdk);

  const ID = 'dialog-root';
  const container = document.createElement('div');
  container.id = ID;
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  document.body.appendChild(container);

  renderSkuPicker(ID, {
    sdk,
    fetchProductPreviews,
    fetchProducts: memoizePromise(async (search, pagination) => {
      const PER_PAGE = 20;
      const requestBuilder = createRequestBuilder({ projectKey });
      const uri = requestBuilder.productProjectionsSearch
        .parse({
          ...(!!search.length && {
            text: {
              language: locale,
              value: search
            }
          }),
          page: pagination.offset / PER_PAGE + 1,
          perPage: PER_PAGE,
          sort: [{ by: `name.${locale}`, direction: 'asc' }]
        })
        .build();
      const response = await client.execute({ uri, method: 'GET' });
      if (response.statusCode === 200) {
        return {
          pagination: {
            count: response.body.count,
            limit: response.body.limit,
            total: response.body.total,
            offset: response.body.offset
          },
          products: response.body.results.map(dataTransformer(sdk.parameters.installation))
        };
      }
      throw new Error(response.statusCode);
    })
  });

  sdk.window.updateHeight(window.outerHeight);
}

async function openDialog(sdk, currentValue, config) {
  const maxFiles = config.maxFiles - currentValue.length;

  const skus = await sdk.dialogs.openExtension({
    position: 'center',
    title: makeCTA(sdk.field.type),
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: { ...config, maxFiles },
    width: 1400
  });

  return Array.isArray(skus) ? skus : [];
}

function isDisabled(/* currentValue, config */) {
  // No restrictions need to be imposed as to when the field is disabled from the app's side
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
  makeCTA,
  name: 'Commercetools',
  logo,
  description:
    'The Commercetools app allows editors to select products from their Commercetools account and reference them inside of Contentful entries.
  color: '#213C45',
  parameterDefinitions: descriptor.parameters.installation,
  fetchProductPreviews,
  renderDialog,
  openDialog,
  isDisabled,
  validateParameters
});
