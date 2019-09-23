'use strict';

require('./matchers/filesystem.js');
const { matchers } = require('jest-json-schema');

const jestExpect = global.expect;
if (jestExpect !== undefined) {
  jestExpect.extend(matchers);
} else {
  // eslint-disable-next-line no-console
  console.error("Unable to find Jest's global expect.");
}
