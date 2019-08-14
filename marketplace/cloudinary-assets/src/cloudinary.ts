import { Cloudinary as cloudinaryCore } from 'cloudinary-core';

import logoSvg from './cloudinary.svg';
import descriptor from '../extension.json';

type Hash = Record<string, any>;

const VALID_IMAGE_FORMATS = ['svg', 'jpg', 'png', 'gif', 'jpeg'];
const MAX_FILES_UPPER_LIMIT = 25;

export const cta = 'Select or upload a file on Cloudinary';
export const logo = logoSvg;
export const parameterDefinitions = descriptor.parameters.installation;

export function makeThumbnail(resource: Hash, config: Hash) {
  const cloudinary = new cloudinaryCore({
    cloud_name: config.cloudName,
    api_key: config.apiKey
  });

  let url;
  const alt = [resource.public_id, ...(resource.tags || [])].join(', ');
  const transformations = { width: 150, height: 100, crop: 'fill' };

  if (resource.resource_type === 'image' && VALID_IMAGE_FORMATS.includes(resource.format)) {
    url = cloudinary.url(resource.public_id, transformations);
  } else if (resource.resource_type === 'video') {
    url = cloudinary.video_thumbnail_url(resource.public_id, transformations);
  }

  return [url, alt];
}

export function renderDialog(sdk: any) {
  const { cloudinary } = window as any;
  const config = sdk.parameters.invocation as Hash;

  const options = {
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    max_files: config.maxFiles,
    multiple: config.maxFiles > 1,
    inline_container: '#root',
    remove_header: true
  };

  const instance = cloudinary.createMediaLibrary(options, {
    insertHandler: (data: any) => sdk.close(data)
  });

  instance.show();

  sdk.window.updateHeight(window.outerHeight);
}

export async function openDialog(sdk: any, currentValue: Hash[], config: Hash) {
  const maxFiles = config.maxFiles - currentValue.length;

  const result = await sdk.dialogs.openExtension({
    position: 'center',
    title: cta,
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

export function isDisabled(currentValue: Hash[], config: Hash) {
  return currentValue.length >= config.maxFiles;
}

export function validateParameters(parameters: Record<string, string>): string | null {
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
