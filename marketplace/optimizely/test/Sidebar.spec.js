import React from 'react';
import { cleanup, render, configure } from '@testing-library/react';

import Sidebar from '../src/Sidebar';

let LOCATION = 'entry-sidebar';
let PROJECT_ID = '123';
let VALID_FIELDS = true;

const mockUnsub = jest.fn();

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
      startAutoResizer: jest.fn(),
      stopAutoResizer: jest.fn()
    },
    ids: {},
    space: {},
    locales: {},
    entry: {
      fields: {
        experimentId: {
          getValue: jest.fn(() => 'exp123'),
          onValueChanged: jest.fn(() => mockUnsub)
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

describe('Sidebar', () => {
  afterEach(cleanup);

  it('should run all lifecycle methods', () => {
    const sdk = mockSdk();

    const { unmount } = render(<Sidebar sdk={sdk} />);

    expect(sdk.window.startAutoResizer).toHaveBeenCalledTimes(1);

    expect(sdk.entry.fields.experimentId.getValue).toHaveBeenCalledTimes(1);
    expect(sdk.entry.fields.experimentId.onValueChanged).toHaveBeenCalledTimes(1);
    expect(typeof sdk.entry.fields.experimentId.onValueChanged.mock.calls[0][0]).toEqual(
      'function'
    );

    unmount();

    expect(sdk.window.stopAutoResizer).toHaveBeenCalledTimes(1);
    expect(mockUnsub).toHaveBeenCalledTimes(1);
  });

  it('should use the project ID to create urls', () => {
    const sdk = mockSdk();
    const { getByTestId } = render(<Sidebar sdk={sdk} />);

    expect(getByTestId('view-experiment').href).toBe(
      'https://app.optimizely.com/v2/projects/123/experiments/exp123/variations'
    );

    expect(getByTestId('view-all').href).toBe(
      'https://app.optimizely.com/v2/projects/123/experiments'
    );
  });
});
