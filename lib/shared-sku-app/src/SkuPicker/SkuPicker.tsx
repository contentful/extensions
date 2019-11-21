import React, { useState, useEffect } from 'react';
import get from 'lodash/get';
import { Button, TextInput } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { Divider } from '../Divider';
import { ProductList } from './ProductList';
import { Hash } from '../interfaces';

interface Props {
  sdk: Hash;
  onSearch: Function;
}

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
  })
};

export const SkuPicker = ({ sdk, onSearch }: Props) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const stringifiedProducts = JSON.stringify(products);

  useEffect(() => {
    async function resolveProducts() {
      const results = await onSearch(search);
      setProducts(results);
    }
    resolveProducts();
  }, [onSearch, search, stringifiedProducts]);

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
          onChange={event => {
            onSearch('sikis');
            setSearch((event.target as HTMLInputElement).value);
          }}
        />
      </header>
      <Divider />
      <section className={styles.body}>
        <ProductList
          locale={get(sdk, ['parameters', 'installation', 'locale'], 'en')}
          products={products}
        />
      </section>
      <Divider />
      <footer className={styles.footer}>
        <Button buttonType="positive">Save</Button>
      </footer>
    </>
  );
};
