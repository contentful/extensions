import React from 'react';
import PropTypes from 'prop-types';

import { Paragraph } from '@contentful/forma-36-react-components';

import ConnectButton from '../ConnectButton';

export default function Connect({ openAuth }) {
  return (
    <>
      <Paragraph>
        In order to see your experiments and connect them to Contentful content, we will need you to
        connect your Optimizely account by clicking on the button below. It will ask you to grant
        Contentful permissions to access your Optimizely experiments.
      </Paragraph>
      <ConnectButton openAuth={openAuth} />
    </>
  );
}

Connect.propTypes = {
  openAuth: PropTypes.func.isRequired
};
