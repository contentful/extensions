/* eslint-disable jsx-a11y/media-has-caption */
import * as React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import './deleteButton.css';

interface DeleteActionProps {
  requestDeleteAsset: () => void;
}

class DeleteButton extends React.Component<DeleteActionProps, {}> {
  render() {
    return (
      <div className="button-container">
        <Button
          buttonType="negative"
          size="small"
          onClick={this.props.requestDeleteAsset}
        >
          Delete this asset
        </Button>
      </div>
    );
  }
}

export default DeleteButton;
