import React, { useState } from 'react';
import { Button, TextInput } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { Divider } from '../Divider';

interface Props {
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

export const SkuPicker = ({ onSearch }: Props) => {
  const [search, setSearch] = useState('');
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
      <section className={styles.body} />
      <Divider />
      <footer className={styles.footer}>
        <Button buttonType="positive">Save</Button>
      </footer>
    </>
  );
};
