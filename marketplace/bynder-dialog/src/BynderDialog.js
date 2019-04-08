import React from 'react';
import PropTypes from 'prop-types';

const BYNDER_SDK_URL =
  'https://d8ejoa1fys2rk.cloudfront.net/modules/compactview/includes/js/client-1.4.0.min.js';

export default class Dialog extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.loadBynderScript();
    this.props.sdk.window.updateHeight();
    document.addEventListener('BynderAddMedia', e => {
      const results = Array.isArray(e.detail) ? e.detail : [];
      const assets = results.map(asset => ({
        id: asset.id,
        src: asset.thumbnails['webimage']
      }));
      this.props.sdk.close(assets);
    });
  }

  loadBynderScript = () => {
    const script = document.createElement('script');
    script.src = BYNDER_SDK_URL;
    script.async = true;
    document.body.appendChild(script);
  };

  render() {
    const { bynderURL } = this.props.sdk.parameters.invocation;

    return (
      <div className="dialog-container">
        <div
          id="bynder-compactview"
          data-assetTypes="image"
          data-autoload="true"
          data-button="Load media from bynder.com"
          data-collections="true"
          data-folder="bynder-compactview"
          data-fullScreen="true"
          data-header="false"
          data-language="en_US"
          data-mode="multi"
          data-zindex="300"
          data-defaultEnvironment={bynderURL}
        />
      </div>
    );
  }
}
