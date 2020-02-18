import pick from 'lodash/pick';
import { setup } from 'shared-dam-app';

import logo from './logo.svg';
import descriptor from '../extension.json';

const BYNDER_SDK_URL =
  'https://d8ejoa1fys2rk.cloudfront.net/modules/compactview/includes/js/client-1.5.0.min.js';

const CTA = 'Select or upload a file on Bynder';

const FIELDS_TO_PERSIST = [
  'archive',
  'brandId',
  'copyright',
  'dateCreated',
  'dateModified',
  'datePublished',
  'description',
  'extension',
  'fileSize',
  'height',
  'id',
  'isPublic',
  'limited',
  'name',
  'orientation',
  'original',
  'thumbnails',
  'type',
  'watermarked',
  'width'
];

function makeThumbnail(resource) {
  const thumbnail = (resource.thumbnails && resource.thumbnails.webimage) || resource.src;
  const url = typeof thumbnail === 'string' ? thumbnail : undefined;
  const alt = [resource.id, ...(resource.tags || [])].join(', ');

  return [url, alt];
}

function prepareBynderHTML(bynderURL) {
  return `
    <div class="dialog-container">
      <div
        id="bynder-compactview"
        data-assetTypes="image"
        data-autoload="true"
        data-button="Load media from bynder.com"
        data-collections="true"
        data-folder="bynder-compactview"
        data-fullScreen="true"
        data-header="false"
        data-language="en_US"
        data-mode="multi"
        data-zindex="300"
        data-defaultEnvironment="${bynderURL}"
      />
    </div>
  `;
}

function renderDialog(sdk) {
  const config = sdk.parameters.invocation;

  const container = document.createElement('div');
  container.innerHTML = prepareBynderHTML(config.bynderURL);
  document.body.appendChild(container);

  const script = document.createElement('script');
  script.src = BYNDER_SDK_URL;
  script.async = true;
  document.body.appendChild(script);

  sdk.window.startAutoResizer();

  document.addEventListener('BynderAddMedia', e => {
    sdk.close(Array.isArray(e.detail) ? e.detail : []);
  });
}

async function openDialog(sdk, _currentValue, config) {
  const result = await sdk.dialogs.openCurrentApp({
    position: 'center',
    title: CTA,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: { ...config },
    width: 1400
  });

  if (!Array.isArray(result)) {
    return [];
  }

  return result.map(item => ({
    ...pick(item, FIELDS_TO_PERSIST),
    src: item.thumbnails && item.thumbnails.webimage
  }));
}

function isDisabled() {
  return false;
}

function validateParameters({ bynderURL }) {
  const hasValidProtocol = bynderURL.startsWith('https://');
  const isHTMLSafe = ['"', '<', '>'].every(unsafe => !bynderURL.includes(unsafe));

  if (hasValidProtocol && isHTMLSafe) {
    return null;
  } else {
    return 'Provide a valid Bynder URL.';
  }
}

setup({
  cta: CTA,
  name: 'Bynder',
  logo,
  color: '#0af',
  description:
    'The Bynder app is a widget that allows editors to select media from their Bynder account. Select or upload a file on Bynder and designate the assets that you want your entry to reference.',
  parameterDefinitions: descriptor.parameters.installation,
  makeThumbnail,
  renderDialog,
  openDialog,
  isDisabled,
  validateParameters
});
