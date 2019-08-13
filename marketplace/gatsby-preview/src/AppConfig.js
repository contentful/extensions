import React from 'react';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';
import { Heading, Typography, Paragraph } from '@contentful/forma-36-react-components';

const styles = {
  body: css({
    margin: '0 auto',
    padding: '0 40px',
    maxWidth: '786px'
  }),
  section: css({
    margin: `${tokens.spacingXl} 0`
  }),
  featuresListItem: css({
    listStyleType: 'disc',
    marginLeft: tokens.spacingM
  }),
  light: css({
    opacity: '0.6',
    marginTop: tokens.spacingM
  })
};

export default class AppConfig extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.body}>
        <div className={styles.section}>
          <Typography>
            <Heading>Gatsby Cloud</Heading>
            <Paragraph>
              Gatsby is an open-source, modern website framework based on React to create and deploy
              websites or web apps with ease. This UI Extension connects to Gatsby Cloud which lets
              you see updates to your Gatsby site as soon as you change content in Contentful. This
              makes it easy for content creators to see changes they make to the website before
              going live.
            </Paragraph>
          </Typography>
        </div>
      </div>
    );
  }
}
