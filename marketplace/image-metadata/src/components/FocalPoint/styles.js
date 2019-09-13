import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

export const styles = {
  focalPoint: css({
    backgroundColor: tokens.colorElementMid,
    borderRadius: '50%',
    border: `1px solid ${tokens.colorElementDarkest}`,
    opacity: 0.5,
    transition: `transform ${tokens.transitionDurationDefault} ${tokens.transitionEasingCubicBezier}`,
    position: 'absolute',
    pointerEvents: 'none'
  })
};
