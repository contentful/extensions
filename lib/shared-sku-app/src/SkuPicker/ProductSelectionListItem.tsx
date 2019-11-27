import React from 'react';
import tokens from '@contentful/forma-36-tokens';
import noop from 'lodash/noop';
import { Tooltip, Icon } from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import { Product } from '../interfaces';

export interface Props {
  product: Product;
  selectProduct: (sku: string) => void;
}

const styles = {
  productWrapper: css({
    display: 'flex',
    position: 'relative',
    '& ~ &': css({
      marginLeft: tokens.spacingXs
    }),
    '&:last-child': css({
      marginRight: tokens.spacingXs
    })
  }),
  product: css({
    border: '1px solid',
    borderColor: tokens.colorElementLight,
    borderRadius: '3px',
    display: 'flex',
    flexDirection: 'column',
    height: '40px',
    width: '40px',
    outline: 0,
    textAlign: 'center',
    transition: `all ${tokens.transitionDurationDefault} ${tokens.transitionEasingDefault}`,
    position: 'relative',
    transform: 'translateZ(0)', // Force hardware acceleration for transitions
    willChange: 'box-shadow, border-color',
    '&:hover': {
      borderColor: tokens.colorElementDarkest,
      cursor: 'pointer',
      '> span > div': {
        opacity: 1
      }
    }
  }),
  previewImg: css({
    margin: '0 auto',
    minWidth: 'auto',
    height: '40px'
  }),
  name: css({
    flex: '1 0 auto',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  }),
  sku: css({
    flex: '0 1 auto',
    color: tokens.colorTextLight,
    fontSize: tokens.fontSizeS
  }),
  removeIcon: css({
    backgroundColor: 'rgba(0,0,0,.65)',
    borderRadius: '50%',
    color: 'white',
    opacity: 0,
    width: '28px',
    height: '28px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    transition: `opacity ${tokens.transitionDurationDefault} ${tokens.transitionEasingDefault}`,
    svg: css({
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

export const ProductSelectionListItem = (props: Props) => {
  const { product, selectProduct } = props;
  return (
    <div className={styles.productWrapper}>
      <div
        role="switch"
        aria-checked={true}
        tabIndex={-1}
        className={styles.product}
        onKeyUp={noop}
        onClick={() => selectProduct(product.sku)}>
        <Tooltip content={product.name} place="bottom">
          <div className={styles.removeIcon}>
            <Icon color="white" icon="Close" />
          </div>
          <img
            src={product.image}
            alt="product preview"
            className={styles.previewImg}
            data-test-id="image"
          />
        </Tooltip>
      </div>
    </div>
  );
};
