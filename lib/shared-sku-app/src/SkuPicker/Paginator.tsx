import React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import range from 'lodash/range';

interface Props {
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

function getPagesRange(page: number, total: number, neighboursCount = 2): number[] {
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

export function Paginator({ activePage, className, pageCount, setActivePage }: Props) {
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
      {getPagesRange(activePage, pageCount).map(pageIndex => (
        <Button
          onClick={() => setActivePage(pageIndex + 1)}
          className={styles.button}
          buttonType={pageIndex + 1 === activePage ? 'positive' : 'muted'}
          key={pageIndex}>
          {pageIndex + 1}
        </Button>
      ))}
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
