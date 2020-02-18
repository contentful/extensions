import get from 'lodash.get';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Heading,
  Typography,
  Paragraph,
  TextField,
  CheckboxField,
  FieldGroup,
  SkeletonContainer,
  SkeletonBodyText,
  TextLink
} from '@contentful/forma-36-react-components';
import GatsbyIcon from './GatsbyIcon';
import styles from './styles';

function editorInterfacesToEnabledContentTypes(eis, appId) {
  const findAppWidget = item => item.widgetNamespace === 'app' && item.widgetId === appId;

  return eis
    .filter(ei => !!get(ei, ['sidebar'], []).find(findAppWidget))
    .map(ei => get(ei, ['sys', 'contentType', 'sys', 'id']))
    .filter(ctId => typeof ctId === 'string' && ctId.length > 0);
}

function enabledContentTypesToTargetState(contentTypes, enabledContentTypes) {
  return {
    EditorInterface: contentTypes.reduce((acc, ct) => {
      return {
        ...acc,
        [ct.sys.id]: enabledContentTypes.includes(ct.sys.id) ? { sidebar: { position: 3 } } : {}
      };
    }, {})
  };
}

export default class AppConfig extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    contentTypes: [],
    enabledContentTypes: {},
    previewUrl: '',
    webhookUrl: '',
    authToken: '',
    validPreview: true,
    validWebhook: true
  };

  async componentDidMount() {
    const { space, app, ids } = this.props.sdk;

    const [installationParams, eisRes, contentTypesRes] = await Promise.all([
      app.getParameters(),
      space.getEditorInterfaces(),
      space.getContentTypes()
    ]);

    const params = installationParams || {};

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(
      {
        contentTypes: contentTypesRes.items,
        enabledContentTypes: editorInterfacesToEnabledContentTypes(eisRes.items, ids.app),
        previewUrl: params.previewUrl || '',
        webhookUrl: params.webhookUrl || '',
        authToken: params.authToken || ''
      },
      () => app.setReady()
    );

    app.onConfigure(this.configureApp);
  }

  configureApp = async () => {
    const { contentTypes, enabledContentTypes, previewUrl, webhookUrl, authToken } = this.state;

    this.setState({ validPreview: true, validWebhook: true });

    let valid = true;

    if (!previewUrl) {
      this.setState({ validPreview: false });
      valid = false;
    }

    if (!previewUrl.startsWith('http')) {
      this.setState({ validPreview: false });
      valid = false;
    }

    // the webhookUrl is optional but if it is passed, check that it is valid
    if (webhookUrl && !webhookUrl.startsWith('http')) {
      this.setState({ validWebhook: false });
      valid = false;
    }

    if (!valid) {
      this.props.sdk.notifier.error('Please review the errors in the form.');
      return false;
    }

    return {
      parameters: {
        previewUrl,
        webhookUrl,
        authToken
      },
      targetState: enabledContentTypesToTargetState(contentTypes, enabledContentTypes)
    };
  };

  updatePreviewUrl = e => {
    this.setState({ previewUrl: e.target.value, validPreview: true });
  };

  updateWebhookUrl = e => {
    this.setState({ webhookUrl: e.target.value, validWebhook: true });
  };

  updateAuthToken = e => {
    this.setState({ authToken: e.target.value });
  };

  validatePreviewUrl = () => {
    if (!this.state.previewUrl.startsWith('http')) {
      this.setState({ validPreview: false });
    }
  };

  validateWebhookUrl = () => {
    if (this.state.webhookUrl && !this.state.webhookUrl.startsWith('http')) {
      this.setState({ validWebhook: false });
    }
  };

  toggleContentType = (enabledContentTypes, ctId) => {
    if (enabledContentTypes.includes(ctId)) {
      return enabledContentTypes.filter(cur => cur !== ctId);
    } else {
      return enabledContentTypes.concat([ctId]);
    }
  };

  onContentTypeToggle = ctId => {
    this.setState(prevState => ({
      ...prevState,
      enabledContentTypes: this.toggleContentType(prevState.enabledContentTypes, ctId)
    }));
  };

  render() {
    const { contentTypes, enabledContentTypes } = this.state;

    return (
      <>
        <div className={styles.background} />
        <div className={styles.body}>
          <div className={styles.section}>
            <Typography>
              <Heading>About Gatsby Cloud</Heading>
              <Paragraph>
                This app connects to Gatsby Cloud which lets you see updates to your Gatsby site as
                soon as you change content in Contentful. This makes it easy for content creators to
                see changes they make to the website before going live.
              </Paragraph>
            </Typography>
          </div>
          <hr className={styles.splitter} />
          <Typography>
            <Heading>Account Details</Heading>
            <Paragraph>Gatsby Cloud needs a Site URL in order to preview projects.</Paragraph>
            <TextField
              name="previewUrl"
              id="previewUrl"
              labelText="Site URL"
              required
              value={this.state.previewUrl}
              onChange={this.updatePreviewUrl}
              onBlur={this.validatePreviewUrl}
              className={styles.input}
              helpText={
                <span>
                  To get your Site URL, see your{' '}
                  <TextLink
                    href="https://www.gatsbyjs.com/dashboard/sites"
                    target="_blank"
                    rel="noopener noreferrer">
                    Gatsby dashboard
                  </TextLink>
                  .
                </span>
              }
              validationMessage={
                !this.state.validPreview
                  ? 'Please provide a valid URL (It should start with http)'
                  : ''
              }
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
              onBlur={this.validateWebhookUrl}
              className={styles.input}
              helpText="Optional Webhook URL for manually building sites."
              validationMessage={
                !this.state.validWebhook
                  ? 'Please provide a valid URL (It should start with http)'
                  : ''
              }
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
              helpText="Optional Authentication token for private Gatsby Cloud sites."
              textInputProps={{
                type: 'password'
              }}
            />
          </Typography>
          <hr className={styles.splitter} />
          <Typography>
            <Heading>Content Types</Heading>
            <Paragraph>
              Select which content types will show the Gatsby Cloud functionality in the sidebar.
            </Paragraph>
            <div className={styles.checks}>
              <FieldGroup>
                {contentTypes.length > 0 ? (
                  contentTypes.map(ct => (
                    <CheckboxField
                      key={ct.sys.id}
                      labelIsLight
                      labelText={ct.name}
                      name={ct.name}
                      checked={enabledContentTypes.includes(ct.sys.id)}
                      value={ct.sys.id}
                      onChange={() => this.onContentTypeToggle(ct.sys.id)}
                      id={ct.sys.id}
                    />
                  ))
                ) : (
                  <SkeletonContainer width="100%">
                    <SkeletonBodyText numberOfLines={3} />
                  </SkeletonContainer>
                )}
              </FieldGroup>
            </div>
          </Typography>
        </div>
        <div className={styles.icon}>
          <GatsbyIcon />
        </div>
      </>
    );
  }
}
