import React from 'react';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';
import { Heading, Typography, Paragraph, TextField } from '@contentful/forma-36-react-components';
import GatsbyIcon from './GatsbyIcon';

const styles = {
  body: css({
    margin: '0 auto',
    marginTop: tokens.spacingXl,
    padding: '20px 40px',
    maxWidth: '786px',
    backgroundColor: '#fff',
    zIndex: '2',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '2px'
  }),
  background: css({
    display: 'block',
    position: 'absolute',
    zIndex: '-1',
    top: '0',
    width: '100%',
    height: '300px',
    backgroundColor: '#452475',
    backgroundImage:
      'linear-gradient(45deg,#542c85 25%,transparent 25%,transparent 50%,#542c85 50%,#542c85 75%,transparent 75%,transparent)'
  }),
  section: css({
    margin: `${tokens.spacingXl} 0`
  }),
  input: css({
    marginTop: tokens.spacingM
  }),
  splitter: css({
    marginTop: tokens.spacingL,
    marginBottom: tokens.spacingL,
    border: 0,
    height: '1px',
    backgroundColor: tokens.colorElementMid
  }),
  icon: css({
    display: 'flex',
    justifyContent: 'center',
    marginTop: tokens.spacingXl
  })
};

export default class AppConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId: '',
      webhookUrl: '',
      authToken: ''
    };
  }

  updateProjectId = e => {
    this.setState({ projectId: e.target.value });
  };

  updateWebhookUrl = e => {
    this.setState({ webhookUrl: e.target.value });
  };

  updateAuthToken = e => {
    this.setState({ authToken: e.target.value });
  };

  render() {
    return (
      <>
        <div className={styles.background} />
        <div className={styles.body}>
          <div className={styles.section}>
            <Typography>
              <Heading>Gatsby Cloud</Heading>
              <Paragraph>
                Gatsby is an open-source, modern website framework based on React to create and
                deploy websites or web apps with ease. This UI Extension connects to Gatsby Cloud
                which lets you see updates to your Gatsby site as soon as you change content in
                Contentful. This makes it easy for content creators to see changes they make to the
                website before going live.
              </Paragraph>
            </Typography>
          </div>
          <hr className={styles.splitter} />
          <div className={styles.section}>
            <Typography>
              <Heading>Account Details</Heading>
              <Paragraph>Gatsby Cloud needs a project ID in order to preview projects.</Paragraph>
              <TextField
                name="projectId"
                id="projectId"
                labelText="Project ID"
                value={this.state.projectId}
                onChange={this.updateProjectId}
                className={styles.input}
                textInputProps={{
                  type: 'text'
                }}
              />
              <TextField
                name="webhookUrl"
                id="webhookUrl"
                labelText="Webhook URL"
                value={this.state.webhookUrl}
                onChange={this.updateWebhookUrl}
                className={styles.input}
                textInputProps={{
                  type: 'text'
                }}
              />
              <TextField
                name="authToken"
                id="authToken"
                labelText="Authentication Token"
                value={this.state.authToken}
                onChange={this.updateAuthToken}
                className={styles.input}
                textInputProps={{
                  type: 'password'
                }}
              />
            </Typography>
          </div>
          <div className={styles.icon}>
            <GatsbyIcon />
          </div>
        </div>
      </>
    );
  }
}
