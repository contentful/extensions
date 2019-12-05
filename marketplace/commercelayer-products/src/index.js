import CLayerAuth from '@commercelayer/js-auth';
import CLayer from '@commercelayer/js-sdk';

import { setup, renderSkuPicker } from 'shared-sku-app';

import logo from './logo.svg';
import descriptor from '../extension.json';
import { dataTransformer, previewDataTransformer } from './dataTransformer';

const PER_PAGE = 20;

function makeCTA(fieldType) {
  return fieldType === 'Array' ? 'Select products' : 'Select a product';
}

async function fetchSKUs({ clientId, clientSecret, apiEndpoint }, search, pagination) {
  const auth = await CLayerAuth.integration({
    clientId: clientId,
    clientSecret: clientSecret,
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

  const result = await res.json();

  return result;
}

async function makeCommerceLayerClient({
  parameters: {
    installation: { apiEndpoint, clientId, clientSecret }
  }
}) {
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

const fetchProductPreviews = async function fetchProductPreviews(skus, config) {
  if (!skus.length) {
    return [];
  }
  await makeCommerceLayerClient({ parameters: { installation: config } });
  const result = await CLayer.Sku.where({ code_in: skus.join(',') }).all();
  return result.toArray().map(previewDataTransformer(config.apiEndpoint));
};

async function renderDialog(sdk) {
  const ID = 'dialog-root';
  const container = document.createElement('div');
  container.id = ID;
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  document.body.appendChild(container);

  renderSkuPicker(ID, {
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
