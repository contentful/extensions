/* global global */
import React from 'react';
import OptimizelyClient from '../src/optimizely-client';
import { render } from 'react-dom';
import { MissingProjectId } from '../src/components/errors-messages';

let LOCATION = '';
const mockGetElementById = jest.fn(id => id);

global.window.document.getElementById = mockGetElementById;

function mockSdk() {
  jest.doMock('../src/sdk', () => {
    return {
      __esModule: true,
      init: jest.fn(fn =>
        fn({
          parameters: {
            installation: {
              optimizelyProjectId: ''
            }
          },
          location: {
            is: jest.fn(l => {
              return l === LOCATION;
            })
          }
        })
      ),
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

describe('Optimizely UIE entry', () => {
  beforeEach(() => {
    mockSdk();
    jest.isolateModules(() => {
      require('../src/index');
    });
  });

  afterEach(() => {
    OptimizelyClient.mockClear();
    jest.unmock('../src/sdk');
  });

  it('should instantiate the optimizely client on init', () => {
    expect(OptimizelyClient).toHaveBeenCalledTimes(1);
  });
  it('should render MissingProjectId screen if no projectId exists', () => {
    LOCATION = 'entry-editor';
    require('../src/index');
    expect(render).toHaveBeenCalledWith(<MissingProjectId />, 'root');
  });
  it('should render App if contentType is valid', () => {});
  it('should render IncorrectContentType if contentType is invalid', () => {});
  it('should render AppSidebar if in sidebar location', () => {});
});
