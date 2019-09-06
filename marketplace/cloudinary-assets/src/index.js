import { Cloudinary as cloudinaryCore } from 'cloudinary-core';

import { setup } from 'shared-dam-app';

import logo from './logo.svg';
import descriptor from '../extension.json';

const VALID_IMAGE_FORMATS = ['svg', 'jpg', 'png', 'gif', 'jpeg'];
const MAX_FILES_UPPER_LIMIT = 25;
const CTA = 'Select or upload a file on Cloudinary';

function makeThumbnail(resource, config) {
  const cloudinary = new cloudinaryCore({
    cloud_name: config.cloudName,
    api_key: config.apiKey
  });

  let url;
  const alt = [resource.public_id, ...(resource.tags || [])].join(', ');
  let transformations = 'w_150,h_100,c_fill';

  if (
    Array.isArray(resource.derived) &&
    resource.derived[0] &&
    resource.derived[0].raw_transformation
  ) {
    transformations = resource.derived[0].raw_transformation + '/' + transformations;
  }

  if (resource.resource_type === 'image' && VALID_IMAGE_FORMATS.includes(resource.format)) {
    url = cloudinary.url(resource.public_id, {
      rawTransformation: transformations
    });
  } else if (resource.resource_type === 'video') {
    url = cloudinary.video_thumbnail_url(resource.public_id, transformations);
  }

  return [url, alt];
}

function renderDialog(sdk) {
  const { cloudinary } = window;
  const config = sdk.parameters.invocation;

  const options = {
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    max_files: config.maxFiles,
    multiple: config.maxFiles > 1,
    inline_container: '#root',
    remove_header: true
  };

  const instance = cloudinary.createMediaLibrary(options, {
    insertHandler: data => sdk.close(data)
  });

  instance.show();

  sdk.window.updateHeight(window.outerHeight);
}

async function openDialog(sdk, currentValue, config) {
  const maxFiles = config.maxFiles - currentValue.length;

  const result = await sdk.dialogs.openExtension({
    position: 'center',
    title: CTA,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: { ...config, maxFiles },
    width: 1400
  });

  if (result && Array.isArray(result.assets)) {
    return result.assets;
  } else {
    return [];
  }
}

function isDisabled(currentValue, config) {
  return currentValue.length >= config.maxFiles;
}

function validateParameters(parameters) {
  if (parameters.cloudName.length < 1) {
    return 'Provide your Cloudinary Cloud name.';
  }

  if (parameters.apiKey.length < 1) {
    return 'Provide your Cloudinary API key.';
  }

  const validFormat = /^[1-9][0-9]*$/.test(parameters.maxFiles);
  const int = parseInt(parameters.maxFiles, 10);
  const valid = validFormat && int > 0 && int <= MAX_FILES_UPPER_LIMIT;
  if (!valid) {
    return `Max files should be a number between 1 and ${MAX_FILES_UPPER_LIMIT}.`;
  }

  return null;
}

setup({
  cta: CTA,
  name: 'Cloudinary',
  logo,
  description:
    'The Cloudinary app is a widget that allows editors to select media from their Cloudinary account. Simply click Select or upload a file on Cloudinary and select the assets you want to be referenced from your entry.',
  color: '#F4B21B',
  parameterDefinitions: descriptor.parameters.installation,
  makeThumbnail,
  renderDialog,
  openDialog,
  isDisabled,
  validateParameters
});
