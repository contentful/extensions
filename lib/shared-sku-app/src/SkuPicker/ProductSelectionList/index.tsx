import React from 'react';
import { css } from 'emotion';
import { Product } from '../../interfaces';
import { ProductSelectionListItem } from './ProductSelectionListItem';
import { RestProductsButton } from './RestProductsButton';

export interface Props {
  products: Product[];
  selectProduct: (sku: string) => void;
}

const styles = {
  productList: css({
    display: 'flex'
  })
};

const MAX_PRODUCTS = 10;

export const ProductSelectionList = ({ selectProduct, products }: Props) => (
  <div className={styles.productList}>
    {products.slice(0, MAX_PRODUCTS).map(product => (
      <ProductSelectionListItem key={product.id} product={product} selectProduct={selectProduct} />
    ))}
    {products.length > MAX_PRODUCTS && (
      <RestProductsButton productCount={products.length - MAX_PRODUCTS} />
    )}
  </div>
);
