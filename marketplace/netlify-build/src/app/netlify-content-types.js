import React from 'react';
import PropTypes from 'prop-types';

import {
  Typography,
  Heading,
  Paragraph,
  FieldGroup,
  CheckboxField
} from '@contentful/forma-36-react-components';

export default class NetlifyContentTypes extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    contentTypes: PropTypes.array.isRequired,
    enabledContentTypes: PropTypes.array.isRequired,
    onEnabledContentTypesChange: PropTypes.func.isRequired
  };

  onToggleSelect = () => {
    const { contentTypes, enabledContentTypes } = this.props;
    const allSelected = contentTypes.length === enabledContentTypes.length;
    if (allSelected) {
      this.props.onEnabledContentTypesChange([]);
    } else {
      this.props.onEnabledContentTypesChange(contentTypes.map(([id]) => id));
    }
  };

  onChange = (checked, id) => {
    const enabled = this.props.enabledContentTypes;
    this.props.onEnabledContentTypesChange(
      checked ? enabled.concat([id]) : enabled.filter(cur => cur !== id)
    );
  };

  render() {
    const { disabled, contentTypes, enabledContentTypes } = this.props;

    const allSelected = contentTypes.length === enabledContentTypes.length;

    return (
      <Typography>
        <Heading>Enable Netlify builds for content types</Heading>
        <Paragraph>Select the content types that can use the Netlify App in the sidebar.</Paragraph>
        <Paragraph>
          <CheckboxField
            id="selectAll"
            labelText="Select all"
            disabled={disabled}
            onChange={this.onToggleSelect}
            checked={allSelected}
          />
        </Paragraph>
        <FieldGroup>
          {contentTypes.map(([id, name]) => (
            <CheckboxField
              key={id}
              id={`ct-box-${id}`}
              labelText={name}
              onChange={e => this.onChange(e.target.checked, id)}
              disabled={disabled}
              checked={enabledContentTypes.includes(id)}
            />
          ))}
        </FieldGroup>
      </Typography>
    );
  }
}
