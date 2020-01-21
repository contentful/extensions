import Client from 'shopify-buy';
import makePagination from './Pagination';

import { validateParameters } from '.';
import { previewsToVariants } from './dataTransformer';

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
 *
 * Note: currently there is no way to cover the edge case where the user
 *       would have more than 250 products selected. In such a case their
 *       selection would be cut off after product no. 250.
 */
export const fetchProductPreviews = async (skus, config) => {
  if (!skus.length) {
    return [];
  }

  const ids = skus.map(sku => `"${sku}"`).join(',');

  const query = `
  {
    nodes (ids: [${ids}]) {
      id,
      ...on ProductVariant {
        sku,
        image {
          src: originalSrc
        },
        title,
        product {
          id,
          title
        }
      }
    }
  }
  `;

  const { apiEndpoint, storefrontAccessToken } = config;

  const res = await window.fetch(`https://${apiEndpoint}/api/2019-10/graphql`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-shopify-storefront-access-token': storefrontAccessToken
    },
    body: JSON.stringify({ query })
  });

  const { data } = await res.json();

  return data.nodes.map(previewsToVariants(config));
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
