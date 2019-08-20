import React from 'react';
import ReactDOM from 'react-dom';
import { init } from 'contentful-ui-extensions-sdk';
import { ExtensionUI } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';
import relativeDate from "relative-date";

import Danger from '../assets/danger';
import { MdRefresh } from 'react-icons/md';

import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNotification: false,
      notificationText: ``,
      NotificationIcon: null,
      ago: null,
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
    clearInterval(this.updatedLast);
  };

  onError = error => {
    this.setState({ working: false });
    this.props.sdk.notifier.error(error.message);
  };

  updatedLast = () => {
    const { showNotification, NotificationIcon } = this.state;
    if (showNotification && !NotificationIcon) {
      const ago = relativeDate(new Date(this.props.sdk.entry.getSys().updatedAt))
      this.setState({
        ago: ago === `just now` ? `a few seconds ago` : ago
      })
    }
  }

  onSysChanged = () => {
    const { showNotification, NotificationIcon } = this.state;
    if (this.debounceInterval) {
      !showNotification && this.setState({ showNotification: true });
      NotificationIcon !== MdRefresh &&
        this.setState({
          notificationText: `Refreshing the preview...`,
          NotificationIcon: MdRefresh,
        });
      clearInterval(this.debounceInterval);
    }
    this.debounceInterval = setInterval(this.refreshGatsbyPreview, 1000);
    this.updatedLast = setInterval(this.updatedLast, 6000)
  };

  refreshGatsbyPreview = () => {
    const { NotificationIcon } = this.state;
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
      () =>
        NotificationIcon !== null &&
        this.setState({
          notificationText: `Preview updated `,
          NotificationIcon: null,
          ago: `a few seconds ago`
        }),
      () =>
      NotificationIcon !== Danger &&
        this.setState({
          notificationText: `Preview failed`,
          NotificationIcon: Danger,
        })
    );
  };

  render = () => {
    const {
      parameters: { installation },
      entry
    } = this.props.sdk;
    const { previewUrl, authToken } = installation;
    const { slug: contentSlug } = entry.fields;
    const { showNotification, notificationText, NotificationIcon, ago } = this.state;

    return (
      <div className="extension">
        <div className="flexcontainer">
          {showNotification && (
            <div className="notification-container">
            <span className="notification">
              {NotificationIcon && (
                <NotificationIcon className={NotificationIcon === MdRefresh ? `loading` : ``} />
              )}
              {notificationText}{!NotificationIcon && ago}
            </span>
            </div>
          )}
          <div className="gatsby-group">
          <ExtensionUI
            contentSlug={contentSlug && contentSlug.getValue()}
            previewUrl={previewUrl}
            authToken={authToken}
          />
          </div>
        </div>
      </div>
    );
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
