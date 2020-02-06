import * as React from 'react';
import arrayMove from 'array-move';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { mapSort } from '../utils';
import { SortableList } from './SortableList';
import { Hash, ProductPreviewsFn, Product } from '../interfaces';

interface Props {
  sdk: FieldExtensionSDK;
  disabled: boolean;
  onChange: (skus: string[]) => void;
  config: Hash;
  skus: string[];
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

  componentDidUpdate({ skus: prevSKUs }: Props) {
    if (!isEqual(this.props.skus, prevSKUs)) {
      const lengthHasChanged = this.props.skus.length !== prevSKUs.length;
      const skusDiffer = difference(this.props.skus, prevSKUs).length > 0;
      const shouldRefetchProducts = lengthHasChanged || skusDiffer;
      this.updateProductPreviews(shouldRefetchProducts);
    }
  }

  updateProductPreviews = async (shouldRefetch: boolean = true) => {
    try {
      const { fetchProductPreviews, skus, config } = this.props;
      const productPreviewsUnsorted = shouldRefetch
        ? await fetchProductPreviews(skus, config)
        : this.state.productPreviews;
      const productPreviews = mapSort(productPreviewsUnsorted, skus, 'sku');
      this.setState({ productPreviews });
    } catch {
      this.props.sdk.notifier.error(
        'There was an error fetching the data for the selected products.'
      );
    }
  };

  onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const skus = arrayMove(this.props.skus, oldIndex, newIndex);
    this.props.onChange(skus);
  };

  deleteItem = (index: number) => {
    const skus = [...this.props.skus];
    skus.splice(index, 1);
    this.props.onChange(skus);
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
