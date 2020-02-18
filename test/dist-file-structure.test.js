'use strict';

const path = require('path');
const { dirsSync } = require('../scripts/utils.js');

const BASE_DIR = path.join(__dirname, '..', 'dist');
const extensions = dirsSync(BASE_DIR);

describe('Dist file structure', function() {
  describe.each(extensions)('%s', function(extension) {
    test('has extension.json', function() {
      expect(path.join(BASE_DIR, extension, 'extension.json')).toBeExistingFile();
    });

    test('has _headers', function() {
      expect(path.join(BASE_DIR, extension, '_headers')).toBeExistingFile();
    });
  });
});
