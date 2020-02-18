'use strict';

const path = require('path');
const { dirsSync, readJsonFile } = require('../scripts/utils.js');

const BASE_DIR = path.join(__dirname, '..', 'marketplace');
const extensions = dirsSync(BASE_DIR);

describe.each(extensions)('Source file structure for %s', function(extension) {
  test('has package.json', function() {
    expect(path.join(BASE_DIR, extension, 'package.json')).toBeExistingFile();
  });

  test('has extension.json', function() {
    expect(path.join(BASE_DIR, extension, 'extension.json')).toBeExistingFile();
  });

  test('folder name matches extension ID', async function() {
    const { id } = await readJsonFile(path.join(BASE_DIR, extension, 'extension.json'));

    // netlify-build violates this so we manually exclude it
    if (extension === 'netlify-build') {
      expect(extension).toBe('netlify-build');
      return;
    }
    expect(extension).toBe(id);
  });

  test('has a non-zero major version', async function() {
    const { version } = await readJsonFile(path.join(BASE_DIR, extension, 'package.json'));
    expect(Number(version.split('.')[0])).toBeGreaterThanOrEqual(1);
  });
});
