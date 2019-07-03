import * as React from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { IconButton, Card } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import {
  SortableElementProperties,
  SortableElementState,
  SortableElementData,
  SortableContainerData
} from './interfaces';
import CloudinaryThumbnail, {
  CloudinaryThumbnailProps
} from '../cloudinaryThumbnail/cloudinaryThumbnail';

const DragHandle = SortableHandle<CloudinaryThumbnailProps>((props: CloudinaryThumbnailProps) => (
  <div className="order">
    <CloudinaryThumbnail config={props.config} resource={props.resource} />
  </div>
));

const SortableItem = SortableElement<SortableElementData>((props: SortableElementData) => (
  <Card className="thumbnail">
    <DragHandle resource={props.resource} config={props.config} />
    <IconButton
      label="Close"
      onClick={() => props.deleteFnc(props.index)}
      className="thumbnail-remove"
      iconProps={{ icon: 'Close' }}
      buttonType="muted"
    />
  </Card>
));

const SortableList = SortableContainer<SortableContainerData>((props: SortableContainerData) => {
  return (
    <div className="thumbnail-list">
      {props.resources.map((resource, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          config={props.config}
          resource={resource}
          deleteFnc={props.deleteFnc}
        />
      ))}
    </div>
  );
});

export class SortableComponent extends React.Component<
  SortableElementProperties,
  SortableElementState
> {
  public constructor(props: SortableElementProperties) {
    super(props);

    this.state = {
      resources: props.resources
    };
  }

  componentWillReceiveProps(props: SortableElementProperties) {
    this.setState({
      resources: props.resources
    });
  }

  onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    this.setState(({ resources }) => ({
      resources: arrayMove(resources, oldIndex, newIndex)
    }));

    if (this.props.onChange) {
      this.props.onChange(this.state.resources);
    }
  };

  deleteItem = (index: number) => {
    this.setState(
      state => {
        const resources = [...state.resources];
        resources.splice(index, 1);
        return { resources };
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.resources);
        }
      }
    );
  };

  render() {
    return (
      <SortableList
        onSortEnd={this.onSortEnd}
        axis="x"
        pressDelay={0}
        resources={this.state.resources}
        config={this.props.config}
        deleteFnc={this.deleteItem}
        useDragHandle
      />
    );
  }
}
