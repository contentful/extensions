import * as React from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import {
  IconButton,
  Card,
  DisplayText,
  Typography,
  Paragraph
} from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import {
  SortableElementProperties,
  SortableElementState,
  SortableElementData,
  AssetData,
  SortableContainerData
} from './interfaces';
import CloudinaryThumbnail from '../cloudinaryThumbnail/cloudinaryThumbnail';

const DragHandle = SortableHandle<AssetData>(props => (
  <div className="order">
    <CloudinaryThumbnail config={props.config} resource={props.resource} />
  </div>
));

const SortableItem = SortableElement<SortableElementData>(props => (
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

const SortableList = SortableContainer<SortableContainerData>(props => {
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

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ resources }) => ({
      resources: arrayMove(resources, oldIndex, newIndex)
    }));

    if (this.props.onChange) {
      this.props.onChange(this.state.resources);
    }
  };

  deleteItem = index => {
    const state = this.state.resources;
    state.splice(index, 1);
    this.setState({ resources: state });

    if (this.props.onChange) {
      this.props.onChange(this.state.resources);
    }
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
