import CLayerAuth from '@commercelayer/js-auth';
import CLayer from '@commercelayer/js-sdk';
import chunk from 'lodash/chunk';
import flatMap from 'lodash/flatMap';

import { setup, renderSkuPicker } from 'shared-sku-app';

import logo from './logo.svg';
import descriptor from '../extension.json';
import { dataTransformer } from './dataTransformer';

const DIALOG_ID = 'dialog-root';
const PER_PAGE = 20;

function makeCTA(fieldType) {
  return fieldType === 'Array' ? 'Select products' : 'Select a product';
}

function validateParameters(parameters) {
  if (parameters.clientId.length < 1) {
    return 'Provide your Commerce Layer client ID.';
  }

  if (parameters.clientSecret.length < 1) {
    return 'Provide your Commerce Layer client secret.';
  }

  if (parameters.apiEndpoint.length < 1) {
    return 'Provide the Commerce Layer API endpoint.';
  }

  return null;
}

/**
 * The Commerce Layer client is currently used to fetch only the previews
 * for the selected products.
 *
 * To fetch all SKUs and to search through them we perform directly an HTTP
 * request to the corresponding endpoint.
 *
 * @see fetchSKUs for a more detailed explanation.
 */
async function makeCommerceLayerClient({ parameters: { installation } }) {
  const validationError = validateParameters(installation);
  if (validationError) {
    throw new Error(validationError);
  }

  const { clientId, apiEndpoint, clientSecret } = installation;
  const auth = await CLayerAuth.integration({
    clientId,
    clientSecret,
    endpoint: apiEndpoint
  });

  CLayer.init({
    accessToken: auth.accessToken,
    host: apiEndpoint.replace(/(https?:\/\/)/g, '')
  });
}

/**
 * This function is needed to make the pagination of Commerce Layer work with the
 * shared-sku-app library.
 *
 * When fetching the SKUs via the Commerce Layer JS SDK the metadata object which
 * includes the total count of records needed by the shared-sku-picker paginator
 * is missing. But it is there when fetching the SKUs via a plain HTTP req.
 */
async function fetchSKUs(installationParams, search, pagination) {
  const validationError = validateParameters(installationParams);
  if (validationError) {
    throw new Error(validationError);
  }

  const { clientId, apiEndpoint, clientSecret } = installationParams;
  const auth = await CLayerAuth.integration({
    clientId,
    clientSecret,
    endpoint: apiEndpoint
  });

  const URL = `${apiEndpoint}/api/skus?page[size]=${PER_PAGE}&page[number]=${pagination.offset /
    PER_PAGE +
    1}${search.length ? `&filter[q][name_or_code_cont]=${search}` : ''}`;

  const res = await fetch(URL, {
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${auth.accessToken}`
    },
    method: 'GET'
  });

  return await res.json();
}

/**
 * Fetches the product previews for the products selected by the user.
 */
const fetchProductPreviews = async function fetchProductPreviews(skus, config) {
  if (!skus.length) {
    return [];
  }
  await makeCommerceLayerClient({ parameters: { installation: config } });

  // Commerce Layer's API automatically paginated results for collection endpoints.
  // Here we account for the edge case where the user has picked more than 25
  // products, which is the max amount of pagination results. We need to fetch
  // and compile the complete selection result doing 1 request per 25 items.
  const PREVIEW_PER_PAGE = 25;
  const resultPromises = chunk(skus, PREVIEW_PER_PAGE).map((_, index) =>
    CLayer.Sku.where({ code_in: skus.join(',') })
      .perPage(PREVIEW_PER_PAGE)
      .page(index + 1)
      .all()
  );
  const results = await Promise.all(resultPromises);
  const products = flatMap(results, res => res.toArray()).map(dataTransformer(config.apiEndpoint));

  return products;
};

async function renderDialog(sdk) {
  const container = document.createElement('div');
  container.id = DIALOG_ID;
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  document.body.appendChild(container);

  renderSkuPicker(DIALOG_ID, {
    sdk,
    fetchProductPreviews,
    fetchProducts: async (search, pagination) => {
      const result = await fetchSKUs(sdk.parameters.installation, search, pagination);

      return {
        pagination: {
          count: PER_PAGE,
          limit: PER_PAGE,
          total: result.meta.record_count,
          offset: pagination.offset
        },
        products: result.data.map(dataTransformer(sdk.parameters.installation.apiEndpoint))
      };
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
  name: 'Commerce Layer',
  logo,
  description:
    'The Commerce Layer app allows editors to select products from their Commerce Layer account and reference them inside of Contentful entries.',
  color: '#212F3F',
  parameterDefinitions: descriptor.parameters.installation,
  fetchProductPreviews,
  renderDialog,
  openDialog,
  isDisabled,
  validateParameters
});
