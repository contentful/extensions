'use strict';

const React = require('react');
const renderer = require('react-test-renderer');

const { mockComponent } = require('./mock-component.js');

jest.mock('@contentful/forma-36-react-components', () => ({
  Icon: mockComponent('icon'),
  Paragraph: mockComponent('paragraph')
}));

const { Message } = require('../src/message.js');

test('Message: renders correctly', function() {
  const message = {
    message: "Don't do this",
    ruleId: 'simon-says'
  };
  const tree = renderer.create(<Message message={message} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Message: shows optional note', function() {
  const message = {
    message: "Don't do this",
    ruleId: 'simon-says',
    note: "you really shouldn't"
  };
  const tree = renderer.create(<Message message={message} />).toJSON();
  expect(tree).toMatchSnapshot();
});
