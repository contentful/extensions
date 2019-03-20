import React from 'react';
import PropTypes from 'prop-types';
import { List, Paragraph } from '@contentful/forma-36-react-components';

import { getField, isCompatibleImageField, isCompatibleTagField, getContentTypeUrl } from '../lib/content-type'
import { ImageTaggingFieldHelpListItem } from './ImageTaggingFieldHelpListItem';

import './ImageTaggingHelp.css'

export const ImageTaggingHelp = ({ contentType, imageFieldId, tagFieldId }) => (
  <div>
    <Paragraph element='p' extraClassNames={'f36-color--text-light'}>
      To be able to use image auto tagging, adjust the extension configuration and resolve the following issues:
    </Paragraph>
    <List>
      <ImageTaggingFieldHelpListItem
        fieldName='image field'
        fieldDescription='Media field as the image source'
        field={getField(contentType, imageFieldId)}
        isCompatibleField={isCompatibleImageField}
        configuredFieldId={imageFieldId}
      />
      <ImageTaggingFieldHelpListItem
        fieldName='tags field'
        fieldDescription='Media field as the image source'
        field={getField(contentType, tagFieldId)}
        isCompatibleField={isCompatibleTagField}
        configuredFieldId={tagFieldId}
      />
    </List>
    <Paragraph element='p' extraClassNames={'f36-color--text-light'}>
      To change the configuration, go to the <a
        href={getContentTypeUrl(contentType)}
        target='_blank'
    >sidebar configuration</a> of your content type {contentType.name} and
      click <span className={'help_description__highlight'}>Change instance parameters</span> on
      the Ai-image-tagging card.
    </Paragraph>
  </div>);

ImageTaggingHelp.propTypes = {
  contentType: PropTypes.object.isRequired,
  imageFieldId: PropTypes.string,
  tagFieldId: PropTypes.string,
};
