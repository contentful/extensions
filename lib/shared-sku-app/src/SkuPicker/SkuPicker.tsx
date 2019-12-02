import React, { Component } from 'react';
import get from 'lodash/get';
import clamp from 'lodash/clamp';
import debounce from 'lodash/debounce';
import { Button, TextInput, Icon } from '@contentful/forma-36-react-components';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import { Divider } from '../Divider';
import { ProductList } from './ProductList';
import { Paginator } from './Paginator';
import { Product } from '../interfaces';
import { Pagination } from './interfaces';
import { ProductSelectionList } from './ProductSelectionList';
import { styles } from './styles';

export interface Props {
  sdk: AppExtensionSDK;
  fetchProductPreview: Function;
  fetchProducts: Function;
}

interface State {
  activePage: number;
  search: string;
  pagination: Pagination;
  products: Product[];
  selectedProducts: Product[];
  selectedSKUs: string[];
}

const SEARCH_DELAY = 250;

function getSaveBtnText(selectedSKUs: string | string[]): string {
  if (typeof selectedSKUs === 'string') {
    return 'Save product';
  }

  switch (selectedSKUs.length) {
    case 0:
      return 'Save products';
    case 1:
      return 'Save 1 product';
    default:
      return `Save ${selectedSKUs.length} products`;
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
    selectedProducts: [],
    selectedSKUs: get(this.props, ['sdk', 'parameters', 'invocation', 'fieldValue'], [])
  };

  componentDidMount() {
    this.updateProducts();
    this.updateSelectedProducts();
  }

  setSearchCallback = debounce(() => {
    this.setActivePage(1);
    this.updateProducts();
  }, SEARCH_DELAY);

  setSearch = (search: string) => {
    this.setState({ search }, this.setSearchCallback);
  };

  updateProducts = async () => {
    try {
      const {
        activePage,
        pagination: { limit },
        search
      } = this.state;
      const offset = (activePage - 1) * limit;
      const { pagination, products } = await this.props.fetchProducts(search, { offset });
      this.setState({ pagination, products });
    } catch (error) {
      this.props.sdk.notifier.error('There was an error fetching the product list.');
    }
  };

  updateSelectedProducts = async () => {
    try {
      const selectedProductsPromises = this.state.selectedSKUs.map(sku =>
        this.props.fetchProductPreview(sku, this.props.sdk.parameters.installation)
      );
      const selectedProducts = await Promise.all(selectedProductsPromises);
      this.setState({ selectedProducts });
    } catch (error) {
      this.props.sdk.notifier.error(
        'There was an error fetching the data for the selected products.'
      );
    }
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

    if (this.state.selectedSKUs.includes(sku)) {
      this.setState(
        ({ selectedSKUs }) => ({
          selectedSKUs: selectedSKUs.filter(productSku => productSku !== sku)
        }),
        () => this.updateSelectedProducts()
      );
    } else {
      this.setState(
        ({ selectedSKUs }) => ({
          selectedSKUs: onlyOneProductCanBeSelected ? [sku] : [...selectedSKUs, sku]
        }),
        () => this.updateSelectedProducts()
      );
    }
  };

  render() {
    const { search, pagination, products, selectedProducts, selectedSKUs } = this.state;
    const pageCount = Math.ceil(pagination.total / pagination.limit);

    return (
      <>
        <header className={styles.header}>
          <div className={styles.leftsideControls}>
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
            <Icon color="muted" icon="Search" />
            <span className={styles.total}>Total results: {pagination.total.toLocaleString()}</span>
          </div>
          <div className={styles.rightsideControls}>
            <ProductSelectionList products={selectedProducts} selectProduct={this.selectProduct} />
            <Button
              className={styles.saveBtn}
              buttonType="primary"
              onClick={() => (this.props.sdk as any).close(selectedSKUs)}
              disabled={selectedSKUs.length === 0}>
              {getSaveBtnText(selectedSKUs)}
            </Button>
          </div>
        </header>
        <Divider />
        <section className={styles.body}>
          <ProductList
            products={products}
            selectProduct={this.selectProduct}
            selectedSKUs={selectedSKUs}
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
