'use strict';

const React = require('react');
const renderer = require('react-test-renderer');
const { advanceTo } = require('jest-date-mock');

const { mockComponent } = require('./mock-component.js');

advanceTo(2016, 5, 27, 11, 32, 16);

jest.mock('../src/timeline.js', () => ({
  Timeline: mockComponent('timeline'),
}));

jest.mock('@contentful/forma-36-react-components', () => ({
  Icon: mockComponent('icon'),
}));

const { Analytics } = require('../src/analytics.js');

describe('Analytics', function() {
  test('renders correctly', function() {
    const tree = renderer
      .create(<Analytics viewId="ga:123456" pagePath="/pricing/" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
