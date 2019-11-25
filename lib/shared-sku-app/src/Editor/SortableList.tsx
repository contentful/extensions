import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { css } from 'emotion';
import { Hash, DeleteFn } from '../interfaces';
import { SortableItem } from './SortableItem';

interface SortableContainerProps {
  disabled: boolean;
  config: Hash;
  productPreviews: string[][];
  deleteFn: DeleteFn;
}

const styles = {
  container: css({
    maxWidth: '600px'
  }),
  grid: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)'
  })
};

export const SortableList = SortableContainer<SortableContainerProps>(
  (props: SortableContainerProps) => {
    // Provide stable keys for all resources so images don't blink.
    const { list } = props.productPreviews.reduce(
      (acc: any, preview, index) => {
        const [url, alt] = preview;
        const item = { url, alt, key: `url-unknown-${index}` };
        const counts = { ...acc.counts };

        // URLs are used as keys.
        // It is possible to include the same image more than once.
        // We count usages of the same URL and use the count in keys.
        // This can be considered an edge-case but still - should be covered.
        if (url) {
          counts[url] = counts[url] || 1;
          item.key = [url, counts[url]].join('-');
          counts[url] += 1;
        }

        return {
          counts,
          list: [...acc.list, item]
        };
      },
      { counts: {}, list: [] }
    ) as { list: Hash[] };

    return (
      <div className={styles.container}>
        <div className={styles.grid}>
          {list.map(({ url, alt, key }, index) => {
            return (
              <SortableItem
                disabled={props.disabled}
                key={key}
                url={url}
                alt={alt}
                index={index}
                onDelete={() => props.deleteFn(index)}
              />
            );
          })}
        </div>
      </div>
    );
  }
);
