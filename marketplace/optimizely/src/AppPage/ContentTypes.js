import React from 'react';
import PropTypes from 'prop-types';
import tokens from '@contentful/forma-36-tokens';
import constants from './constants';
import { hasReferenceFieldsLinkingToEntry } from './ReferenceForm';
import { css } from 'emotion';
import {
  Heading,
  Paragraph,
  Button,
  Table,
  TableRow,
  TableCell,
  TextLink,
  SelectField,
  Option
} from '@contentful/forma-36-react-components';
import { getContentTypesNotAddedYet } from './ContentTypeHelpers';
import ReferenceField from './ReferenceField';

const styles = {
  table: css({
    marginTop: tokens.spacingS
  }),
  link: css({
    marginRight: tokens.spacingS
  }),
  contentTypeRow: css({
    gridTemplateColumns: 'auto 6rem'
  })
};

ContentTypes.propTypes = {
  addedContentTypes: PropTypes.array.isRequired,
  allContentTypes: PropTypes.array.isRequired,
  allReferenceFields: PropTypes.object.isRequired,
  selectedContentType: PropTypes.string.isRequired,
  onAddContentType: PropTypes.func.isRequired,
  onSelectContentType: PropTypes.func.isRequired,
  onSelectReferenceField: PropTypes.func.isRequired,
  onDeleteContentType: PropTypes.func.isRequired
};

export function isContentTypeValidSelection(contentType, addedContentTypes) {
  return (
    contentType.sys.id !== constants.VARIATION_CONTAINER_CT_ID &&
    !isContentTypeAlreadyAdded(contentType, addedContentTypes) &&
    hasReferenceFieldsLinkingToEntry(contentType)
  );
}

export function isContentTypeAlreadyAdded(contentType, addedContentTypes) {
  return addedContentTypes.includes(contentType.sys.id);
}

export default function ContentTypes({
  addedContentTypes,
  allContentTypes,
  allReferenceFields,
  onAddContentType,
  onSelectContentType,
  onSelectReferenceField,
  onDeleteContentType,
  selectedContentType
}) {
  const allContentTypesAdded =
    getContentTypesNotAddedYet(allContentTypes, addedContentTypes).length === 0;

  return (
    <div className="f36-margin-top--xl">
      <Heading>Content Types</Heading>
      <Paragraph className="f36-margin-top--m">
        Select the content types for which you want to enable A/B testing.
      </Paragraph>
      <SelectField
        id="content-types"
        name="content-types"
        labelText="Content Type"
        selectProps={{ width: 'medium', isDisabled: allContentTypesAdded }}
        onChange={e => onSelectContentType(e.target.value)}
        value={selectedContentType || ''}
        required>
        <Option key="default" value="">
          Select a content type
        </Option>
        {allContentTypes
          .filter(ct => isContentTypeValidSelection(ct, addedContentTypes))
          .map(ct => (
            <Option key={ct.sys.id} value={ct.sys.id}>
              {ct.name}
            </Option>
          ))}
      </SelectField>
      <Button
        buttonType="muted"
        className="f36-margin-top--m"
        onClick={onAddContentType}
        disabled={allContentTypesAdded || !selectedContentType}>
        Add
      </Button>
      {addedContentTypes.length > 0 ? (
        <Table className={styles.table}>
          <tbody>
            {addedContentTypes.map(id => (
              <ContentTypeRow
                key={id}
                contentTypeId={id}
                allContentTypes={allContentTypes}
                allReferenceFields={allReferenceFields}
                onClickDelete={onDeleteContentType}
                onSelectReferenceField={onSelectReferenceField}
              />
            ))}
          </tbody>
        </Table>
      ) : null}
    </div>
  );
}

ContentTypeRow.propTypes = {
  contentTypeId: PropTypes.string.isRequired,
  allContentTypes: PropTypes.array.isRequired,
  allReferenceFields: PropTypes.object.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onSelectReferenceField: PropTypes.func.isRequired
};

function ContentTypeRow({
  contentTypeId,
  allContentTypes,
  allReferenceFields,
  onSelectReferenceField,
  onClickDelete
}) {
  const contentType = allContentTypes.find(ct => ct.sys.id === contentTypeId);
  const referenceFields = allReferenceFields[contentTypeId];
  const referenceFieldIds = Object.keys(referenceFields);

  return (
    <TableRow>
      <TableCell className={styles.contentTypeRow}>
        <strong>{contentType.name}</strong>
      </TableCell>
      <TableCell className={styles.contentTypeRow}>
        {referenceFieldIds.map(fieldId => (
          <ReferenceField
            key={fieldId}
            contentType={contentType}
            id={fieldId}
            checked={referenceFields[fieldId]}
            onSelect={onSelectReferenceField}
          />
        ))}
      </TableCell>
      <TableCell className={styles.contentTypeRow}>
        <TextLink
          onClick={() => onClickDelete(contentTypeId)}
          className={styles.link}
          linkType="negative">
          Delete
        </TextLink>
      </TableCell>
    </TableRow>
  );
}
