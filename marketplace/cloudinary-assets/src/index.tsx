import 'es6-promise/auto';

import * as React from 'react';
import { render } from 'react-dom';

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

import CloudinaryDialog from './components/Editor/CloudinaryDialog';
import CloudinaryField from './components/Editor/CloudinaryField';
import ClodudinaryAppConfig from './components/AppConfig/AppConfig';

import { Cloudinary as cloudinaryCore } from 'cloudinary-core';
import { CloudinaryResource } from './cloudinaryInterfaces';
import { ExtensionParameters } from './components/AppConfig/parameters';

const VALID_IMAGE_FORMATS = ['svg', 'jpg', 'png', 'gif', 'jpeg'];

function makeThumbnail(resource: CloudinaryResource, config: ExtensionParameters) {
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

init(sdk => {
  const root = document.getElementById('root');

  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    render(<CloudinaryDialog sdk={sdk as DialogExtensionSDK} />, root);
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    render(<CloudinaryField sdk={sdk as FieldExtensionSDK} makeThumbnail={makeThumbnail} />, root);
  } else if (sdk.location.is(locations.LOCATION_APP)) {
    render(<ClodudinaryAppConfig sdk={sdk as AppExtensionSDK} />, root);
  }
});
