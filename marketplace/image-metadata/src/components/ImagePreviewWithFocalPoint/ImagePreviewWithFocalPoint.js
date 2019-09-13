import React from 'react';
import PropTypes from 'prop-types';

export const ImagePreviewWithFocalPoint = props => {
  const {
    file: {
      url,
      fileName,
      details: {
        image: { width: actualImgWidth, height: actualImgHeight }
      }
    },
    focalPoint,
    zoom
  } = props;

  const maxWidth = props.wrapperWidth || 150;
  const sizingRatio = actualImgWidth / maxWidth;

  const imgWidth = Math.min(actualImgWidth, maxWidth);
  const imgHeight = actualImgHeight / sizingRatio;
  const wrapperWidth = props.wrapperWidth || imgWidth;
  const wrapperHeight = props.wrapperHeight || imgHeight;

  const xPos = ((focalPoint.x / actualImgWidth) * 100).toFixed(2);
  const yPos = ((focalPoint.y / actualImgHeight) * 100).toFixed(2);
  const imgStyles = {
    backgroundImage: `url(${url})`,
    backgroundSize: `${imgWidth * zoom}px ${imgHeight * zoom}px`,
    backgroundPosition: `${xPos}% ${yPos}%`,
    transition: 'background-position 350ms ease-in',
    willChange: 'background-position'
  };

  return (
    <div>
      <div
        role="image"
        aria-label="fileName"
        style={{
          ...imgStyles,
          width: wrapperWidth,
          height: wrapperHeight
        }}
      />
      <p>Zoom: x{zoom}</p>
    </div>
  );
};

ImagePreviewWithFocalPoint.propTypes = {
  file: PropTypes.shape({
    url: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    details: PropTypes.shape({
      image: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  focalPoint: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  wrapperWidth: PropTypes.number,
  wrapperHeight: PropTypes.number,
  zoom: PropTypes.number
};

ImagePreviewWithFocalPoint.defaultProps = {
  zoom: 1
};
