/** @jsx jsx */
import { jsx } from "@emotion/core"
import React from 'react';
import ReactDOM from 'react-dom';
import { init } from 'contentful-ui-extensions-sdk';
import { ExtensionUI } from "@gatsby-cloud-pkg/gatsby-cms-extension-base";
import { Textarea } from "gatsby-interface"

import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.detachFn = this.props.sdk.entry.onSysChanged(this.onSysChanged);
    console.log(this.props.sdk)
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
    console.log(`sys change`)
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    }
    this.debounceInterval = setInterval(this.refreshGatsbySite, 1000);
  };

  refreshGatsbySite = () => {
    console.log(this.props.sdk.notifier)
    const {
      parameters: { installation }
    } = this.props.sdk;

    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    }

    const { webhookUrl, authToken } = installation;

    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-preview-update-source': 'contentful-sidebar-extension',
        'x-preview-auth-token': authToken
      },
      body: JSON.stringify({})
    }).then(
      () => this.props.sdk.notifier.success('Gatsby site updated!'),
      () => this.props.sdk.notifier.error('Gatsby site failed :(')
    );
  };

  render = () => {
    const {
      parameters: { installation },
      entry
    } = this.props.sdk;
    const { previewUrl, authToken } = installation;
    const { slug: contentSlug } = entry.fields;
    console.log(`hey`)
    return (
      <div className="extension">
        <div className="flexcontainer">

          <ExtensionUI contentSlug={contentSlug && contentSlug.getValue()} siteUrl={previewUrl} authToken={authToken} />
        </div>
      </div>
    );
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
