import * as React from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { IconButton, Card } from '@contentful/forma-36-react-components';
import { ExtensionParameters } from '../AppConfig/parameters';

type Resource = Record<string, any>;

interface SortableElementProperties {
  onChange?: (data: Resource[]) => void;
  config: ExtensionParameters;
  resources: Resource[];
  makeThumbnail: (resource: any, config: any) => (string | undefined)[];
}

interface SortableContainerData {
  config: ExtensionParameters;
  resources: Resource[];
  deleteFnc: (index: number) => void;
  makeThumbnail: (resource: any, config: any) => (string | undefined)[];
}

interface SortableElementState {
  readonly resources: Resource[];
}

interface ThumbnailProps {
  url: string | undefined;
  alt: string | undefined;
}

interface SortableElementData extends ThumbnailProps {
  readonly index: number;
  deleteFnc: (index: number) => void;
}

const DragHandle = SortableHandle<ThumbnailProps>(({ url, alt }: ThumbnailProps) => (
  <div className="order">
    {url ? (
      <img src={url} alt={alt} className="CloudinaryImage" />
    ) : (
      <div className="unknownFiletype" />
    )}
  </div>
));

const SortableItem = SortableElement<SortableElementData>((props: SortableElementData) => {
  return (
    <Card className="thumbnail">
      <DragHandle url={props.url} alt={props.alt} />
      <IconButton
        label="Close"
        onClick={() => props.deleteFnc(props.index)}
        className="thumbnail-remove"
        iconProps={{ icon: 'Close' }}
        buttonType="muted"
      />
    </Card>
  );
});

const SortableList = SortableContainer<SortableContainerData>((props: SortableContainerData) => {
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
            deleteFnc={props.deleteFnc}
          />
        );
      })}
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
        axis="xy"
        resources={this.state.resources}
        config={this.props.config}
        deleteFnc={this.deleteItem}
        useDragHandle
        makeThumbnail={this.props.makeThumbnail}
      />
    );
  }
}
