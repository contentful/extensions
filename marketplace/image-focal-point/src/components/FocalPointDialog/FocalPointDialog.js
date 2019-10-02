import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Subheading, Modal } from '@contentful/forma-36-react-components';

import { FocalPoint } from '../FocalPoint';
import { ImagePreviewWithFocalPoint } from '../ImagePreviewWithFocalPoint';

import { MAX_PREVIEW_WRAPPER_SIZE, styles } from './styles';

export class FocalPointDialog extends Component {
  static propTypes = {
    file: PropTypes.object.isRequired,
    focalPoint: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  imgRef = React.createRef();

  state = {
    focalPoint: this.props.focalPoint || {
      x: this.props.file.details.image.width / 2,
      y: this.props.file.details.image.height / 2
    },
    imgElementRect: null
  };

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  getAdjustedFocalPointForUI = () => {
    const { file } = this.props;
    const { focalPoint, imgElementRect } = this.state;

    const { width, height } = file.details.image;
    const widthRatio = width / imgElementRect.width;
    const heightRatio = height / imgElementRect.height;

    const marginLeft = Math.max((MAX_PREVIEW_WRAPPER_SIZE - imgElementRect.width) / 2, 0);
    const marginTop = Math.max((MAX_PREVIEW_WRAPPER_SIZE - imgElementRect.height) / 2, 0);

    return {
      x: Math.round(focalPoint.x / widthRatio + marginLeft),
      y: Math.round(focalPoint.y / heightRatio + marginTop)
    };
  };

  onImageClick = e => {
    const imageWasClicked = this.imgRef.current === e.target;
    if (!imageWasClicked) {
      return;
    }

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

  onImageLoad = e =>
    this.setState({
      imgElementRect: e.target.getBoundingClientRect()
    });

  onWindowResize = () =>
    this.setState({
      imgElementRect: this.imgRef.current.getBoundingClientRect()
    });

  render() {
    const { file } = this.props;
    const { focalPoint, imgElementRect } = this.state;
    const shouldRenderFocalPoint = !!focalPoint && !!imgElementRect;

    return (
      <>
        <Modal.Header title="Set focal point" onClose={this.props.onClose} />
        <Modal.Content>
          <div className={styles.modalContent}>
            <div>
              <Subheading className={styles.subheading}>Select position of focal point</Subheading>
              <div className={styles.previewWrapper}>
                <div
                  className={styles.previewImg}
                  role="button"
                  tabIndex={-1}
                  onClick={this.onImageClick}
                  onKeyDown={() => {}}>
                  <img
                    ref={this.imgRef}
                    src={file.url}
                    onLoad={this.onImageLoad}
                    alt="focal point preview"
                  />
                </div>
                {shouldRenderFocalPoint && (
                  <FocalPoint focalPoint={this.getAdjustedFocalPointForUI()} />
                )}
              </div>
            </div>
            <div className={styles.focalPointDemo}>
              <Subheading className={styles.subheading}>
                Preview for different screen sizes
              </Subheading>
              <div className={styles.displayFlex}>
                <ImagePreviewWithFocalPoint
                  file={file}
                  focalPoint={focalPoint}
                  wrapperWidth={410}
                  wrapperHeight={180}
                  subtitle="Desktop"
                />
              </div>
              <div className={styles.displayFlex}>
                <ImagePreviewWithFocalPoint
                  file={file}
                  focalPoint={focalPoint}
                  wrapperWidth={280}
                  wrapperHeight={180}
                  subtitle="Tablet"
                />
                <ImagePreviewWithFocalPoint
                  className={styles.spacingLeftXs}
                  file={file}
                  focalPoint={focalPoint}
                  wrapperWidth={120}
                  wrapperHeight={180}
                  subtitle="Mobile"
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
