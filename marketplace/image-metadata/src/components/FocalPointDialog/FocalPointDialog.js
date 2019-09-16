import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Heading, Modal } from '@contentful/forma-36-react-components';

import { FocalPoint } from '../FocalPoint';
import { ImagePreviewWithFocalPoint } from '../ImagePreviewWithFocalPoint';

import { styles } from './styles';

export class FocalPointDialog extends Component {
  static propTypes = {
    file: PropTypes.object.isRequired,
    focalPoint: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
  }

  state = {
    focalPoint: this.props.focalPoint || { x: 0, y: 0 },
    imgElementRect: null
  };

  getAdjustedFocalPointForUI = () => {
    const { file } = this.props;
    const { focalPoint, imgElementRect } = this.state;

    const { width, height } = file.details.image;
    const widthRatio = width / imgElementRect.width;
    const heightRatio = height / imgElementRect.height;

    const marginLeft = parseInt(getComputedStyle(this.imgRef.current).marginLeft);
    const marginTop = parseInt(getComputedStyle(this.imgRef.current).marginTop);

    return {
      x: Math.round(focalPoint.x / widthRatio) + marginLeft,
      y: Math.round(focalPoint.y / heightRatio) + marginTop
    };
  };

  onImageClick = e => {
    const { file } = this.props;

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { width, height } = file.details.image;

    const widthRatio = width / rect.width;
    const heightRatio = height / rect.height;

    const actualX = Math.round(x * widthRatio);
    const actualY = Math.round(y * heightRatio);

    this.setState({
      focalPoint: { x: actualX, y: actualY }
    });
  };

  onImageLoad = e => {
    this.setState({
      imgElementRect: e.target.getBoundingClientRect()
    });
  };

  render() {
    const { file, sdk } = this.props;
    const { focalPoint, imgElementRect } = this.state;
    const shouldRenderFocalPoint = !!focalPoint && !!imgElementRect;

    return (
      <>
        <Modal.Header title="Focal point preview" onClose={this.props.onClose} />
        <Modal.Content>
          <div className={styles.modalContent}>
            <div>
              <Heading>Set a focal point</Heading>
              <div className={styles.previewWrapper}>
                <img
                  ref={this.imgRef}
                  src={file.url}
                  className={styles.previewWrapperImg}
                  onClick={this.onImageClick}
                  onLoad={this.onImageLoad}
                />
                {shouldRenderFocalPoint && (
                  <FocalPoint focalPoint={this.getAdjustedFocalPointForUI()} />
                )}
              </div>
            </div>
            <div className={styles.focalPointDemo}>
              <Heading>Preview</Heading>
              <div>
                <ImagePreviewWithFocalPoint
                  file={file}
                  focalPoint={focalPoint}
                  wrapperWidth={120}
                  wrapperHeight={180}
                  subtitle="Mobile"
                  zoomToFit
                />
                <ImagePreviewWithFocalPoint
                  file={file}
                  focalPoint={focalPoint}
                  wrapperWidth={280}
                  wrapperHeight={180}
                  subtitle="Tablet"
                  zoomToFit
                />
              </div>
              <div>
                <ImagePreviewWithFocalPoint
                  file={file}
                  focalPoint={focalPoint}
                  wrapperWidth={410}
                  wrapperHeight={180}
                  subtitle="Desktop"
                  zoomToFit
                />
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Controls>
          <Button onClick={() => this.props.onSave(this.state.focalPoint)} buttonType="positive">
            Save
          </Button>
          <Button onClick={this.props.onClose} buttonType="muted">
            Close
          </Button>
        </Modal.Controls>
      </>
    );
  }
}
