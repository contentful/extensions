import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';

export const styles = {
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
    backgroundColor: '#599ded' // corresponds to logo
  }),
  featuresListItem: css({
    listStyleType: 'disc',
    marginLeft: tokens.spacingM
  }),
  light: css({
    color: tokens.colorTextLight,
    marginTop: tokens.spacingM
  }),
  logo: css({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: tokens.spacingXl,
    marginBottom: tokens.spacingXl,
    '& > img': css({
      width: '80px'
    })
  }),
  paragraph: css({
    marginTop: tokens.spacingM
  }),
  heading: css({
    marginBottom: tokens.spacingM
  }),
  input: css({
    marginTop: tokens.spacingM
  }),
  list: css({
    marginTop: tokens.spacingXs
  })
};
