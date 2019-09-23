'use strict';

const path = require('path');
const { existsSync } = require('fs');
const { matcherHint } = require('jest-matcher-utils');

expect.extend({
  toBeExistingFile(received) {
    const pass = existsSync(received);

    let fileName = '';
    if (typeof received === 'string') {
      const parts = received.split(path.sep);
      fileName = parts[parts.length - 1];
    }

    const message = pass
      ? () =>
          `${matcherHint(
            '.not.toBeExistingFile',
            received,
            ''
          )}\n\nExpected ${fileName} not to exist`
      : () => `${matcherHint('.toBeExistingFile', received, '')}\n\nExpected ${fileName} to exist`;

    return {
      actual: received,
      name: 'toBeExistingFile',
      message,
      pass
    };
  }
});
