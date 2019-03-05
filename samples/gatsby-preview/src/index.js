import React from 'react';
import ReactDOM from 'react-dom';
import { Button, FieldGroup, RadioButtonField, Paragraph } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props)

    const { parameters } = this.props.sdk
    const { projectId } = parameters.installation
    const { contentTypeSlug, isAutoUpdate } = parameters.instance

    const entrySlug = this.props.sdk.entry.fields.slug
      ? "/" + this.props.sdk.entry.fields.slug.getValue()
      : ""

    this.state = {
      projectId,
      isAutoUpdate,
      previewUrl:
        "https://" +
        projectId +
        "-preview.gtsb.io/" +
        contentTypeSlug +
        entrySlug,
      /**
        Note: Gatsby doesn't support CORS hence the request needs to go through a proxy.
        When using this extension in your own setup, please replace this URL with a proxy you own.
      */
      webhookUrl:
        "https://backends.ctffns.net/gatsby-preview-proxy/" + projectId
    }
  }

  componentDidMount = () => {
    this.detachFn = this.props.sdk.entry.onSysChanged(this.onSysChanged)

    this.props.sdk.window.startAutoResizer()
  }

  componentWillUnmount = () => {
    this.detachFn()
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval)
    }
  }

  onError = error => {
    this.setState({ working: false })
    this.props.sdk.notifier.error(error.message)
  }

  onSysChanged = () => {
    if (!this.state.isAutoUpdate) {
      return
    }
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval)
    }
    this.debounceInterval = setInterval(this.refreshGatsbyPreview, 1000)
  }

  refreshGatsbyPreview = () => {
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval)
    }

    fetch(this.state.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then(
      () => this.props.sdk.notifier.success("Gatsby Preview updated!"),
      () => this.props.sdk.notifier.error("Gatsby Preview failed :(")
    )
  }

  openPreviewTab = () => {
    window.open(this.state.previewUrl)
  }
  onAutoUpdateChange = e => {
    this.setState({ isAutoUpdate: e.target.value === "yes" })
  }

  render = () => {
    return (
      <div className="extension">
        <div className="flexcontainer">
          <Button buttonType="positive" onClick={this.openPreviewTab} isFullWidth>
            Open preview
          </Button>

          <FieldGroup row={true}>
            <RadioButtonField
              labelText="Auto-update"
              disabled={false}
              checked={this.state.isAutoUpdate}
              value="yes"
              onChange={this.onAutoUpdateChange}
              labelIsLight
              name="autoUpdate"
            />
            <RadioButtonField
              labelText="Manual update"
              disabled={false}
              checked={!this.state.isAutoUpdate}
              name="someOption"
              value="no"
              onChange={this.onAutoUpdateChange}
              labelIsLight
              name="autoUpdate"
            />
          </FieldGroup>

          <Button
            isFullWidth
            size="small"
            buttonType="muted"
            onClick={this.refreshGatsbyPreview}
          >
            Update Preview
          </Button>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end"
            }}
          >
            <Paragraph
              extraClassNames=""
              element="p"
              style={{ marginRight: "5%" }}
            >
              Powered by:
            </Paragraph>


            <img
              src={require('./gatsby.svg')}
              className="gatsby-logo"
              alt="Gatsby"
            />
          </div>
        </div>
      </div>
    )
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById("root"))
});
