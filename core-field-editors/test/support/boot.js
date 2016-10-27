/**
 * This file is required by mocha before collecting and running the
 * tests.
 */
require('babel-register')({
  babelrc: false,
  presets: ['es2015-node6'],
  plugins: [
    ['module-resolver', {
      alias: {
        'support': './test/support',
        'src': './src',
        // We mock the SDK. Loading it will trigger an error.
        // TODO we should fix that error
        'contentful-ui-extensions-sdk': './test/support/empty',
      },
    }],
  ],
})
