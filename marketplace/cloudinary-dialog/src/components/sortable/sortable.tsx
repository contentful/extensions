import * as React from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import {
  EntityList,
  EntityListItem,
  DropdownList,
  DropdownListItem,
  CardDragHandle,
  AssetCard,
  IconButton,
} from "@contentful/forma-36-react-components";
import "@contentful/forma-36-react-components/dist/styles.css";
import {
  SortableElementProperties,
  SortableElementState,
  SortableElementData,
} from "./interfaces";

export class SortableComponent extends React.Component<
  SortableElementProperties,
  SortableElementState
> {
  public constructor(props: SortableElementProperties) {
    super(props);

    this.state = {
      items: props.results,
    };
  }

  DragHandle = SortableHandle(() => <CardDragHandle>...</CardDragHandle>);

  SortableItem = SortableElement((data: SortableElementData) => {
    const contentType = (["video", "image"].includes(data.value.resource_type)
      ? data.value.resource_type
      : undefined) as "video" | "image" | undefined;

    return (
      <AssetCard
        size={"small"}
        src={data.value.secure_url}
        className="thumbnail2"
        title={data.value.context.custom.caption}
        cardDragHandleComponent={<this.DragHandle />}
        isDragActive={false}
        withDragHandle={true}
        type={contentType}
        dropdownListElements={
          <DropdownList>
            <DropdownListItem isTitle>Actions</DropdownListItem>
            <DropdownListItem
              isTitle={false}
              isActive={false}
              isDisabled={false}
              onClick={e => this.deleteItem(data.index)}
            >
              Delete
            </DropdownListItem>
          </DropdownList>
        }
      >
        <IconButton
          label="Close"
          onClick={this.deleteItem}
          className="thumbnail-remove"
          iconProps={{ icon: "Close" }}
          buttonType="muted"
        />
      </AssetCard>
      // <EntityListItem
      //   thumbnailUrl={data.value.secure_url}
      //   title={data.value.context.custom.caption}
      //   description={data.value.context.custom.alt}
      //   contentType={data.value.resource_type}
      //   isDragActive={false}
      //   withDragHandle={true}
      //   cardDragHandleComponent={<this.DragHandle />}
      //
      // />
    );
  });

  SortableList = SortableContainer(({ items }) => {
    return (
      <div className="thumbnail-list">
        {items.map((value, index) => (
          <this.SortableItem
            key={`item-${index}`}
            index={index}
            value={value}
          />
        ))}
      </div>
    );
  });

  componentWillReceiveProps(props: SortableElementProperties) {
    this.setState({
      items: props.results,
    });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex),
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
        onSortEnd={this.onSortEnd}
        useDragHandle
      />
    );
  }
}
