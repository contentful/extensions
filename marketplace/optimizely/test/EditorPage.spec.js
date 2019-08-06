import React from 'react';
import { cleanup, render, wait, configure } from '@testing-library/react';

import mockProps from './mockProps';
import mockVariantData from './mockData/mockVariantData';

import EditorPage from '../src/EditorPage';

configure({ testIdAttribute: 'data-test-id' });

describe('EditorPage', () => {
  afterEach(cleanup);

  it('should show the reauth modal when no client is available', () => {
    const { getByTestId } = render(<EditorPage sdk={mockProps.sdk} />);

    expect(getByTestId('reconnect-optimizely')).toMatchSnapshot();
  });

  it('should show the preemtive reconnect warning box', () => {
    const expires = (Date.now() + 50000).toString();
    const { getByTestId } = render(
      <EditorPage sdk={mockProps.sdk} client={() => {}} expires={expires} />
    );

    expect(getByTestId('preemptive-connect')).toMatchSnapshot();
  });

  it('should show the experiment data when loaded', async () => {
    const space = {
      getContentTypes: () => Promise.resolve(mockVariantData.contentTypes),
      getEntries: () => Promise.resolve(mockVariantData.entries)
    };

    let valueChange = null;

    const sdk = { ...mockProps.sdk, space };

    sdk.entry.fields.experimentTitle.setValue = jest.fn();
    sdk.entry.fields.experimentId.onValueChanged = fn => {
      valueChange = fn;
      return () => {};
    };

    const client = {
      getExperiments: () => Promise.resolve(mockVariantData.experiments),
      getResultsUrl: (campaignUrl, experimentId) => {
        return `https://app.optimizely.com/v2/projects/123/results/${campaignUrl}/experiments/${experimentId}`;
      },
      getExperimentResults: () => Promise.resolve(mockVariantData.results)
    };

    const expires = (Date.now + 10000000).toString();
    const { container } = render(
      <EditorPage sdk={sdk} expires={expires} client={client} openAuth={() => {}} />
    );

    await wait();
    valueChange('15049730511');

    await wait();

    expect(container).toMatchSnapshot();
  });
});
