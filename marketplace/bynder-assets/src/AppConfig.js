import React from 'react';
import PropTypes from 'prop-types';

import { Heading, Typography, TextField, Form } from '@contentful/forma-36-react-components';

import {
  getCompatibleFields,
  currentStateToSelectedFields,
  selectedFieldsToTargetState
} from '../../cloudinary-assets/src/components/cloudinaryAppConfig/fields';
import FieldSelector from '../../cloudinary-assets/src/components/cloudinaryAppConfig/fieldSelector';

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
    const compatibleFields = getCompatibleFields(contentTypes);
    const filteredContentTypes = contentTypes.filter(ct => {
      const fields = compatibleFields[ct.sys.id];
      return fields && fields.length > 0;
    });

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
    const { contentTypes, compatibleFields, selectedFields, bynderURL } = this.state;

    if (!this.state.ready) {
      return <div>Loading...</div>;
    }

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
