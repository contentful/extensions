import React from 'react';
import { render } from '@testing-library/react';

import AppSidebar from '../src/app-sidebar';

describe('AppSidebar', () => {
  function makeSdk(hasExperiment = false) {
    return {
      window: {
        startAutoResizer: () => {},
        stopAutoResizer: () => {}
      },
      entry: {
        fields: {
          experimentId: {
            onValueChanged: jest.fn(),
            getValue: jest.fn(() => (hasExperiment ? 'test-experiment' : undefined))
          }
        }
      }
    };
  }

  const mockClient = {
    getExperimentUrl: jest.fn(id => `experiment-url-${id}`),
    getAllExperimentsUrl: jest.fn(() => 'all-experiment-url')
  };
  it('should match snapshot for disabled', () => {
    const { container } = render(<AppSidebar sdk={makeSdk()} client={mockClient} />);

    expect(container).toMatchSnapshot();
  });
  it('should match snapshot for enabled', () => {
    const { container } = render(<AppSidebar sdk={makeSdk(true)} client={mockClient} />);

    expect(container).toMatchSnapshot();
  });
});
