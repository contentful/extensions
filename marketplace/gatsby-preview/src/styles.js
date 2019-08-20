import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

export default {
  body: css({
    height: 'auto',
    minHeight: '850px',
    margin: '0 auto',
    marginTop: tokens.spacingXl,
    padding: '20px 40px',
    maxWidth: '786px',
    backgroundColor: '#fff',
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
    backgroundColor: '#452475',
    backgroundImage:
      'linear-gradient(45deg,#542c85 25%,transparent 25%,transparent 50%,#542c85 50%,#542c85 75%,transparent 75%,transparent)'
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
    marginTop: tokens.spacingXl
  }),
  checks: css({
    marginTop: tokens.spacingM
  }),
  pills: css({
    margin: `0 ${tokens.spacingXs}`
  })
};
