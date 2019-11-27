import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Props, ProductSelectionList } from '.';
import productPreviews from '../../__mocks__/productPreviews';

const defaultProps: Props = {
  products: productPreviews,
  selectProduct: jest.fn()
};

const renderComponent = (props: Props) => {
  return render(<ProductSelectionList {...props} />);
};

describe('ProductSelectionList', () => {
  afterEach(cleanup);

  it('should render successfully', async () => {
    const component = renderComponent(defaultProps);
    expect(component.container).toMatchSnapshot();
  });
});
