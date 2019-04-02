import React from 'react';
import PropTypes from 'prop-types';
import { Button, CheckboxField } from '@contentful/forma-36-react-components';

import { mergeTags, requestTags } from '../lib/tags';

import './ImageTagging.css';

export class ImageTagging extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      overwriteTags: true,
    }
  }

  loadTags = async () => {
    const bail = (message) => {
      notifier.error(message);
      this.setState({
        loadingTags: false,
      })
    };

    this.setState({
      loadingTags: true,
    });

    const { sdk } = this.props;
    const { entry, space, notifier, parameters: { instance: { tagFieldId, imageFieldId } } } = sdk;

    const { overwriteTags } = this.state;
    const defaultLocale = sdk.locales.default;

    let imageUrl;
    try {
      const assetId = entry.fields[imageFieldId].getValue().sys.id;
      const asset = await space.getAsset(assetId);
      imageUrl = asset.fields.file[defaultLocale].url;

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

    this.setState({
      loadingTags: false,
    })
  };

  onTagMergeChanged = (event) => {
    const overwriteTags = event.target.checked;

    this.setState({
      overwriteTags,
    })
  };

  render() {
    const { loadingTags, overwriteTags } = (this.state || {});

    return (
      <div className='f36-color--text-light'>
        <CheckboxField
          labelText='Overwrite existing tags'
          name='overwriteTags'
          checked={overwriteTags}
          labelIsLight={true}
          onChange={this.onTagMergeChanged}
          id='overwriteTags'
          className='config_overwrite_tags'
        />
        <Button
          buttonType='muted'
          isFullWidth={true}
          onClick={this.loadTags}
          loading={loadingTags}
          disabled={loadingTags}
        >
          Auto-tag image
        </Button>
      </div>
    );
  };
}
