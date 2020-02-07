import * as React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import omit from 'lodash/omit';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import {
  Form,
  Subheading,
  CheckboxField,
  Typography,
  SelectField,
  Option
} from '@contentful/forma-36-react-components';

import { ContentType, CompatibleFields, FieldsConfig } from './fields';

const styles = {
  fieldGroup: css({
    display: 'flex'
  }),
  select: css({
    marginLeft: '10px'
  })
};

interface Props {
  contentTypes: ContentType[];
  compatibleFields: CompatibleFields;
  selectedFields: FieldsConfig;
  onSelectedFieldsChange: Function;
}

export default class FieldSelector extends React.Component<Props> {
  onSelectedFieldChange = (
    ctId: string,
    fieldId: string,
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isTargetChecked = e.currentTarget.checked;

    this.props.onSelectedFieldsChange(
      isTargetChecked
        ? set(Object.assign({}, this.props.selectedFields), [ctId, fieldId], type)
        : omit(this.props.selectedFields, [`${ctId}.${fieldId}`])
    );
  };

  onSelectedFieldTypeChange(ctId, fieldId, type) {
    this.props.onSelectedFieldsChange(
      set(Object.assign({}, this.props.selectedFields), [ctId, fieldId], type)
    );
  }

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
                {fields.map(field => {
                  const type = get(selectedFields, [ct.sys.id, field.id], null);
                  const isChecked = !!type;

                  return (
                    <div className={styles.fieldGroup} key={field.id}>
                      <CheckboxField
                        id={`field-box-${ct.sys.id}-${field.id}`}
                        labelText={field.name}
                        helpText={`${
                          field.type === 'Symbol' ? 'Short text' : 'Short text, list'
                        } · Field ID: ${field.id}`}
                        checked={isChecked}
                        onChange={this.onSelectedFieldChange.bind(this, ct.sys.id, field.id, 'sku')}
                      />
                      {isChecked && (
                        <SelectField
                          id={`${field.id}-type`}
                          className={styles.select}
                          labelText=""
                          name="type"
                          value={type}
                          onChange={event =>
                            this.onSelectedFieldTypeChange(
                              ct.sys.id,
                              field.id,
                              (event.target as HTMLSelectElement).value
                            )
                          }>
                          <Option value="sku">SKU</Option>
                          <Option value="category">Category</Option>
                        </SelectField>
                      )}
                    </div>
                  );
                })}
              </Form>
            </div>
          );
        })}
      </Typography>
    );
  }
}
