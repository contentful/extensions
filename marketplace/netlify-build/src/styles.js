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
  previewIcon: css({
    marginTop: 0,
    marginRight: '5px'
  }),
  header: css({
    display: 'flex',
    marginBottom: tokens.spacingS
  }),
  alphaLabel: css({
    display: 'block',
    marginRight: tokens.spacingS,
    background: tokens.colorBlueDark,
    color: tokens.colorWhite,
    padding: tokens.spacing2Xs,
    fontSize: '0.65rem',
    lineHeight: '0.65rem',
    borderRadius: '3px',
    textTransform: 'uppercase'
  }),
  body: css({
    fontFamily: 'Avenir Next W01'
  })
};
