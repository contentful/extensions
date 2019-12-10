import React from 'react';
import tokens from '@contentful/forma-36-tokens';
import { Icon } from '@contentful/forma-36-react-components';
import './progress-view.css';

export default function UploadView(props) {
  const imageUrl = props.imageUrl || `${props.base64Prefix},${props.base64Data}`;
  const isSVG = imageUrl.endsWith('.svg') || imageUrl.includes('svg+xml');

  const progressViewStyles = {
    backgroundColor: tokens.colorElementLight
  };

  // Pass upload progress as CSS variable so we can adjust the size of progress components
  const uploadProgress = {
    '--uploadProgress': `${props.uploadProgress}%`
  };

  return (
    <div className="viewport">
      <main className="progress-view" style={progressViewStyles}>
        {isSVG ? (
          <Icon color="muted" icon="Asset" size="large" className="uploaded-image" />
        ) : (
          <img className="uploaded-image" src={imageUrl} alt="image being uploaded" />
        )}
        <aside className="bar" style={uploadProgress} />
        <aside className="bar-placeholder" style={uploadProgress} />
        <aside className="overlay" style={uploadProgress} />
      </main>
    </div>
  );
}
