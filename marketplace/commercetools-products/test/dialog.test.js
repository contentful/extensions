/* global global */

'use strict';

const React = require('react');
const renderer = require('react-test-renderer');

const { mockComponent } = require('./helpers.js');

jest.mock('@contentful/forma-36-react-components', () => ({
  Button: mockComponent('button')
}));

const { CommerceToolsDialog } = require('./../src/dialog.js');

describe('CommerceToolsDialog', function() {
  test('renders correctly', function() {
    const extension = {};
    const parameters = {
      projectKey: '',
      clientId: '',
      clientSecret: '',
      apiUri: '',
      authUri: '',
      locale: 'en'
    };

    global.CTPicker = class CTPicker {
      init() {
        return Promise.resolve();
      }

      show() {
        return Promise.resolve();
      }
    };

    const tree = renderer
      .create(
        <CommerceToolsDialog extension={extension} parameters={parameters} isSingle={false} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();

    delete global.CTPicker;
  });
});
