import React, { Component } from 'react';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';

import {
  Heading,
  Paragraph,
  List,
  ListItem,
  TextLink
} from '@contentful/forma-36-react-components';

const styles = {
  featuresListItem: css({
    listStyleType: 'disc',
    marginLeft: tokens.spacingM
  })
};

export default class Features extends Component {
  render() {
    return (
      <div className="f36-margin-top--l">
        <Heading>Features</Heading>
        <Paragraph className="f36-margin-top--m">Optimizely integration enables:</Paragraph>
        <List className="f36-margin-top--m f36-margin-bottom--m">
          <ListItem className={styles.featuresListItem}>
            Loading experiments from Optimizely
          </ListItem>
          <ListItem className={styles.featuresListItem}>Adding content to variations</ListItem>
          <ListItem className={styles.featuresListItem}>
            Seeing all experiments connected with Contentful (drafts, running, ended)
          </ListItem>
        </List>
        <Paragraph>
          Check out the{' '}
          <TextLink
            href="https://www.contentful.com/developers/docs/extensibility/apps/optimizely/"
            target="_blank">
            documentation
          </TextLink>{' '}
          for more information.
        </Paragraph>
      </div>
    );
  }
}
