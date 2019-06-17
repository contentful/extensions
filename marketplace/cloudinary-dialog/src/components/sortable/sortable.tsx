import * as React from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { IconButton, Card } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import {
  SortableElementProperties,
  SortableElementState,
  SortableElementData,
  AssetData
} from './interfaces';

export class SortableComponent extends React.Component<
  SortableElementProperties,
  SortableElementState
> {
  public constructor(props: SortableElementProperties) {
    super(props);

    this.state = {
      items: props.results
    };
  }

  DragHandle = SortableHandle((assetData: AssetData) => (
    <div className="order">
      <img
        width="150"
        height="150"
        src={`https://res.cloudinary.com/${this.props.config.cloudName}/${assetData.asset.resource_type}/upload/v${assetData.asset.version}/${assetData.asset.public_id}.jpg`}
      />
    </div>
  ));

  SortableItem = SortableElement((data: SortableElementData) => {
    const contentType = (['video', 'image'].includes(data.value.resource_type)
      ? data.value.resource_type
      : undefined) as 'video' | 'image' | undefined;
    return (
      <Card className="thumbnail">
        <this.DragHandle asset={data.value} />
        <IconButton
          label="Close"
          onClick={() => this.deleteItem(data.index)}
          className="thumbnail-remove"
          iconProps={{ icon: 'Close' }}
          buttonType="muted"
        />
      </Card>
    );
  });

  SortableList = SortableContainer(({ items }) => {
    return (
      <div className="thumbnail-list">
        {items.map((value, index) => (
          <this.SortableItem key={`item-${index}`} index={index} value={value} />
        ))}
      </div>
    );
  });

  componentWillReceiveProps(props: SortableElementProperties) {
    this.setState({
      items: props.results
    });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex)
    }));

    if (this.props.onChange) {
      this.props.onChange(this.state.items);
    }
  };

  deleteItem = index => {
    const state = this.state.items;
    state.splice(index, 1);
    this.setState({ items: state });

    if (this.props.onChange) {
      this.props.onChange(this.state.items);
    }
  };

  render() {
    return (
      <this.SortableList
        items={this.state.items}
        onSortMove={this.onSortEnd}
        onSortEnd={this.onSortEnd}
        axis="x"
        pressDelay={0}
        useDragHandle
      />
    );
  }
}
