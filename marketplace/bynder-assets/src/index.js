import { setup } from 'shared-dam-app';

import logo from './logo.svg';
import descriptor from '../extension.json';

const BYNDER_SDK_URL =
  'https://d8ejoa1fys2rk.cloudfront.net/modules/compactview/includes/js/client-1.5.0.min.js';

const CTA = 'Select or upload a file on Bynder';

function makeThumbnail(resource) {
  const thumbnail = resource.thumbnails && resource.thumbnails.webimage;
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
  const result = await sdk.dialogs.openExtension({
    position: 'center',
    title: CTA,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: { ...config },
    width: 1400
  });

  return Array.isArray(result) ? result : [];
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
  logo,
  color: '#0af',
  description:
    "Bynder's digital asset management solution improves your digital asset flow from creation to approval, to deliver consistent content across all of your channels.",
  parameterDefinitions: descriptor.parameters.installation,
  makeThumbnail,
  renderDialog,
  openDialog,
  isDisabled,
  validateParameters
});
