import React from 'react';
import identity from 'lodash/identity';
import merge from 'lodash/merge';
import { fireEvent, configure, render, cleanup } from '@testing-library/react';
import { Props, SkuPicker } from './SkuPicker';
import productPreviews from '../__mocks__/productPreviews';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';

configure({
  testIdAttribute: 'data-test-id'
});

const defaultProps: Props = {
  sdk: ({
    parameters: {
      installation: {},
      invocation: {
        fieldType: 'Symbol',
        fieldValue: []
      }
    },
    close: jest.fn(),
    notifier: {
      success: jest.fn(),
      error: jest.fn()
    }
  } as unknown) as DialogExtensionSDK,
  fetchProductPreviews: jest.fn(skus =>
    productPreviews.filter(preview => skus.includes(preview.sku))
  ) as any,
  fetchProducts: jest.fn(() => ({
    pagination: {
      count: 3,
      limit: 20,
      offset: 0,
      total: 3
    },
    products: productPreviews
  })) as any
};

const renderComponent = async (props: Props) => {
  const component = render(<SkuPicker {...props} />);
  // wait for data to load and render
  await component.findByText('Dress Twin-Set rose');
  component.getAllByTestId('image').forEach(img => fireEvent(img, new Event('load')));
  return component;
};

jest.mock('react-sortable-hoc', () => ({
  SortableContainer: identity,
  SortableElement: identity,
  SortableHandle: identity
}));

describe('SkuPicker', () => {
  afterEach(cleanup);

  it('should render successfully with no products selected', async () => {
    const { container } = await renderComponent(defaultProps);
    expect(container).toMatchSnapshot();
  });

  describe('when it has infinite scrolling mode pagination', () => {
    it('should render the "Load more" text link if there is a next page', async () => {
      const { findByTestId } = await renderComponent({
        ...defaultProps,
        fetchProducts: jest.fn(() => ({
          pagination: {
            hasNextPage: true
          },
          products: productPreviews.slice(0, 2)
        })) as any
      });
      expect(await findByTestId('infinite-scrolling-pagination')).toBeTruthy();
    });

    it('should not render the "Load more" text link if there is no next page', async () => {
      const { queryByTestId } = await renderComponent({
        ...defaultProps,
        fetchProducts: jest.fn(() => ({
          pagination: {
            hasNextPage: false
          },
          products: productPreviews.slice(0, 2)
        })) as any
      });
      expect(queryByTestId('infinite-scrolling-pagination')).toBeNull();
    });
  });

  describe('when it is operating on a field of type Symbol', () => {
    it('should allow the user to select only one product', async () => {
      const { queryByTestId, findByTestId } = await renderComponent(defaultProps);
      const productA = await findByTestId(`product-preview-${productPreviews[1].sku}`);
      const productB = await findByTestId(`product-preview-${productPreviews[2].sku}`);
      productA.click();
      productB.click();
      expect(queryByTestId(`selection-preview-${productPreviews[1].sku}`)).toBeNull();
      expect(await findByTestId(`selection-preview-${productPreviews[2].sku}`)).toBeTruthy();
    });
  });

  describe('when it is operating on a field of type Symbol[]', () => {
    it('should allow the user to select multiple products', async () => {
      const { findByTestId } = await renderComponent({
        ...defaultProps,
        sdk: merge({}, defaultProps.sdk, {
          parameters: { invocation: { fieldType: 'Array' } }
        })
      });
      const productA = await findByTestId(`product-preview-${productPreviews[1].sku}`);
      const productB = await findByTestId(`product-preview-${productPreviews[2].sku}`);
      productA.click();
      productB.click();
      expect(await findByTestId(`selection-preview-${productPreviews[1].sku}`)).toBeTruthy();
      expect(await findByTestId(`selection-preview-${productPreviews[2].sku}`)).toBeTruthy();
    });
  });
});
