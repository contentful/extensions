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
    zIndex: 2,
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '2px'
  }),
  signInButton: css({
    textAlign: 'center',
    dispay: 'none',
    margin: 'auto',
    cursor: 'pointer'
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
    zIndex: -1,
    top: '0',
    width: '100%',
    height: '300px',
    backgroundColor: '#f8ab00'
  }),
  contentTypeGrid: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr) max-content',
    gridGap: tokens.spacingXs
  }),
  contentTypeGridInputs: css({
    marginBottom: tokens.spacingM
  }),
  header: css({
    display: 'grid',
    gridTemplateColumns: '1.5fr 1.25fr',
    gridColumnGap: tokens.spacing2Xs,
    width: '100%',
    alignItems: 'self-end',
    marginBottom: tokens.spacingXs
  }),
  invisible: css({
    visibility: 'hidden'
  }),
  hidden: css({
    display: 'none'
  }),
  slug: css({
    color: tokens.colorTextLight,
    fontSize: tokens.fontSizeS,
    marginBottom: tokens.spacingM
  }),
  spaced: css({
    marginBottom: tokens.spacingL
  }),
  timeline: css({
    position: 'relative'
  }),
  timelineChart: css({
    minHeight: '200px'
  }),
  timelineSkeleton: css({
    position: 'absolute',
    top: 0,
    left: 0
  }),
  pageViews: css({
    opacity: 1,
    transition: `opacity ${tokens.transitionDurationShort}`
  }),
  pageViewsLoading: css({
    opacity: 0,
    transition: `opacity ${tokens.transitionDurationShort}`
  }),
  logo: css({
    display: 'flex',
    justifyContent: 'center',
    margin: `${tokens.spacing2Xl} 0 ${tokens.spacing4Xl}`
  })
};
