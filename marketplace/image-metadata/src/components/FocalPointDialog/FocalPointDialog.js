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

  componentDidMount() {
    this.setState({
      imgElementRect: this.imgRef.current.getBoundingClientRect()
    });
  }

  getAdjustedFocalPointForUI = () => {
    const { file } = this.props;
    const { focalPoint, imgElementRect } = this.state;

    const { width, height } = file.details.image;
    const widthRatio = width / imgElementRect.width;
    const heightRatio = height / imgElementRect.height;

    return {
      x: Math.round(focalPoint.x / widthRatio),
      y: Math.round(focalPoint.y / heightRatio)
    };
  };

  onImageClick = e => {
    const { file } = this.props;

    const rect = e.target.getBoundingClientRect();
    const x = e.pageX - rect.left; //x position within the element.
    const y = e.pageY - rect.top; //y position within the element.

    const { width, height } = file.details.image;

    const widthRatio = width / rect.width;
    const heightRatio = height / rect.height;

    const actualX = Math.round(x * widthRatio);
    const actualY = Math.round(y * heightRatio);

    this.setState({
      focalPoint: { x: actualX, y: actualY }
    });
  };

  render() {
    const { file, sdk } = this.props;
    const { focalPoint, imgElementRect } = this.state;

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
                />
                {imgElementRect && <FocalPoint focalPoint={this.getAdjustedFocalPointForUI()} />}
              </div>
            </div>
            <div className={styles.focalPointDemo}>
              <Heading>Preview</Heading>
              <div>
                <ImagePreviewWithFocalPoint file={file} focalPoint={focalPoint} />
                <ImagePreviewWithFocalPoint
                  file={file}
                  focalPoint={focalPoint}
                  wrapperWidth={305}
                  wrapperHeight={225}
                />
              </div>
              <div className={styles.spacingTop}>
                <ImagePreviewWithFocalPoint file={file} focalPoint={focalPoint} />
                <ImagePreviewWithFocalPoint file={file} focalPoint={focalPoint} zoom={2} />
                <ImagePreviewWithFocalPoint file={file} focalPoint={focalPoint} zoom={3} />
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
