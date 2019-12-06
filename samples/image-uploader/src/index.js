import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import '@contentful/forma-36-react-components/dist/styles.css';

import { Spinner } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import UploadView from './components/UploadView';
import ProgressView from './components/ProgressView';
import FileView from './components/FileView';
import {
  readFileAsUrl,
  findImageContentType,
  getImageUrlFromDataTransfer,
  getAssetIdFromDataTransfer,
  getBase64FromDataTransfer
} from './utils';

import './index.css';

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    isDraggingOver: false,
    value: this.props.sdk.field.getValue(this.findProperLocale())
  };

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);

    if (this.state.value) {
      this.props.sdk.space
        .getAsset(this.state.value.sys.id)
        .then(asset => this.setState({ asset }))
        .catch(() => this.unlinkAsset());
    }
  }

  componentWillUnmount() {
    this.detachExternalChangeHandler();
  }

  onDropFiles = event => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      imageUrl: undefined,
      base64Prefix: undefined,
      base64Data: undefined
    });

    // Read the file that was just selected
    const files = Array.prototype.slice.call(event.target.files || event.dataTransfer.files);

    if (files.length) {
      return this.createNewAssetFromFiles(files);
    }

    if (!event.dataTransfer) {
      return;
    }

    // Check if another asset was dragndropped.
    const assetId = getAssetIdFromDataTransfer(event.dataTransfer);
    if (assetId) {
      return this.reuseExistingAsset(assetId);
    }

    // Check if an image with base64 type was dragndropped
    const base64 = getBase64FromDataTransfer(event.dataTransfer);
    if (base64) {
      return this.createNewAssetFromBase64(base64.prefix, base64.data, {
        name: 'Unnamed',
        type: base64.type
      });
    }

    // Check if an image element was dragndropped
    const imageUrl = getImageUrlFromDataTransfer(event.dataTransfer);
    if (imageUrl) {
      return this.createNewAssetFromImageUrl(imageUrl);
    }
  };

  onChange = event => {
    const value = event.currentTarget.value;
    this.setState({ value });

    if (value) {
      this.props.sdk.field.setValue(value);
    } else {
      this.props.sdk.field.removeValue();
    }
  };

  onClickEdit = () => {
    this.props.sdk.navigator.openAsset(this.state.asset.sys.id, {
      slideIn: true
    });
  };

  onClickLinkExisting = async () => {
    const selectedAsset = await this.props.sdk.dialogs.selectSingleAsset({
      locale: this.props.sdk.field.locale
    });

    try {
      await this.setFieldLink(selectedAsset.sys.id);
    } catch (err) {
      this.onError(err);
    }
  };

  onClickRemove = () => {
    this.unlinkAsset();
  };

  onDragOverEnd = () => {
    this.setState({ isDraggingOver: false });
  };

  onDragOverStart = () => {
    this.setState({ isDraggingOver: true });
  };

  onError = error => {
    this.props.sdk.notifier.error(error.message);
  };

  onExternalChange = value => {
    this.setState({ value });
  };

  /*
     Create a new (unprocessed) asset entry for given upload and file.
     createAsset(upload: UploadEntity, file: File, locale: string): Promise<AssetEntity>
  */
  createAsset = (upload, file, locale) => {
    const asset = {
      fields: {
        title: {},
        description: {},
        file: {}
      }
    };

    asset.fields.title[locale] = file.name;
    asset.fields.description[locale] = file.name;
    asset.fields.file[locale] = {
      contentType: file.type,
      fileName: file.name,
      uploadFrom: {
        sys: {
          type: 'Link',
          linkType: 'Upload',
          id: upload.sys.id
        }
      }
    };

    return this.props.sdk.space.createAsset(asset);
  };

  createAssetWithImageUrl = (imageUrl, contentType, locale) => {
    const asset = {
      fields: {
        title: {},
        description: {},
        file: {}
      }
    };

    asset.fields.title[locale] = imageUrl;
    asset.fields.description[locale] = imageUrl;
    asset.fields.file[locale] = {
      contentType,
      fileName: imageUrl,
      upload: imageUrl
    };

    return this.props.sdk.space.createAsset(asset);
  };

  /*
    If customers prefers localization of references, always return default locale.
    If not, return current locale.
  */
  findProperLocale() {
    if (this.props.sdk.entry.fields[this.props.sdk.field.id].type === 'Link') {
      return this.props.sdk.locales.default;
    }

    return this.props.sdk.field.locale;
  }

  reuseExistingAsset = async assetId => {
    let asset;

    try {
      asset = await this.props.sdk.space.getAsset(assetId);
    } catch (err) {
      this.onError(err);
    }

    this.setState({
      asset
    });

    await this.props.sdk.field.setValue(
      {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: assetId
        }
      },
      this.findProperLocale()
    );
  };

  createNewAssetFromFiles = async files => {
    // Filter only images
    const imageFiles = files.filter(file => /^image\/[\w-_|\w+\w]+$/.test(file.type));

    // If no images were found, raise an error
    if (imageFiles.length === 0) {
      return this.onError(new Error('Only images are allowed'));
    }

    // Only one image at a time is supported. In the future, we can accept set of images per locale ?
    if (imageFiles.length > 1) {
      return this.onError(new Error('Please drop only one image at a time'));
    }

    const imageFile = imageFiles[0];

    this.setState({ file: imageFile });
    this.setUploadProgress(0);

    // Encode the file as Base64, so we can pass it through SDK proxy to get it uploaded
    const [base64Prefix, base64Data] = await readFileAsUrl(imageFile);
    this.createNewAssetFromBase64(base64Prefix, base64Data, imageFile);
  };

  /* `createNewAssetFromFile(file?: File): void` takes base64 data
     that contains the image and performs following tasks;

     * Upload the image via SDK
     * Create a raw asset object that links to the upload created
     * Send a request to start processing the asset
     * Wait until the asset is processed
     * Publish the asset
     */
  createNewAssetFromBase64 = async (base64Prefix, base64Data, file) => {
    this.setUploadProgress(10);
    this.setState({ base64Prefix, base64Data });

    // Upload the Base64 encoded image
    const upload = await this.props.sdk.space.createUpload(base64Data);
    this.setUploadProgress(40);

    // Some customers use different locale model than others, so we need to figure out what works for them best
    const locale = this.findProperLocale();

    // Create an unprocessed asset record that links to the upload record created above
    // It reads asset title and filenames from the HTML5 File object we're passing as second parameter
    const rawAsset = await this.createAsset(upload, file, locale);
    this.setUploadProgress(50);
    this.processAndPublishAsset(rawAsset, locale);
  };

  createNewAssetFromImageUrl = async imageUrl => {
    this.setUploadProgress(0);

    this.setState({
      imageUrl
    });

    // const contentType = await findImageContentType(imageUrl)
    const locale = this.findProperLocale();
    const rawAsset = await this.createAssetWithImageUrl(imageUrl, '', locale);

    this.setUploadProgress(25);
    this.processAndPublishAsset(rawAsset, locale);
  };

  /*
    - Send a request to start processing the asset
    - Wait until the asset is processed
    - Publish the asset
  */
  processAndPublishAsset = async (rawAsset, locale) => {
    // Send a request to start processing the asset. This will happen asynchronously.
    await this.props.sdk.space.processAsset(rawAsset, locale);

    this.setUploadProgress(55);

    // Wait until asset is processed.
    const processedAsset = await this.props.sdk.space.waitUntilAssetProcessed(
      rawAsset.sys.id,
      locale
    );
    this.setUploadProgress(85);

    // Publish the asset, ignore if it fails
    let publishedAsset;
    try {
      publishedAsset = await this.props.sdk.space.publishAsset(processedAsset);
    } catch (err) {}

    this.setUploadProgress(95);

    const asset = publishedAsset || processedAsset;
    this.setState({
      asset
    });

    // Set the value of the reference field as a link to the asset created above
    await this.props.sdk.field.setValue(
      {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: asset.sys.id
        }
      },
      locale
    );

    this.setUploadProgress(100);
  };

  unlinkAsset = () => {
    this.props.sdk.field.setValue(null, this.findProperLocale());
    this.setState({
      value: null,
      asset: null
    });
  };

  setFieldLink(assetId) {
    return this.props.sdk.field
      .setValue(
        {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: assetId
          }
        },
        this.findProperLocale()
      )
      .then(() =>
        this.props.sdk.space
          .getAsset(this.state.value.sys.id)
          .then(asset => this.setState({ asset }))
      );
  }

  setUploadProgress(percent) {
    this.setState({
      uploading: percent < 100,
      uploadProgress: percent
    });
  }

  render = () => {
    if (this.state.uploading) {
      return (
        <ProgressView
          imageUrl={this.state.imageUrl}
          base64Prefix={this.state.base64Prefix}
          base64Data={this.state.base64Data}
          uploadProgress={this.state.uploadProgress}
        />
      );
    } else if (!this.state.isDraggingOver && this.state.asset) {
      // Display existing asset if user is not dragging over an image
      return (
        <FileView
          file={this.state.asset.fields.file[this.findProperLocale()]}
          isPublished={
            this.state.asset.sys.version === (this.state.asset.sys.publishedVersion || 0) + 1
          }
          isDraggingOver={this.state.isDraggingOver}
          onDrop={this.onDropFiles}
          onDragOverStart={this.onDragOverStart}
          onDragOverEnd={this.onDragOverEnd}
          onClickEdit={this.onClickEdit}
          onClickRemove={this.onClickRemove}
        />
      );
    } else if (!this.state.isDraggingOver && this.state.value) {
      // If `asset` is not set but `value` is, the entry was just opened
      // and we're currently loading the asset value.
      return (
        <main className="spinner viewport centered">
          <Spinner />
        </main>
      );
    }

    return (
      <UploadView
        isDraggingOver={this.state.isDraggingOver}
        onDrop={this.onDropFiles}
        onDragOverStart={this.onDragOverStart}
        onDragOverEnd={this.onDragOverEnd}
        onClickLinkExisting={this.onClickLinkExisting}
      />
    );
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

if (module.hot) {
  module.hot.accept();
}
