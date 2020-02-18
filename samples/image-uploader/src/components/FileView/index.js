import React from 'react';
import { Heading, Button, Paragraph, Asset } from '@contentful/forma-36-react-components';

import Dropzone from '../Dropzone';

import './fileview.css';

const IMAGE_WRAPPER_SIZE = 320;

const headerStyle = {
  width: `${IMAGE_WRAPPER_SIZE}px`,
  height: `${IMAGE_WRAPPER_SIZE}px`
};

function getImagePreviewUrl(file, { imgWidth, imgHeight }) {
  if (file.contentType.includes('svg')) {
    return `${file.url}?fm=png&w=${imgWidth}&h=${imgHeight}`;
  }
  return `${file.url}?w=${imgWidth}&h=${imgHeight}`;
}

export default function FileView(props) {
  const file = props.file;
  const type = file.contentType.split('/')[0];
  const prettySize = `${(file.details.size / 1000000).toFixed(2)} MB`;
  const imgWidth = Math.min(file.details.image.width, IMAGE_WRAPPER_SIZE);
  const imgHeight = file.details.image.height / (file.details.image.width / imgWidth);

  return (
    <Dropzone
      className={`file-view viewport ${type === 'image' ? 'image-file' : 'non-image-file'}`}
      isDraggingOver={props.isDraggingOver}
      onDrop={props.onDropFiles}
      onDragOverStart={props.onDragOverStart}
      onDragOverEnd={props.onDragOverEnd}>
      {type === 'image' ? (
        <header style={headerStyle}>
          <img
            style={{ width: `${imgWidth}px`, height: `${imgHeight}px` }}
            src={getImagePreviewUrl(file, { imgWidth, imgHeight })}
            alt="image preview"
          />
        </header>
      ) : (
        <header>
          <Asset type={type} className="file-type-icon" />
        </header>
      )}
      <section className="details">
        <main>
          <Heading className="filename">{file.fileName}</Heading>
          {type === 'image' ? (
            <Paragraph className="row">
              <strong>Dimensions:</strong> {file.details.image.width}x{file.details.image.height}
            </Paragraph>
          ) : null}
          <Paragraph className="row">
            <strong>Size:</strong> {prettySize}
          </Paragraph>
          <Paragraph className="row">
            <strong>Type:</strong> {file.contentType}
          </Paragraph>
          <Paragraph className="row">
            <strong>Status:</strong> {props.isPublished ? 'Published' : 'Draft'}
          </Paragraph>
        </main>
        <nav className="buttonset">
          <Button buttonType="muted" className="button" onClick={props.onClickEdit}>
            Edit
          </Button>
          <Button buttonType="muted" className="button" onClick={props.onClickRemove}>
            Remove
          </Button>
        </nav>
      </section>
    </Dropzone>
  );
}
