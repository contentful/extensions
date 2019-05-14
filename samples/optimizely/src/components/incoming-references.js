import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Heading,
  Paragraph,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@contentful/forma-36-react-components';
import * as ReferenceInfo from '../reference-info';

function renderCombinedLinkValidation(entry) {
  if (entry.combinedLinkValidationType === ReferenceInfo.COMBINED_LINK_VALIDATION_CONFLICT) {
    return 'Conflicting';
  }

  if (entry.combinedLinkValidationType === ReferenceInfo.COMBINED_LINK_VALIDATION_INTERSECTION) {
    if (entry.linkContentTypeNames.length > 1) {
      return `Intersection of content types used: ${entry.linkContentTypeNames.join(', ')}`;
    }
    return entry.linkContentTypeNames[0];
  }

  return 'All content types';
}

export default function IncomingReferences(props) {
  return (
    <Typography>
      <Heading>Incoming references</Heading>
      <Paragraph>This variation container is used in the following entries:</Paragraph>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Entry title</TableCell>
            <TableCell>Content type name</TableCell>
            <TableCell>Referenced from fields</TableCell>
            <TableCell>Combined link validation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.referenceInfo.references.map(entry => (
            <TableRow key={entry.id}>
              <TableCell>{entry.title}</TableCell>
              <TableCell>{entry.contentTypeName}</TableCell>
              <TableCell>{entry.referencedFromFields.join(', ')}</TableCell>
              <TableCell>{renderCombinedLinkValidation(entry)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Typography>
  );
}

IncomingReferences.propTypes = {
  referenceInfo: PropTypes.object
};
