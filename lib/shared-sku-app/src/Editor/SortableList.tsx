import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { DeleteFn } from '../interfaces';
import { SortableItem } from './SortableItem';

interface SortableContainerProps {
  disabled: boolean;
  productPreviews: string[][];
  deleteFn: DeleteFn;
}

export const SortableList = SortableContainer<SortableContainerProps>(
  ({ disabled, deleteFn, productPreviews }: SortableContainerProps) => {
    return (
      <div>
        {productPreviews.map(([url, alt], index) => {
          return (
            <SortableItem
              disabled={disabled}
              key={`${url}-${index}`}
              url={url}
              alt={alt}
              index={index}
              onDelete={() => deleteFn(index)}
            />
          );
        })}
      </div>
    );
  }
);
