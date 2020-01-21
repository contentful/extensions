/* global global */
import React from 'react';
import { cleanup, render, configure } from '@testing-library/react';

import App from '../src';
global.window.close = () => {};
global.window.encodeURIComponent = x => x;
global.window.addEventListener = jest.fn();

global.window.localStorage = {
  getItem: () => {},
  setItem: () => {}
};

const LOCATION_ENTRY_SIDEBAR = 'entry-sidebar';
const LOCATION_ENTRY_EDITOR = 'entry-editor';

let LOCATION = '';
let PROJECT_ID = '';
let VALID_FIELDS = false;

function mockSdk() {
  return {
    parameters: {
      installation: {
        optimizelyProjectId: PROJECT_ID
      }
    },
    location: {
      is: jest.fn(l => {
        return l === LOCATION;
      })
    },
    window: {
      startAutoResizer: () => {},
      stopAutoResizer: () => {}
    },
    ids: {},
    space: {},
    locales: {},
    entry: {
      fields: {
        experimentId: {
          getValue: jest.fn(() => 'exp123'),
          onValueChanged: jest.fn(() => jest.fn())
        },
        meta: {
          getValue: jest.fn(),
          onValueChanged: jest.fn(() => jest.fn())
        },
        variations: {
          getValue: jest.fn(),
          onValueChanged: jest.fn(() => jest.fn())
        }
      }
    },
    contentType: {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'cyu19ucaypb9'
          }
        },
        id: 'variationContainer',
        type: 'ContentType',
        createdAt: '2019-05-24T07:45:48.863Z',
        updatedAt: '2019-05-30T04:28:43.488Z',
        environment: {
          sys: {
            id: 'master',
            type: 'Link',
            linkType: 'Environment'
          }
        },
        revision: 3
      },
      name: 'Variation Container',
      description: null,
      displayField: 'experimentTitle',
      fields: [
        {
          id: 'experimentTitle',
          name: 'Experiment title',
          type: 'Symbol',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false
        },
        {
          id: 'experimentId',
          name: 'Experiment ID',
          type: 'Symbol',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false
        },
        {
          id: 'meta',
          name: 'Meta',
          type: 'Object',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false
        },
        {
          id: 'variations',
          name: 'Variations',
          type: 'Array',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false,
          items: {
            type: 'Link',
            validations: [],
            linkType: 'Entry'
          }
        }
      ].concat(
        VALID_FIELDS
          ? {
              id: 'experimentKey',
              name: 'Experiment key',
              type: 'Symbol',
              localized: false,
              required: false,
              validations: [],
              disabled: false,
              omitted: false
            }
          : []
      )
    }
  };
}

configure({ testIdAttribute: 'data-test-id' });

describe('Optimizely App', () => {
  afterEach(() => {
    cleanup();

    LOCATION = '';
    PROJECT_ID = '';
    VALID_FIELDS = false;
  });

  it('should render the missing project on the sidebar', () => {
    LOCATION = LOCATION_ENTRY_SIDEBAR;
    const sdk = mockSdk();
    const { getByTestId } = render(<App sdk={sdk} />);

    expect(getByTestId('missing-project')).toMatchSnapshot();
  });

  it('should render the sidebar', () => {
    LOCATION = LOCATION_ENTRY_SIDEBAR;
    PROJECT_ID = '123';
    const sdk = mockSdk();
    const { getByTestId } = render(<App sdk={sdk} />);

    expect(getByTestId('sidebar')).toMatchSnapshot();
  });

  it('should render the incorrect type message', () => {
    LOCATION = LOCATION_ENTRY_EDITOR;
    PROJECT_ID = '123';
    const sdk = mockSdk();

    const { getByTestId } = render(<App sdk={sdk} />);
    expect(getByTestId('incorrect-type')).toMatchSnapshot();
  });

  it('should render the editor page', () => {
    LOCATION = LOCATION_ENTRY_EDITOR;
    PROJECT_ID = '123';
    VALID_FIELDS = true;
    const sdk = mockSdk();

    const { getByTestId } = render(<App sdk={sdk} />);
    expect(getByTestId('editor-page')).toMatchSnapshot();
  });
});
