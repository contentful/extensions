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
    allContentTypes: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      loadingProjects: true,
      addedContentTypes: [],
      allProjects: null,
      isContentTypeDialogOpen: false,
      isVariationContainerInstalled: false,
      selectedContentType: '',
      selectedProject: null,
      referenceFields: {}
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
    this.setState({
      selectedProject: event.target.value
    })
  }

  onSelectContentType = contentTypeId => {
    const contentType = this.props.allContentTypes.find(ct => ct.sys.id === contentTypeId)

    // In case null / undefined gets passed, just set the value and return.
    if (!contentType) {
      this.setState({ selectedContentType: contentType })
      return
    }

    this.setState(state => ({
      selectedContentType: contentType.sys.id,
      referenceFields: {
        ...state.referenceFields,
        [contentType.sys.id]:
          state.referenceFields[contentType.sys.id] ||
          this.createReferenceFieldMap(contentType.sys.id)
      }
    }))
  }

  createReferenceFieldMap = contentTypeId => {
    return getReferenceFieldsLinkingToEntry(
      this.props.allContentTypes.find(ct => ct.sys.id === contentTypeId)
    ).reduce((map, field) => {
      return {
        ...map,
        [field.id]: hasVariationContainerInFieldLinkValidations(field)
      };
    }, {});
  };

  onSelectReferenceField = ({ id, checked }) => {
    this.setState(state => ({
      referenceFields: {
        ...state.referenceFields,
        [state.selectedContentType]: {
          ...state.referenceFields[this.state.selectedContentType],
          [id]: checked
        }
      }
    }))
  }

  onDeleteContentType = async contentTypeId => {
    this.setState(state => ({
      addedContentTypes: state.addedContentTypes.filter(id => id !== contentTypeId)
    }))
  }

  onAddContentType = () => {
    this.setState(state => {
      if (state.addedContentTypes.includes(state.selectedContentType)) {
        return
      }

      return {
        addedContentTypes: [...state.addedContentTypes, state.selectedContentType]
      }
    })

    this.initializeSelectedContentType()
  }

  render() {
    if (this.state.loadingProjects) {
      return (<div>Loading ...</div>)
    }

    return (
      <>
        <Projects
          allProjects={this.state.allProjects}
          onProjectChange={this.onProjectChange}
          selectedProject={this.state.selectedProject}
        />
        <ContentTypes 
          addedContentTypes={this.state.addedContentTypes}
          allContentTypes={this.props.allContentTypes}
          allReferenceFields={this.state.referenceFields}
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
