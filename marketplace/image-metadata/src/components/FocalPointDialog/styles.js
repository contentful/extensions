import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

export const styles = {
  modalContent: css({
    display: 'flex'
  }),
  previewWrapper: css({
    position: 'relative',
    height: '300px'
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
    marginLeft: tokens.spacing2Xl,
    '& > div': {
      display: 'flex',
      '& > div ~ div': {
        marginLeft: tokens.spacingXs
      }
    }
  }),
  spacingTop: css({
    marginTop: tokens.spacingXs
  })
};
