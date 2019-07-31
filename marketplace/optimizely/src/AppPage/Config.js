import React from 'react';
import PropTypes from 'prop-types';

import Projects from './Projects';
import ContentTypes from './ContentTypes';

export default class Config extends React.Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    allContentTypes: PropTypes.array.isRequired,
    config: PropTypes.object.isRequired,
    updateConfig: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      loadingProjects: true,
      allProjects: null
    };
  }

  async componentDidMount() {
    const allProjects = await this.props.client.getProjects();

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      allProjects,
      loadingProjects: false
    });

    this.initializeSelectedContentType();
  }

  onProjectChange = event => {
    this.props.updateConfig({
      optimizelyProjectId: event.target.value
    });
  };

  onDeleteContentType = contentTypeId => {
    const { contentTypes } = this.props.config;

    const newContentTypes = {
      ...contentTypes
    };

    delete newContentTypes[contentTypeId];

    this.props.updateConfig({
      contentTypes: newContentTypes
    });
  };

  onAddContentType = contentConfig => {
    const { contentTypes } = this.props.config;

    this.props.updateConfig({
      contentTypes: {
        ...contentTypes,
        ...contentConfig
      }
    });
  };

  render() {
    if (this.state.loadingProjects) {
      return <div>Loading ...</div>;
    }

    const { contentTypes } = this.props.config;
    const addedContentTypes = Object.keys(contentTypes);

    return (
      <>
        <Projects
          allProjects={this.state.allProjects}
          onProjectChange={this.onProjectChange}
          selectedProject={this.props.config.optimizelyProjectId}
        />
        <ContentTypes
          addedContentTypes={addedContentTypes}
          allContentTypes={this.props.allContentTypes}
          allReferenceFields={contentTypes}
          onAddContentType={this.onAddContentType}
          onDeleteContentType={this.onDeleteContentType}
        />
      </>
    );
  }
}
