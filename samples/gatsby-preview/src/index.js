import React from 'react';
import ReactDOM from 'react-dom';
import { init } from 'contentful-ui-extensions-sdk';
import { ExtensionUI } from "@gatsby-cloud-pkg/gatsby-cms-extension-base";
import Notification from "./Notification"
import Danger from "../assets/danger"
import Warning from "../assets/warning"

import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNotification: false,
      notificationText: ``,
      notificationTone: `STANDARD`,
      notificationIcon: null,
    } 
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
    const { showNotification, notificationTone } = this.state
    if (this.debounceInterval) {
      !showNotification && this.setState({ showNotification: true })
      notificationTone !== `WARNING` && this.setState({ notificationText: `Refreshing the preview...`, notificationTone: `WARNING`, notificationIcon: Warning })
      clearInterval(this.debounceInterval);
    }
    this.debounceInterval = setInterval(this.refreshGatsbySite, 1000);
  };

  refreshGatsbySite = () => {
    const { notificationTone } = this.state
    const {
      parameters: { installation }
    } = this.props.sdk;

    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    }

    const date = new Date().toString();
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
      () => notificationTone !== `SUCCESS` && this.setState({ notificationText: `Preview updated on ${date}`, notificationTone: `SUCCESS`, notificationIcon: null }),
      () => notificationTone !== `DANGER` && this.setState({ notificationText: `Preview failed`, notificationTone: `DANGER`, notificationIcon: Danger })
    );
  };

  render = () => {
    const {
      parameters: { installation },
      entry
    } = this.props.sdk;
    const { previewUrl, authToken } = installation;
    const { slug: contentSlug } = entry.fields;
    const { showNotification, notificationText, notificationTone, notificationIcon } = this.state
    return (
      <div className="extension">
        <div className="flexcontainer">
          {showNotification && <Notification icon={notificationIcon} tone={notificationTone}>{notificationText}</Notification>}
          <ExtensionUI contentSlug={contentSlug && contentSlug.getValue()} siteUrl={previewUrl} authToken={authToken} />
        </div>
      </div>
    );
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
