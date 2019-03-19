import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Button, CheckboxField } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss'

import { ImageTaggingHelp } from './ImageTaggingHelp/ImageTaggingHelp'
import { isCompatibleTagField, isCompatibleImageField } from "./lib/content-type";
import { mergeTags, requestTags } from './lib/tags';

import './index.css';

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      overwriteTags: true,
    }
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
  }

  loadTags = async () => {
    const bail = (message) => {
      notifier.error(message);
      this.setState(state => ({
        ...state,
        loadingTags: false,
      }))
    };

    this.setState(state => ({
      ...state,
      loadingTags: true,
    }));

    const { sdk } = this.props;
    const { entry, space, notifier, parameters: { instance: { tagFieldId, imageFieldId } } } = sdk;

    const { overwriteTags } = this.state;

    if (!imageFieldId) {
      bail('Add an image field to the content type first');
      return
    }

    if (!tagFieldId) {
      bail('Add a text list field to the content type first');
      return
    }

    let imageUrl;
    try {
      const assetId = entry.fields[imageFieldId].getValue().sys.id;
      const asset = await space.getAsset(assetId);
      imageUrl = asset.fields.file['en-US'].url;

      if (!imageUrl) {
        bail('Add an image to the entry first');
        return
      }
    } catch (e) {
      bail('Add an image to the entry first');
      return
    }

    try {
      const newTags = await requestTags('https:' + imageUrl + '?w=1080');

      const tags = overwriteTags ? newTags : mergeTags(entry.fields[tagFieldId].getValue() || [], newTags);
      entry.fields[tagFieldId].setValue(tags);
      notifier.success('Tags added!')
    } catch (e) {
      bail('Failed to load tags for image')
    }

    this.setState(state => ({
      ...state,
      loadingTags: false,
    }))
  };

  onTagMergeChanged = (event) => {
    const overwriteTags = event.target.checked;

    this.setState((state) => ({
      ...state,
      overwriteTags,
    }))
  };

  render = () => {
    const { contentType, parameters } = this.props.sdk;
    const { loadingTags, overwriteTags } = (this.state || {});

    const hasImageField = isCompatibleImageField(contentType, parameters.instance.imageFieldId);
    const hasTagField = isCompatibleTagField(contentType, parameters.instance.tagFieldId);

    return (<div className='f36-color--text-light'>{
      hasImageField && hasTagField ?
        <div>
          <CheckboxField
            labelText='Overwrite existing tags'
            name='overwriteTags'
            checked={overwriteTags}
            labelIsLight={true}
            onChange={e => this.onTagMergeChanged(e)}
            id='overwriteTags'
            extraClassNames='config_overwrite_tags'
          />
          <Button
            buttonType='muted'
            isFullWidth={true}
            onClick={() => this.loadTags()}
            loading={loadingTags}
            disabled={loadingTags}
          >
            Auto-tag image
          </Button>
        </div> : <ImageTaggingHelp contentType={contentType} />
    }</div>);
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
