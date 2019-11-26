import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import clamp from 'lodash/clamp';
import { Button, TextInput } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import { css } from 'emotion';
import { Divider } from '../Divider';
import { ProductList } from './ProductList';
import { Paginator } from './Paginator';
import { Product } from '../interfaces';
import { Pagination } from './interfaces';

interface Props {
  sdk: AppExtensionSDK;
  fetchProducts: Function;
}

interface State {
  activePage: number;
  search: string;
  pagination: Pagination;
  products: Product[];
  selectedProducts: string[];
}

const SEARCH_DELAY = 250;

const styles = {
  header: css({
    display: 'flex',
    justifyContent: 'space-between',
    padding: tokens.spacingL
  }),
  body: css({
    height: 'calc(100vh - 145px)',
    overflowY: 'auto',
    padding: `${tokens.spacingL} ${tokens.spacingL} 0 ${tokens.spacingL}`
  }),
  total: css({
    fontSize: tokens.fontSizeM,
    color: tokens.colorTextLight,
    display: 'block',
    marginTop: tokens.spacingS
  }),
  saveBtn: css({
    marginLeft: 'auto',
    marginRight: tokens.spacingM
  }),
  paginator: css({
    margin: `${tokens.spacingM} auto ${tokens.spacingL} auto`,
    textAlign: 'center'
  })
};

function getSaveBtnText(selectedProducts: string | string[]): string {
  if (typeof selectedProducts === 'string') {
    return 'Save product';
  }

  switch (selectedProducts.length) {
    case 0:
      return 'Save products';
    case 1:
      return 'Save 1 product';
    default:
      return `Save ${selectedProducts.length} products`;
  }
}

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
    selectedProducts: get(this.props, ['sdk', 'parameters', 'invocation', 'fieldValue'], [])
  };

  componentDidMount() {
    this.updateProducts();
  }

  setSearchCallback = debounce(() => {
    this.setActivePage(1);
    this.updateProducts();
  }, SEARCH_DELAY);

  setSearch = (search: string): void => {
    this.setState({ search }, this.setSearchCallback);
  };

  updateProducts = async (): Promise<void> => {
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
      this.updateProducts();
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
          <div>
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
            <span className={styles.total}>Total results: {pagination.total.toLocaleString()}</span>
          </div>
          <Button
            className={styles.saveBtn}
            buttonType="primary"
            onClick={() => (this.props.sdk as any).close(selectedProducts)}
            disabled={selectedProducts.length === 0}>
            {getSaveBtnText(selectedProducts)}
          </Button>
        </header>
        <Divider />
        <section className={styles.body}>
          <ProductList
            products={products}
            selectProduct={this.selectProduct}
            selectedProducts={selectedProducts}
          />
          {products.length > 0 && (
            <Paginator
              activePage={this.state.activePage}
              className={styles.paginator}
              pageCount={pageCount}
              setActivePage={this.setActivePage}
            />
          )}
        </section>
      </>
    );
  }
}
