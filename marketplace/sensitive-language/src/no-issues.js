'use strict';

import React from 'react';

import { Icon, Typography, Subheading, Paragraph } from '@contentful/forma-36-react-components';

export function NoIssues() {
  return (
    <Typography>
      <Subheading style={{ display: 'flex', alignItems: 'center' }}>
        <Icon icon="CheckCircle" color="positive" extraClassNames="f36-margin-right--xs" />
        No issues found
      </Subheading>
      <Paragraph style={{ marginBottom: 0 }}>
        All checked files seem to be free on insenstive language. Good job!
      </Paragraph>
    </Typography>
  );
}
