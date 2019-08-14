import 'es6-promise/auto';

import * as React from 'react';
import { render } from 'react-dom';

import { Cloudinary as cloudinaryCore } from 'cloudinary-core';

import {
  init,
  locations,
  FieldExtensionSDK,
  DialogExtensionSDK,
  AppExtensionSDK
} from 'contentful-ui-extensions-sdk';

import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';

import Field from './components/Editor/Field';
import AppConfig from './components/AppConfig/AppConfig';

type Hash = Record<string, any>;

const VALID_IMAGE_FORMATS = ['svg', 'jpg', 'png', 'gif', 'jpeg'];

function makeThumbnail(resource: Hash, config: Hash) {
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

function renderDialog(sdk: DialogExtensionSDK) {
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

init(sdk => {
  const root = document.getElementById('root');

  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    renderDialog(sdk as DialogExtensionSDK);
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    render(<Field sdk={sdk as FieldExtensionSDK} makeThumbnail={makeThumbnail} />, root);
  } else if (sdk.location.is(locations.LOCATION_APP)) {
    render(<AppConfig sdk={sdk as AppExtensionSDK} />, root);
  }
});
