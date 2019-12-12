import Client from 'shopify-buy';
import get from 'lodash/get';
import merge from 'lodash/merge';

import { validateParameters } from '.';
import { dataTransformer } from './dataTransformer';

const PER_PAGE = 20;

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
export const fetchProductPreviews = async (skus, config) => {
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

/**
 * Fetches the products searched by the user
 *
 * Shopify does not support indexed pagination, only infinite scrolling
 * @see https://community.shopify.com/c/Shopify-APIs-SDKs/How-to-display-more-than-20-products-in-my-app-when-products-are/td-p/464090 for more details (KarlOffenberger's answer)
 */
export const makeProductSearchResolver = async sdk => {
  const client = await makeShopifyClient(sdk);
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

    return {
      pagination: {
        hasNextPage: get(products, [products.length - 1, 'hasNextPage'], false)
      },
      products: products.map(dataTransformer())
    };
  };
};
