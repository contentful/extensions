import CLayerAuth from '@commercelayer/js-auth';
import chunk from 'lodash/chunk';
import flatMap from 'lodash/flatMap';

import { setup, renderSkuPicker } from 'shared-sku-app';

import logo from './logo.svg';
import descriptor from '../extension.json';
import { dataTransformer } from './dataTransformer';

const DIALOG_ID = 'root';
const PER_PAGE = 20;

let accessToken = null;

function makeCTA(fieldType) {
  return fieldType === 'Array' ? 'Select products' : 'Select a product';
}

function validateParameters(parameters) {
  if (parameters.clientId.length < 1) {
    return 'Provide your Commerce Layer client ID.';
  }

  if (parameters.apiEndpoint.length < 1) {
    return 'Provide the Commerce Layer API endpoint.';
  }

  return null;
}

async function getAccessToken(clientId, endpoint) {
  if (!accessToken) {
    /* eslint-disable-next-line require-atomic-updates */
    accessToken = (await CLayerAuth.getIntegrationToken({
      clientId,
      endpoint,
      // The empty client secret is needed for legacy reasons, as the
      // CLayerAuth SDK will throw if not present. By setting to empty
      // string we prevent the SDK exception and the value is ignored
      // by the Commerce Layer Auth API.
      clientSecret: ''
    })).accessToken;
  }
  return accessToken;
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

  const { clientId, apiEndpoint } = installationParams;
  const accessToken = await getAccessToken(clientId, apiEndpoint);

  const URL = `${apiEndpoint}/api/skus?page[size]=${PER_PAGE}&page[number]=${pagination.offset /
    PER_PAGE +
    1}${search.length ? `&filter[q][name_or_code_cont]=${search}` : ''}`;

  const res = await fetch(URL, {
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${accessToken}`
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

  const PREVIEWS_PER_PAGE = 25;

  const { clientId, apiEndpoint } = config;
  const accessToken = await getAccessToken(clientId, apiEndpoint);

  // Commerce Layer's API automatically paginated results for collection endpoints.
  // Here we account for the edge case where the user has picked more than 25
  // products, which is the max amount of pagination results. We need to fetch
  // and compile the complete selection result doing 1 request per 25 items.
  const resultPromises = chunk(skus, PREVIEWS_PER_PAGE).map(async skusSubset => {
    const URL = `${apiEndpoint}/api/skus?page[size]=${PREVIEWS_PER_PAGE}&filter[q][code_in]=${skusSubset}`;
    const res = await fetch(URL, {
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${accessToken}`
      },
      method: 'GET'
    });
    return await res.json();
  });

  const results = await Promise.all(resultPromises);

  return flatMap(results, ({ data }) => data.map(dataTransformer(config.apiEndpoint)));
};

async function renderDialog(sdk) {
  const container = document.getElementById(DIALOG_ID);
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

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
