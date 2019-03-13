import React from "react"
import PropTypes from "prop-types"
import ReactDOM from "react-dom"
import "@contentful/forma-36-react-components/dist/styles.css"
import { init } from "contentful-ui-extensions-sdk"
import {
  SectionHeading,
  Subheading,
  Heading,
  Icon,
  Button,
  Illustration,
  Paragraph,
  Spinner
} from "@contentful/forma-36-react-components"

import UploadView from "./components/UploadView"
import ProgressView from "./components/ProgressView"
import FileView from "./components/FileView"
import Dropzone from "./components/Dropzone"
import { readFileAsURL, trimFilename } from "./utils"
import { ASSET_PROCESSING_POLL_MS, MAX_ASSET_TITLE_LEN } from "./config"

import "./index.css"

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  }

  dropzoneEl = React.createRef()
  state = {
    isDraggingOver: false,
    value: this.props.sdk.field.getValue()
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer()

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(
      this.onExternalChange
    )

    if (this.state.value) {
      this.props.sdk.space
        .getAsset(this.state.value.sys.id)
        .then(asset => this.setState({ asset }))
        .catch(this.onError)
    }
  }

  componentWillUnmount() {
    this.detachExternalChangeHandler()
  }

  onDropFiles = event => {
    event.preventDefault()
    event.stopPropagation()

    // Read the file that was just selected
    const file = Array.prototype.slice.call(
      event.target.files || event.dataTransfer.files
    )[0]

    try {
      this.uploadNewAssetForImageWrapper(file)
    } catch (err) {
      this.onError(err)
    }
  }

  onChange = event => {
    const value = event.currentTarget.value
    this.setState({ value })

    if (value) {
      this.props.sdk.field.setValue(value)
    } else {
      this.props.sdk.field.removeValue()
    }
  }

  onClickEdit = () => {
    this.props.sdk.navigator.openAsset(this.state.asset.sys.id, {
      slideIn: true
    })
  }

  onClickRemove = () => {
    this.props.sdk.field.setValue(null)
    this.setState({
      value: null,
      asset: null
    })
  }

  onDragOverEnd = () => {
    this.setState({ isDraggingOver: false })
  }

  onDragOverStart = () => {
    this.setState({ isDraggingOver: true })
  }

  onError = error => {
    this.props.sdk.notifier.error(error.message)
  }

  onExternalChange = value => {
    this.setState({ value })
  }

  /*
     Create a new (unprocessed) asset entry for given upload and file.

     createAsset(upload: UploadEntity, file: File): Promise<AssetEntity>
  */
  createAsset = (upload, file) => {
    return this.props.sdk.space.createAsset({
      fields: {
        title: {
          "en-US": trimFilename(file.name, MAX_ASSET_TITLE_LEN)
        },
        description: {
          "en-US": ""
        },
        file: {
          "en-US": {
            contentType: file.type,
            fileName: file.name,
            uploadFrom: {
              sys: {
                type: "Link",
                linkType: "Upload",
                id: upload.sys.id
              }
            }
          }
        }
      }
    })
  }

  /* `uploadNewAssetForImageWrapper(file: File): void` takes an HTML5 File object
     that contains the image user selected and performs following tasks;

      * Encode file as a base64 url
      * Upload the image via SDK
      * Create a raw asset object that links to the upload created
      * Send a request to start processing the asset
      * Wait until the asset is processed
      * Publish the asset
  */
  uploadNewAssetForImageWrapper = async file => {
    this.setUploadProgress(0)
    this.setState({ file })

    // Encode the file as Base64, so we can pass it through SDK proxy to get it uploaded
    const [base64Prefix, base64Data] = await readFileAsURL(file)
    this.setState({ base64Prefix, base64Data })
    this.setUploadProgress(10)

    // Upload the Base64 encoded image
    const upload = await this.props.sdk.space.createUpload(base64Data)
    this.setUploadProgress(40)

    // Create an unprocessed asset record that links to the upload record created above
    // It reads asset title and filenames from the HTML5 File object we're passing as second parameter
    const rawAsset = await this.createAsset(upload, file)
    this.setUploadProgress(50)

    // Send a request to start processing the asset. This will happen asynchronously.
    await this.props.sdk.space.processAsset(
      rawAsset,
      this.props.sdk.field.locale
    )

    this.setUploadProgress(55)

    // Wait until asset is processed.
    const processedAsset = await this.props.sdk.space.waitUntilAssetProcessed(
      rawAsset.sys.id,
      this.props.sdk.field.locale
    )
    this.setUploadProgress(85)

    this.setState({
      asset: processedAsset
    })

    // Publish the asset
    await this.props.sdk.space.publishAsset(processedAsset)
    this.setUploadProgress(95)

    // Set the value of the reference field as a link to the asset created above
    await this.props.sdk.field.setValue({
      sys: {
        type: "Link",
        linkType: "Asset",
        id: processedAsset.sys.id
      }
    })

    this.setUploadProgress(100)
  }

  setUploadProgress(percent) {
    this.setState({
      uploading: percent < 100,
      uploadProgress: percent
    })
  }

  render = () => {
    if (this.state.uploading) {
      return (
        <ProgressView
          base64Prefix={this.state.base64Prefix}
          base64Data={this.state.base64Data}
          uploadProgress={this.state.uploadProgress}
        />
      )
    } else if (!this.state.isDraggingOver && this.state.asset) {
      // Display existing asset if user is not dragging over an image
      return (
        <FileView
          file={this.state.asset.fields.file[this.props.sdk.field.locale]}
          isDraggingOver={this.state.isDraggingOver}
          onDrop={this.onDropFiles}
          onDragOverStart={this.onDragOverStart}
          onDragOverEnd={this.onDragOverEnd}
          onClickEdit={this.onClickEdit}
          onClickRemove={this.onClickRemove}
        />
      )
    } else if (!this.state.isDraggingOver && this.state.value) {
      // If `asset` is not set but `value` is, the entry was just opened
      // and we're currently loading the asset value.
      return (
        <main className="spinner viewport centered">
          <Spinner />
        </main>
      )
    }

    return (
      <UploadView
        isDraggingOver={this.state.isDraggingOver}
        onDrop={this.onDropFiles}
        onDragOverStart={this.onDragOverStart}
        onDragOverEnd={this.onDragOverEnd}
      />
    )
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById("root"))
})

if (module.hot) {
  module.hot.accept()
}
