import * as React from 'react';
import { render } from 'react-dom';
import {
  Note,
  Paragraph,
  Spinner,
} from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { createUpload } from '@mux/upchunk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

import Player from './preview';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface AppProps {
  sdk: FieldExtensionSDK;
}

interface MuxContentfulObject {
  uploadId: string;
  assetId: string;
  playbackId: string;
  ready: boolean;
}

interface AppState {
  value?: MuxContentfulObject;
  uploadProgress?: number;
  error: string | false;
}

export class App extends React.Component<AppProps, AppState> {
  muxBaseReqOptions: {
    mode: 'cors' | 'no-cors';
    headers: Headers;
  };

  constructor(props: AppProps) {
    super(props);

    const { muxAccessTokenId, muxAccessTokenSecret } = this.props.sdk.parameters
      .installation as {
      muxAccessTokenId: string;
      muxAccessTokenSecret: string;
    };

    this.muxBaseReqOptions = {
      mode: 'cors',
      headers: this.requestHeaders(muxAccessTokenId, muxAccessTokenSecret),
    };

    this.state = {
      value: props.sdk.field.getValue(),
      error:
        (!muxAccessTokenId || !muxAccessTokenSecret) &&
        "It doesn't look like you've specified your Mux Access Token ID or Secret in the extension configuration.",
    };
  }

  detachExternalChangeHandler: Function | null = null;

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(
      this.onExternalChange
    );

    // Just in case someone left an asset in a bad place, we'll do some additional checks first just to see if
    // we can clean up.
    if (this.state.value) {
      if (this.state.value.ready) return;

      if (this.state.value.uploadId && !this.state.value.ready) {
        this.pollForUploadDetails();
      }
    }
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = (value: MuxContentfulObject) => {
    this.setState({ value });
  };

  requestHeaders = (tokenId: string, tokenSecret: string) => {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(`${tokenId}:${tokenSecret}`));
    headers.set('Content-Type', 'application/json');

    return headers;
  };

  getUploadUrl = async () => {
    const passthroughId = (this.props.sdk.entry.getSys() as { id: string }).id;

    const res = await fetch('https://api.mux.com/video/v1/uploads', {
      ...this.muxBaseReqOptions,
      body: JSON.stringify({
        cors_origin: window.location.origin,
        new_asset_settings: {
          passthrough: passthroughId,
          playback_policy: 'public',
        },
      }),
      method: 'POST',
    });

    if (res.status === 401) {
      throw Error(
        'Looks like something is wrong with the Mux Access Token specified in the config. Are you sure the token ID and secret in the extension settings match the access token you created?'
      );
    }

    const { data: muxUpload } = await res.json();

    await this.props.sdk.field.setValue({
      uploadId: muxUpload.id,
    });

    return muxUpload.url;
  };

  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files && e.currentTarget.files[0];
    this.setState({ uploadProgress: 1 });

    if (!file) {
      throw Error("Looks like a file wasn't selected");
    }

    try {
      const endpoint = await this.getUploadUrl();

      const upload = createUpload({
        file,
        endpoint,
        chunkSize: 5120, // Uploads the file in ~5mb chunks
      });

      upload.on('error', this.onUploadError);
      upload.on('progress', this.onUploadProgress);
      upload.on('success', this.onUploadSuccess);
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  onUploadError = (progress: CustomEvent) => {
    this.setState({ error: progress.detail });
  };

  onUploadProgress = (progress: CustomEvent) => {
    this.setState({ uploadProgress: progress.detail });
  };

  onUploadSuccess = (progress: CustomEvent) => {
    this.setState({ uploadProgress: 100 });
    this.pollForUploadDetails();
  };

  pollForUploadDetails = async () => {
    if (!this.state.value || !this.state.value.uploadId) {
      throw Error(
        'Something went wrong, because by this point we require an upload ID.'
      );
    }

    const res = await fetch(
      `https://api.mux.com/video/v1/uploads/${this.state.value.uploadId}`,
      {
        ...this.muxBaseReqOptions,
      }
    );

    const { data: muxUpload } = await res.json();

    if (muxUpload['asset_id']) {
      await this.props.sdk.field.setValue({
        uploadId: muxUpload.id,
        assetId: muxUpload['asset_id'],
      });
      this.pollForAssetDetails();
    } else {
      await delay(350);
      this.pollForUploadDetails();
    }
  };

  pollForAssetDetails = async () => {
    if (!this.state.value || !this.state.value.assetId) {
      throw Error(
        'Something went wrong, because by this point we require an upload ID.'
      );
    }

    const res = await fetch(
      `https://api.mux.com/video/v1/assets/${this.state.value.assetId}`,
      {
        ...this.muxBaseReqOptions,
      }
    );

    const { data: asset } = await res.json();

    await this.props.sdk.field.setValue({
      uploadId: this.state.value.uploadId,
      assetId: this.state.value.assetId,
      playbackId: asset['playback_ids'][0].id,
      ready: asset.status === 'ready',
    });

    if (asset.status !== 'ready') {
      await delay(500);
      this.pollForAssetDetails();
    }
  };

  render = () => {
    if (this.state.error) {
      return <Note noteType="negative">{this.state.error}</Note>;
    }

    if (this.state.value) {
      if (this.state.value.assetId && !this.state.value.ready) {
        return (
          <Paragraph>
            <Spinner size="small" /> Waiting for asset to be playable!
          </Paragraph>
        );
      }

      if (this.state.value.ready) {
        return <Player playbackId={this.state.value.playbackId} />;
      }
    }

    if (this.state.uploadProgress) {
      return (
        <div>
          <Paragraph>
            <Spinner size="small" />{' '}
            {this.state.uploadProgress < 100
              ? 'Uploading file to Mux...'
              : 'Upload complete! Waiting for created asset details...'}
          </Paragraph>
          <div
            className="progress"
            style={{ width: `${this.state.uploadProgress}%` }}
          />
        </div>
      );
    }

    return (
      <input type="file" className="cf-file-input" onChange={this.onChange} />
    );
  };
}

init(sdk => {
  render(
    <App sdk={sdk as FieldExtensionSDK} />,
    document.getElementById('root')
  );
});

// Enabling hot reload
if (module.hot) {
  module.hot.accept();
}
