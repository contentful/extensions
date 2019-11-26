import React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import clamp from 'lodash/clamp';
import range from 'lodash/range';

export interface Props {
  activePage: number;
  className?: string;
  pageCount: number;
  setActivePage: Function;
}

const styles = {
  button: css({
    borderRadius: 0,
    maxWidth: '45px',
    span: {
      overflow: 'visible !important'
    }
  })
};

export function getPagesRange(page: number, total: number, neighboursCount = 2): number[] {
  if (total < neighboursCount * 2 + 1) {
    return range(0, total);
  }
  if (page <= neighboursCount) {
    return range(0, neighboursCount * 2 + 1);
  }
  if (page > total - neighboursCount) {
    return range(total - neighboursCount * 2 - 1, total);
  }
  return range(page - neighboursCount - 1, page + neighboursCount);
}

export function Paginator(props: Props) {
  const { className, pageCount, setActivePage } = props;
  const activePage = clamp(props.activePage, 1, pageCount);
  return (
    <div className={className}>
      <Button
        className={styles.button}
        buttonType="muted"
        disabled={pageCount === 1 || activePage === 1}
        onClick={() => setActivePage(1)}>
        &laquo;
      </Button>
      <Button
        icon="ChevronLeft"
        className={styles.button}
        buttonType="muted"
        disabled={pageCount === 1 || activePage === 1}
        onClick={() => setActivePage(activePage - 1)}
      />
      {getPagesRange(activePage, pageCount).map(pageIndex => {
        const page = pageIndex + 1;
        return (
          <Button
            onClick={() => setActivePage(page)}
            className={styles.button}
            buttonType={page === activePage ? 'primary' : 'muted'}
            testId={page === activePage ? 'active' : `inactive-${page}`}
            key={pageIndex}>
            {page}
          </Button>
        );
      })}
      <Button
        icon="ChevronRight"
        buttonType="muted"
        className={styles.button}
        disabled={pageCount === 1 || activePage === pageCount}
        onClick={() => setActivePage(activePage + 1)}
      />
      <Button
        buttonType="muted"
        className={styles.button}
        disabled={pageCount === 1 || activePage === pageCount}
        onClick={() => setActivePage(pageCount)}>
        &raquo;
      </Button>
    </div>
  );
}
