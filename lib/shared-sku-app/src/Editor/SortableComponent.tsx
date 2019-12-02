import * as React from 'react';
import arrayMove from 'array-move';
import isEqual from 'lodash/isEqual';
import { SortableList } from './SortableList';
import { Hash, ProductPreviewsFn, Product } from '../interfaces';

interface Props {
  disabled: boolean;
  onChange: (data: string[] | string) => void;
  config: Hash;
  resources: string[];
  fetchProductPreviews: ProductPreviewsFn;
}

interface State {
  productPreviews: Product[];
}

export class SortableComponent extends React.Component<Props, State> {
  state = {
    productPreviews: []
  };

  componentDidMount() {
    this.updateProductPreviews();
  }

  componentDidUpdate({ resources: prevResources }: Props) {
    if (!isEqual(this.props.resources, prevResources)) {
      this.updateProductPreviews();
    }
  }

  updateProductPreviews = async () => {
    const { fetchProductPreviews, resources, config } = this.props;
    const productPreviews = await fetchProductPreviews(resources, config);
    this.setState({ productPreviews });
  };

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
        disabled={this.props.disabled}
        onSortStart={(_, e) => e.preventDefault()} // Fixes FF glitches.
        onSortEnd={this.onSortEnd}
        axis="xy"
        productPreviews={this.state.productPreviews}
        deleteFn={this.deleteItem}
        useDragHandle
      />
    );
  }
}
