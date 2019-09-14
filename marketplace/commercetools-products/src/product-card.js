import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  EntryCard,
  DropdownList,
  DropdownListItem,
  IconButton,
  CardDragHandle
} from '@contentful/forma-36-react-components';
import { Query } from '@apollo/react-components';
import GET_PRODUCT_BY_SKU from './ct-product-query.graphql';

import { SortableHandle, SortableElement } from 'react-sortable-hoc';

const DragHandle = SortableHandle(function DragHandle() {
  return <CardDragHandle>Reorder product</CardDragHandle>;
});

function getValueByLocale(nameAllLocales, locale) {
  if (!nameAllLocales.length) {
    return null;
  }

  let val = nameAllLocales.find(item => item.locale === locale);

  if (val === undefined) {
    val = nameAllLocales[0];
  }

  return val.value;
}

function ProductCard({ sku, locale, removeItem, index, sortable, isDisabled, projectKey }) {
  return (
    <Query query={GET_PRODUCT_BY_SKU} variables={{ skus: [sku] }}>
      {({ loading, error, data }) => {
        return (
          <ProductCardRenderer
            loading={loading}
            error={error}
            data={data}
            sku={sku}
            locale={locale}
            index={index}
            removeItem={removeItem}
            sortable={sortable}
            isDisabled={isDisabled}
            projectKey={projectKey}
          />
        );
      }}
    </Query>
  );
}

ProductCard.defaultProps = {
  sortable: false,
  isDisabled: false
};

ProductCard.propTypes = {
  sku: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  removeItem: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  sortable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  projectKey: PropTypes.string.isRequired
};

export class ProductCardRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.onRemoveItem = this.onRemoveItem.bind(this);
  }

  onRemoveItem() {
    const { index, removeItem } = this.props;
    removeItem(index);
  }

  render() {
    const { loading, error, data, sku, locale, sortable, isDisabled, projectKey } = this.props;

    if (loading) {
      return (
        <EntryCard
          title={sku}
          loading={loading}
          dropdownListElements={
            <React.Fragment>
              <DropdownList>
                <DropdownListItem onClick={this.onRemoveItem}>Remove</DropdownListItem>
              </DropdownList>
            </React.Fragment>
          }
        />
      );
    }

    if (error) {
      return (
        <Card>
          <div style={{ display: 'flex' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '.875rem', // Equal to 14px when browser text size is set to 100%
                lineHeight: 1.5,
                flex: '1 1 auto'
              }}>
              Error fetching product. This might be authentication issue or an issue with the
              commerce tools API.
            </h1>
          </div>
        </Card>
      );
    }

    const results = data.products.results;

    if (results.length === 0) {
      return (
        <Card>
          <div style={{ display: 'flex' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '.875rem', // Equal to 14px when browser text size is set to 100%
                lineHeight: 1.5,
                flex: '1 1 auto'
              }}>
              Product missing or inaccessible
            </h1>
            <IconButton
              iconProps={{ icon: 'Close' }}
              label="Remove reference to product"
              onClick={this.onRemoveItem}
              buttonType="muted"
            />
          </div>
        </Card>
      );
    }

    const { id, masterData } = results[0];
    const { categories, masterVariant, nameAllLocales } = masterData.current;
    let thumbnailElement = null;

    if (masterVariant.images.length) {
      thumbnailElement = <img alt="" src={masterVariant.images[0].url} width="70" height="70" />;
    }

    return (
      <EntryCard
        title={`${getValueByLocale(nameAllLocales, locale)} (${sku})`}
        loading={loading}
        contentType={getValueByLocale(categories[0].nameAllLocales, locale)}
        thumbnailElement={thumbnailElement}
        cardDragHandleComponent={sortable ? <DragHandle /> : null}
        dropdownListElements={
          // @todo these leave the viewport in the single item version
          <React.Fragment>
            <DropdownList>
              <DropdownListItem onClick={this.onRemoveItem} isDisabled={isDisabled}>
                Remove
              </DropdownListItem>
              <DropdownListItem
                target="_blank"
                href={`https://mc.commercetools.com/${projectKey}/products/${id}/general`}>
                Open in Merchant Center
              </DropdownListItem>
            </DropdownList>
          </React.Fragment>
        }
      />
    );
  }
}

ProductCardRenderer.defaultProps = {
  loading: false,
  sortable: false,
  isDisabled: false
};

ProductCardRenderer.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  data: PropTypes.shape({
    products: PropTypes.shape({
      results: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          masterData: PropTypes.object
        })
      )
    })
  }),
  sku: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  removeItem: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  sortable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  projectKey: PropTypes.string.isRequired
};

export const SortableProductCard = SortableElement(function SortableProductCard({
  removeItem,
  locale,
  sku,
  itemIndex,
  sortable,
  isDisabled,
  projectKey
}) {
  return (
    <ProductCard
      sku={sku}
      index={itemIndex}
      removeItem={removeItem}
      locale={locale}
      sortable={sortable}
      isDisabled={isDisabled}
      projectKey={projectKey}
    />
  );
});
