import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Props, ProductList } from '.';
import productPreviews from '../../__mocks__/productPreviews';

const defaultProps: Props = {
  products: productPreviews,
  selectProduct: jest.fn(),
  selectedSKUs: []
};

const renderComponent = (props: Props) => {
  return render(<ProductList {...props} />);
};

describe('ProductList', () => {
  afterEach(cleanup);

  it('should render successfully with no items selected', async () => {
    const component = renderComponent(defaultProps);
    expect(component.container).toMatchSnapshot();
  });

  it('should render successfully with selected items', () => {
    const component = renderComponent({
      ...defaultProps,
      selectedSKUs: [productPreviews[1].sku]
    });
    expect(component.container).toMatchSnapshot();
  });
});
