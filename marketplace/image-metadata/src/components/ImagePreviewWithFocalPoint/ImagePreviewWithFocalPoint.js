import React from 'react';
import PropTypes from 'prop-types';
import tokens from '@contentful/forma-36-tokens';
import { clamp } from '../../utils';

function getZoomFactor(imgWidth, imgHeight, wrapperWidth, wrapperHeight) {
  const widthFactor = Math.max(wrapperWidth / imgWidth, 1);
  const heightFactor = Math.max(wrapperHeight / imgHeight, 1);
  return Math.max(widthFactor, heightFactor);
}

export const ImagePreviewWithFocalPoint = ({
  file: {
    url,
    fileName,
    details: {
      image: { width: actualImgWidth, height: actualImgHeight }
    }
  },
  subtitle,
  ...otherProps
}) => {
  const width = otherProps.wrapperWidth || 150;
  const sizingRatio = actualImgWidth / width;
  const height = actualImgHeight / sizingRatio;

  const wrapperWidth = otherProps.wrapperWidth || width;
  const wrapperHeight = otherProps.wrapperHeight || height;

  const zoom = getZoomFactor(width, height, wrapperWidth, wrapperHeight);

  const imgWidth = Math.round(width * zoom);
  const imgHeight = Math.round(height * zoom);

  const widthRatio = actualImgWidth / imgWidth;
  const heightRatio = actualImgHeight / imgHeight;

  const focalPoint = {
    x: otherProps.focalPoint.x / widthRatio,
    y: otherProps.focalPoint.y / heightRatio
  };

  const xMin = imgWidth - wrapperWidth;
  const yMin = imgHeight - wrapperHeight;
  const translateX = clamp(-focalPoint.x + wrapperWidth / 2, -xMin, 0);
  const translateY = clamp(-focalPoint.y + wrapperHeight / 2, -yMin, 0);

  return (
    <div>
      <div
        style={{
          width: wrapperWidth,
          height: wrapperHeight,
          overflow: 'hidden',
          position: 'relative'
        }}>
        <img
          src={url}
          style={{
            width: `${imgWidth}px`,
            height: `${imgHeight}px`,
            transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
            transition: `transform ${tokens.transitionDurationLong} ${tokens.transitionEasingCubicBezier}`
          }}
        />
      </div>
      {subtitle && <p>{subtitle}</p>}
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
  subtitle: PropTypes.string,
  wrapperWidth: PropTypes.number,
  wrapperHeight: PropTypes.number
};

ImagePreviewWithFocalPoint.defaultProps = {
  subtitle: ''
};
