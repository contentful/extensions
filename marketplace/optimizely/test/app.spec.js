import React from 'react';
import { cleanup, render } from '@testing-library/react';

import App from '../src/app';
import mockProps from './mockProps';

describe('App', () => {
  afterEach(cleanup);

  it('should match the snapshot', () => {
    const { container } = render(<App {...mockProps} />);

    expect(container).toMatchSnapshot();
  });
});
