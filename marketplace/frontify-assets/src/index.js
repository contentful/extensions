import { setup } from 'shared-dam-app';

import descriptor from '../extension.json';
import logo from './logo.svg';

const CTA = 'Select files from Frontify';

setup({
  cta: CTA,
  name: 'Frontify',
  logo,
  color: '#363D4A',
  description:
    'The Frontify app enables editors to access all digital brand assets in Frontify directly from Contentful.',
  parameterDefinitions: descriptor.parameters.installation,
  makeThumbnail,
  renderDialog,
  openDialog,
  isDisabled,
  validateParameters
});

function makeThumbnail(resource) {
  const url = resource.preview_url;
  const alt = resource.title;

  return [url, alt];
}

function renderDialog(sdk) {
  const config = sdk.parameters.invocation;

  sdk.window.startAutoResizer();

  // prepare iframe
  const container = document.createElement('div');
  const iframe = document.createElement('iframe');
  const target = config.domain + '/external-asset-chooser';

  container.className = 'container';
  iframe.src = target;
  container.appendChild(iframe);
  document.body.appendChild(container);

  const chooser = iframe.contentWindow;

  // cross document messaging
  window.addEventListener('message', e => {
    if (!e.data) return;

    if (e.data.error) {
      sdk.notifier.error('An error occurred while selecting assets.');
    } else if (e.data.configurationRequested) {
      chooser.postMessage(
        { token: config.accessToken, mode: 'tree', multiSelectionAllowed: true },
        target
      );
    } else if (e.data.assetsChosen) {
      sdk.close(e.data.assetsChosen || []);
    }
  });
}

async function openDialog(sdk) {
  const params = sdk.parameters;
  // Use per-field access token first, if not provided then default to app config.
  const accessToken = params.instance.accessToken || params.installation.defaultAccessToken;

  if (typeof accessToken !== 'string' || accessToken.length < 1) {
    sdk.notifier.error('No valid acccess token found. Update app or field configuration.');
    return;
  }

  const result = await sdk.dialogs.openCurrentApp({
    position: 'center',
    title: CTA,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: { domain: params.installation.domain, accessToken },
    width: 1400
  });

  if (!Array.isArray(result)) {
    return [];
  }

  return result.map(item => ({
    id: item.id,
    title: item.title,
    name: item.name,
    ext: item.ext,
    height: item.height,
    width: item.width,
    created: item.created,
    generic_url: item.generic_url,
    preview_url: item.preview_url,
    src: item.preview_url
  }));
}

function isDisabled() {
  return false;
}

function validateParameters({ domain }) {
  const hasValidProtocol = domain.startsWith('https://');
  const isHTMLSafe = ['"', '<', '>'].every(unsafe => !domain.includes(unsafe));

  if (hasValidProtocol && isHTMLSafe) {
    return null;
  } else {
    return 'Provide a valid Frontify URL.';
  }
}
