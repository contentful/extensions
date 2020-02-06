import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { DeleteFn, Product } from '../interfaces';
import { SortableListItem } from './SortableListItem';

export interface Props {
  disabled: boolean;
  productPreviews: Product[];
  deleteFn: DeleteFn;
}

export const SortableList = SortableContainer<Props>(
  ({ disabled, deleteFn, productPreviews }: Props) => {
    const itemsAreSortable = productPreviews.length > 1;
    return (
      <div>
        {productPreviews.map((product, index) => {
          return (
            <SortableListItem
              disabled={disabled}
              key={`${product.image}-${product.sku}`}
              product={product}
              index={index}
              onDelete={() => deleteFn(index)}
              isSortable={itemsAreSortable}
            />
          );
        })}
      </div>
    );
  }
);
