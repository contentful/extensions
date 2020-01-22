import * as React from 'react';
import {
  Typography,
  Heading,
  Paragraph,
  TextField,
  SelectField,
  Option,
  TextLink,
  Button
} from '@contentful/forma-36-react-components';
import styles from './styles';
import PropTypes from 'prop-types';
import { AppConfigParams, AppConfigState } from './typings';

export default class AppConfig extends React.Component<AppConfigParams, AppConfigState> {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state: AppConfigState = {
    allContentTypes: {},
    contentTypes: {}
  };

  async componentDidMount() {
    const { sdk } = this.props;
    const { app } = sdk.platformAlpha;

    const [{ items: spaceContentTypes }, savedParams] = await Promise.all([
      sdk.space.getContentTypes().then(),
      app.getParameters()
    ]);

    const contentTypes = savedParams.contentTypes || {};

    // add an incomplete contentType entry if there are none saved
    if (!Object.keys(contentTypes).length) {
      contentTypes[''] = { slugField: '', urlPrefix: '' };
    }

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(
      {
        // TODO: filter fields to string type values
        allContentTypes: spaceContentTypes.reduce((acc, { sys, fields, name }) => {
          acc[sys.id] = { fields, name };
          return acc;
        }, {}),
        contentTypes,
        clientId: savedParams.clientId || '',
        viewId: savedParams.viewId || ''
      },
      () => sdk.app.setReady()
    );

    app.onConfigure(() => this.configureApp());
  }

  async configureApp() {
    const { contentTypes, clientId, viewId } = this.state;

    // TODO: store this in app settings of content type
    const EditorInterface = Object.keys(contentTypes).reduce((acc, id) => {
      acc[id] = { sidebar: { position: 3 } };
      return acc;
    }, {});

    /*
    if (!valid) {
      this.props.sdk.notifier.error('Please review the errors in the form.');
      return false;
    }
    */

    return {
      parameters: {
        contentTypes,
        clientId,
        viewId
      },
      targetState: {
        EditorInterface
      }
    };
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  }

  handleContentTypeChange(prevKey, key) {
    this.setState(prevState => {
      const contentTypes = {};

      // remove contentType[prevKey] field and replace with the new contentType
      // key while preserving key order
      for (const [prop, value] of Object.entries(prevState.contentTypes)) {
        contentTypes[prop === prevKey ? key : prop] = value;
      }

      return {
        contentTypes
      };
    });
  }

  handleContentTypeFieldChange(key, field, value) {
    this.setState(prevState => {
      const prevContentTypes = prevState.contentTypes;
      const curContentTypeProps = prevContentTypes[key];

      return {
        contentTypes: {
          ...prevState.contentTypes,
          [key]: {
            ...curContentTypeProps,
            [field]: value
          }
        }
      };
    });
  }

  addContentType() {
    this.setState(prevState => ({
      ...prevState,
      contentTypes: {
        ...prevState.contentTypes,
        '': { slugField: '', urlPrefix: '' }
      }
    }));
  }

  removeContentType(key) {
    this.setState(prevState => {
      const contentTypes = { ...prevState.contentTypes };

      delete contentTypes[key];

      return { contentTypes };
    });
  }

  render() {
    const { contentTypes, allContentTypes } = this.state;
    const filteredContentTypesEntries = Object.entries(allContentTypes).filter(
      ([type]) => !contentTypes[type]
    );

    console.log(Object.keys(contentTypes));
    console.log(filteredContentTypesEntries.map(([t]) => t));
    return (
      <>
        <div className={styles.background} />
        <div className={styles.body}>
          <div className={styles.section}>
            <Typography>
              <Heading>About Google Analytics</Heading>

              <Paragraph>
                This app allows you to view pageview analytics of a Contentful entry in the editor
                sidebar. For installation instructions, please refer to the app&apos;s
                <a href>documentation</a>.
              </Paragraph>
            </Typography>
          </div>

          <hr className={styles.splitter} />

          <Typography>
            <Heading>Configuration</Heading>

            <TextField
              labelText="Client ID"
              name="clientId"
              id="clientId"
              required
              value={this.state.clientId}
              onChange={event => this.handleChange('clientId', event.target.value)}
              className={styles.input}
              helpText="Client ID of the Google Cloud OAuth application."
              textInputProps={{
                type: 'text'
              }}
            />
            <TextField
              labelText="View ID"
              required
              name="viewId"
              id="viewId"
              value={this.state.viewId}
              onChange={event => this.handleChange('viewId', event.target.value)}
              className={styles.input}
              helpText="The ID of the Google Analytics view you want to query."
              textInputProps={{
                type: 'text'
              }}
            />
          </Typography>

          <hr className={styles.splitter} />

          <Typography>
            <Heading>Assign to content types</Heading>
            <Paragraph>
              Select which content types will show the Google Analytics functionality in the
              sidebar. Specify the slug field that is used for URL generation in your application.
              Optionally, specify a prefix for the slug.
            </Paragraph>

            {Object.entries(contentTypes).map(([key, { slugField, urlPrefix }], index) => (
              <div key={key}>
                {JSON.stringify({ key, slugField, urlPrefix, index })}
                <SelectField
                  labelText="Content type"
                  required
                  name={'contentType-' + index}
                  id={'contentType-' + index}
                  value={key}
                  onChange={event => this.handleContentTypeChange(key, event.target.value)}
                  className={styles.input}>
                  <Option disabled value="">
                    Select a Content Type
                  </Option>
                  {filteredContentTypesEntries.map(([type, { name: typeName }]) => (
                    <Option key={type} value={type}>
                      {typeName}
                    </Option>
                  ))}
                </SelectField>

                <SelectField
                  labelText="Slug field"
                  required
                  name={'slugField-' + index}
                  id={'slugField-' + index}
                  selectProps={{ isDisabled: !key, hasError: !slugField }}
                  value={slugField}
                  onChange={event =>
                    this.handleContentTypeFieldChange(key, 'slugField', event.target.value)
                  }
                  className={styles.input}>
                  <Option disabled value="">
                    Select slug field
                  </Option>
                  {key
                    ? allContentTypes[key].fields.map(f => (
                        <Option key={f.id} value={f.id}>
                          {f.name}
                        </Option>
                      ))
                    : null}
                </SelectField>

                <TextField
                  labelText="URL Prefix"
                  name={'urlPrefix-' + index}
                  id={'urlPrefix-' + index}
                  value={urlPrefix}
                  disabled={!key}
                  onChange={event =>
                    this.handleContentTypeFieldChange(key, 'urlPrefix', event.target.value)
                  }
                  className={styles.input}
                  textInputProps={{
                    type: 'text'
                  }}
                />

                <TextLink onClick={() => this.removeContentType(key)}>Remove</TextLink>
              </div>
            ))}

            <Button
              type="button"
              buttonType="muted"
              className="button"
              disabled={!!contentTypes['']}
              onClick={() => this.addContentType()}>
              {' '}
              Add another content type
            </Button>
          </Typography>
        </div>
      </>
    );
  }
}
