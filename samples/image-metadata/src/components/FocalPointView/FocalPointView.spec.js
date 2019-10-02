import React from 'react';
import { render } from '@testing-library/react';

import { FocalPointView } from './FocalPointView';

const props = {
  focalPoint: {
    x: 10,
    y: 30
  },
  showFocalPointDialog: jest.fn()
};

describe('FocalPointView', () => {
  it('should render the focal point field view', () => {
    const { container } = render(<FocalPointView {...props} />);
    expect(container).toMatchSnapshot();
  });
});
