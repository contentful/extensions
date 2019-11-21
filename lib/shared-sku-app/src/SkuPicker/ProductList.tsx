import React from 'react';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { Hash } from '../interfaces';
import { ProductListItem } from './ProductListItem';

interface Props {
  products: Hash[];
}

const styles = {
  productList: css({
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: `-${tokens.spacingS}`,
    marginRight: `-${tokens.spacingS}`
  })
};

export const ProductList = ({ products }: Props) => (
  <div className={styles.productList}>
    {products.map(product => (
      <ProductListItem key={product.id} product={product} />
    ))}
  </div>
);
