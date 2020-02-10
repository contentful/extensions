import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { DeleteFn, Category } from '../../interfaces';
import { SortableListItem } from './SortableListItem';

export interface Props {
  disabled: boolean;
  categoryPreviews: Category[];
  deleteFn: DeleteFn;
}

export const SortableList = SortableContainer<Props>(
  ({ disabled, deleteFn, categoryPreviews }: Props) => {
    const itemsAreSortable = categoryPreviews.length > 1;
    return (
      <div>
        {categoryPreviews.map((category, index) => {
          return (
            <SortableListItem
              disabled={disabled}
              key={`${category.id}-${category.name}`}
              category={category}
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
