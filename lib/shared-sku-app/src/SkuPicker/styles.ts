import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

/**
 * Returns the target height of the modal window body in pixels.
 * Relative units were causing multiple resizings of the iframe.
 */
function getBodyHeight() {
  const HEADER_HEIGHT = 114;
  const twentyPerc = window.outerHeight * 0.3;
  return window.outerHeight - twentyPerc - HEADER_HEIGHT;
}

export const styles = {
  header: css({
    display: 'flex',
    justifyContent: 'space-between',
    padding: tokens.spacingL
  }),
  body: css({
    height: getBodyHeight(),
    padding: `${tokens.spacingL} ${tokens.spacingL} 0 ${tokens.spacingL}`
  }),
  total: css({
    fontSize: tokens.fontSizeS,
    color: tokens.colorTextLight,
    display: 'block',
    marginTop: tokens.spacingS
  }),
  saveBtn: css({
    marginRight: tokens.spacingM
  }),
  paginator: css({
    margin: `${tokens.spacingM} auto ${tokens.spacingL} auto`,
    textAlign: 'center'
  }),
  leftsideControls: css({
    position: 'relative',
    zIndex: 0,
    svg: css({
      zIndex: 1,
      position: 'absolute',
      top: '10px',
      left: '10px'
    }),
    input: css({
      paddingLeft: '35px'
    })
  }),
  rightsideControls: css({
    justifyContent: 'flex-end',
    flexGrow: 1,
    display: 'flex'
  }),
  loadMoreButton: css({
    width: '100%',
    marginTop: tokens.spacingXs
  })
};
