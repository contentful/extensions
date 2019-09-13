import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';
import hexRgb from 'hex-rgb';

const { red, green, blue } = hexRgb(tokens.colorElementMid);

export const styles = {
  focalPoint: css({
    backgroundColor: `rgba(${red}, ${green}, ${blue}, 0.5)`,
    borderRadius: '50%',
    border: `2px solid ${tokens.colorElementDarkest}`,
    opacity: 1,
    transition: `transform ${tokens.transitionDurationDefault} ${tokens.transitionEasingCubicBezier}`,
    position: 'absolute',
    pointerEvents: 'none'
  })
};
