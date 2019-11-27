import React from 'react';
import { css } from 'emotion';
import { Product } from '../interfaces';
import { ProductSelectionListItem } from './ProductSelectionListItem';

export interface Props {
  products: Product[];
  selectProduct: (sku: string) => void;
}

const styles = {
  productList: css({
    display: 'flex'
  })
};

export const ProductSelectionList = ({ selectProduct, products }: Props) => (
  <div className={styles.productList}>
    {products.map(product => (
      <ProductSelectionListItem key={product.id} product={product} selectProduct={selectProduct} />
    ))}
  </div>
);
