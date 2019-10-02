import React from 'react';
import { render } from '@testing-library/react';

import mockProps from '../../test/mockProps';
import { ImagePreviewWithFocalPoint } from './ImagePreviewWithFocalPoint';

const props = {
  file: mockProps.file,
  focalPoint: {
    x: 10,
    y: 30
  },
  wrapperWidth: 320,
  wrapperHeight: 180,
  subtitle: 'Desktop'
};

describe('ImagePreviewWithFocalPoint', () => {
  it('should render the image preview with a focal point', () => {
    const { container } = render(<ImagePreviewWithFocalPoint {...props} />);
    expect(container).toMatchSnapshot();
  });
});
