import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Button } from '@contentful/forma-36-react-components';

import OptimizelyLogo from './OptimizelyLogo';

const styles = {
  connect: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: 'transparent!important' // necessary to eliminate the forma styling in favor of the custom optimizely styling
    }
  })
};

export default function ConnectButton({ openAuth }) {
  return (
    <Button
      className={styles.connect}
      onClick={openAuth}
      testId="connect-button"
      isFullWidth
      buttonType="naked">
      <OptimizelyLogo />
    </Button>
  );
}

ConnectButton.propTypes = {
  openAuth: PropTypes.func.isRequired
};
