import get from 'lodash/get';
import merge from 'lodash/merge';
import last from 'lodash/last';
import { dataTransformer, productsToVariantsTransformer } from './dataTransformer';
import { makeShopifyClient } from './productResolvers';

const PER_PAGE = 1;

class Pagination {
  products = [];

  variants = [];

  prevSearch = '';

  paginationEndIndex = PER_PAGE;

  constructor(sdk, shopifyClient) {
    this.sdk = sdk;
    this.shopifyClient = shopifyClient;
  }

  async init() {
    this.shopifyClient = await makeShopifyClient(this.sdk);
  }

  async fetchNext(search) {
    const searchHasChanged = search !== this.prevSearch;
    if (searchHasChanged) {
      this._resetPagination();
    }

    const nothingLeftToFetch = !!this.products.length && !last(this.products).hasNextPage;

    if (this.variants.length >= PER_PAGE || nothingLeftToFetch) {
      // If there is already a satisfactory size of variants to fill the next
      // page there is no need to fetch any more products and extract their variants
      // until the next click on the "Load more" button
      const variants = this.variants.splice(0, PER_PAGE);
      const productCorrespondingToLastVariant = this.products.find(
        product => product.id === last(variants).productId
      );
      const hasNextPage = get(productCorrespondingToLastVariant, ['hasNextPage'], false);
      return {
        pagination: { hasNextPage },
        products: variants.map(dataTransformer(this.sdk.parameters.installation))
      };
    }

    await this._fetchMoreProducts(search);
    return this.fetchNext(search);
  }

  async _fetchMoreProducts(search) {
    const noProductsFetchedYet = this.products.length === 0;
    const nextProducts = noProductsFetchedYet
      ? await this._fetchProducts(search)
      : await this._fetchNextPage(this.products);
    const nextVariants = productsToVariantsTransformer(nextProducts);
    merge(this.products, nextProducts);
    merge(this.variants, nextVariants);
  }

  async _fetchProducts(search) {
    const query = { query: `variants:['sku:${search}'] OR title:${search}` };
    const products = await this.shopifyClient.product.fetchQuery({
      first: PER_PAGE,
      sortBy: 'TITLE',
      ...(search.length && query)
    });
    return products;
  }

  async _fetchNextPage(products) {
    return (await this.shopifyClient.fetchNextPage(products)).model;
  }

  _resetPagination() {
    this.products.length = 0;
    this.variants.length = 0;
    this.prevSearch = '';
    this.paginationEndIndex = PER_PAGE;
  }
}

const makePagination = async sdk => {
  const pagination = new Pagination(sdk);
  await pagination.init();
  return pagination;
};

export default makePagination;
