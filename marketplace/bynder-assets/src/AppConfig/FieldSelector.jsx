import * as React from 'react';
import PropTypes from 'prop-types';

import { Form, Subheading, CheckboxField, Typography } from '@contentful/forma-36-react-components';

export default class FieldSelector extends React.Component {
  static propTypes = {
    contentTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    compatibleFields: PropTypes.object.isRequired,
    selectedFields: PropTypes.object.isRequired,
    onSelectedFieldsChange: PropTypes.func.isRequired
  };

  onSelectedFieldChange = (ctId, fieldId, e) => {
    const updated = { ...this.props.selectedFields };

    if (e.currentTarget.checked) {
      updated[ctId] = (updated[ctId] || []).concat([fieldId]);
    } else {
      updated[ctId] = (updated[ctId] || []).filter(cur => cur !== fieldId);
    }

    this.props.onSelectedFieldsChange(updated);
  };

  render() {
    const { compatibleFields, contentTypes, selectedFields } = this.props;

    return (
      <Typography>
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
    );
  }
}
