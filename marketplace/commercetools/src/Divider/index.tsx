import React from 'react';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  divider: css({
    border: 0,
    height: '1px',
    backgroundColor: tokens.colorElementMid,
    margin: 0
  })
};

export const Divider = () => <hr className={styles.divider} />;
