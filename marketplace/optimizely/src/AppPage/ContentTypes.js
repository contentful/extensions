import React from 'react';
import PropTypes from 'prop-types';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import {
  Heading,
  Paragraph,
  Button,
  Table,
  TableRow,
  TableCell,
  TextLink
} from '@contentful/forma-36-react-components';
import ContentTypeSelectionModal, {
  getContentTypesNotAddedYet
} from './ContentTypeSelectionModal.es6';
import { hasFieldLinkValidations } from './ReferenceField.es6';

const styles = {
  table: css({
    marginTop: tokens.spacingS
  }),
  link: css({
    marginRight: tokens.spacingS
  }),
  contentTypeRow: css({
    display: 'grid',
    gridTemplateColumns: 'auto 6rem'
  })
};

ContentTypes.propTypes = {
  addedContentTypes: PropTypes.array.isRequired,
  allContentTypes: PropTypes.array.isRequired,
  allReferenceFields: PropTypes.object.isRequired,
  isContentTypeDialogOpen: PropTypes.bool.isRequired,
  selectedContentType: PropTypes.string.isRequired,
  openContentTypeDialog: PropTypes.func.isRequired,
  closeContentTypeDialog: PropTypes.func.isRequired,
  saveContentTypeDialog: PropTypes.func.isRequired,
  onSelectContentType: PropTypes.func.isRequired,
  onSelectReferenceField: PropTypes.func.isRequired,
  onDeleteContentType: PropTypes.func.isRequired
};

export default function ContentTypes({
  addedContentTypes,
  allContentTypes,
  allReferenceFields,
  isContentTypeDialogOpen,
  openContentTypeDialog,
  closeContentTypeDialog,
  saveContentTypeDialog,
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
      <Button
        buttonType="muted"
        className="f36-margin-top--s"
        onClick={onClickAdd}
        disabled={allContentTypesAdded}>
        Add content type
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
                onClickEdit={onClickEdit}
                onClickDelete={onDeleteContentType}
              />
            ))}
          </tbody>
        </Table>
      ) : null}
      <ContentTypeSelectionModal
        allContentTypes={allContentTypes}
        allReferenceFields={allReferenceFields}
        addedContentTypes={addedContentTypes}
        isShown={isContentTypeDialogOpen}
        selectedContentType={selectedContentType}
        onSelectContentType={onSelectContentType}
        onSelectReferenceField={onSelectReferenceField}
        onSave={saveContentTypeDialog}
        onCancel={closeContentTypeDialog}
      />
    </div>
  );

  function onClickAdd() {
    onSelectContentType(null);
    openContentTypeDialog();
  }

  function onClickEdit(contentTypeId) {
    onSelectContentType(allContentTypes.find(ct => ct.sys.id === contentTypeId));
    openContentTypeDialog();
  }
}

ContentTypeRow.propTypes = {
  contentTypeId: PropTypes.string.isRequired,
  allContentTypes: PropTypes.array.isRequired,
  allReferenceFields: PropTypes.object.isRequired,
  onClickEdit: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired
};

function ContentTypeRow({
  contentTypeId,
  allContentTypes,
  allReferenceFields,
  onClickEdit,
  onClickDelete
}) {
  const contentType = allContentTypes.find(ct => ct.sys.id === contentTypeId);

  const referenceFields = Object.keys(allReferenceFields[contentTypeId])
    .map(fieldId => contentType.fields.find(field => field.id === fieldId))
    .filter(field => isReferenceFieldEnabled(field, allReferenceFields[contentTypeId]))
    .map(field => field.name);

  return (
    <TableRow>
      <TableCell className={styles.contentTypeRow}>
        <section>
          <strong>{contentType.name}</strong>
          <Paragraph>{referenceFields.join(' • ')}</Paragraph>
        </section>

        <section>
          <TextLink onClick={() => onClickEdit(contentTypeId)} className={styles.link}>
            Edit
          </TextLink>
          <TextLink
            onClick={() => onClickDelete(contentTypeId)}
            className={styles.link}
            linkType="negative">
            Delete
          </TextLink>
        </section>
      </TableCell>
    </TableRow>
  );
}

function isReferenceFieldEnabled(referenceField, referenceFieldsMap) {
  return !!referenceFieldsMap[referenceField.id] || !hasFieldLinkValidations(referenceField);
}
