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
    'z-index': '2',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '2px'
  }),
  splitter: css({
    marginTop: tokens.spacingL,
    marginBottom: tokens.spacingL,
    border: 0,
    height: '1px',
    backgroundColor: tokens.colorElementMid
  }),
  background: css({
    display: 'block',
    position: 'absolute',
    'z-index': '-1',
    top: '0',
    width: '100%',
    height: '300px',
    backgroundColor: '#f8ab00'
  }),
  icon: css({
    display: 'flex',
    justifyContent: 'center',
    margin: `${tokens.spacingXl} 0`
  }),
  checks: css({
    marginTop: tokens.spacingM
  }),
  pills: css({
    margin: `0 ${tokens.spacingXs}`
  }),
  contentTypeGrid: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr) max-content',
    gridGap: tokens.spacingXs
  }),
  contentTypeGridInputs: css({
    marginBottom: tokens.spacingM
  }),
  range: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridColumnGap: tokens.spacing2Xs,
    width: '100%',
    alignItems: 'center'
  }),
  invisible: css({
    visibility: 'hidden'
  })
};
