import React from 'react';
import PropTypes from 'prop-types';
import { ExtensionUI } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';

export default class Sidebar extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.detachFn = props.sdk.entry.onSysChanged(this.onSysChanged);
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
  }

  componentWillUnmount() {
    this.detachFn();
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    }
  }

  onError = error => {
    this.props.sdk.notifier.error(error.message);
  };

  onSysChanged = () => {
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    }
    this.debounceInterval = setInterval(this.refreshGatsbyPreview, 1000);
  };

  refreshGatsbyPreview = () => {
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
      () => this.props.sdk.notifier.success('Gatsby Preview updated!'),
      () => this.props.sdk.notifier.error('Updating Gatsby Preview failed.')
    );
  };

  render = () => {
    const {
      parameters: { installation },
      entry
    } = this.props.sdk;
    const { previewUrl, authToken } = installation;
    const { slug: contentSlug } = entry.fields;
    return (
      <div className="extension">
        <div className="flexcontainer">
          <ExtensionUI
            contentSlug={contentSlug && contentSlug.getValue()}
            previewInstanceUrl={previewUrl}
            authToken={authToken}
          />
        </div>
      </div>
    );
  };
}
