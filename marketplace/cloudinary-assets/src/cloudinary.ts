import { FieldExtensionSDK, DialogExtensionSDK } from 'contentful-ui-extensions-sdk';

import { Cloudinary as cloudinaryCore } from 'cloudinary-core';

import { Hash } from './interfaces';

import logoSvg from './cloudinary.svg';

const VALID_IMAGE_FORMATS = ['svg', 'jpg', 'png', 'gif', 'jpeg'];

export const cta = 'Select or upload a file on Cloudinary';
export const logo = logoSvg;

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

export function renderDialog(sdk: DialogExtensionSDK) {
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

export async function openDialog(sdk: FieldExtensionSDK, currentValue: Hash[], config: Hash) {
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
