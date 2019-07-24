import React from 'react';
import PropTypes from 'prop-types';
import ReferenceForm, { hasReferenceFieldsLinkingToEntry } from './ReferenceForm.es6';
import constants from './constants.es6';
import { every } from 'lodash';
import { hasFieldLinkValidations, findFieldById } from './ReferenceField.es6';
import {
  Modal,
  Button,
  Paragraph,
  SelectField,
  Option
} from '@contentful/forma-36-react-components';

ContentTypeSelectionModal.propTypes = {
  addedContentTypes: PropTypes.array.isRequired,
  allContentTypes: PropTypes.array.isRequired,
  allReferenceFields: PropTypes.object.isRequired,
  isShown: PropTypes.bool.isRequired,
  selectedContentType: PropTypes.string.isRequired,
  onSelectContentType: PropTypes.func.isRequired,
  onSelectReferenceField: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default function ContentTypeSelectionModal({
  addedContentTypes,
  allContentTypes,
  allReferenceFields,
  isShown,
  selectedContentType,
  onSelectContentType,
  onSelectReferenceField,
  onCancel,
  onSave
}) {
  const notAddedYet = getContentTypesNotAddedYet(allContentTypes, addedContentTypes);

  // The default behavior is to display the first not added yet content type if no
  // content type has selected yet.
  if (!selectedContentType && notAddedYet.length > 0) {
    onSelectContentType(notAddedYet[0]);
    return null;
  }

  const editingMode = addedContentTypes.includes(selectedContentType);
  const allReferencesUnchecked = every(
    allReferenceFields[selectedContentType],
    (checked, fieldId) =>
      !checked &&
      hasFieldLinkValidations(
        findFieldById(fieldId, allContentTypes.find(ct => ct.sys.id === selectedContentType))
      )
  );

  return (
    <Modal
      size="large"
      isShown={isShown}
      onClose={onCancel}
      allowHeightOverflow={true}
      shouldCloseOnEscapePress={false}
      shouldCloseOnOverlayClick={false}>
      {() => (
        <React.Fragment>
          <Modal.Header
            title={editingMode ? 'Edit content type' : 'Add content type'}
            onClose={onCancel}
          />
          <Modal.Content>
            {editingMode ? null : (
              <Paragraph className="f36-margin-top--m f36-margin-bottom--m">
                Select the content type and the reference fields you want to enable for
                experimentation. You{"'"}ll be able to change this later.
              </Paragraph>
            )}
            <SelectField
              id="content-types"
              name="content-types"
              labelText="Content Type"
              selectProps={{ width: 'medium', isDisabled: editingMode }}
              onChange={e =>
                onSelectContentType(allContentTypes.find(ct => ct.sys.id === e.target.value))
              }
              value={selectedContentType || ''}
              required>
              {allContentTypes
                .filter(ct => editingMode || isContentTypeValidSelection(ct, addedContentTypes))
                .map(ct => (
                  <Option key={ct.sys.id} value={ct.sys.id}>
                    {ct.name}
                  </Option>
                ))}
            </SelectField>
            <ReferenceForm
              allContentTypes={allContentTypes}
              selectedContentType={selectedContentType}
              fields={allReferenceFields[selectedContentType]}
              onSelect={onSelectReferenceField}
            />
          </Modal.Content>
          <Modal.Controls>
            <Button buttonType="primary" onClick={onSave} disabled={allReferencesUnchecked}>
              Save
            </Button>
            <Button buttonType="muted" onClick={onCancel}>
              Cancel
            </Button>
          </Modal.Controls>
        </React.Fragment>
      )}
    </Modal>
  );
}

export function getContentTypesNotAddedYet(all, added) {
  return all.filter(ct => isContentTypeValidSelection(ct, added));
}

export function isContentTypeAlreadyAdded(contentType, addedContentTypes) {
  return addedContentTypes.includes(contentType.sys.id);
}

export function isContentTypeValidSelection(contentType, addedContentTypes) {
  return (
    contentType.sys.id !== constants.VARIATION_CONTAINER_CT_ID &&
    !isContentTypeAlreadyAdded(contentType, addedContentTypes) &&
    hasReferenceFieldsLinkingToEntry(contentType)
  );
}
