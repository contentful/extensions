import React from 'react';
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
    <Button onClick={openAuth}>
      <div className={styles.connect}>
        <OptimizelyLogo />
        &nbsp; Connect with Optimizely
      </div>
    </Button>
  );
}
