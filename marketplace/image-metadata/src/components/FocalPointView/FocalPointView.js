import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextInput } from '@contentful/forma-36-react-components';

const FocalPointView = ({ focalPoint: { x, y }, showFocalPointDialog }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <TextInput
        width="large"
        type="text"
        id="focal-point"
        testId="focal-point"
        value={`x: ${x}px / y: ${y}px`}
        disabled={true}
      />
      <Button style={{ marginLeft: '5px' }} buttonType="muted" onClick={showFocalPointDialog}>
        Set focal point
      </Button>
    </div>
  );
};

FocalPointView.propTypes = {
  focalPoint: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  showFocalPointDialog: PropTypes.func.isRequired
};

export { FocalPointView };
