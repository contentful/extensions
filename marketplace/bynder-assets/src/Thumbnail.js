import React from 'react';
import PropTypes from 'prop-types';
import Card from '@contentful/forma-36-react-components/dist/components/Card/Card/index';
import IconButton from '@contentful/forma-36-react-components/dist/components/IconButton/index';

export default function Thumbnail({ src, onDeleteClick }) {
  return (
    <Card className="thumbnail">
      <img width="150" height="150" src={src} />
      <IconButton
        label="Close"
        onClick={onDeleteClick}
        className="thumbnail-remove"
        iconProps={{ icon: 'Close' }}
        buttonType="muted"
      />
    </Card>
  );
}

Thumbnail.propTypes = {
  src: PropTypes.string.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};
