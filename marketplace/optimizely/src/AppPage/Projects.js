import React from 'react';
import PropTypes from 'prop-types';

import { Heading, Paragraph, SelectField, Option } from '@contentful/forma-36-react-components';

export default function Projects({ allProjects, selectedProject, onProjectChange }) {
  return (
    <div className="f36-margin-top--xl">
      <Heading>Optimizely Project</Heading>
      <Paragraph className="f36-margin-top--m">
        Works only with Optimizely Full Stack projects
      </Paragraph>
      <SelectField
        name="project"
        className="f36-margin-top--m"
        id="project"
        labelText="Project"
        required={true}
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
