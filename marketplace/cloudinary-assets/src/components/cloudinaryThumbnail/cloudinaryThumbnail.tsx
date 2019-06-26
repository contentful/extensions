import * as React from 'react';
import { CloudinaryResource, ExtensionParameters } from '../../interface';
import { Cloudinary as cloudinaryCore } from 'cloudinary-core';

export interface CloudinaryThumbnailProps {
  config: ExtensionParameters;
  resource: CloudinaryResource;
}

export function CloudinaryThumbnail(props: CloudinaryThumbnailProps) {
  const cloudinary = new cloudinaryCore({
    cloud_name: props.config.cloudName,
    api_key: props.config.apiKey
  });

  if (
    props.resource.resource_type === 'image' &&
    ['svg', 'jpg', 'png', 'gif', 'jpeg'].includes(props.resource.format)
  ) {
    return (
      <img
        src={cloudinary.url(props.resource.public_id, {
          height: 300,
          width: 300,
          crop: 'fill'
        })}
        className="CloudinaryImage"
      />
    );
  } else if (props.resource.resource_type === 'video') {
    return (
      <img
        src={cloudinary.video_thumbnail_url(props.resource.public_id, {
          height: 300,
          width: 300,
          crop: 'fill'
        })}
        className="CloudinaryImage"
      />
    );
  }

  return <div className={'unknownFiletype'}></div>;
}

export default CloudinaryThumbnail;
