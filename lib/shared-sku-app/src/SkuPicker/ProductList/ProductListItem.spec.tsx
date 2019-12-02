import React from 'react';
import { fireEvent, configure, render, cleanup } from '@testing-library/react';
import { Props, ProductListItem } from './ProductListItem';
import productPreviews from '../../__mocks__/productPreviews';

configure({
  testIdAttribute: 'data-test-id'
});

const defaultProps: Props = {
  product: productPreviews[0],
  selectProduct: jest.fn(),
  isSelected: false
};

const renderComponent = (props: Props) => {
  return render(<ProductListItem {...props} />);
};

describe('ProductListItem', () => {
  afterEach(cleanup);

  it('should render successfully', async () => {
    const component = renderComponent(defaultProps);
    fireEvent(component.getByTestId('image'), new Event('load'));
    expect(component.container).toMatchSnapshot();
  });

  it('should render successfully the isSelected variation', () => {
    const component = renderComponent({ ...defaultProps, isSelected: true });
    fireEvent(component.getByTestId('image'), new Event('load'));
    expect(component.container).toMatchSnapshot();
  });

  it('should render successfully the loading variation', () => {
    const component = renderComponent(defaultProps);
    expect(component.container).toMatchSnapshot();
  });

  it('should render successfully the error variation', () => {
    const component = renderComponent({ ...defaultProps, isSelected: true });
    fireEvent(component.getByTestId('image'), new Event('error'));
    expect(component.container).toMatchSnapshot();
  });
});
