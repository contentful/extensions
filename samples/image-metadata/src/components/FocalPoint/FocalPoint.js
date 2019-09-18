import React from 'react';
import PropTypes from 'prop-types';

import { BORDER_SIZE, styles } from './styles';

const SIZE = 32;

export const FocalPoint = ({ focalPoint }) => (
  <div
    style={{
      width: `${SIZE}px`,
      height: `${SIZE}px`,
      transform: `translate3d(${focalPoint.x - (SIZE / 2 + BORDER_SIZE)}px, ${focalPoint.y -
        (SIZE / 2 + BORDER_SIZE)}px, 0)`,
      top: 0,
      left: 0
    }}
    className={styles.focalPoint}
  />
);

FocalPoint.propTypes = {
  focalPoint: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  })
};
