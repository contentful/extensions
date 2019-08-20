import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import tokens from '@contentful/forma-36-tokens';
import { Heading, Paragraph, SelectField, Option } from '@contentful/forma-36-react-components';

const styles = {
  section: css({
    marginTop: tokens.spacingM
  })
};

export default function Projects({ allProjects, selectedProject, onProjectChange }) {
  return (
    <div>
      <Heading>Optimizely Project</Heading>
      <Paragraph>Works only with Optimizely Full Stack projects.</Paragraph>
      <SelectField
        name="project"
        id="project"
        labelText="Project"
        required={true}
        className={styles.section}
        value={selectedProject ? selectedProject.toString() : ''}
        onChange={onProjectChange}
        selectProps={{ isDisabled: !allProjects }}
        width="large">
        <Option value="">Select Optimizely Project</Option>
        {!!allProjects.length &&
          allProjects.map(p => (
            <Option key={p.id} value={p.id.toString()}>
              {p.name}
            </Option>
          ))}
      </SelectField>
    </div>
  );
}

Projects.defaultProps = {
  allProjects: []
};

Projects.propTypes = {
  allProjects: PropTypes.array,
  selectedProject: PropTypes.string,
  onProjectChange: PropTypes.func.isRequired
};
