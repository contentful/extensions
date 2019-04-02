import { Note } from '@contentful/forma-36-react-components';
import { SidebarConfigLink } from './SidebarConfigLink';
import React from 'react';

export const ImageTaggingLocationError =
  ({ contentType, configuredForField }) =>
    (
      <Note noteType="primary" className="f36-color--text-light">
        The ai-image-tagging extension is an entry-level sidebar extension.
        You are currently using it on a field level.
        Remove the extension from the field {configuredForField ?
        <span className={'help_description__highlight'}>{configuredForField.id}</span> : ' ' } and
        add it in the <SidebarConfigLink contentType={contentType}>sidebar configuration</SidebarConfigLink> of your
        content type.
      </Note>
    );
