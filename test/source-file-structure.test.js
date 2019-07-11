'use strict';

const path = require('path');
const { readFile } = require('fs-extra');
const { dirsSync } = require('../scripts/utils.js');

const BASE_DIR = path.join(__dirname, '..', 'marketplace');
const extensions = dirsSync(BASE_DIR);

describe.each(extensions)('Source file structure for %s', function(extension) {
  test('has package.json', function() {
    expect(path.join(BASE_DIR, extension, 'package.json')).toBeExistingFile();
  });

  test('has extension.json', function() {
    expect(path.join(BASE_DIR, extension, 'extension.json')).toBeExistingFile();
  });

  test('folder name matches extension ID', function() {
    return readFile(path.join(BASE_DIR, extension, 'extension.json'), 'utf8')
      .then(data => JSON.parse(data))
      .then(({ id }) => {
        expect(extension).toBe(id);
      });
  });

  test('has a non-zero major version', function() {
    return readFile(path.join(BASE_DIR, extension, 'package.json'), 'utf8')
      .then(data => JSON.parse(data))
      .then(({ version }) => {
        expect(Number(version.split('.')[0])).toBeGreaterThanOrEqual(1);
      });
  });
});
