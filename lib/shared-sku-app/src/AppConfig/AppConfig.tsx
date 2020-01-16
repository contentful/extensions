import * as React from 'react';

import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import {
  Heading,
  Paragraph,
  Typography,
  TextField,
  Form
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';

import FieldSelector from './FieldSelector';

import { toInputParameters, toAppParameters } from './parameters';

import {
  getCompatibleFields,
  editorInterfacesToSelectedFields,
  selectedFieldsToTargetState,
  EditorInterface,
  ContentType,
  CompatibleFields,
  SelectedFields
} from './fields';

import { Hash, ValidateParametersFn } from '../interfaces';

interface Props {
  sdk: AppExtensionSDK;
  parameterDefinitions: Hash[];
  validateParameters: ValidateParametersFn;
  logo: string;
  name: string;
  color: string;
  description: string;
}

interface State {
  contentTypes: ContentType[];
  compatibleFields: CompatibleFields;
  selectedFields: SelectedFields;
  parameters: Hash;
}

const styles = {
  body: css({
    height: 'auto',
    minHeight: '65vh',
    margin: '0 auto',
    marginTop: tokens.spacingXl,
    padding: `${tokens.spacingXl} ${tokens.spacing2Xl}`,
    maxWidth: tokens.contentWidthText,
    backgroundColor: tokens.colorWhite,
    zIndex: 2,
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '2px'
  }),
  background: (color: string) =>
    css({
      display: 'block',
      position: 'absolute',
      zIndex: -1,
      top: 0,
      width: '100%',
      height: '300px',
      backgroundColor: color
    }),
  section: css({
    margin: `${tokens.spacingXl} 0`
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
    '> img': {
      display: 'block',
      width: '70px',
      margin: `${tokens.spacingXl} 0`
    }
  })
};

export default class AppConfig extends React.Component<Props, State> {
  state = {
    contentTypes: [],
    compatibleFields: {},
    selectedFields: {},
    parameters: toInputParameters(this.props.parameterDefinitions, null)
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { space, app, ids } = this.props.sdk;

    app.onConfigure(this.onAppConfigure);

    const [contentTypesResponse, eisResponse, parameters] = await Promise.all([
      space.getContentTypes(),
      space.getEditorInterfaces(),
      app.getParameters()
    ]);

    const contentTypes = contentTypesResponse.items as ContentType[];
    const editorInterfaces = eisResponse.items as EditorInterface[];

    const compatibleFields = getCompatibleFields(contentTypes);
    const filteredContentTypes = contentTypes.filter(ct => {
      const fields = compatibleFields[ct.sys.id];
      return fields && fields.length > 0;
    });

    this.setState(
      {
        contentTypes: filteredContentTypes,
        compatibleFields,
        selectedFields: editorInterfacesToSelectedFields(editorInterfaces, ids.app),
        parameters: toInputParameters(this.props.parameterDefinitions, parameters)
      },
      () => app.setReady()
    );
  };

  onAppConfigure = () => {
    const { parameters, contentTypes, selectedFields } = this.state;
    const error = this.props.validateParameters(parameters);

    if (error) {
      this.props.sdk.notifier.error(error);
      return false;
    }

    return {
      parameters: toAppParameters(this.props.parameterDefinitions, parameters),
      targetState: selectedFieldsToTargetState(contentTypes, selectedFields)
    };
  };

  render() {
    return (
      <>
        <div className={styles.background(this.props.color)} />
        <div className={styles.body}>
          <Typography>
            <Heading>About {this.props.name}</Heading>
            <Paragraph>{this.props.description}</Paragraph>
            <hr className={styles.splitter} />
          </Typography>
          {this.renderApp()}
        </div>
        <div className={styles.icon}>
          <img src={this.props.logo} alt="App logo" />
        </div>
      </>
    );
  }

  onParameterChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    this.setState(state => ({
      parameters: { ...state.parameters, [key]: value }
    }));
  };

  onSelectedFieldsChange = (selectedFields: SelectedFields) => {
    this.setState({ selectedFields });
  };

  renderApp() {
    const { contentTypes, compatibleFields, selectedFields, parameters } = this.state;
    const { parameterDefinitions } = this.props;
    const hasConfigurationOptions = parameterDefinitions && parameterDefinitions.length > 0;

    return (
      <>
        {hasConfigurationOptions && (
          <Typography>
            <Heading>Configuration</Heading>
            <Form>
              {parameterDefinitions.map(def => {
                const key = `config-input-${def.id}`;

                return (
                  <TextField
                    required={def.required}
                    key={key}
                    id={key}
                    name={key}
                    labelText={def.name}
                    textInputProps={{
                      width: def.type === 'Symbol' ? 'large' : 'medium',
                      type: def.type === 'Symbol' ? 'text' : 'number',
                      maxLength: 255
                    }}
                    helpText={def.description}
                    value={parameters[def.id]}
                    onChange={this.onParameterChange.bind(this, def.id)}
                  />
                );
              })}
            </Form>
            <hr className={styles.splitter} />
          </Typography>
        )}
        <Typography>
          <Heading>Assign to fields</Heading>
          {contentTypes.length > 0 ? (
            <Paragraph>
              This app can only be used with <strong>Short text</strong> or{' '}
              <strong>Short text list</strong> fields. Select which fields you’d like to enable for
              this app.
            </Paragraph>
          ) : (
            <>
              <Paragraph>
                This app can only be used with <strong>Short text</strong> or{' '}
                <strong>Short text list</strong> fields.
              </Paragraph>
              <Paragraph>
                There are <strong>no content types with Short text or Short text list</strong>{' '}
                fields in this environment. You can add one here later.
              </Paragraph>
            </>
          )}
          <FieldSelector
            contentTypes={contentTypes}
            compatibleFields={compatibleFields}
            selectedFields={selectedFields}
            onSelectedFieldsChange={this.onSelectedFieldsChange}
          />
        </Typography>
      </>
    );
  }
}
