import PropTypes from 'prop-types';
import React from 'react';
import { getContentTypeUrl } from '../lib/content-type';

export const SidebarConfigLink = ({ contentType, linkText, children }) => (
  <a
    href={getContentTypeUrl(contentType)}
    target='_blank'
  >{children}</a>
);

SidebarConfigLink.propTypes = {
  contentType: PropTypes.object.isRequired,
};
