import React from 'react';
import { configure, render, cleanup } from '@testing-library/react';
import { Props, ProductList } from './ProductList';
import productPreviews from './__mocks__/productPreviews';

configure({
  testIdAttribute: 'data-test-id'
});

const defaultProps: Props = {
  products: productPreviews,
  selectProduct: jest.fn(),
  selectedSKUs: []
};

const renderComponent = (props: Props) => {
  return render(<ProductList {...props} />);
};

describe('ProductListItem', () => {
  afterEach(cleanup);

  it('should render successfully', async () => {
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
