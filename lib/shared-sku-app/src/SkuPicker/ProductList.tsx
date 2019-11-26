import React from 'react';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { Product } from '../interfaces';
import { ProductListItem } from './ProductListItem';

export interface Props {
  products: Product[];
  selectProduct: (sku: string) => void;
  selectedProducts: string[];
}

const styles = {
  productList: css({
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: `-${tokens.spacingS}`,
    marginRight: `-${tokens.spacingS}`
  })
};

export const ProductList = ({ selectProduct, selectedProducts, products }: Props) => (
  <div className={styles.productList}>
    {products.map(product => (
      <ProductListItem
        key={product.id}
        product={product}
        isSelected={selectedProducts.includes(product.sku)}
        selectProduct={selectProduct}
      />
    ))}
  </div>
);
