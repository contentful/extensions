import React from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Paragraph
} from "@contentful/forma-36-react-components";
import { init } from "contentful-ui-extensions-sdk";
import "@contentful/forma-36-react-components/dist/styles.css";
import "./index.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    const { parameters } = this.props.sdk;
    const { webhookUrl, previewUrl } = parameters.installation;
    const { contentTypeSlug } = parameters.instance;

    let slug = contentTypeSlug ? contentTypeSlug : "";

    if (this.props.sdk.entry.fields.slug) {
      slug += "/" + this.props.sdk.entry.fields.slug.getValue();
    }

    this.state = {
      previewUrl: previewUrl + slug,
      webhookUrl
    };
  }

  componentDidMount = () => {
    this.detachFn = this.props.sdk.entry.onSysChanged(this.onSysChanged);

    this.props.sdk.window.startAutoResizer();
  };

  componentWillUnmount = () => {
    this.detachFn();
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    }
  };

  onError = error => {
    this.setState({ working: false });
    this.props.sdk.notifier.error(error.message);
  };

  onSysChanged = () => {
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    }
    this.debounceInterval = setInterval(this.refreshGatsbyPreview, 1000);
  };

  refreshGatsbyPreview = () => {
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    }

    fetch(this.state.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-preview-update-source": "contentful-sidebar-extension"
      },
      body: JSON.stringify({})
    }).then(
      () => this.props.sdk.notifier.success("Gatsby Preview updated!"),
      () => this.props.sdk.notifier.error("Gatsby Preview failed :(")
    );
  };

  openPreviewTab = () => {
    window.open(this.state.previewUrl);
  };

  render = () => {
    return (
      <div className="extension">
        <div className="flexcontainer">
          <Button
            buttonType="positive"
            onClick={this.openPreviewTab}
            isFullWidth
          >
            Open preview
          </Button>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Paragraph style={{ marginRight: "5%" }}>Powered by:</Paragraph>

            <img
              src={require("./gatsby.svg")}
              className="gatsby-logo"
              alt="Gatsby"
            />
          </div>
        </div>
      </div>
    );
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById("root"));
});