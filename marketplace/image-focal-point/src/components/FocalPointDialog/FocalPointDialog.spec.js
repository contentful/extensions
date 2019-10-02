import React from 'react';
import { render } from '@testing-library/react';

import mockProps from '../../test/mockProps';
import { FocalPointDialog } from './FocalPointDialog';

const props = {
  file: mockProps.file,
  focalPoint: mockProps.focalPoint,
  onClose: jest.fn(),
  onSave: jest.fn(),
  sdk: mockProps.sdk
};

describe('FocalPointDialog', () => {
  it('should render the focal point dialog', () => {
    const { container } = render(<FocalPointDialog {...props} />);
    expect(container).toMatchSnapshot();
  });
});
