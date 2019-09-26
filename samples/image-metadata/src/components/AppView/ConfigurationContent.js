import React from 'react';
import { Heading, Paragraph } from '@contentful/forma-36-react-components';
import { Divider } from '../Divider';
import { styles } from './styles';

export const ConfigurationContent = () => (
  <>
    <Heading className={styles.heading}>Getting started</Heading>
    <Paragraph>
      The Image Wrapper app is now installed. We have set up a demo content type for you with a
      title field, an image field and a metadata field (currently only able to hold focal point
      data).
    </Paragraph>
    <Paragraph className={styles.paragraph}>
      The metadata field is a plain Object type field with its appearance set to be that of the
      current app and the image field ID parameter pointing to the image field, as the data it holds
      is connected to that image.
    </Paragraph>
    <Paragraph className={styles.paragraph}>
      To create a new image with focal point data, simply create a new entry for the content type we
      set up for you in the Content tab. Then create a Reference field in your other Content Model
      that needs to reference this image and make it point to the entry you just created.
    </Paragraph>
    <Divider />
    <Heading className={styles.heading}>Uninstallation &amp; Cleanup</Heading>
    <Paragraph>
      Please note that if you decide to uninstall this app you will have to take care of deleting
      the demo content type we set up for you during the installation process. This might require
      you to delete any entries for that content type you have created first.
    </Paragraph>
  </>
);
