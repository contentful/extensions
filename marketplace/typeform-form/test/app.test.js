'use strict';

const React = require('react');
const renderer = require('react-test-renderer');

const { mockComponent, flushPromises } = require('./helpers.js');

jest.mock('@contentful/forma-36-react-components', () => ({
  TextInput: mockComponent('text-input'),
  Select: mockComponent('select'),
  Option: mockComponent('option')
}));

jest.mock('../src/warning.js', () => ({
  Warning: mockComponent('warning')
}));

let mockFetchForms = () => Promise.resolve([]);

jest.mock('../src/fetch.js', () => ({
  fetchForms: (workspaceId, accessToken) => mockFetchForms(workspaceId, accessToken)
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
        onValueChanged() {},
        onIsDisabledChanged() {}
      }
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
        onValueChanged() {},
        onIsDisabledChanged() {}
      }
    };

    const tree = renderer.create(<App isRequired={isRequired} parameters={parameters} sdk={sdk} />);

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
        onValueChanged() {},
        onIsDisabledChanged() {}
      }
    };

    const tree = renderer.create(<App isRequired={isRequired} parameters={parameters} sdk={sdk} />);

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  test('renders error state with previous value', function() {
    mockFetchForms = () => Promise.reject(new Error("ain't working"));
    const isRequired = false;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return 'https://cf-exts.typeform.com/to/ABCDEF';
        },
        onValueChanged() {},
        onIsDisabledChanged() {}
      }
    };

    const tree = renderer.create(<App isRequired={isRequired} parameters={parameters} sdk={sdk} />);

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  test('renders with forms', function() {
    mockFetchForms = () =>
      Promise.resolve([
        {
          id: '123',
          title: 'First form',
          _links: { display: 'https://cf-exts.typeform.com/to/123' }
        },
        {
          id: '345',
          title: 'Second form',
          _links: { display: 'https://cf-exts.typeform.com/to/345' }
        },
        {
          id: '678',
          title: 'Third form',
          _links: { display: 'https://cf-exts.typeform.com/to/678' }
        }
      ]);
    const isRequired = false;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return undefined;
        },
        onValueChanged() {},
        onIsDisabledChanged() {}
      }
    };

    const tree = renderer.create(<App isRequired={isRequired} parameters={parameters} sdk={sdk} />);

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  test('renders with forms and being required', function() {
    mockFetchForms = () =>
      Promise.resolve([
        {
          id: '123',
          title: 'First form',
          _links: { display: 'https://cf-exts.typeform.com/to/123' }
        },
        {
          id: '345',
          title: 'Second form',
          _links: { display: 'https://cf-exts.typeform.com/to/345' }
        },
        {
          id: '678',
          title: 'Third form',
          _links: { display: 'https://cf-exts.typeform.com/to/678' }
        }
      ]);
    const isRequired = true;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return undefined;
        },
        onValueChanged() {},
        onIsDisabledChanged() {}
      }
    };

    const tree = renderer.create(<App isRequired={isRequired} parameters={parameters} sdk={sdk} />);

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  test('renders with forms and previous value', function() {
    mockFetchForms = () =>
      Promise.resolve([
        {
          id: '123',
          title: 'First form',
          _links: { display: 'https://cf-exts.typeform.com/to/123' }
        },
        {
          id: '345',
          title: 'Second form',
          _links: { display: 'https://cf-exts.typeform.com/to/345' }
        },
        {
          id: '678',
          title: 'Third form',
          _links: { display: 'https://cf-exts.typeform.com/to/678' }
        }
      ]);
    const isRequired = true;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return 'https://cf-exts.typeform.com/to/123';
        },
        onValueChanged() {},
        onIsDisabledChanged() {}
      }
    };

    const tree = renderer.create(<App isRequired={isRequired} parameters={parameters} sdk={sdk} />);

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  test('renders with forms and no longer existing previous value', function() {
    mockFetchForms = () =>
      Promise.resolve([
        {
          id: '123',
          title: 'First form',
          _links: { display: 'https://cf-exts.typeform.com/to/123' }
        },
        {
          id: '345',
          title: 'Second form',
          _links: { display: 'https://cf-exts.typeform.com/to/345' }
        },
        {
          id: '678',
          title: 'Third form',
          _links: { display: 'https://cf-exts.typeform.com/to/678' }
        }
      ]);
    const isRequired = true;
    const parameters = { accessToken: 'abc', workspaceId: '123' };
    const sdk = {
      field: {
        getValue() {
          return 'https://cf-exts.typeform.com/to/234';
        },
        onValueChanged() {},
        onIsDisabledChanged() {}
      }
    };

    const tree = renderer.create(<App isRequired={isRequired} parameters={parameters} sdk={sdk} />);

    return flushPromises().then(() => expect(tree.toJSON()).toMatchSnapshot());
  });
});
