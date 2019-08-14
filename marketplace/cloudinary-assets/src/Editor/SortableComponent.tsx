import * as React from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { css } from 'emotion';
import arrayMove from 'array-move';
import { IconButton, Card } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { Hash, ThumbnailFn, DeleteFn } from '../interfaces';

interface Props {
  onChange: (data: Hash[]) => void;
  config: Hash;
  resources: Hash[];
  makeThumbnail: ThumbnailFn;
}

interface SortableContainerProps {
  config: Hash;
  resources: Hash[];
  deleteFn: DeleteFn;
  makeThumbnail: ThumbnailFn;
}

interface DragHandleProps {
  url: string | undefined;
  alt: string | undefined;
}

interface SortableElementProps extends DragHandleProps {
  readonly index: number;
  deleteFn: DeleteFn;
}

const DragHandle = SortableHandle<DragHandleProps>(({ url, alt }: DragHandleProps) =>
  url ? <img src={url} alt={alt} /> : <div>Asset not available</div>
);

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }),
  card: css({
    cursor: 'pointer',
    margin: tokens.spacingXs,
    position: 'relative',
    width: '150px',
    height: '100px',
    '> img': {
      display: 'block',
      // Image selection sometimes makes drag and drop ugly.
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      'user-select': 'none'
    }
  }),
  remove: css({
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    backgroundColor: 'white'
  })
};

const SortableItem = SortableElement<SortableElementProps>((props: SortableElementProps) => {
  return (
    <Card className={styles.card}>
      <DragHandle url={props.url} alt={props.alt} />
      <IconButton
        label="Close"
        onClick={() => props.deleteFn(props.index)}
        className={styles.remove}
        iconProps={{ icon: 'Close' }}
        buttonType="muted"
      />
    </Card>
  );
});

const SortableList = SortableContainer<SortableContainerProps>((props: SortableContainerProps) => {
  return (
    <div className={styles.container}>
      {props.resources.map((resource, index) => {
        const [url, alt] = props.makeThumbnail(resource, props.config);
        return (
          <SortableItem
            key={`item-${index}`}
            index={index}
            url={url}
            alt={alt}
            deleteFn={props.deleteFn}
          />
        );
      })}
    </div>
  );
});

export class SortableComponent extends React.Component<Props> {
  onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const resources = arrayMove(this.props.resources, oldIndex, newIndex);
    this.props.onChange(resources);
  };

  deleteItem = (index: number) => {
    const resources = [...this.props.resources];
    resources.splice(index, 1);
    this.props.onChange(resources);
  };

  render() {
    return (
      <SortableList
        onSortEnd={this.onSortEnd}
        axis="xy"
        resources={this.props.resources}
        config={this.props.config}
        deleteFn={this.deleteItem}
        useDragHandle
        makeThumbnail={this.props.makeThumbnail}
      />
    );
  }
}
