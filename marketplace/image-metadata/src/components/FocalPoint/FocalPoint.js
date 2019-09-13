import React from 'react';
import PropTypes from 'prop-types';

export const FocalPoint = ({ focalPoint }) => (
  <div
    style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: 'red',
      border: '1px solid grey',
      top: `${focalPoint.y - 4}px`,
      left: `${focalPoint.x - 4}px`,
      position: 'absolute'
    }}
  />
);

FocalPoint.propTypes = {
  focalPoint: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  })
};
