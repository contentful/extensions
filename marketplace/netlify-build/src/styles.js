import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

export default {
  info: css({
    color: tokens.colorTextLight,
    marginBottom: tokens.spacingM,
    fontSize: tokens.fontSizeS,
    fontWeight: tokens.fontWeightNormal
  }),
  button: css({
    marginBottom: tokens.spacingS
  }),
  previewButton: css({
    margin: `${tokens.spacingS} 0`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  previewContent: css({
    display: 'flex',
    alignContent: 'center'
  }),
  previewIcon: css({
    marginRight: tokens.spacing2Xs,
    marginTop: '1px'
  }),
  header: css({
    display: 'flex',
    marginBottom: tokens.spacingS
  }),
  section: css({
    marginBottom: tokens.spacingXl
  })
};
