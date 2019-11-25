import * as React from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { css } from 'emotion';
import { IconButton, Card } from '@contentful/forma-36-react-components';

interface DragHandleProps {
  url: string | undefined;
  alt: string | undefined;
}

interface SortableElementProps extends DragHandleProps {
  disabled: boolean;
  onDelete: () => void;
}

const DragHandle = SortableHandle<DragHandleProps>(({ url, alt }: DragHandleProps) =>
  url ? <img src={url} alt={alt} /> : <div>Asset not available</div>
);

const styles = {
  card: (disabled: boolean) =>
    css({
      margin: '10px',
      position: 'relative',
      width: '150px',
      height: '100px',
      '> img': {
        cursor: disabled ? 'move' : 'pointer',
        display: 'block',
        maxWidth: '150px',
        maxHeight: '100px',
        margin: 'auto',
        userSelect: 'none' // Image selection sometimes makes drag and drop ugly.
      }
    }),
  remove: css({
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    backgroundColor: 'white'
  })
};

export const SortableItem = SortableElement<SortableElementProps>((props: SortableElementProps) => {
  return (
    <Card className={styles.card(props.disabled)}>
      <DragHandle url={props.url} alt={props.alt} />
      {!props.disabled && (
        <IconButton
          label="Close"
          onClick={props.onDelete}
          className={styles.remove}
          iconProps={{ icon: 'Close' }}
          buttonType="muted"
        />
      )}
    </Card>
  );
});
