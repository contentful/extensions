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
    '& > div': {
      marginLeft: '25px',
      display: 'flex',
      '& > div ~ div': {
        marginLeft: '5px'
      }
    }
  })
};
