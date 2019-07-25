import React from 'react'
import PropTypes from 'prop-types'

import Projects from './Projects'
import ContentTypes from './ContentTypes'

import { hasVariationContainerInFieldLinkValidations } from './ReferenceField'
import { getReferenceFieldsLinkingToEntry } from './ReferenceForm'

function isActiveFullStackProject(project) {
  return project.status === 'active' && project.platform === 'custom'
}

export default class Config extends React.Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    sdk: PropTypes.object.isRequired,
    allContentTypes: PropTypes.array.isRequired,
    config: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      loadingProjects: true,
      allProjects: null,
      isContentTypeDialogOpen: false,
      isVariationContainerInstalled: false,
      selectedContentType: '',
      selectedProject: null
    }
  }

  initializeSelectedContentType() {
    this.setState({
      selectedContentType: ''
    })
  }

  async componentDidMount() {
    const allProjects = await this.props.client.getProjects()

    this.setState({ 
      allProjects,
      loadingProjects: false
    })

    this.initializeSelectedContentType()
  }

  onProjectChange = event => {
    this.props.updateConfig({
      projectId: event.target.value
    })
  }

  onSelectContentType = contentTypeId => {
    this.setState({ selectedContentType: contentTypeId })
  }

  createReferenceFieldMap = contentType => {
    return getReferenceFieldsLinkingToEntry(
      contentType
    ).reduce((map, field) => {
      return {
        ...map,
        [field.id]: hasVariationContainerInFieldLinkValidations(field)
      };
    }, {});
  };

  onSelectReferenceField = ({ contentTypeId, fieldId, checked }) => {
    this.props.updateConfig({
      contentTypes: {
        ...this.props.config.contentTypes,
        [contentTypeId]: {
          ...this.props.config.contentTypes[contentTypeId],
          [fieldId]: checked
        }
      }
    })
  }

  onDeleteContentType = contentTypeId => {
    const { contentTypes } = this.props.config

    const newContentTypes = {
      ...contentTypes
    }

    delete newContentTypes[contentTypeId]

    this.props.updateConfig({
      contentTypes: newContentTypes
    })
  }

  onAddContentType = () => {
    const { contentTypes } = this.props.config
    const { selectedContentType } = this.state

    const contentType = this.props.allContentTypes.find(ct => ct.sys.id === selectedContentType)

    this.props.updateConfig({
      contentTypes: {
        ...contentTypes,
        [contentType.sys.id]: this.createReferenceFieldMap(
          contentType
        )
      }
    })

    this.initializeSelectedContentType()
  }

  render() {
    if (this.state.loadingProjects) {
      return (<div>Loading ...</div>)
    }

    const { contentTypes } = this.props.config
    const addedContentTypes = Object.keys(contentTypes)

    return (
      <>
        <Projects
          allProjects={this.state.allProjects}
          onProjectChange={this.onProjectChange}
          selectedProject={this.props.config.projectId}
        />
        <ContentTypes 
          addedContentTypes={addedContentTypes}
          allContentTypes={this.props.allContentTypes}
          allReferenceFields={contentTypes}
          selectedContentType={this.state.selectedContentType}
          onAddContentType={this.onAddContentType}
          onSelectContentType={this.onSelectContentType}
          onDeleteContentType={this.onDeleteContentType}
          onSelectReferenceField={this.onSelectReferenceField}
        />
      </>
    )
  }
}
