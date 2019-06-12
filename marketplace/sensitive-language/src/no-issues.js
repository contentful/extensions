'use strict';

import React from 'react';

import { Icon, Typography, Subheading, Paragraph } from '@contentful/forma-36-react-components';

export function NoIssues() {
  return (
    <Typography>
      <Subheading className="align-center">
        <Icon icon="CheckCircle" color="positive" className="f36-margin-right--xs" />
        No issues found
      </Subheading>
      <Paragraph className="bottom-margin-none">
        All checked files seem to be free on insenstive language. Good job!
      </Paragraph>
    </Typography>
  );
}
