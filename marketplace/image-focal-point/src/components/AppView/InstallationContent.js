import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Paragraph, TextField } from '@contentful/forma-36-react-components';
import { styles } from './styles';

export function InstallationContent({
  allContentTypesIds,
  contentTypeId,
  contentTypeName,
  onContentTypeNameChange,
  onContentTypeIdChange
}) {
  const validationMessageName = allContentTypesIds.includes(contentTypeId)
    ? `A content type with ID "${contentTypeId}" already exists. Try a different name.`
    : null;

  const validationMessageId = allContentTypesIds.includes(contentTypeId)
    ? `A content type with ID "${contentTypeId}" already exists. Try a different ID.`
    : null;

  return (
    <>
      <Heading className={styles.heading}>Configuration</Heading>
      <Paragraph>
        To help you get started, we are going to create a content type for you with a title field,
        an image field and a focal point field.
      </Paragraph>
      <TextField
        className={styles.input}
        labelText="Content type name"
        name="contentTypeName"
        textInputProps={{
          placeholder: 'e.g. Image with Focal Point',
          testId: 'content-type-name-input'
        }}
        helpText="You can use this content type to wrap images with focal point data"
        value={contentTypeName}
        onChange={onContentTypeNameChange}
        testId="content-type-name"
        id="content-type-name"
        validationMessage={validationMessageName}
        required
      />
      <TextField
        className={styles.input}
        labelText="Content type ID"
        name="contentTypeId"
        helpText="The ID is generated from the name, you can also set it manually"
        value={contentTypeId}
        onChange={onContentTypeIdChange}
        id="content-type-id"
        testId="content-type-id"
        textInputProps={{ testId: 'content-type-id-input' }}
        validationMessage={validationMessageId}
        required
      />
    </>
  );
}

InstallationContent.propTypes = {
  allContentTypesIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  contentTypeId: PropTypes.string.isRequired,
  contentTypeName: PropTypes.string.isRequired,
  onContentTypeNameChange: PropTypes.func.isRequired,
  onContentTypeIdChange: PropTypes.func.isRequired
};
