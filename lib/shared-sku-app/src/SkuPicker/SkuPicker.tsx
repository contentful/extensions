import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import clamp from 'lodash/clamp';
import { Button, TextInput } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import { css } from 'emotion';
import { Divider } from '../Divider';
import { ProductList } from './ProductList';
import { Paginator } from './Paginator';
import { Hash } from '../interfaces';
import { Pagination } from './interfaces';

interface Props {
  sdk: AppExtensionSDK;
  fetchProducts: Function;
}

interface State {
  activePage: number;
  search: string;
  pagination: Pagination;
  products: Hash[];
  selectedProducts: string[];
}

const SEARCH_DELAY = 250;

const styles = {
  header: css({
    padding: tokens.spacingL
  }),
  body: css({
    height: 'calc(100vh - 226px)',
    overflowY: 'auto',
    padding: tokens.spacingL
  }),
  footer: css({
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.spacingL} ${tokens.spacingL} 0 ${tokens.spacingL}`,
    textAlign: 'right'
  }),
  footerButton: css({
    marginLeft: 'auto',
    marginRight: tokens.spacingM
  }),
  paginatorBottom: css({
    padding: `0 ${tokens.spacingL} ${tokens.spacingL} 0`
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
    products: [],
    selectedProducts: []
  };

  componentDidMount() {
    this.setSearchResults();
  }

  setSearchCallback = debounce(() => {
    this.setActivePage(1);
    this.setSearchResults();
  }, SEARCH_DELAY);

  setSearch = (search: string): void => {
    this.setState({ search }, this.setSearchCallback);
  };

  setSearchResults = async (): Promise<void> => {
    const {
      activePage,
      pagination: { limit },
      search
    } = this.state;
    const offset = (activePage - 1) * limit;
    const { pagination, products } = await this.props.fetchProducts(search, { offset });
    this.setState({ pagination, products });
  };

  setActivePage = (activePage: number) => {
    const { pagination } = this.state;
    const pageCount = Math.ceil(pagination.total / pagination.limit);
    this.setState({ activePage: clamp(activePage, 1, pageCount) }, () => {
      this.setSearchResults();
    });
  };

  selectProduct = (sku: string) => {
    const { fieldType } = this.props.sdk.parameters.invocation as any;
    const onlyOneProductCanBeSelected = fieldType === 'Symbol';

    if (this.state.selectedProducts.includes(sku)) {
      this.setState(({ selectedProducts }) => ({
        selectedProducts: selectedProducts.filter(productSku => productSku !== sku)
      }));
    } else {
      this.setState(({ selectedProducts }) => ({
        selectedProducts: onlyOneProductCanBeSelected ? [sku] : [...selectedProducts, sku]
      }));
    }
  };

  render() {
    const { search, pagination, products, selectedProducts } = this.state;
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
            onChange={event => this.setSearch((event.target as HTMLInputElement).value)}
          />
        </header>
        <Divider />
        <section className={styles.body}>
          <ProductList
            products={products}
            selectProduct={this.selectProduct}
            selectedProducts={selectedProducts}
          />
        </section>
        <Divider />
        <footer className={styles.footer}>
          {products.length > 0 && (
            <Paginator
              activePage={this.state.activePage}
              className={styles.paginatorBottom}
              pageCount={pageCount}
              setActivePage={this.setActivePage}
            />
          )}
          <Button
            className={styles.footerButton}
            buttonType="positive"
            onClick={() => (this.props.sdk as any).close(selectedProducts)}
            disabled={selectedProducts.length === 0}>
            Save
          </Button>
        </footer>
      </>
    );
  }
}
