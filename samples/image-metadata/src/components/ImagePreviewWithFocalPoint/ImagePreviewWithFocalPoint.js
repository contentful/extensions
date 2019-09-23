import React from 'react';
import PropTypes from 'prop-types';
import tokens from '@contentful/forma-36-tokens';
import { styles } from './styles';
import { clamp } from '../../utils';

function getZoomFactor(imgHeight, wrapperHeight) {
  return Math.max(1, wrapperHeight / imgHeight);
}

function getTranslateValue(coord, wrapperSize, imgSize) {
  const min = imgSize - wrapperSize;
  const translate = -coord + wrapperSize / 2;
  return clamp(translate, -min, 0);
}

export const ImagePreviewWithFocalPoint = ({
  className,
  file: {
    url,
    details: {
      image: { width: originalImgWidth, height: originalImgHeight }
    }
  },
  subtitle,
  wrapperWidth,
  ...otherProps
}) => {
  const sizingRatio = originalImgWidth / wrapperWidth;
  const baseImgHeight = originalImgHeight / sizingRatio;

  const wrapperHeight = otherProps.wrapperHeight || baseImgHeight;

  const zoom = getZoomFactor(baseImgHeight, wrapperHeight);

  const imgWidth = Math.round(wrapperWidth * zoom);
  const imgHeight = Math.round(baseImgHeight * zoom);

  const widthRatio = originalImgWidth / imgWidth;
  const heightRatio = originalImgHeight / imgHeight;

  const focalPoint = {
    x: otherProps.focalPoint.x / widthRatio,
    y: otherProps.focalPoint.y / heightRatio
  };

  const translateX = getTranslateValue(focalPoint.x, wrapperWidth, imgWidth);
  const translateY = getTranslateValue(focalPoint.y, wrapperHeight, imgHeight);

  return (
    <div className={className}>
      <div
        style={{
          width: wrapperWidth,
          height: wrapperHeight,
          overflow: 'hidden',
          position: 'relative'
        }}>
        <img
          alt="Preview with cropping applied"
          src={url}
          style={{
            width: `${imgWidth}px`,
            height: `${imgHeight}px`,
            transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
            transition: `transform ${tokens.transitionDurationLong} ${tokens.transitionEasingCubicBezier}`
          }}
        />
      </div>
      {subtitle && <p className={styles.device}>{subtitle}</p>}
    </div>
  );
};

ImagePreviewWithFocalPoint.propTypes = {
  className: PropTypes.string,
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
  wrapperHeight: PropTypes.number,
  wrapperWidth: PropTypes.number,
  subtitle: PropTypes.string
};

ImagePreviewWithFocalPoint.defaultProps = {
  className: '',
  wrapperWidth: 150,
  subtitle: ''
};
