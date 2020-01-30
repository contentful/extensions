import * as React from 'react';
import sortBy from 'lodash.sortby';
import {
  Typography,
  Heading,
  Paragraph,
  TextField,
  Option,
  TextLink,
  Button,
  Select,
  FormLabel,
  TextInput
} from '@contentful/forma-36-react-components';
import styles from './styles';
import { AppConfigParams, AppConfigState } from './typings';
import { getAndUpdateSavedParams } from './utils';

export default class AppConfig extends React.Component<AppConfigParams, AppConfigState> {
  state: AppConfigState = {
    allContentTypes: {},
    contentTypes: {},
    clientId: '',
    viewId: ''
  };

  async componentDidMount() {
    const { sdk } = this.props;

    const [{ items: spaceContentTypes }, savedParams] = await Promise.all([
      sdk.space.getContentTypes(),
      getAndUpdateSavedParams(sdk)
    ]);

    const { contentTypes } = savedParams;

    // add an incomplete contentType entry if there are none saved
    if (!Object.keys(contentTypes).length) {
      contentTypes[''] = { slugField: '', urlPrefix: '' };
    }

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(
      {
        // sort contentTypes by display name
        allContentTypes: sortBy(spaceContentTypes, 'name').reduce((acc, contentType) => {
          acc[contentType.sys.id] = {
            ...contentType,
            fields: sortBy(
              // use only short text fields of content type
              contentType.fields.filter(f => f.type === 'Symbol'),
              // sort by field name
              'name'
            )
          };

          return acc;
        }, {}),
        contentTypes,
        clientId: savedParams.clientId || '',
        viewId: savedParams.viewId || ''
      },
      () => sdk.app.setReady()
    );

    sdk.app.onConfigure(() => this.configureApp());
  }

  async configureApp() {
    const { contentTypes, clientId, viewId } = this.state;
    const { notifier } = this.props.sdk;

    if (!clientId || !viewId) {
      notifier.error('You must provide both a valid client ID and view ID!');

      return false;
    }

    if (!/^[-a-z0-9]+.apps.googleusercontent.com$/i.test(clientId)) {
      notifier.error("The value given for the client ID doesn't look valid!");
      return false;
    }

    const ctKeys = Object.keys(contentTypes);

    if (!ctKeys.length || !ctKeys[0]) {
      notifier.error('You need to select at least one content type with a slug field!');
    }

    if (ctKeys.some(key => key && !contentTypes[key].slugField)) {
      notifier.error('Please complete or remove the incomplete content type rows!');
      return false;
    }

    const EditorInterface = Object.keys(contentTypes).reduce((acc, id) => {
      acc[id] = { sidebar: { position: 1 } };
      return acc;
    }, {});

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

  handleContentTypeChange(prevKey, newKey) {
    this.setState(prevState => {
      const contentTypes = {};

      // remove contentType[prevKey] field and replace with the new contentType
      // key while preserving key order
      for (const [prop, value] of Object.entries(prevState.contentTypes)) {
        if (prop === prevKey) {
          contentTypes[newKey] = {
            slugId: '',
            urlPrefix: value.urlPrefix
          };
        } else {
          contentTypes[prop] = value;
        }
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

    return (
      <>
        <div className={styles.background} />
        <div className={styles.body}>
          <div className={styles.section}>
            <Typography>
              <Heading className={styles.spaced}>About Google Analytics</Heading>

              <Paragraph>
                This app allows you to view pageview analytics of a Contentful entry in the editor
                sidebar. For installation instructions, please refer to the app&apos;s
                <a href="https://www.contentful.com/developers/docs/extensibility/apps/google-analytics/">
                  documentation
                </a>
                .
              </Paragraph>
            </Typography>
          </div>

          <hr className={styles.splitter} />

          <Typography>
            <Heading className={styles.spaced}>Configuration</Heading>

            <TextField
              labelText="Client ID"
              name="clientId"
              id="clientId"
              required
              value={this.state.clientId}
              onChange={event => this.setState({ clientId: event.target.value.trim() })}
              helpText="Client ID of the Google Cloud OAuth application."
              className={styles.spaced}
              textInputProps={{
                type: 'text',
                placeholder: 'XXXXXXXX-XXXXXXXX.apps.googleusercontent.com'
              }}
            />
            <TextField
              labelText="View ID"
              required
              name="viewId"
              id="viewId"
              value={this.state.viewId}
              onChange={event => this.setState({ viewId: event.target.value.trim() })}
              helpText="The ID of the Google Analytics view you want to query."
              textInputProps={{
                type: 'text'
              }}
            />
          </Typography>

          <hr className={styles.splitter} />

          <Typography>
            <Heading className={styles.spaced}>Assign to content types</Heading>
            <Paragraph className={styles.spaced}>
              Select which content types will show the Google Analytics functionality in the
              sidebar. Specify the slug field that is used for URL generation in your application.
              Optionally, specify a prefix for the slug.
            </Paragraph>

            <div className={styles.contentTypeGrid}>
              <FormLabel>Content type</FormLabel>
              <FormLabel>Slug field</FormLabel>
              <FormLabel>URL prefix</FormLabel>
              <div className={styles.invisible}>Remover</div>
            </div>

            {Object.entries(contentTypes).map(([key, { slugField, urlPrefix }], index) => (
              <div
                key={key}
                className={[styles.contentTypeGrid, styles.contentTypeGridInputs].join(' ')}>
                <Select
                  name={'contentType-' + index}
                  id={'contentType-' + index}
                  value={key}
                  hasError={!key}
                  onChange={event => this.handleContentTypeChange(key, event.target.value)}>
                  {key ? null : (
                    <Option disabled value="">
                      {' '}
                      Select a Content Type{' '}
                    </Option>
                  )}

                  {Object.entries(allContentTypes)
                    // include current type in options (required by Select component)
                    // and all types that are not selected
                    .filter(([type]) => type === key || !contentTypes[type])
                    .map(([type, { name: typeName }]) => (
                      <Option key={`${key}->${type}`} value={type}>
                        {typeName}
                      </Option>
                    ))}
                </Select>

                <Select
                  name={'slugField-' + index}
                  id={'slugField-' + index}
                  isDisabled={!key}
                  hasError={key && !slugField}
                  value={slugField}
                  onChange={event =>
                    this.handleContentTypeFieldChange(key, 'slugField', event.target.value)
                  }>
                  <Option disabled value="">
                    Select slug field
                  </Option>
                  {key
                    ? allContentTypes[key].fields.map(f => (
                        <Option key={`${key}.${f.id}`} value={f.id}>
                          {f.name}
                        </Option>
                      ))
                    : null}
                </Select>

                <TextInput
                  name={'urlPrefix-' + index}
                  id={'urlPrefix-' + index}
                  value={urlPrefix}
                  disabled={!key}
                  onChange={event =>
                    this.handleContentTypeFieldChange(key, 'urlPrefix', event.target.value)
                  }
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
              disabled={Object.values(contentTypes).some(ct => !ct.slugField)}
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
