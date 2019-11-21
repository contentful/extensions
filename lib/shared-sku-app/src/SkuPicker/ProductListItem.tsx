import React from 'react';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { Hash } from '../interfaces';

interface Props {
  product: Hash;
}

const styles = {
  productWrapper: css({
    display: 'flex',
    flex: `0 0 calc(25% - ${parseFloat(tokens.spacingS) * 2}rem)`,
    padding: tokens.spacingS
  }),
  product: css({
    border: '1px solid',
    borderColor: tokens.colorElementLight,
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingS,
    textAlign: 'center',
    transition: `border-color ${tokens.transitionDurationDefault} ${tokens.transitionEasingDefault}`,
    '&:hover': {
      borderColor: tokens.colorElementDark,
      cursor: 'pointer'
    }
  }),
  previewImg: css({
    width: '100%'
  }),
  name: css({
    flex: '1 0 auto',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  }),
  sku: css({
    flex: '0 1 auto',
    color: tokens.colorContrastLight,
    fontSize: tokens.fontSizeS
  })
};

export const ProductListItem = ({ product }: Props) => (
  <div className={styles.productWrapper}>
    <div className={styles.product}>
      <img src={product.image} alt="product preview" className={styles.previewImg} />
      <p className={styles.name}>{product.name}</p>
      <p className={styles.sku}>{product.sku}</p>
    </div>
  </div>
);
