import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Heading, Modal } from '@contentful/forma-36-react-components';

import './FocalPointDialog.css';
import { FocalPoint } from '../FocalPoint';
// import { FocalPointPreviewImage } from './FocalPointPreviewImage';
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

  onImageClick = ({ clientX, clientY, target }) => {
    const { file } = this.props;

    const rect = target.getBoundingClientRect();
    const x = clientX - rect.left; //x position within the element.
    const y = clientY - rect.top; //y position within the element.

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
          <div className="modal-content">
            <div className="preview-wrapper">
              <img ref={this.imgRef} src={file.url} onClick={this.onImageClick} />
              {imgElementRect && <FocalPoint focalPoint={this.getAdjustedFocalPointForUI()} />}
            </div>
          </div>
          {/* <Heading element="h1">Aspect ratio demo</Heading>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <FocalPointPreviewImage file={file} focalPoint={focalPoint} />
        <FocalPointPreviewImage
          file={file}
          focalPoint={focalPoint}
          wrapperWidth={590}
          wrapperHeight={375}
        />
      </div>
      <Heading element="h1">Zoom demo</Heading>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <FocalPointPreviewImage file={file} focalPoint={focalPoint} />
        <FocalPointPreviewImage file={file} focalPoint={focalPoint} zoom={2} />
        <FocalPointPreviewImage file={file} focalPoint={focalPoint} zoom={3} />
      </div> */}
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
