import React from 'react';
import { cleanup, render, wait } from '@testing-library/react';

import AppPage from '../src/AppPage';
import mockProps from './mockProps';
import projectData from './mockData/project.json';
import contentTypesData from './mockData/contentTypes.json';

const basicProps = {
  openAuth: () => {},
  accessToken: '',
  client: {},
  sdk: mockProps.sdk
};

describe('AppPage', () => {
  afterEach(cleanup);
  // There is potentially a bug with react/testing library here. The order that these tests run
  // actually seems to matter. I tried calling `cleanup` in various ways but it didn't work.
  // This test must run before the other unfortunately.
  it('should render the Optimizely config when loaded', async () => {
    let configFunc = null;

    const platformAlpha = {
      app: {
        getParameters: jest.fn(() => Promise.resolve({ optimizelyProjectId: '123' })),
        onConfigure: jest.fn(fn => {
          configFunc = fn;
        })
      }
    };

    const space = {
      getContentTypes: jest.fn(() => Promise.resolve(contentTypesData))
    };

    const sdk = { ...basicProps.sdk, platformAlpha, space };

    const client = {
      getProjects: () => Promise.resolve(projectData)
    };

    const props = { ...basicProps, accessToken: '123', client, sdk };

    const { container } = render(<AppPage {...props} />);

    await wait(() => {
      if (!configFunc) {
        throw '';
      }
    });

    await configFunc();
    expect(container).toMatchSnapshot();
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
