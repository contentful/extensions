import Client from 'shopify-buy';
import get from 'lodash/get';
import merge from 'lodash/merge';

import { setup, renderSkuPicker } from 'shared-sku-app';

import logo from './logo.svg';
import descriptor from '../extension.json';
import { dataTransformer } from './dataTransformer';

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
    first: 250,
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
    fetchProducts: (function() {
      const products = [];
      let prevSearch = '';

      return async search => {
        const productsAreDefined = !!products.length;
        const searchHasChanged = prevSearch !== search;
        const shouldFetchNextBatchOfProducts = productsAreDefined && !searchHasChanged;

        if (searchHasChanged) {
          // If the user has made a new search reset pagination
          prevSearch = search;
          products.length = 0;
        }

        if (shouldFetchNextBatchOfProducts) {
          // Will get here when the user has clicked on the Load more
          // button to fetch and render the next batch of products.
          // This is because of the infinite scrolling type of
          // pagination Shopify offers.
          const nextProducts = (await client.fetchNextPage(products)).model;
          merge(products, nextProducts);
        } else {
          const query = { query: `variants:['sku:${search}'] OR title:${search}` };
          const nextProducts = await client.product.fetchQuery({
            first: PER_PAGE,
            sortBy: 'TITLE',
            ...(search.length && query)
          });
          merge(products, nextProducts);
        }

        // Shopify does not support indexed pagination, only infinite scrolling
        // @see https://community.shopify.com/c/Shopify-APIs-SDKs/How-to-display-more-than-20-products-in-my-app-when-products-are/td-p/464090 for more details (KarlOffenberger's answer)
        return {
          pagination: {
            hasNextPage: get(products, [products.length - 1, 'hasNextPage'], false)
          },
          products: products.map(dataTransformer())
        };
      };
    })()
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
