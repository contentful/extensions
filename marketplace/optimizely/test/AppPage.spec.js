import React from 'react';
import { cleanup, render, wait } from '@testing-library/react';

import AppPage from '../src/AppPage';
import mockProps from './mockProps';
import projectData from './mockData/project.json';
import contentTypesData from './mockData/contentTypes.json';

const basicProps = {
  openAuth: jest.fn(),
  accessToken: '',
  client: {},
  sdk: mockProps.sdk
};

describe('AppPage', () => {
  afterEach(cleanup);

  it('should render the AppPage with Features and connect button', () => {
    const { container } = render(<AppPage {...basicProps} />);

    expect(container).toMatchSnapshot();
  });

  it('should render the AppPage loading when first connected to Optimizely', () => {
    const props = { ...basicProps, accessToken: '123' };

    const { container } = render(<AppPage {...props} />);

    expect(container).toMatchSnapshot();
  });

  it.skip('should render the Optimizely config when loaded', async () => {
    const client = {
      getProjects: () => Promise.resolve(projectData)
    };

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

    const props = { ...basicProps, accessToken: '123', client, sdk };

    const { container } = render(<AppPage {...props} />);

    await wait();
    await configFunc();
    await wait();

    expect(container).toMatchSnapshot();
  });
});
