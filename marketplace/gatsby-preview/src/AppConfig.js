import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';
import {
  Heading,
  Typography,
  Paragraph,
  TextField,
  CheckboxField,
  Pill
} from '@contentful/forma-36-react-components';
import GatsbyIcon from './GatsbyIcon';

const styles = {
  body: css({
    height: 'auto',
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
  }),
  checks: css({
    marginTop: tokens.spacingM,
    display: 'flex'
  }),
  pills: css({
    margin: `0 ${tokens.spacingXs}`
  })
};

export default class AppConfig extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      previewUrl: '',
      webhookUrl: '',
      authToken: '',
      checkedContentTypes: {}
    };
  }

  async componentDidMount() {
    const { app } = this.props.sdk.platformAlpha;
    app.onConfigure(this.configureApp);

    const params = (await app.getParameters()) || {};

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(prevState => ({
      previewUrl: params.previewUrl || prevState.previewUrl,
      webhookUrl: params.webhookUrl || prevState.webhookUrl,
      authToken: params.authToken || prevState.authToken
    }));

    const { items } = await this.props.sdk.space.getContentTypes();

    if (items && items.length) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState(prevState => {
        return {
          checkedContentTypes: items.reduce((acc, ct) => {
            acc[ct.sys.id] = { name: ct.name, checked: false };
            return acc;
          }, prevState.checkedContentTypes)
        };
      });
    }
  }

  configureApp = async () => {
    const { previewUrl, webhookUrl, authToken, checkedContentTypes } = this.state;

    if (!previewUrl || !webhookUrl || !authToken) {
      this.props.sdk.notifier.error('You must fill out all fields before installing!');
      return false;
    }

    const sidebarContentTypes = Object.keys(checkedContentTypes).reduce((acc, key) => {
      if (checkedContentTypes[key].checked) {
        acc[key] = { sidebar: { position: 3 } };
      }
      return acc;
    }, {});

    return {
      parameters: {
        previewUrl,
        webhookUrl,
        authToken
      },
      targetState: {
        EditorInterface: sidebarContentTypes
      }
    };
  };

  updatePreviewUrl = e => {
    this.setState({ previewUrl: e.target.value });
  };

  updateWebhookUrl = e => {
    this.setState({ webhookUrl: e.target.value });
  };

  updateAuthToken = e => {
    this.setState({ authToken: e.target.value });
  };

  onContentTypeSelect = key => {
    this.setState(prevState => ({
      checkedContentTypes: {
        ...prevState.checkedContentTypes,
        [key]: {
          ...prevState.checkedContentTypes[key],
          checked: !prevState.checkedContentTypes[key].checked
        }
      }
    }));
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
                name="previewUrl"
                id="previewUrl"
                labelText="Site URL"
                value={this.state.previewUrl}
                onChange={this.updatePreviewUrl}
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
          <hr className={styles.splitter} />
          <div className={styles.section}>
            <Typography>
              <Heading>Preview locations</Heading>
              <Paragraph>
                Here you can choose which content type(s) will show the Gatsby Cloud preview
                functionality
              </Paragraph>
              <div className={styles.checks}>
                {Object.keys(this.state.checkedContentTypes).map(key => (
                  <Pill
                    key={key}
                    label={
                      <CheckboxField
                        labelText={this.state.checkedContentTypes[key].name}
                        name={this.state.checkedContentTypes[key].name}
                        checked={this.state.checkedContentTypes[key].checked}
                        value={key}
                        onChange={() => this.onContentTypeSelect(key)}
                        id={key}
                      />
                    }
                    className={styles.pills}
                  />
                ))}
              </div>
            </Typography>
          </div>
        </div>
        <div className={styles.icon}>
          <GatsbyIcon />
        </div>
      </>
    );
  }
}
