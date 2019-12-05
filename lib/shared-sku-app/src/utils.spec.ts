import { mapSort } from './utils';
import productPreviews from './__mocks__/productPreviews';

describe('utils', () => {
  describe('mapSort', () => {
    it('should order an array of object based on a prop value following the order of another ordered array', () => {});
    const selectedSKUs = ['A0E2300FX102203', 'M0E20130820E90Z', 'M0E21300900DZN7'];
    const sortedProductPreviews = mapSort(productPreviews, selectedSKUs, 'sku');
    expect(sortedProductPreviews[0].sku).toEqual(selectedSKUs[0]);
    expect(sortedProductPreviews[1].sku).toEqual(selectedSKUs[1]);
    expect(sortedProductPreviews[2].sku).toEqual(selectedSKUs[2]);
  });
});
