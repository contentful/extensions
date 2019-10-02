import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

export const styles = {
  container: css({
    display: 'flex',
    alignItems: 'flex-start'
  }),
  input: css({
    maxWidth: '280px'
  }),
  button: css({
    marginLeft: tokens.spacingXs
  })
};
