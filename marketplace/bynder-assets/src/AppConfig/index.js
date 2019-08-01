import React from 'react';
import PropTypes from 'prop-types';

import {
  Paragraph,
  Spinner,
  Heading,
  Typography,
  TextField,
  Form
} from '@contentful/forma-36-react-components';
import { Workbench } from '@contentful/forma-36-react-components/dist/alpha';

import {
  getCompatibleFields,
  currentStateToSelectedFields,
  selectedFieldsToTargetState
} from './fields';

import FieldSelector from './FieldSelector';

export default class AppConfig extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = { ready: false, bynderURL: '' };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { platformAlpha, space } = this.props.sdk;
    const { app } = platformAlpha;

    app.onConfigure(this.onAppConfigure);

    const [parameters, currentState, contentTypesRes] = await Promise.all([
      app.getParameters(),
      app.getCurrentState(),
      space.getContentTypes()
    ]);

    const bynderURL = parameters ? parameters.bynderURL || '' : '';
    const contentTypes = contentTypesRes.items || [];
    const { compatibleFields, filteredContentTypes } = getCompatibleFields(contentTypes);

    this.setState({
      ready: true,
      bynderURL,
      compatibleFields,
      contentTypes: filteredContentTypes,
      selectedFields: currentStateToSelectedFields(currentState || {})
    });
  };

  onAppConfigure = () => {
    const { contentTypes, selectedFields, bynderURL } = this.state;

    if (bynderURL.length < 10 || !bynderURL.startsWith('https://')) {
      this.props.sdk.notifier.error('Invalid Bynder URL provided.');
      return false;
    }

    return {
      parameters: { bynderURL },
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

  renderApp() {
    const { contentTypes, compatibleFields, selectedFields, bynderURL } = this.state;

    return (
      <Typography>
        <Heading>Bynder URL</Heading>
        <Form>
          <TextField
            required={true}
            id="bynder-url-input"
            name="bynder-url-input"
            labelText="Bynder URL"
            textInputProps={{
              width: 'large',
              maxLength: 250,
              placeholder: 'https://youraccount.getbynder.com'
            }}
            helpText="Bynder URL for your account."
            value={bynderURL}
            onChange={e => this.setState({ bynderURL: e.currentTarget.value })}
          />
        </Form>

        <Heading>Field assignment</Heading>
        <Paragraph>
          This app can be used with <code>Object</code> fields.
        </Paragraph>
        {contentTypes.length > 0 ? (
          <Paragraph>
            The list below enumerates all Content Types with at least one <code>Object</code> field.
            Tick the box next to a field name to enable Bynder for it.
          </Paragraph>
        ) : (
          <Paragraph>
            There is no content type with an <code>Object</code> field. Come back to this page once
            you create one.
          </Paragraph>
        )}
        <FieldSelector
          contentTypes={contentTypes}
          compatibleFields={compatibleFields}
          selectedFields={selectedFields}
          onSelectedFieldsChange={selectedFields => this.setState({ selectedFields })}
        />
      </Typography>
    );
  }
}
