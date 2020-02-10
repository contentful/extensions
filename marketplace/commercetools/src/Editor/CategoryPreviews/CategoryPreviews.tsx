import * as React from 'react';
import arrayMove from 'array-move';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { mapSort } from '../../utils';
import { SortableList } from './SortableList';
import { Hash, PreviewsFn, Product } from '../../interfaces';

interface Props {
  sdk: FieldExtensionSDK;
  disabled: boolean;
  onChange: (categories: string[]) => void;
  config: Hash;
  categories: string[];
  fetchCategoryPreviews: PreviewsFn;
}

interface State {
  categoryPreviews: Product[];
}

export class CategoryPreviews extends React.Component<Props, State> {
  state = {
    categoryPreviews: []
  };

  componentDidMount() {
    this.updateCategoryPreviews();
  }

  componentDidUpdate({ categories: prevCategories }: Props) {
    if (!isEqual(this.props.categories, prevCategories)) {
      const lengthHasChanged = this.props.categories.length !== prevCategories.length;
      const categoriesDiffer = difference(this.props.categories, prevCategories).length > 0;
      const shouldRefetchProducts = lengthHasChanged || categoriesDiffer;
      this.updateCategoryPreviews(shouldRefetchProducts);
    }
  }

  updateCategoryPreviews = async (shouldRefetch: boolean = true) => {
    try {
      const { fetchCategoryPreviews, categories } = this.props;
      const categoryPreviewsUnsorted = shouldRefetch
        ? await fetchCategoryPreviews(categories)
        : this.state.categoryPreviews;
      const categoryPreviews = mapSort(categoryPreviewsUnsorted, categories, 'sku');
      this.setState({ categoryPreviews });
    } catch {
      this.props.sdk.notifier.error(
        'There was an error fetching the data for the selected products.'
      );
    }
  };

  onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const categories = arrayMove(this.props.categories, oldIndex, newIndex);
    this.props.onChange(categories);
  };

  deleteItem = (index: number) => {
    const categories = [...this.props.categories];
    categories.splice(index, 1);
    this.props.onChange(categories);
  };

  render() {
    return (
      <SortableList
        disabled={this.props.disabled}
        onSortStart={(_, e) => e.preventDefault()} // Fixes FF glitches.
        onSortEnd={this.onSortEnd}
        axis="xy"
        categoryPreviews={this.state.categoryPreviews}
        deleteFn={this.deleteItem}
        useDragHandle
      />
    );
  }
}
