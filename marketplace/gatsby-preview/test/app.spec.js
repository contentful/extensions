import React from 'react';
import { render, cleanup } from '@testing-library/react';

import App from '../src/index';

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

describe('Gatsby React App', () => {
  afterEach(cleanup);

  it('should match snapshot', () => {
    const { container } = render(<App sdk={mockSdk} />);

    expect(container).toMatchSnapshot();
  });
});
