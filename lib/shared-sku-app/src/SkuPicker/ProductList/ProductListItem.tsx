import React, { useState } from 'react';
import tokens from '@contentful/forma-36-tokens';
import noop from 'lodash/noop';
import { Icon, SkeletonContainer, SkeletonImage } from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import { activeProductCheck } from '../iconsInBase64';
import { Product } from '../../interfaces';

export interface Props {
  product: Product;
  selectProduct: (sku: string) => void;
  isSelected: boolean;
}

const styles = {
  productWrapper: css({
    display: 'flex',
    flex: `0 0 calc(25% - ${parseFloat(tokens.spacingS) * 2}rem)`,
    padding: tokens.spacingS,
    position: 'relative'
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
  imgWrapper: (imageHasLoaded: boolean) =>
    css({
      height: `${imageHasLoaded ? 290 : 0}px`,
      position: 'relative',
      overflow: 'hidden'
    }),
  previewImg: css({
    height: '290px',
    minWidth: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }),
  name: css({
    flex: '1 0 auto',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  }),
  sku: css({
    flex: '0 1 auto',
    color: tokens.colorTextLight,
    fontSize: tokens.fontSizeS,
    marginTop: 0,
    marginBottom: 0,
    maxWidth: '289px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  }),
  skeletonImage: css({
    width: '100%',
    height: '290px'
  }),
  errorImage: css({
    backgroundColor: tokens.colorElementLightest,
    width: '100%',
    height: '290px',
    position: 'relative',
    svg: css({
      fill: tokens.colorTextLight,
      width: '100%',
      height: '50%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    })
  }),
  check: (isSelected: boolean) =>
    css({
      opacity: isSelected ? 1 : 0,
      position: 'absolute',
      top: tokens.spacingL,
      right: tokens.spacingL,
      transition: `opacity ${tokens.transitionDurationDefault} ${tokens.transitionEasingDefault}`
    })
};

export const ProductListItem = (props: Props) => {
  const { product, isSelected, selectProduct } = props;
  const [imageHasLoaded, setImageHasLoaded] = useState(false);
  const [imageHasErrored, setImageHasErrored] = useState(false);

  return (
    <div className={styles.productWrapper}>
      <div
        data-test-id={`product-preview-${product.sku}`}
        role="switch"
        aria-checked={isSelected}
        tabIndex={-1}
        className={`${styles.product} ${isSelected ? styles.selectedProduct : ''}`}
        onKeyUp={noop}
        onClick={() => selectProduct(product.sku)}>
        {!imageHasLoaded && !imageHasErrored && (
          <SkeletonContainer className={styles.skeletonImage}>
            <SkeletonImage width={400} height={290} />
          </SkeletonContainer>
        )}
        {imageHasErrored && (
          <div className={styles.errorImage}>
            <Icon icon="Asset" />
          </div>
        )}
        {!imageHasErrored && (
          <div className={styles.imgWrapper(imageHasLoaded)}>
            <img
              onLoad={() => setImageHasLoaded(true)}
              onError={() => setImageHasErrored(true)}
              style={{ display: imageHasLoaded ? 'block' : 'none' }}
              src={product.image}
              alt="product preview"
              className={styles.previewImg}
              data-test-id="image"
            />
            <img className={styles.check(isSelected)} src={activeProductCheck} alt="check" />
          </div>
        )}
        <p className={styles.name}>{product.name}</p>
        <p className={styles.sku}>{product.sku}</p>
      </div>
    </div>
  );
};
