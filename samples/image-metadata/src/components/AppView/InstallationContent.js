import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Paragraph, TextField } from '@contentful/forma-36-react-components';
import { styles } from './styles';

export function InstallationContent({
  allContentTypesIds,
  contentTypeId,
  contentTypeName,
  setContentTypeName
}) {
  const validationMessage = allContentTypesIds.includes(contentTypeId)
    ? `A content type with ID "${contentTypeId}" already exists. Try a different name.`
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
          placeholder: 'e.g. Image Wrapper'
        }}
        helpText="You can use this content type to wrap images with focal point data"
        value={contentTypeName}
        onChange={setContentTypeName}
        id="content-type-name"
        validationMessage={validationMessage}
        required
      />
    </>
  );
}

InstallationContent.propTypes = {
  allContentTypesIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  contentTypeId: PropTypes.string.isRequired,
  contentTypeName: PropTypes.string.isRequired,
  setContentTypeName: PropTypes.func.isRequired
};
