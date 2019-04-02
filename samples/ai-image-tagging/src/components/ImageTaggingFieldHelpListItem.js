import {ListItem} from '@contentful/forma-36-react-components';
import PropTypes from 'prop-types';
import React from 'react';

import './ImageTaggingFieldHelpListItem.css'

export const ImageTaggingFieldHelpListItem =
  ({ configuredFieldId, field, isCompatibleField, fieldName, fieldDescription }) => {
    if (!configuredFieldId) {
      return (
        <ListItem className='help_list__item'>
          The field id for the {fieldName} is not configured.
          Add the id of a {fieldDescription} to the extension configuration.
        </ListItem>
      )
    } else if (!field) {
      return <ListItem className='help_list__item'>
        Unable to find field id {configuredFieldId}, configured as the {fieldName}.
      </ListItem>
    } else if (!isCompatibleField(field)) {
      return <ListItem className='help_list__item'>
        Configured {fieldName} with id {configuredFieldId} should be a {fieldDescription}.
        Found field type {field.type}.
      </ListItem>
    }

    return null
  };

ImageTaggingFieldHelpListItem.propTypes = {
  fieldName: PropTypes.string.isRequired,
  fieldDescription: PropTypes.string.isRequired,
  isCompatibleField: PropTypes.func.isRequired,
  configuredFieldId: PropTypes.string,
  field: PropTypes.object
};
