import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Select, Option } from '@contentful/forma-36-react-components';
import { Warning } from './warning.js';

import { fetchForms } from './fetch.js';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.sdk.field.getValue(),
      previousValueFormIsMissing: false,
      forms: undefined,
      error: undefined,
      isDisabled: false
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const { sdk, parameters } = this.props;
    const { accessToken, workspaceId } = parameters;
    const { value } = this.state;

    // Handle external changes (e.g. when multiple authors are working on the same entry).
    sdk.field.onValueChanged(value => {
      this.setState({ value: value });
    });

    // Disable editing (e.g. when field is not editable due to R&P).
    sdk.field.onIsDisabledChanged(isDisabled => {
      this.setState({ isDisabled });
    });

    fetchForms(workspaceId, accessToken)
      .then(forms => {
        const valueIndex = forms.findIndex(function(form) {
          return form._links.display === value;
        });

        const previousValueFormIsMissing = valueIndex === -1 && value !== undefined;
        if (previousValueFormIsMissing) {
          forms.unshift({
            id: 'previous--value-form-is-missing',
            _links: {
              display: value
            },
            title: 'Previous value (no longer exists in Typeform)'
          });
        }

        this.setState({ forms, previousValueFormIsMissing });

        return forms;
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  onChange(e) {
    let value = e.currentTarget.value;
    if (value === '') {
      value = undefined;
    }

    this.setState({ value });
    if (value) {
      this.props.sdk.field.setValue(value);
    } else {
      this.props.sdk.field.removeValue();
    }
  }

  render() {
    const { value, forms, error, previousValueFormIsMissing, isDisabled } = this.state;
    const { isRequired } = this.props;

    // No error and no forms means we're still loading data. Let's not render anything.
    if (!error && !Array.isArray(forms)) {
      return null;
    }

    if (error) {
      return (
        <React.Fragment>
          <TextInput
            onChange={this.onChange}
            value={value}
            required={isRequired}
            disabled={isDisabled}
          />
          <Warning iconColor="negative">
            {`Could not fetch forms from Typeform. Received the following error: ${error.message}`}
          </Warning>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {previousValueFormIsMissing && (
          <Warning>The form you have selected in Contentful no longer exists in Typeform.</Warning>
        )}
        <Select onChange={this.onChange} value={value} required={isRequired} disabled={isDisabled}>
          <Option key="" value="">
            Choose a typeform
          </Option>
          {this.state.forms.map(form => (
            <Option key={form.id} value={form._links.display}>
              {form.title}
            </Option>
          ))}
        </Select>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  sdk: PropTypes.object.isRequired,
  parameters: PropTypes.shape({
    accessToken: PropTypes.string.isRequired,
    workspaceId: PropTypes.string
  }).isRequired,
  isRequired: PropTypes.bool.isRequired
};
