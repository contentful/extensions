import React from 'react';
import { cleanup, render, wait, fireEvent, act, configure } from '@testing-library/react';

import AppPage from '../src/AppPage';
import mockProps from './mockProps';
import projectData from './mockData/project.json';
import contentTypesData from './mockData/contentTypes.json';

const basicProps = {
  openAuth: () => {},
  accessToken: '',
  client: {
    getProjects: () => Promise.resolve(projectData)
  },
  sdk: mockProps.sdk
};

configure({ testIdAttribute: 'data-test-id' });

describe('AppPage', () => {
  afterEach(cleanup);
  // There is potentially a bug with @testing-library/react here. The order that these tests run
  // actually seems to matter. I tried calling `cleanup` in various ways but it didn't work.
  // This test must run before the other unfortunately.
  it('should render the Optimizely config and allow for adding content types', async () => {
    let configFunc = null;

    const sdk = {
      ...basicProps.sdk,
      space: {
        getContentTypes: jest.fn(() => Promise.resolve(contentTypesData))
      },
      app: {
        setReady: jest.fn(),
        getParameters: jest.fn(() => Promise.resolve({ optimizelyProjectId: '123' })),
        onConfigure: jest.fn(fn => {
          configFunc = fn;
        })
      }
    };

    const props = { ...basicProps, accessToken: '123', sdk };

    const { container, getByTestId } = render(<AppPage {...props} />);

    await wait(() => {
      if (!configFunc) {
        throw '';
      }
    });

    await configFunc();
    expect(container).toMatchSnapshot();

    act(() => {
      fireEvent.click(getByTestId('add-content'));
    });

    // first we select the `select` element
    getByTestId('content-type-selector').click();
    // then we select the first `option` element
    getByTestId('content-type-selector').firstChild.click();

    expect(getByTestId('content-type-selector')).toMatchSnapshot();
  });

  it('should render the AppPage with Features and connect button', () => {
    const { container } = render(<AppPage {...basicProps} />);

    expect(container).toMatchSnapshot();
  });

  it('should render the AppPage loading when first connected to Optimizely', () => {
    const props = { ...basicProps, accessToken: '123' };

    const { container } = render(<AppPage {...props} />);

    expect(container).toMatchSnapshot();
  });
});
