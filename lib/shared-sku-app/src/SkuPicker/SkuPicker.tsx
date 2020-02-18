import React, { Component } from 'react';
import get from 'lodash/get';
import clamp from 'lodash/clamp';
import debounce from 'lodash/debounce';
import { Button, TextInput, Icon } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { Divider } from '../Divider';
import { ProductList } from './ProductList';
import { Paginator } from './Paginator';
import { Pagination, Product, Hash, ProductPreviewsFn, ProductsFn } from '../interfaces';
import { ProductSelectionList } from './ProductSelectionList';
import { styles } from './styles';
import { mapSort } from '../utils';

export interface Props {
  sdk: DialogExtensionSDK;
  fetchProductPreviews: ProductPreviewsFn;
  fetchProducts: ProductsFn;
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

function getSaveBtnText(selectedSKUs: string[]): string {
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
      const { selectedSKUs } = this.state;
      const config = this.props.sdk.parameters.installation;
      const selectedProductsUnsorted = await this.props.fetchProductPreviews(selectedSKUs, config);
      const selectedProducts = mapSort(selectedProductsUnsorted, selectedSKUs, 'sku');
      this.setState({ selectedProducts });
    } catch (error) {
      this.props.sdk.notifier.error(
        'There was an error fetching the data for the selected products.'
      );
    }
  };

  loadMoreProducts = async () => {
    const { pagination, products } = await this.props.fetchProducts(this.state.search);
    this.setState(oldState => ({ pagination, products: [...oldState.products, ...products] }));
  };

  setActivePage = (activePage: number) => {
    const { pagination } = this.state;
    const pageCount = Math.ceil(pagination.total / pagination.limit);
    this.setState({ activePage: clamp(activePage, 1, pageCount) }, () => {
      this.updateProducts();
    });
  };

  selectProduct = (sku: string) => {
    const { fieldType } = this.props.sdk.parameters.invocation as Hash;
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
    const infiniteScrollingPaginationMode = 'hasNextPage' in pagination;
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
            {!!pagination.total && (
              <span className={styles.total}>
                Total results: {pagination.total.toLocaleString()}
              </span>
            )}
          </div>
          <div className={styles.rightsideControls}>
            <ProductSelectionList products={selectedProducts} selectProduct={this.selectProduct} />
            <Button
              className={styles.saveBtn}
              buttonType="primary"
              onClick={() => this.props.sdk.close(selectedSKUs)}
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
          {!infiniteScrollingPaginationMode && products.length > 0 && (
            <Paginator
              activePage={this.state.activePage}
              className={styles.paginator}
              pageCount={pageCount}
              setActivePage={this.setActivePage}
            />
          )}
          {infiniteScrollingPaginationMode && pagination.hasNextPage && (
            <Button
              className={styles.loadMoreButton}
              buttonType="naked"
              testId="infinite-scrolling-pagination"
              onClick={this.loadMoreProducts}>
              Load more
            </Button>
          )}
        </section>
      </>
    );
  }
}
