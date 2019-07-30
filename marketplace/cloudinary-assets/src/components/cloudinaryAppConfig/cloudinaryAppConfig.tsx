import * as React from 'react';

import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import {
  Heading,
  Paragraph,
  Spinner,
  Typography,
  TextField,
  Form,
  Subheading,
  CheckboxField
} from '@contentful/forma-36-react-components';
import { Workbench } from '@contentful/forma-36-react-components/dist/alpha';

import {
  toExtensionParameters,
  toInputParameters,
  validateParameters,
  ParameterValue,
  InputParameters,
  MAX_FILES_UPPER_LIMIT
} from './parameters';

import {
  getCompatibleFields,
  currentStateToSelectedFields,
  selectedFieldsToTargetState,
  ContentType,
  CompatibleFields,
  SelectedFields
} from './fields';

interface Props {
  sdk: AppExtensionSDK;
}

interface State {
  ready: boolean;
  contentTypes: ContentType[];
  compatibleFields: CompatibleFields;
  selectedFields: SelectedFields;
  parameters: InputParameters;
}

export default class CloudinaryAppConfig extends React.Component<Props, State> {
  state = {
    ready: false,
    contentTypes: [] as ContentType[],
    compatibleFields: ({} as any) as CompatibleFields,
    selectedFields: ({} as any) as SelectedFields,
    parameters: toInputParameters(null)
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { space, platformAlpha } = this.props.sdk;

    platformAlpha.app.onConfigure(this.onAppConfigure);

    const [contentTypesResponse, currentState, parameters] = await Promise.all([
      space.getContentTypes(),
      platformAlpha.app.getCurrentState(),
      platformAlpha.app.getParameters()
    ]);

    const contentTypes = contentTypesResponse.items as ContentType[];
    const compatibleFields = getCompatibleFields(contentTypes);
    const filteredContentTypes = contentTypes.filter(ct => {
      const fields = compatibleFields[ct.sys.id];
      return fields && fields.length > 0;
    });

    this.setState({
      ready: true,
      contentTypes: filteredContentTypes,
      compatibleFields,
      selectedFields: currentStateToSelectedFields(currentState || {}),
      parameters: toInputParameters((parameters || {}) as Record<string, ParameterValue>)
    });
  };

  onAppConfigure = () => {
    const { parameters, contentTypes, selectedFields } = this.state;
    const error = validateParameters(parameters);

    if (error) {
      this.props.sdk.notifier.error(error);
      return false;
    }

    return {
      parameters: toExtensionParameters(parameters),
      targetState: selectedFieldsToTargetState(contentTypes, selectedFields)
    };
  };

  render() {
    return (
      <Workbench>
        <Workbench.Content>
          {this.state.ready ? this.renderApp() : this.renderLoader()}
        </Workbench.Content>
      </Workbench>
    );
  }

  renderLoader() {
    return (
      <Paragraph>
        Loading <Spinner />
      </Paragraph>
    );
  }

  onParameterChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    this.setState(state => ({
      ...state,
      parameters: { ...state.parameters, [key]: value }
    }));
  };

  onSelectedFieldChange = (
    ctId: string,
    fieldId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e.currentTarget;

    this.setState(state => {
      const updated = { ...state.selectedFields };

      if (checked) {
        updated[ctId] = (updated[ctId] || []).concat([fieldId]);
      } else {
        updated[ctId] = (updated[ctId] || []).filter(cur => cur !== fieldId);
      }

      return { ...state, selectedFields: updated };
    });
  };

  renderApp() {
    const { contentTypes, compatibleFields, selectedFields, parameters } = this.state;

    return (
      <>
        <Typography>
          <Heading>Cloudinary account</Heading>
          <Paragraph>Provide details of your Cloudinary account so we can connect to it.</Paragraph>
          <Form>
            <TextField
              required={true}
              id="cloud-name-input"
              name="cloud-name-input"
              labelText="Cloud name"
              textInputProps={{
                width: 'large',
                maxLength: 50
              }}
              helpText="The cloud_name of the account to access."
              value={parameters.cloudName}
              onChange={this.onParameterChange.bind(this, 'cloudName')}
            />
            <TextField
              required={true}
              id="api-key-input"
              name="api-key-input"
              labelText="API key"
              textInputProps={{
                width: 'large',
                type: 'password',
                maxLength: 50
              }}
              helpText="The account API key."
              value={parameters.apiKey}
              onChange={this.onParameterChange.bind(this, 'apiKey')}
            />
          </Form>

          <Heading>Configuration</Heading>
          <Form>
            <TextField
              required={true}
              id="max-files-input"
              name="max-files-input"
              labelText="Max number of files"
              textInputProps={{
                width: 'medium',
                type: 'number'
              }}
              helpText={`Max number of files that can be added to a single field. Between 1 and ${MAX_FILES_UPPER_LIMIT}.`}
              value={parameters.maxFiles}
              onChange={this.onParameterChange.bind(this, 'maxFiles')}
            />
          </Form>

          <Heading>Field assignment</Heading>
          <Paragraph>
            This app can be used with <code>Object</code> fields.
          </Paragraph>
          {contentTypes.length > 0 ? (
            <Paragraph>
              The list below enumerates all Content Types with at least one <code>Object</code>{' '}
              field. Tick the box next to a field name to enable Cloudinary for it.
            </Paragraph>
          ) : (
            <Paragraph>
              There is no content type with an <code>Object</code> field. Come back to this page
              once you create one.
            </Paragraph>
          )}
          {contentTypes.map(ct => {
            const fields = compatibleFields[ct.sys.id];
            return (
              <div key={ct.sys.id}>
                <Subheading>
                  {ct.name} ({fields.length})
                </Subheading>
                <Form>
                  {fields.map(field => (
                    <CheckboxField
                      key={field.id}
                      id={`field-box-${ct.sys.id}-${field.id}`}
                      labelText={field.name}
                      helpText={`Field ID: ${field.id}`}
                      checked={(selectedFields[ct.sys.id] || []).includes(field.id)}
                      onChange={this.onSelectedFieldChange.bind(this, ct.sys.id, field.id)}
                    />
                  ))}
                </Form>
              </div>
            );
          })}
        </Typography>
      </>
    );
  }
}
