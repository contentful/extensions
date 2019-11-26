import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { DeleteFn, Product } from '../interfaces';
import { SortableItem } from './SortableItem';

interface SortableContainerProps {
  disabled: boolean;
  productPreviews: Product[];
  deleteFn: DeleteFn;
}

export const SortableList = SortableContainer<SortableContainerProps>(
  ({ disabled, deleteFn, productPreviews }: SortableContainerProps) => {
    const itemsAreSortable = productPreviews.length > 1;
    return (
      <div>
        {productPreviews.map((product, index) => {
          return (
            <SortableItem
              disabled={disabled}
              key={`${product.image}-${index}`}
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
