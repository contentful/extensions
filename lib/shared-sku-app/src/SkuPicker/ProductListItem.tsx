import React, { useState } from 'react';
import tokens from '@contentful/forma-36-tokens';
import noop from 'lodash/noop';
import { SkeletonContainer, SkeletonImage } from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import { Product } from '../interfaces';

export interface Props {
  product: Product;
  selectProduct: (sku: string) => void;
  isSelected: boolean;
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
    borderRadius: '3px',
    boxShadow: '0px 0px 0px 1px inset rgba(48, 114, 190, 0), 0 1px 3px rgba(0, 0, 0, 0)',
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingS,
    outline: 0,
    textAlign: 'center',
    transition: `all ${tokens.transitionDurationDefault} ${tokens.transitionEasingDefault}`,
    '&:hover': {
      borderColor: tokens.colorElementDark,
      cursor: 'pointer'
    },
    width: '100%',
    // Force hardware acceleration for non-accelerated
    // animated props box-shadow and border-color
    transform: 'translateZ(0)',
    willChange: 'box-shadow, border-color'
  }),
  selectedProduct: css({
    borderColor: 'rgba(48, 114, 190, 1)',
    boxShadow: '0px 0px 0px 1px inset rgba(48, 114, 190, 1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    '&:hover': {
      borderColor: 'rgba(48, 114, 190, 1)',
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
  }),
  skeletonImage: css({
    width: '100%',
    height: '400px'
  })
};

export const ProductListItem = (props: Props) => {
  const { product, isSelected, selectProduct } = props;
  const [imageHasLoaded, setImageHasLoaded] = useState(false);

  return (
    <div className={styles.productWrapper}>
      <div
        role="switch"
        aria-checked={isSelected}
        tabIndex={-1}
        className={`${styles.product} ${isSelected ? styles.selectedProduct : ''}`}
        onKeyUp={noop}
        onClick={() => selectProduct(product.sku)}>
        {!imageHasLoaded && (
          <SkeletonContainer className={styles.skeletonImage}>
            <SkeletonImage width={400} height={400} />
          </SkeletonContainer>
        )}
        <img
          onLoad={() => setImageHasLoaded(true)}
          style={{ display: imageHasLoaded ? 'block' : 'none' }}
          src={product.image}
          alt="product preview"
          className={styles.previewImg}
        />
        <p className={styles.name}>{product.name}</p>
        <p className={styles.sku}>{product.sku}</p>
      </div>
    </div>
  );
};
