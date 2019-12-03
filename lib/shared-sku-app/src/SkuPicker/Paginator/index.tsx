import React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import clamp from 'lodash/clamp';
import range from 'lodash/range';
import { doubleChevron } from '../iconsInBase64';
import { styles } from './styles';

export interface Props {
  activePage: number;
  className?: string;
  pageCount: number;
  setActivePage: (page: number) => void;
}

export function getPagesRange(page: number, total: number, neighboursCount = 2): number[] {
  const PAGINATOR_RANGE = neighboursCount * 2;

  if (total <= PAGINATOR_RANGE) {
    // Total amount of pages are less than the possible paginator range
    return range(0, total);
  }
  if (page <= neighboursCount) {
    // Active page is at the start of the paginator page count
    return range(0, PAGINATOR_RANGE + 1);
  }
  if (page > total - neighboursCount) {
    // Active page is at the end of the paginator page count
    return range(total - PAGINATOR_RANGE - 1, total);
  }
  // Active page is in the middle of the paginator count
  return range(page - neighboursCount - 1, page + neighboursCount);
}

export function Paginator(props: Props) {
  const { className, pageCount, setActivePage } = props;
  const activePage = clamp(props.activePage, 1, pageCount);
  const hasOnlyOnePage = pageCount === 1;
  const activePageIsAtPaginatorStart = activePage === 1;
  const activePageIsAtPaginatorEnd = activePage === pageCount;

  return (
    <div className={className}>
      <Button
        className={styles.button}
        buttonType="muted"
        disabled={hasOnlyOnePage || activePageIsAtPaginatorStart}
        onClick={() => setActivePage(1)}>
        <img className={styles.chevronLeft} src={doubleChevron} alt="right" />
      </Button>
      <Button
        icon="ChevronLeft"
        className={styles.button}
        buttonType="muted"
        disabled={hasOnlyOnePage || activePageIsAtPaginatorStart}
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
        disabled={hasOnlyOnePage || activePageIsAtPaginatorEnd}
        onClick={() => setActivePage(activePage + 1)}
      />
      <Button
        buttonType="muted"
        className={styles.button}
        disabled={hasOnlyOnePage || activePageIsAtPaginatorEnd}
        onClick={() => setActivePage(pageCount)}>
        <img className={styles.chevronRight} src={doubleChevron} alt="right" />
      </Button>
    </div>
  );
}
