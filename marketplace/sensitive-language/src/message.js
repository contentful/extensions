'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Paragraph } from '@contentful/forma-36-react-components';

export function Message({ message }) {
  return (
    <li className="warning-list__item">
      <Icon icon="Close" color="negative" className="f36-margin-right--2xs" />
      <Paragraph
        title={`Flagged by rule ID "${message.ruleId}". ${message.note ? message.note : ''}`}>
        {message.message}
      </Paragraph>
    </li>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    ruleId: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    note: PropTypes.string
  }).isRequired
};
