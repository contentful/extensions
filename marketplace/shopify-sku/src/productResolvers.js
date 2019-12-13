import Client from 'shopify-buy';
import makePagination from './Pagination';

import { validateParameters } from '.';
import { dataTransformer, productPreviewsToVariantsTransformer } from './dataTransformer';

export async function makeShopifyClient({ parameters: { installation } }) {
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
  const variants = productPreviewsToVariantsTransformer(products, skus);

  return variants.map(dataTransformer(config));
};

/**
 * Fetches the products searched by the user
 *
 * Shopify does not support indexed pagination, only infinite scrolling
 * @see https://community.shopify.com/c/Shopify-APIs-SDKs/How-to-display-more-than-20-products-in-my-app-when-products-are/td-p/464090 for more details (KarlOffenberger's answer)
 */
export const makeProductSearchResolver = async sdk => {
  const pagination = await makePagination(sdk);
  return search => pagination.fetchNext(search);
};
