/* global global */
import { render } from 'react-dom';

const mockGetElementById = jest.fn(id => id);
const mockFetch = jest.fn(() => Promise.resolve());

global.window.fetch = mockFetch;
global.window.document.getElementById = mockGetElementById;

function loadEntryPoint() {
  jest.isolateModules(() => {
    require('../src/index');
  });
}

jest.mock('react-dom');

const mockSdk = {
  parameters: {
    installation: {
      previewUrl: 'https://preview.com',
      webhookUrl: 'https://webhook.com',
      authToken: 'test-token'
    }
  },
  entry: {
    onSysChanged: jest.fn(),
    fields: {
      slug: {
        getValue: jest.fn(() => 'preview-slug')
      }
    }
  },
  window: {
    startAutoResizer: jest.fn()
  },
  notifier: {
    success: jest.fn(),
    error: jest.fn()
  }
};

function doSdkMock() {
  jest.doMock('contentful-ui-extensions-sdk', () => {
    return {
      __esModule: true,
      init: jest.fn(fn => fn(mockSdk))
    };
  });
}

describe('Gatsby Preview entry point', () => {
  beforeEach(() => {
    doSdkMock();
  });
  afterEach(() => {
    render.mockClear();
    jest.unmock('contentful-ui-extensions-sdk');
  });

  it('should initialize the app', () => {
    loadEntryPoint();

    const [renderedComponent, root] = render.mock.calls[0];
    expect(renderedComponent.props).toEqual({ sdk: mockSdk });
    expect(root).toEqual('root');
  });
});
