import React from 'react'
import PropTypes from 'prop-types'

import Projects from './Projects'
import ContentTypes from './ContentTypes'

function isActiveFullStackProject(project) {
  return project.status === 'active' && project.platform === 'custom'
}

export default class Config extends React.Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    allContentTypes: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      loadingContentTypes: true,
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

  async componentDidMount() {
    const allProjects = await this.props.client.getProjects()
    
    this.setState({ 
      allProjects,
      loadingContentTypes: false,
      loadingProjects: false
    })
  }

  onProjectChange = event => {
    this.setState({
      selectedProject: event.target.value
    })
  }

  onSelectContentType = contentType => {
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

  saveContentTypeDialog = () => {
    this.setState(state => {
      if (state.addedContentTypes.includes(state.selectedContentType)) {
        return
      }

      return {
        addedContentTypes: [...state.addedContentTypes, state.selectedContentType]
      }
    })

    this.setContentTypeDialogAsOpen(false)
  }

  setContentTypeDialogAsOpen = open => {
    this.setState({
      isContentTypeDialogOpen: open
    })
  }

  render() {
    if (this.state.loadingContentTypes || this.state.loadingProjects) {
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
          isContentTypeDialogOpen={this.state.isContentTypeDialogOpen}
          openContentTypeDialog={() => this.setContentTypeDialogAsOpen(true)}
          closeContentTypeDialog={() => this.setContentTypeDialogAsOpen(false)}
          selectedContentType={this.state.selectedContentType}
          saveContentTypeDialog={this.saveContentTypeDialog}
          onSelectContentType={this.onSelectContentType}
          onDeleteContentType={this.onDeleteContentType}
          onSelectReferenceField={this.onSelectReferenceField}
        />
      </>
    )
  }
}
