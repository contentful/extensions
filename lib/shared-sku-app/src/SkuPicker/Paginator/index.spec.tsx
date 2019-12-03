import React from 'react';
import { configure, render, cleanup } from '@testing-library/react';
import { getPagesRange, Props, Paginator } from '.';

configure({
  testIdAttribute: 'data-test-id'
});

const defaultProps: Props = {
  activePage: 3,
  pageCount: 12,
  setActivePage: jest.fn()
};

const renderComponent = (props: Props) => {
  return render(<Paginator {...props} />);
};

describe('Paginator', () => {
  afterEach(cleanup);

  it('renders the last page if active page index is larger than the total count of pages', () => {
    const component = renderComponent({ ...defaultProps, activePage: 14 });
    const button = component.getByTestId('active');
    expect(button.textContent).toEqual('12');
  });

  it('renders the first page if active page index is <= 0', () => {
    const component = renderComponent({ ...defaultProps, activePage: 0 });
    const button = component.getByTestId('active');
    expect(button.textContent).toEqual('1');
  });
});

describe('getPagesRange', () => {
  const NEIGHBOURS_COUNT = 2;
  describe('when the total pages are less than double the amount of renderable neighbouring buttons', () => {
    it('should return a range of 0 to total pages', () => {
      expect(getPagesRange(2, 4, NEIGHBOURS_COUNT)).toEqual([0, 1, 2, 3]);
    });
  });

  describe('when the total pages are more than double the amount of renderable neighbouring buttons', () => {
    describe('and the active page is somewhere at the start of the total pages', () => {
      it('should return a range of 0 to the max amount of visible paginator buttons', () => {
        expect(getPagesRange(2, 30, NEIGHBOURS_COUNT)).toEqual([0, 1, 2, 3, 4]);
      });
    });
    describe('and the active page is near the end of the total pages', () => {
      it('should return a range of the last renderable paginator buttons up to the amount of total pages', () => {
        expect(getPagesRange(28, 30, NEIGHBOURS_COUNT)).toEqual([25, 26, 27, 28, 29]);
      });
    });
    describe('and the active page is anywhere in the middle of the total pages', () => {
      it('should return a range of active pages -/+ neighours count', () => {
        expect(getPagesRange(15, 30, NEIGHBOURS_COUNT)).toEqual([12, 13, 14, 15, 16]);
      });
    });
  });
});
