import * as React from 'react';
import { CloudinaryResource, Config } from '../../interfaces';
import { Cloudinary as cloudinaryCore } from 'cloudinary-core';

export interface CloudinaryThumbnailProps {
  config: Config;
  resource: CloudinaryResource;
}

export default function CloudinaryThumbnail(props: CloudinaryThumbnailProps) {
  const cloudinary = new cloudinaryCore({
    cloud_name: props.config.cloudName,
    api_key: props.config.apiKey
  });

  const resourceName = props.resource.public_id + props.resource.tags.join(', ');

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
        alt={resourceName}
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
        alt={resourceName}
        className="CloudinaryImage"
      />
    );
  }

  return <div className="unknownFiletype" />;
}
