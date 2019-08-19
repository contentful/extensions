import React from 'react';
import PropTypes from 'prop-types';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { SkeletonContainer, SkeletonBodyText } from '@contentful/forma-36-react-components';

import Projects from './Projects';
import ContentTypes from './ContentTypes';

const styles = {
  section: css({
    margin: `${tokens.spacingXl} 0`,
    width: '100%'
  })
};

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

  onAddContentType = contentTypeConfig => {
    const { contentTypes } = this.props.config;

    this.props.updateConfig({
      contentTypes: {
        ...contentTypes,
        ...contentTypeConfig
      }
    });
  };

  renderLoader = () => (
    <div>
      <SkeletonContainer width="100%">
        <SkeletonBodyText numberOfLines={3} offsetTop={35} />
      </SkeletonContainer>
    </div>
  );

  render() {
    const { loadingProjects } = this.state;

    const { contentTypes } = this.props.config;
    const addedContentTypes = Object.keys(contentTypes);

    return (
      <>
        <div className={styles.section}>
          {loadingProjects ? (
            this.renderLoader()
          ) : (
            <Projects
              allProjects={this.state.allProjects}
              onProjectChange={this.onProjectChange}
              selectedProject={this.props.config.optimizelyProjectId}
            />
          )}
        </div>
        <div className={styles.section}>
          {loadingProjects ? (
            this.renderLoader()
          ) : (
            <ContentTypes
              addedContentTypes={addedContentTypes}
              allContentTypes={this.props.allContentTypes}
              allReferenceFields={contentTypes}
              onAddContentType={this.onAddContentType}
              onDeleteContentType={this.onDeleteContentType}
            />
          )}
        </div>
      </>
    );
  }
}
