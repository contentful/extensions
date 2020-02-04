import * as React from 'react';
import sortBy from 'lodash/sortBy';
import {
  Typography,
  Heading,
  Paragraph,
  TextField,
  TextLink,
  Button,
  Select,
  FormLabel,
  TextInput
} from '@contentful/forma-36-react-components';
import styles from './styles';
import { AppConfigParams, AppConfigState, AllContentTypes, ContentTypes } from './typings';
import { getAndUpdateSavedParams } from './utils';
import {
  ContentType,
  EditorInterface,
  ContentTypeField,
  CollectionResponse
} from 'contentful-ui-extensions-sdk';

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
      sdk.space.getContentTypes() as Promise<
        CollectionResponse<ContentType & { fields: ContentTypeField[] }>
      >,
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
        allContentTypes: sortBy(spaceContentTypes, 'name').reduce(
          (acc: AllContentTypes, contentType) => {
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
          },
          {}
        ),
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

    const editorInterface = ctKeys.reduce(
      (acc: { [key: string]: Partial<EditorInterface> }, id) => {
        const sidebarPosition: { [key: string]: object } = { sidebar: { position: 1 } };

        acc[id] = sidebarPosition;
        return acc;
      },
      {}
    );

    return {
      parameters: {
        contentTypes,
        clientId,
        viewId
      },
      targetState: {
        EditorInterface: editorInterface
      }
    };
  }

  handleContentTypeChange(prevKey: string, newKey: string) {
    this.setState(prevState => {
      const contentTypes: ContentTypes = {};

      // remove contentType[prevKey] field and replace with the new contentType
      // key while preserving key order
      for (const [prop, value] of Object.entries(prevState.contentTypes)) {
        if (prop === prevKey) {
          contentTypes[newKey as keyof typeof contentTypes] = {
            slugField: '',
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

  handleContentTypeFieldChange(key: string, field: string, value: string) {
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

  removeContentType(key: string) {
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
          <div>
            <Typography>
              <Heading className={styles.spaced}>About Google Analytics</Heading>

              <Paragraph>
                This app allows you to view pageview analytics of a Contentful entry in the editor
                sidebar. For installation instructions, please refer to the app&apos;s{' '}
                <TextLink
                  target="blank"
                  href="https://www.contentful.com/developers/docs/extensibility/apps/google-analytics/">
                  documentation
                </TextLink>
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                this.setState({ clientId: event.target.value.trim() })
              }
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                this.setState({ viewId: event.target.value.trim() })
              }
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
              <FormLabel htmlFor="">Content type</FormLabel>
              <FormLabel htmlFor="">Slug field</FormLabel>
              <FormLabel htmlFor="">URL prefix</FormLabel>
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
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                    this.handleContentTypeChange(key, event.target.value)
                  }>
                  {key ? null : (
                    <option disabled value="">
                      Select a Content Type
                    </option>
                  )}

                  {Object.entries(allContentTypes)
                    // include current type in options (required by Select component)
                    // and all types that are not selected
                    .filter(([type]) => type === key || !contentTypes[type])
                    .map(([type, { name: typeName }]) => (
                      <option key={`${key}->${type}`} value={type}>
                        {typeName}
                      </option>
                    ))}
                </Select>

                <Select
                  name={'slugField-' + index}
                  id={'slugField-' + index}
                  isDisabled={!key}
                  hasError={key ? !slugField : false}
                  value={slugField}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    this.handleContentTypeFieldChange(key, 'slugField', event.target.value)
                  }>
                  <option disabled value="">
                    Select slug field
                  </option>
                  {key &&
                    allContentTypes[key].fields.map(f => (
                      <option key={`${key}.${f.id}`} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                </Select>

                <TextInput
                  name={'urlPrefix-' + index}
                  id={'urlPrefix-' + index}
                  value={urlPrefix}
                  disabled={!key}
                  onChange={event =>
                    this.handleContentTypeFieldChange(key, 'urlPrefix', event.target.value)
                  }
                />

                <TextLink onClick={() => this.removeContentType(key)}>Remove</TextLink>
              </div>
            ))}

            <Button
              type="button"
              buttonType="muted"
              disabled={Object.values(contentTypes).some(ct => !ct.slugField)}
              onClick={() => this.addContentType()}>
              Add another content type
            </Button>
          </Typography>
        </div>

        <div className={styles.logo}>
          <img src={require('./ga-logo.svg')} alt="Google Analytics Logo" />
        </div>
      </>
    );
  }
}
