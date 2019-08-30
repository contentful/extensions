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
    zIndex: '-1',
    top: '0',
    width: '100%',
    height: '300px',
    backgroundColor: '#452475',
    backgroundImage:
      'linear-gradient(45deg,#542c85 25%,transparent 25%,transparent 50%,#542c85 50%,#542c85 75%,transparent 75%,transparent)'
  }),
  input: css({
    marginTop: tokens.spacingM
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
  })
};
