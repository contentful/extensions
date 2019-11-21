import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import clamp from 'lodash/clamp';
import { Button, TextInput } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { Divider } from '../Divider';
import { ProductList } from './ProductList';
import { Paginator } from './Paginator';
import { Hash } from '../interfaces';
import { Pagination } from './interfaces';

interface Props {
  onSearch: Function;
}

interface State {
  activePage: number;
  search: string;
  pagination: Pagination;
  products: Hash[];
}

const SEARCH_DELAY = 150;

const styles = {
  header: css({
    padding: tokens.spacingL
  }),
  body: css({
    padding: tokens.spacingL
  }),
  footer: css({
    padding: tokens.spacingL,
    textAlign: 'right'
  }),
  paginatorTop: css({
    padding: `${tokens.spacingL} ${tokens.spacingL} 0 ${tokens.spacingL}`
  }),
  paginatorBottom: css({
    padding: `0 ${tokens.spacingL} ${tokens.spacingL} ${tokens.spacingL}`
  })
};

export class SkuPicker extends Component<Props, State> {
  state: State = {
    activePage: 1,
    search: '',
    pagination: {
      count: 0,
      limit: 0,
      offset: 0,
      total: 0
    },
    products: []
  };

  componentDidMount() {
    this.setSearchResults();
  }

  setSearch = (search: string): void => {
    this.setState({ search }, () => {
      this.setActivePage(1);
      this.setSearchResults();
    });
  };

  setSearchResults = async (): Promise<void> => {
    const {
      activePage,
      pagination: { limit },
      search
    } = this.state;
    const offset = (activePage - 1) * limit;
    const { pagination, products } = await this.props.onSearch(search, { offset });
    this.setState({ pagination, products });
  };

  setActivePage = (activePage: number) => {
    const { pagination } = this.state;
    const pageCount = Math.ceil(pagination.total / pagination.limit);
    this.setState({ activePage: clamp(activePage, 1, pageCount) }, () => {
      this.setSearchResults();
    });
  };

  render() {
    const { search, pagination, products } = this.state;
    const debouncedSetSearch = debounce(this.setSearch, SEARCH_DELAY);
    const pageCount = Math.ceil(pagination.total / pagination.limit);

    return (
      <>
        <header className={styles.header}>
          <TextInput
            placeholder="Search for a product..."
            type="search"
            name="sku-search"
            id="sku-search"
            testId="sku-search"
            width="medium"
            value={search}
            onChange={event => debouncedSetSearch((event.target as HTMLInputElement).value)}
          />
        </header>
        <Divider />
        <Paginator
          activePage={this.state.activePage}
          className={styles.paginatorTop}
          pageCount={pageCount}
          setActivePage={this.setActivePage}
        />
        <section className={styles.body}>
          <ProductList products={products} />
        </section>
        <Paginator
          activePage={this.state.activePage}
          className={styles.paginatorBottom}
          pageCount={pageCount}
          setActivePage={this.setActivePage}
        />
        <Divider />
        <footer className={styles.footer}>
          <Button buttonType="positive">Save</Button>
        </footer>
      </>
    );
  }
}
