import React from 'react';
import {
  Heading,
  Paragraph,
  List,
  ListItem,
  TextLink
} from '@contentful/forma-36-react-components';
import ConnectButton from '../ConnectButton';

export default function Connect({openAuth}) {
    return (
        <>
            <Heading>Connect Optimizely</Heading>
            <Paragraph>
                In order to see your experiments and connect them to Contentful content,
                we will need you to connect your Optimizely account by clicking on the button below.
                It will ask you to grant Contentful permissions to access your Optimizely experiments.
            </Paragraph>
            <ConnectButton openAuth={openAuth} />
        </>
    );
}