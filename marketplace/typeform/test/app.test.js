'use strict';

const React = require('react');
const renderer = require('react-test-renderer');

const { mockComponent, flushPromises } = require('./helpers.js');

jest.mock('@contentful/forma-36-react-components', () => ({
  TextInput: mockComponent('text-input'),
  Select: mockComponent('select'),
  Option: mockComponent('option'),
}));

jest.mock('../src/warning.js', () => ({
  Warning: mockComponent('warning'),
}));

let mockFetchForms = () => Promise.resolve([]);

jest.mock('../src/fetch.js', () => ({
  fetchForms: (workspaceId, accessToken) =>
    mockFetchForms(workspaceId, accessToken),
}));

const { App } = require('../src/app.js');

describe('App', function() {
  test('renders loading state', function() {
    const isRequired = false;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return undefined;
        },
      },
    };

    const tree = renderer
      .create(<App isRequired={isRequired} parameters={parameters} sdk={sdk} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders error state', function() {
    mockFetchForms = () => Promise.reject(new Error("ain't working"));
    const isRequired = false;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return undefined;
        },
      },
    };

    const tree = renderer.create(
      <App isRequired={isRequired} parameters={parameters} sdk={sdk} />
    );

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  test('renders error state with the field being required', function() {
    mockFetchForms = () => Promise.reject(new Error("ain't working"));
    const isRequired = true;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return undefined;
        },
      },
    };

    const tree = renderer.create(
      <App isRequired={isRequired} parameters={parameters} sdk={sdk} />
    );

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  test('renders error state with previous value', function() {
    mockFetchForms = () => Promise.reject(new Error("ain't working"));
    const isRequired = false;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return 'ABCDEF';
        },
      },
    };

    const tree = renderer.create(
      <App isRequired={isRequired} parameters={parameters} sdk={sdk} />
    );

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  test('renders with forms', function() {
    mockFetchForms = () =>
      Promise.resolve([
        { id: '123', title: 'First form' },
        { id: '345', title: 'Second form' },
        { id: '678', title: 'Third form' },
      ]);
    const isRequired = false;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return undefined;
        },
      },
    };

    const tree = renderer.create(
      <App isRequired={isRequired} parameters={parameters} sdk={sdk} />
    );

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  test('renders with forms and being required', function() {
    mockFetchForms = () =>
      Promise.resolve([
        { id: '123', title: 'First form' },
        { id: '345', title: 'Second form' },
        { id: '678', title: 'Third form' },
      ]);
    const isRequired = true;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return undefined;
        },
      },
    };

    const tree = renderer.create(
      <App isRequired={isRequired} parameters={parameters} sdk={sdk} />
    );

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  test('renders with forms and previous value', function() {
    mockFetchForms = () =>
      Promise.resolve([
        { id: '123', title: 'First form' },
        { id: '345', title: 'Second form' },
        { id: '678', title: 'Third form' },
      ]);
    const isRequired = true;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return '123';
        },
      },
    };

    const tree = renderer.create(
      <App isRequired={isRequired} parameters={parameters} sdk={sdk} />
    );

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  test('renders with forms and no longer existing previous value', function() {
    mockFetchForms = () =>
      Promise.resolve([
        { id: '123', title: 'First form' },
        { id: '345', title: 'Second form' },
        { id: '678', title: 'Third form' },
      ]);
    const isRequired = true;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return '234';
        },
      },
    };

    const tree = renderer.create(
      <App isRequired={isRequired} parameters={parameters} sdk={sdk} />
    );

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });
});
