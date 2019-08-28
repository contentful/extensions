import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

export default {
  body: css({
    height: 'auto',
    minHeight: '65vh',
    margin: '0 auto',
    marginTop: tokens.spacingXl,
    padding: `${tokens.spacingXl} ${tokens.spacing2Xl}`,
    maxWidth: tokens.contentWidthText,
    backgroundColor: tokens.colorWhite,
    zIndex: '2',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '2px'
  }),
  background: css({
    display: 'block',
    position: 'absolute',
    zIndex: '-1',
    top: '0',
    width: '100%',
    height: '300px',
    backgroundColor: 'rgb(23,64,121)',
    background: 'linear-gradient(90deg, rgba(23,64,121,1) 0%, rgba(27,158,156,1) 100%)'
  }),
  section: css({
    margin: `${tokens.spacingXl} 0`
  }),
  input: css({
    marginTop: tokens.spacingM
  }),
  splitter: css({
    marginTop: tokens.spacingL,
    marginBottom: tokens.spacingL,
    border: 0,
    height: '1px',
    backgroundColor: tokens.colorElementMid
  }),
  icon: css({
    display: 'flex',
    justifyContent: 'center',
    marginTop: tokens.spacingXl,
    marginBottom: tokens.spacingXl
  }),
  checks: css({
    marginTop: tokens.spacingM,
    display: 'flex'
  }),
  pills: css({
    margin: `0 ${tokens.spacingXs}`
  }),
  relative: css({
    position: 'relative'
  }),
  configurationProtector: css({
    zIndex: 9999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.60)',
    position: 'absolute'
  })
};
