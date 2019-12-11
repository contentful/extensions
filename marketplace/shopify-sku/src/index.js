import Client from 'shopify-buy';

import { setup, renderSkuPicker } from 'shared-sku-app';

import logo from './logo.svg';
import descriptor from '../extension.json';
import { dataTransformer } from './dataTransformer';

let activePage = 0;

const DIALOG_ID = 'dialog-root';
const PER_PAGE = 1;

function makeCTA(fieldType) {
  return fieldType === 'Array' ? 'Select products' : 'Select a product';
}

function validateParameters(parameters) {
  if (parameters.storefrontAccessToken.length < 1) {
    return 'Provide the storefront access token to your Shopify store.';
  }

  if (parameters.apiEndpoint.length < 1) {
    return 'Provide the Shopify API endpoint.';
  }

  return null;
}

async function makeShopifyClient({ parameters: { installation } }) {
  const validationError = validateParameters(installation);
  if (validationError) {
    throw new Error(validationError);
  }

  const { storefrontAccessToken, apiEndpoint } = installation;

  return Client.buildClient({
    domain: apiEndpoint,
    storefrontAccessToken
  });
}

/**
 * Fetches the product previews for the products selected by the user.
 */
const fetchProductPreviews = async function fetchProductPreviews(skus, config) {
  if (!skus.length) {
    return [];
  }
  const client = await makeShopifyClient({ parameters: { installation: config } });
  const query = {
    query: `variants:['sku:${skus.join(' OR ')}']`
  };
  const products = await client.product.fetchQuery(query);

  return products.map(dataTransformer());
};

async function renderDialog(sdk) {
  const client = await makeShopifyClient(sdk);

  const container = document.createElement('div');
  container.id = DIALOG_ID;
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  document.body.appendChild(container);

  renderSkuPicker(DIALOG_ID, {
    sdk,
    fetchProductPreviews,
    fetchProducts: async (search, pagination) => {
      activePage = pagination.offset + 1;
      console.log('RECEIVED', pagination, activePage);
      const query = {
        query: `variants:['sku:${search}'] OR title:${search}`
      };
      const products = await client.product.fetchQuery({
        first: PER_PAGE,
        ...(search.length && query),
        sortBy: 'TITLE'
      });
      console.log('GOT PAGINATED', products[0].nextPageQueryAndPath());
      return {
        pagination: {
          count: PER_PAGE,
          limit: PER_PAGE,
          total: 2,
          offset: (activePage - 1) * PER_PAGE
        },
        products: products.map(dataTransformer())
      };
      // const result = await fetchSKUs(sdk.parameters.installation, search, pagination);

      // return {
      //   pagination: {
      //     count: PER_PAGE,
      //     limit: PER_PAGE,
      //     total: result.meta.record_count,
      //     offset: pagination.offset
      //   },
      //   products: result.data.map(dataTransformer(sdk.parameters.installation.apiEndpoint))
      // };
    }
  });

  sdk.window.updateHeight(window.outerHeight);
}

async function openDialog(sdk, currentValue, config) {
  const skus = await sdk.dialogs.openExtension({
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
  name: 'Shopify',
  logo,
  description:
    'The Shopify app allows editors to select products from their Shopify account and reference them inside of Contentful entries.',
  color: '#212F3F',
  parameterDefinitions: descriptor.parameters.installation,
  fetchProductPreviews,
  renderDialog,
  openDialog,
  isDisabled,
  validateParameters
});
