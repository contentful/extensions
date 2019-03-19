import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Paragraph } from '@contentful/forma-36-react-components';

import './ImageTaggingHelp.css'

const getContentTypeUrl = (contentType) => {
  const spaceId = contentType.sys.space.sys.id;
  const contentTypeId = contentType.sys.id;

  return `https://app.contentful.com/spaces/${spaceId}/content_types/${contentTypeId}/sidebar_configuration`
};

export class ImageTaggingHelp extends React.Component {
  static propTypes = {
    contentType: PropTypes.object.isRequired,
  };

  render = () => {
    const { contentType } = this.props;

    return (
      <div>
        <Paragraph element='p' extraClassNames={'f36-color--text-light'}>
          To be able to use image auto tagging, add the following fields to your content type:
        </Paragraph>
        <List>
            <ListItem extraClassNames='help_list__item'>A 'Media' field as the image source</ListItem>
            <ListItem extraClassNames='help_list__item'>A 'Short text, list' field to store the tags</ListItem>
        </List>
        <Paragraph element='p' extraClassNames={'help_field_configuration f36-color--text-light'}>
          You will also need to configure their field ids in the image-tagging extension configuration. To do so, go to the
          sidebar configuration of your content-type <a
            href={getContentTypeUrl(contentType)}
            target='_blank'
          >{contentType.name}</a> and click 'Change instance parameters' on the image-tagging extension card.</Paragraph>
      </div>
    )
  }
}