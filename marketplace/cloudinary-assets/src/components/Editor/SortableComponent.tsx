import * as React from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { IconButton, Card } from '@contentful/forma-36-react-components';
import { Hash, ThumbnailFn, DeleteFn } from '../../interfaces';

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

interface ThumbnailProps {
  url: string | undefined;
  alt: string | undefined;
}

interface SortableElementProps extends ThumbnailProps {
  readonly index: number;
  deleteFn: DeleteFn;
}

const DragHandle = SortableHandle<ThumbnailProps>(({ url, alt }: ThumbnailProps) =>
  url ? (
    <img src={url} alt={alt} className="CloudinaryImage" />
  ) : (
    <div className="unknownFiletype" />
  )
);

const SortableItem = SortableElement<SortableElementProps>((props: SortableElementProps) => {
  return (
    <Card className="thumbnail">
      <DragHandle url={props.url} alt={props.alt} />
      <IconButton
        label="Close"
        onClick={() => props.deleteFn(props.index)}
        className="thumbnail-remove"
        iconProps={{ icon: 'Close' }}
        buttonType="muted"
      />
    </Card>
  );
});

const SortableList = SortableContainer<SortableContainerProps>((props: SortableContainerProps) => {
  return (
    <div className="thumbnail-list">
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
