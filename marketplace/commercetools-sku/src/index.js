import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue';

import { setup, renderSkuPicker } from 'shared-sku-app';

import logo from './logo.svg';
import descriptor from '../extension.json';
import { dataTransformer } from './dataTransformer';

const CTA = 'Select product';

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

async function fetchProductPreview(sku, config) {
  const client = makeCommerceToolsClient({ parameters: { installation: config } });
  const requestBuilder = createRequestBuilder({ projectKey: config.projectKey });
  const uri = requestBuilder.productProjectionsSearch
    .parse({ filter: [`variants.sku:"${sku}"`] })
    .build();
  const response = await client.execute({ uri, method: 'GET' });
  if (response.statusCode === 200) {
    const [product] = response.body.results.map(dataTransformer(config));
    return product;
  }

  return dataTransformer({}); // return empty product
}

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
    fetchProducts: async (search, { offset }) => {
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
          page: offset / PER_PAGE + 1,
          perPage: PER_PAGE
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
    }
  });

  sdk.window.updateHeight(window.outerHeight);
}

async function openDialog(sdk, currentValue, config) {
  const maxFiles = config.maxFiles - currentValue.length;

  const skus = await sdk.dialogs.openExtension({
    position: 'center',
    title: CTA,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: { ...config, maxFiles },
    width: 1400
  });

  return Array.isArray(skus) ? skus : [];
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
  fetchProductPreview,
  renderDialog,
  openDialog,
  isDisabled,
  validateParameters
});
