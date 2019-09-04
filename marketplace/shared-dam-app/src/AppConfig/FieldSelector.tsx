import * as React from 'react';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { Form, Subheading, CheckboxField, Typography } from '@contentful/forma-36-react-components';

import { ContentType, CompatibleFields, SelectedFields } from './fields';

interface Props {
  contentTypes: ContentType[];
  compatibleFields: CompatibleFields;
  selectedFields: SelectedFields;
  onSelectedFieldsChange: Function;
}

export default class FieldSelector extends React.Component<Props> {
  onSelectedFieldChange = (
    ctId: string,
    fieldId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
            <div key={ct.sys.id} className={css({ marginTop: tokens.spacingL })}>
              <Subheading>{ct.name}</Subheading>
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
