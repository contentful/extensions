import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

export const MAX_PREVIEW_WRAPPER_SIZE = 300;

export const styles = {
  modalContent: css({
    display: 'flex'
  }),
  previewWrapper: css({
    backgroundColor: tokens.colorElementLight,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    minWidth: `${MAX_PREVIEW_WRAPPER_SIZE}px`,
    height: `${MAX_PREVIEW_WRAPPER_SIZE}px`
  }),
  previewWrapperImg: css({
    cursor: 'crosshair',
    display: 'block',
    margin: '0 auto',
    maxWidth: '100%',
    maxHeight: '100%'
  }),
  focalPointDemo: css({
    display: 'flex',
    flexDirection: 'column',
    marginLeft: tokens.spacing2Xl
  }),
  displayFlex: css({
    display: 'flex'
  }),
  spacingLeftXs: css({
    marginLeft: tokens.spacingXs
  }),
  previewHeading: css({
    marginTop: tokens.spacingM
  }),
  subheading: css({
    marginBottom: tokens.spacingXs
  })
};
