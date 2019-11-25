import * as React from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { css } from 'emotion';
import {
  DropdownList,
  DropdownListItem,
  Card,
  CardDragHandle as FormaCardDragHandle,
  CardActions
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';

interface SortableElementProps {
  url: string | undefined;
  alt: string | undefined;
  disabled: boolean;
  onDelete: () => void;
}

const styles = {
  card: (disabled: boolean) =>
    css({
      display: 'flex',
      // height: '150px',
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
  })
};

const CardDragHandle = SortableHandle(() => (
  <FormaCardDragHandle className={styles.dragHandle}>Reorder product</FormaCardDragHandle>
));

export const SortableItem = SortableElement<SortableElementProps>((props: SortableElementProps) => {
  return (
    <Card className={styles.card(props.disabled)}>
      {props.url ? (
        <>
          <CardDragHandle />
          <img src={props.url} alt={props.alt} />
        </>
      ) : (
        <div>Product not available</div>
      )}
      {!props.disabled && (
        <CardActions className={styles.actions}>
          <DropdownList>
            <DropdownListItem isTitle>Actions</DropdownListItem>
            <DropdownListItem onClick={props.onDelete}>Remove</DropdownListItem>
          </DropdownList>
        </CardActions>
      )}
    </Card>
  );
});
