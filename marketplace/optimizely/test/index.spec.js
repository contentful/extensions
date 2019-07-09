/* global global */
import React from 'react';
import OptimizelyClient from '../src/optimizely-client';
import { render } from 'react-dom';
import App from '../src/app';
import AppSidebar from '../src/app-sidebar';
import { IncorrectContentType, MissingProjectId } from '../src/components/errors-messages';

let LOCATION = '';
let PROJECT_ID = '';
let VALID_FIELDS = false;
const mockGetElementById = jest.fn(id => id);

global.window.document.getElementById = mockGetElementById;

function loadEntryPoint() {
  jest.isolateModules(() => {
    require('../src/index');
  });
}

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
    ids: {},
    space: {},
    locales: {},
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

function makeSdk() {
  jest.doMock('../src/sdk', () => {
    return {
      __esModule: true,
      init: jest.fn(fn => fn(mockSdk())),
      locations: {
        LOCATION_ENTRY_FIELD: 'entry-field',
        LOCATION_ENTRY_FIELD_SIDEBAR: 'entry-field-sidebar',
        LOCATION_ENTRY_SIDEBAR: 'entry-sidebar',
        LOCATION_DIALOG: 'dialog',
        LOCATION_ENTRY_EDITOR: 'entry-editor'
      }
    };
  });

  require('../src/sdk');
}

jest.mock('../src/optimizely-client');

jest.mock('react-dom');

describe('Optimizely UIE entry point', () => {
  beforeEach(() => {
    makeSdk();
  });

  afterEach(() => {
    LOCATION = '';
    PROJECT_ID = '';
    VALID_FIELDS = false;
    OptimizelyClient.mockClear();
    render.mockClear();
    jest.unmock('../src/sdk');
  });

  it('should instantiate the optimizely client on init', () => {
    PROJECT_ID = '123';
    loadEntryPoint();
    const [{ sdk, project }] = OptimizelyClient.mock.calls[0];
    expect(project).toEqual(PROJECT_ID);
    expect(JSON.stringify(sdk)).toEqual(JSON.stringify(mockSdk()));
  });
  it('should render MissingProjectId screen if no projectId exists', () => {
    LOCATION = 'entry-editor';
    loadEntryPoint();

    expect(render).toHaveBeenCalledWith(<MissingProjectId />, 'root');
  });
  it('should render App if contentType is valid', () => {
    LOCATION = 'entry-editor';
    PROJECT_ID = '123';
    VALID_FIELDS = true;
    loadEntryPoint();
    const [component] = render.mock.calls[0];
    const { sdk, client } = component.props;
    expect(render).toHaveBeenCalledWith(<App sdk={sdk} client={client} />, 'root');
  });
  it('should render IncorrectContentType if contentType is invalid', () => {
    LOCATION = 'entry-editor';
    PROJECT_ID = '123';
    loadEntryPoint();
    const [component] = render.mock.calls[0];
    const { sdk, missingFields } = component.props;
    expect(render).toHaveBeenCalledWith(
      <IncorrectContentType sdk={sdk} missingFields={missingFields} />,
      'root'
    );
  });
  it('should render AppSidebar if in sidebar location', () => {
    LOCATION = 'entry-sidebar';
    PROJECT_ID = '123';
    loadEntryPoint();
    const [component] = render.mock.calls[0];
    const { sdk, client } = component.props;
    expect(render).toHaveBeenCalledWith(<AppSidebar sdk={sdk} client={client} />, 'root');
  });
});
