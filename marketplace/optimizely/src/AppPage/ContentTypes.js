import React, { useState } from 'react';
import PropTypes from 'prop-types';
import tokens from '@contentful/forma-36-tokens';
import { VARIATION_CONTAINER_ID } from './constants';
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
  Option,
  Modal
} from '@contentful/forma-36-react-components';
import { getContentTypesNotAddedYet } from './ContentTypeHelpers';
import ReferenceField, { hasFieldLinkValidations } from './ReferenceField';
import RefToolTip from './RefToolTip';

const styles = {
  table: css({
    marginTop: tokens.spacingS
  }),
  link: css({
    marginRight: tokens.spacingS
  }),
  description: css({
    marginBottom: '1rem'
  }),
  contentTypeRow: css({
    gridTemplateColumns: 'auto 6rem'
  })
};

ContentTypes.propTypes = {
  addedContentTypes: PropTypes.array.isRequired,
  allContentTypes: PropTypes.array.isRequired,
  allReferenceFields: PropTypes.object.isRequired,
  onAddContentType: PropTypes.func.isRequired,
  onDeleteContentType: PropTypes.func.isRequired
};

export function isContentTypeValidSelection(contentType) {
  return (
    contentType.sys.id !== VARIATION_CONTAINER_ID && hasReferenceFieldsLinkingToEntry(contentType)
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
  onDeleteContentType
}) {
  const addableContentTypes = allContentTypes.filter(ct =>
    isContentTypeValidSelection(ct, addedContentTypes)
  );

  const [selectedContentType, onSelectContentType] = useState('');
  const [selectedReferenceFields, selectRef] = useState({});
  const [modalOpen, toggleModal] = useState(false);

  const allContentTypesAdded =
    getContentTypesNotAddedYet(allContentTypes, addedContentTypes).length === 0;

  const contentType = allContentTypes.find(ct => ct.sys.id === selectedContentType);
  let referenceFields = [];
  let checkedFields = {};

  if (contentType) {
    referenceFields = contentType.fields
      .filter(
        field =>
          field.linkType === 'Entry' || (field.type === 'Array' && field.items.linkType === 'Entry')
      )
      .map(ref => ref.id);

    checkedFields = referenceFields.reduce((acc, id) => {
      const checkedReferences = {
        ...allReferenceFields[selectedContentType],
        ...selectedReferenceFields
      };

      if (checkedReferences) {
        return { ...acc, [id]: checkedReferences[id] || false };
      }

      return { ...acc, [id]: false };
    }, {});
  }

  const onSelectReferenceField = fields => {
    selectRef({ ...selectedReferenceFields, ...fields });
  };

  const closeModal = () => {
    // reset state
    onSelectReferenceField({});
    onSelectContentType('');
    toggleModal(false);
  };

  const addContentTypeCloseModal = () => {
    const update = { ...allReferenceFields[selectedContentType], ...selectedReferenceFields };

    onAddContentType({ [selectedContentType]: update });
    closeModal();
  };

  const onEdit = ctId => {
    onSelectContentType(ctId);
    toggleModal(true);
  };

  return (
    <div className="f36-margin-top--xl">
      <Heading>Content Types</Heading>
      <Paragraph className="f36-margin-top--m">
        Select the content types for which you want to enable A/B testing.
      </Paragraph>
      <Button
        buttonType="muted"
        className="f36-margin-top--m"
        onClick={() => toggleModal(true)}
        disabled={allContentTypesAdded}>
        Add content type
      </Button>
      <Modal title="Add content type" isShown={modalOpen} onClose={closeModal}>
        {({ title, onClose }) => (
          <React.Fragment>
            <Modal.Header title={title} onClose={onClose} />
            <Modal.Content>
              <Paragraph className={styles.description}>
                Select the content type and the reference fields you want to enable for
                experimentation. You&rsquo;ll be able to change this later.
              </Paragraph>
              <SelectField
                id="content-types"
                name="content-types"
                labelText="Content Type"
                selectProps={{ width: 'medium', isDisabled: allContentTypesAdded }}
                onChange={e => onSelectContentType(e.target.value)}
                value={selectedContentType || ''}
                required>
                <Option value="" disabled>
                  Select content type
                </Option>
                {addableContentTypes.map(ct => (
                  <Option key={ct.sys.id} value={ct.sys.id}>
                    {ct.name}
                  </Option>
                ))}
              </SelectField>
              {referenceFields.map(field => (
                <ReferenceField
                  key={field}
                  contentType={contentType}
                  id={field}
                  checked={checkedFields[field] || selectedReferenceFields[field]}
                  onSelect={checked => onSelectReferenceField({ [field]: checked })}
                />
              ))}
            </Modal.Content>
            <Modal.Controls>
              <Button onClick={addContentTypeCloseModal} buttonType="positive">
                Save
              </Button>
              <Button onClick={onClose} buttonType="muted">
                Close
              </Button>
            </Modal.Controls>
          </React.Fragment>
        )}
      </Modal>
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
                onEdit={onEdit}
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
  onEdit: PropTypes.func.isRequired
};

function ContentTypeRow({
  contentTypeId,
  allContentTypes,
  allReferenceFields,
  onClickDelete,
  onEdit
}) {
  const contentType = allContentTypes.find(ct => ct.sys.id === contentTypeId);
  const referenceFields = allReferenceFields[contentTypeId];
  const referenceFieldIds = Object.keys(referenceFields);
  const referencesToShow = referenceFieldIds.filter(id => referenceFields[id]);

  if (!referencesToShow.length) {
    return null;
  }

  return (
    <TableRow>
      <TableCell className={styles.contentTypeRow}>
        <strong>{contentType.name}</strong>
      </TableCell>
      <TableCell className={styles.contentTypeRow}>
        {referencesToShow.map(id => {
          const field = contentType.fields.find(f => f.id === id) || {};
          const disabled = !hasFieldLinkValidations(field);

          return (
            <div key={id}>
              {field.name} {disabled && <RefToolTip />}
            </div>
          );
        })}
      </TableCell>
      <TableCell className={styles.contentTypeRow}>
        <TextLink onClick={() => onEdit(contentTypeId)} className={styles.link}>
          Edit
        </TextLink>
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
