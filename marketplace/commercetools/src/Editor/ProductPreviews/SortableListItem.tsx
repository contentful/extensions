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
  Tag,
  Typography
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { Product } from '../../interfaces';

export interface Props {
  product: Product;
  disabled: boolean;
  onDelete: () => void;
  isSortable: boolean;
}

const IMAGE_SIZE = 48;

const styles = {
  card: css({
    display: 'flex',
    padding: 0,
    position: 'relative',
    ':not(:first-of-type)': css({
      marginTop: tokens.spacingXs
    })
  }),
  imageWrapper: (imageHasLoaded: boolean) =>
    css({
      width: imageHasLoaded ? `${IMAGE_SIZE}px` : 0,
      height: imageHasLoaded ? `${IMAGE_SIZE}px` : 0,
      overflow: 'hidden',
      margin: imageHasLoaded ? tokens.spacingM : 0,
      position: 'relative',
      '> img': css({
        display: 'block',
        height: `${IMAGE_SIZE}px`,
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
  name: (name?: string) =>
    css({
      fontSize: tokens.fontSizeL,
      marginBottom: tokens.spacing2Xs,
      ...(name && { textTransform: 'capitalize' })
    }),
  sku: css({
    color: tokens.colorElementDarkest,
    fontSize: tokens.fontSizeS,
    marginBottom: 0
  }),
  skeletonImage: css({
    width: `${IMAGE_SIZE}px`,
    height: `${IMAGE_SIZE}px`,
    padding: tokens.spacingM
  }),
  errorImage: css({
    backgroundColor: tokens.colorElementLightest,
    borderRadius: '3px',
    margin: tokens.spacingM,
    width: `${IMAGE_SIZE}px`,
    height: `${IMAGE_SIZE}px`,
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
  })
};

const CardDragHandle = SortableHandle(() => (
  <FormaCardDragHandle className={styles.dragHandle}>Reorder product</FormaCardDragHandle>
));

export const SortableListItem = SortableElement<Props>(
  ({ product, disabled, isSortable, onDelete }: Props) => {
    const [imageHasLoaded, setImageLoaded] = useState(false);
    const [imageHasErrored, setImageHasErrored] = useState(false);
    const productIsMissing = !product.name;

    return (
      <Card className={styles.card}>
        <>
          {isSortable && <CardDragHandle />}
          {!imageHasLoaded && !imageHasErrored && (
            <SkeletonContainer className={styles.skeletonImage}>
              <SkeletonImage width={IMAGE_SIZE} height={IMAGE_SIZE} />
            </SkeletonContainer>
          )}
          {imageHasErrored && (
            <div className={styles.errorImage}>
              <Icon icon={productIsMissing ? 'ErrorCircle' : 'Asset'} />
            </div>
          )}
          {!imageHasErrored && (
            <div className={styles.imageWrapper(imageHasLoaded)}>
              <img
                style={{ display: imageHasLoaded ? 'block' : 'none' }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageHasErrored(true)}
                src={product.image}
                alt={product.name}
                data-test-id="image"
              />
            </div>
          )}
          <section className={styles.description}>
            <Typography>
              <Heading className={styles.name(product.name)}>
                {productIsMissing ? product.sku : product.name}
              </Heading>
              {productIsMissing ? (
                <Tag tagType="negative">Product missing</Tag>
              ) : (
                <Subheading className={styles.sku}>{product.sku}</Subheading>
              )}
            </Typography>
          </section>
        </>
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
