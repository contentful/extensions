import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Typography,
  Paragraph,
} from '@contentful/forma-36-react-components';

export function Warning({ children, iconColor }) {
  return (
    <Typography>
      <Paragraph>
        <Icon
          icon="Warning"
          color={iconColor}
          className="f36-margin-right--xs"
        />
        {children}
      </Paragraph>
    </Typography>
  );
}

Warning.propTypes = {
  children: PropTypes.string.isRequired,
  iconColor: PropTypes.oneOf(['warning', 'negative']),
};

Warning.defaultProps = {
  iconColor: 'warning',
};
