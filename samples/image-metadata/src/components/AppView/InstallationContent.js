import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Paragraph, TextField } from '@contentful/forma-36-react-components';
import { styles } from './styles';

export function InstallationContent({ demoContentTypeName, setDemoContentTypeName }) {
  return (
    <>
      <Heading className={styles.heading}>Configuration</Heading>
      <Paragraph>
        To help you get started, we are going to create a demo content type for you. This wrapper
        content type will have a title field, an image field and a focal point field. You can later
        enrich this content type with new fields as needed, or use it as is.
      </Paragraph>
      <TextField
        className={styles.input}
        labelText="Demo content type name"
        name="demoContentTypeName"
        textInputProps={{
          placeholder: 'e.g. Image Wrapper'
        }}
        helpText="Provide a name for the content type to be created during the installation"
        value={demoContentTypeName}
        onChange={setDemoContentTypeName}
        id="demo-content-type-name"
        required
      />
    </>
  );
}

InstallationContent.propTypes = {
  demoContentTypeName: PropTypes.string.isRequired,
  setDemoContentTypeName: PropTypes.func.isRequired
};
