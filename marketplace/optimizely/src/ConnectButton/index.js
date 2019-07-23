import React from 'react';
import { css } from 'emotion';
import { Button } from '@contentful/forma-36-react-components';

const styles = {
  connect: css({
    display: 'flex',
    alignItems: 'center',
  }),
};
export default function ConnectButton({openAuth}) {
    return (
        <Button onClick={openAuth} isFullWidth>
          <div className={styles.connect}>
            <ConnectButton />&nbsp;
            Connect with Optimizely
          </div>
        </Button>
    );
}