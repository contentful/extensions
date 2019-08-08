'use strict';

const React = require('react');
const renderer = require('react-test-renderer');

const { mockComponent } = require('./helpers.js');

jest.mock('@contentful/forma-36-react-components', () => ({
  Icon: mockComponent('icon'),
  Typography: mockComponent('typography'),
  Paragraph: mockComponent('paragraph')
}));

const { Warning } = require('../src/warning.js');

describe('Warning', function() {
  test('renders correctly', function() {
    const tree = renderer.create(<Warning>A warning</Warning>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly with different color', function() {
    const tree = renderer
      .create(<Warning iconColor="negative">A more severe warning</Warning>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
