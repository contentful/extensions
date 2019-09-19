import React from 'react';
import { render } from '@testing-library/react';

import { FocalPoint } from './FocalPoint';

const props = {
  focalPoint: {
    x: 10,
    y: 30
  }
};

describe('FocalPoint', () => {
  it('should render the focal point', () => {
    const { container } = render(<FocalPoint {...props} />);
    expect(container).toMatchSnapshot();
  });
});
