import * as React from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { css } from 'emotion';
import {
  DropdownList,
  DropdownListItem,
  Card,
  CardDragHandle as FormaCardDragHandle,
  CardActions,
  Heading,
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
  card: (disabled: boolean) =>
    css({
      display: 'flex',
      padding: 0,
      position: 'relative',
      '& ~ &': css({
        marginTop: tokens.spacingXs
      }),
      '> img': css({
        cursor: disabled ? 'move' : 'pointer',
        display: 'block',
        maxWidth: '150px',
        maxHeight: '100px',
        margin: 'auto 0 auto auto',
        padding: `${tokens.spacingL} ${tokens.spacingM} ${tokens.spacingM} ${tokens.spacingM}`,
        userSelect: 'none' // Image selection sometimes makes drag and drop ugly.
      })
    }),
  dragHandle: css({
    height: 'auto'
  }),
  actions: css({
    position: 'absolute',
    top: tokens.spacingXs,
    right: tokens.spacingXs
  }),
  description: css({
    padding: tokens.spacingM
  }),
  name: css({
    fontSize: tokens.fontSizeL,
    marginBottom: tokens.spacingXs,
    textTransform: 'capitalize'
  }),
  sku: css({
    color: tokens.colorElementDarkest,
    fontSize: tokens.fontSizeS
  }),
  dropdownLink: css({
    textDecoration: 'none',
    '&, &:hover, &:visited, &:active': {
      color: '#536171'
    }
  })
};

const CardDragHandle = SortableHandle(() => (
  <FormaCardDragHandle className={styles.dragHandle}>Reorder product</FormaCardDragHandle>
));

export const SortableItem = SortableElement<SortableElementProps>(
  ({ product, disabled, isSortable, onDelete }: SortableElementProps) => {
    return (
      <Card className={styles.card(disabled)}>
        {product.image ? (
          <>
            {isSortable && <CardDragHandle />}
            <section className={styles.description}>
              <Typography>
                <Heading className={styles.name}>{product.name}</Heading>
                <Subheading className={styles.sku}>{product.sku}</Subheading>
              </Typography>
            </section>
            <img src={product.image} alt={product.name} />
          </>
        ) : (
          <div>Product not available</div>
        )}
        {!disabled && (
          <CardActions className={styles.actions}>
            <DropdownList>
              <DropdownListItem isTitle>Actions</DropdownListItem>
              <DropdownListItem onClick={onDelete}>Remove</DropdownListItem>
              {product.externalLink && (
                <DropdownListItem {...{ target: '_blank' }} href={product.externalLink}>
                  Go to external link
                </DropdownListItem>
              )}
            </DropdownList>
          </CardActions>
        )}
      </Card>
    );
  }
);
