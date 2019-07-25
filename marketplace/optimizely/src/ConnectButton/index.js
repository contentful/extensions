import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Button } from '@contentful/forma-36-react-components';

import OptimizelyLogo from './OptimizelyLogo';

const styles = {
  connect: css({
    display: 'flex',
    alignItems: 'center'
  })
};

export default function ConnectButton({ openAuth }) {
  return (
    <Button onClick={openAuth} data-testid="connect-button">
      <div className={styles.connect}>
        <OptimizelyLogo />
        &nbsp; Connect with Optimizely
      </div>
    </Button>
  );
}

ConnectButton.propTypes = {
  openAuth: PropTypes.func.isRequired
};

