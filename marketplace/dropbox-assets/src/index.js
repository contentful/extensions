import pick from 'lodash/pick';
import { setup } from 'shared-dam-app';

import logo from './logo.svg';

const FIELDS_TO_PERSIST = [
  'isDir',
  'linkType',
  'name',
  'thumbnailLink',
  'bytes',
  'link',
  'id',
  'icon'
];

function makeThumbnail(file) {
  const url = file.thumbnailLink.split('?')[0] + '?bounding_box=256&mode=fit';
  const alt = file.name;

  return [url, alt];
}

async function openDialog() {
  return new Promise(resolve => {
    window.Dropbox.choose({
      success: files =>
        resolve(Array.isArray(files) ? files.map(file => pick(file, FIELDS_TO_PERSIST)) : []),
      linkType: 'preview',
      multiselect: true,
      folderselect: false,
      extensions: ['.jpg', '.jpeg', '.gif', '.svg', '.png']
    });
  });
}

setup({
  cta: 'Select or upload a file on Dropbox',
  name: 'Dropbox',
  logo,
  color: '#0061ff',
  description:
    'This app allows content editors to select images stored in Dropbox directly from the entry editor. Preview URLs are automatically generated for selected Dropbox assets and stored in JSON fields.',
  parameterDefinitions: [],
  makeThumbnail,
  renderDialog: () => {},
  openDialog,
  isDisabled: () => false,
  validateParameters: () => {}
});
