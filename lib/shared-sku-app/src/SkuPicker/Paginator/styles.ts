import { css } from 'emotion';

export const styles = {
  button: css({
    borderRadius: 0,
    maxWidth: '45px',
    span: {
      overflow: 'visible !important'
    }
  }),
  chevronLeft: css({
    display: 'flex',
    opacity: 0.6
  }),
  chevronRight: css({
    display: 'flex',
    transform: 'rotate(180deg)',
    opacity: 0.6
  })
};
