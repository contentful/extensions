'use strict';

const React = require('react');
const renderer = require('react-test-renderer');

const { mockComponent } = require('./mock-component.js');

jest.mock('@contentful/forma-36-react-components', () => ({
  Icon: mockComponent('icon'),
  Typography: mockComponent('typography'),
  Subheading: mockComponent('subheading'),
  Paragraph: mockComponent('paragraph')
}));

const { NoIssues } = require('../src/no-issues.js');

test('NoIssues: renders correctly', function() {
  const tree = renderer.create(<NoIssues />).toJSON();
  expect(tree).toMatchSnapshot();
});
