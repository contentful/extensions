import React from 'react';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  splitter: css({
    marginTop: tokens.spacingL,
    marginBottom: tokens.spacingL,
    border: 0,
    height: '1px',
    backgroundColor: tokens.colorElementMid
  })
};

export default function SectionSplitter() {
  return <hr className={styles.splitter} />;
}
