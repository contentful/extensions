import React, { useState } from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { css } from 'emotion';
import {
  Card,
  CardDragHandle as FormaCardDragHandle,
  Heading,
  Icon,
  IconButton,
  SkeletonContainer,
  SkeletonImage,
  Subheading,
  Typography
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { Product } from '../interfaces';

interface SortableElementProps {
  product: Product;
  disabled: boolean;
  onDelete: () => void;
  isSortable: boolean;
}

const styles = {
  card: css({
    display: 'flex',
    padding: 0,
    position: 'relative',
    '& ~ &': css({
      marginTop: tokens.spacingXs
    })
  }),
  imageWrapper: css({
    width: '48px',
    height: '48px',
    overflow: 'hidden',
    margin: tokens.spacingM,
    position: 'relative',
    '> img': css({
      display: 'block',
      height: '48px',
      minWidth: 'auto',
      userSelect: 'none',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    })
  }),
  dragHandle: css({
    height: 'auto'
  }),
  actions: css({
    position: 'absolute',
    top: tokens.spacingXs,
    right: tokens.spacingXs,
    a: css({
      display: 'inline-block',
      marginRight: tokens.spacingXs,
      svg: css({
        transition: `fill ${tokens.transitionDurationDefault} ${tokens.transitionEasingDefault}`
      }),
      '&:hover': {
        svg: css({
          fill: tokens.colorContrastDark
        })
      }
    })
  }),
  description: css({
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }),
  name: css({
    fontSize: tokens.fontSizeL,
    marginBottom: tokens.spacing2Xs,
    textTransform: 'capitalize'
  }),
  sku: css({
    color: tokens.colorElementDarkest,
    fontSize: tokens.fontSizeS,
    marginBottom: 0
  }),
  skeletonImage: css({
    width: '100px',
    height: '120px',
    paddingRight: tokens.spacingM,
    paddingBottom: tokens.spacingM,
    paddingTop: tokens.spacingXl
  })
};

const CardDragHandle = SortableHandle(() => (
  <FormaCardDragHandle className={styles.dragHandle}>Reorder product</FormaCardDragHandle>
));

export const SortableItem = SortableElement<SortableElementProps>(
  ({ product, disabled, isSortable, onDelete }: SortableElementProps) => {
    const [imageHasLoaded, setImageLoaded] = useState(false);

    return (
      <Card className={styles.card}>
        {product.image ? (
          <>
            {isSortable && <CardDragHandle />}

            {!imageHasLoaded && (
              <SkeletonContainer className={styles.skeletonImage}>
                <SkeletonImage width={100} height={100} />
              </SkeletonContainer>
            )}
            <div className={styles.imageWrapper}>
              <img
                style={{ display: imageHasLoaded ? 'block' : 'none' }}
                onLoad={() => setImageLoaded(true)}
                src={product.image}
                alt={product.name}
              />
            </div>
            <section className={styles.description}>
              <Typography>
                <Heading className={styles.name}>{product.name}</Heading>
                <Subheading className={styles.sku}>{product.sku}</Subheading>
              </Typography>
            </section>
          </>
        ) : (
          <div>Product not available</div>
        )}
        {!disabled && (
          <div className={styles.actions}>
            {product.externalLink && (
              <a target="_blank" rel="noopener noreferrer" href={product.externalLink}>
                <Icon icon="ExternalLink" color="muted" />
              </a>
            )}
            <IconButton
              label="Delete"
              iconProps={{ icon: 'Close' }}
              {...{
                buttonType: 'muted',
                onClick: onDelete
              }}
            />
          </div>
        )}
      </Card>
    );
  }
);
