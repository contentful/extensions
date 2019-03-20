import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Paragraph } from '@contentful/forma-36-react-components';

import { getField, isCompatibleImageField, isCompatibleTagField } from '../lib/content-type'

import './ImageTaggingHelp.css'

const getContentTypeUrl = (contentType) => {
  const spaceId = contentType.sys.space.sys.id;
  const contentTypeId = contentType.sys.id;

  return `https://app.contentful.com/spaces/${spaceId}/content_types/${contentTypeId}/sidebar_configuration`
};

export class ImageTaggingHelp extends React.Component {
  static propTypes = {
    contentType: PropTypes.object.isRequired,
    imageFieldId: PropTypes.bool.isRequired,
    tagFieldId: PropTypes.bool.isRequired,
  };

  renderFieldHelp = (fieldId, contentType, validateFieldType, fieldName, fieldDescription) => {
    const isConfigured = !!fieldId;
    const field = getField(contentType, fieldId);
    const isCompatibleField = validateFieldType(contentType, fieldId);

    if (!isConfigured) {
      return (
        <ListItem extraClassNames='help_list__item'>
          The field id for {fieldName} is not configured.
          Add the id of a {fieldDescription} to the extension configuration.
        </ListItem>
      )
    } else if (!field) {
      return <ListItem extraClassNames='help_list__item'>
        Unable to find field id {fieldId} configured as {fieldName}.
      </ListItem>
    } else if (!isCompatibleField) {
      return <ListItem extraClassNames='help_list__item'>
        Configured {fieldName} with id {fieldId} should be a {fieldDescription}. Found field type {field.type}.
      </ListItem>
    }
  };

  render = () => {
    const { contentType, imageFieldId, tagFieldId } = this.props;

    return (
      <div>

        <Paragraph element='p' extraClassNames={'f36-color--text-light'}>
          To be able to use image auto tagging, adjust the sidebar configuration of your content type <a
            href={getContentTypeUrl(contentType)}
            target='_blank'
          >{contentType.name}</a> and resolve the following issues:
        </Paragraph>
        <List>
          {this.renderFieldHelp(
            imageFieldId,
            contentType,
            isCompatibleImageField,
            'Image field',
            'Media field as the image source')}
          {this.renderFieldHelp(
            tagFieldId,
            contentType,
            isCompatibleTagField,
            'Tags field',
            'Short text, list field to store the tags')}
        </List>
      </div>
    )
  }
}
