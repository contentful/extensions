import React from 'react';
import get from 'lodash/get';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { Hash } from '../interfaces';

interface Props {
  locale: string;
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

export const ProductListItem = ({ product, locale }: Props) => {
  const imgUrl = get(product, ['masterData', 'current', 'masterVariant', 'images', 0, 'url'], '');
  const name = get(product, ['masterData', 'current', 'name', locale], '');
  const sku = get(product, ['masterData', 'current', 'masterVariant', 'sku'], '');
  return (
    <div className={styles.productWrapper}>
      <div className={styles.product}>
        <img src={imgUrl} alt="product preview" className={styles.previewImg} />
        <p className={styles.name}>{name}</p>
        <p className={styles.sku}>{sku}</p>
      </div>
    </div>
  );
};
