import React from 'react';
import PropTypes from 'prop-types';

import { styles } from './styles';

export const FocalPoint = ({ focalPoint }) => (
  <div
    style={{
      width: '32px',
      height: '32px',
      transform: `translate3d(${focalPoint.x - 16}px, ${focalPoint.y - 16}px, 0)`,
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
