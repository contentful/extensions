import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {
  Button, SelectField, Option, Paragraph, FieldGroup, CheckboxField
} from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss'

import { ImageTaggingHelp } from './ImageTaggingHelp/ImageTaggingHelp'
import { getAssetFields, findImageField, findTagsField, getTagFields } from "./lib/content-type";
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
      tagField: null,
      imageField: null,
    }
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    this.setState(state => ({
      ...state,
      tagField: findTagsField(this.props.sdk.contentType),
      imageField: findImageField(this.props.sdk.contentType)
    }))
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
    const { entry, space, notifier } = sdk;

    const { imageField, tagField, overwriteTags } = this.state;

    if (!imageField) {
      bail('Add an image field to the content type first');
      return
    }

    if (!tagField) {
      bail('Add a text list field to the content type first');
      return
    }

    let imageUrl;
    try {
      const assetId = entry.fields[imageField].getValue().sys.id;
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

      const tags = overwriteTags ? newTags : mergeTags(entry.fields[tagField].getValue() || [], newTags);
      entry.fields[tagField].setValue(tags);
      notifier.success('Tags added!')
    } catch (e) {
      bail('Failed to load tags for image')
    }

    this.setState(state => ({
      ...state,
      loadingTags: false,
    }))
  };

  onFieldSelect = (fieldType, event) => {
    const fieldId = event.target.value;

    this.setState((state) => ({
      ...state,
      [fieldType]: fieldId,
    }))
  };

  onTagMergeChanged = (event) => {
    const overwriteTags = event.target.checked;

    this.setState((state) => ({
      ...state,
      overwriteTags,
    }))
  };

  fieldToSelectOption = (field) => <Option key={field.id} value={field.id}>{field.name}</Option>;

  renderFieldSelector = (contentType, imageFields, tagFields) => {
    return (
      <div className='config_field_group'>
        <FieldGroup>
          <SelectField
            labelText='Image field'
            defaultValue={findImageField(contentType)}
            id='imageFieldSelect'
            name='imageFieldSelect'
            onChange={(event) => this.onFieldSelect('imageField', event)}
            width='full'
          >
            {
              imageFields.map(this.fieldToSelectOption)
            }
          </SelectField>
          <SelectField
            labelText='Tags field'
            defaultValue={findTagsField(contentType)}
            id='tagsFieldSelect'
            name='tagsFieldSelect'
            onChange={(event) => this.onFieldSelect('tagField', event)}
            width='full'
          >
            {
              tagFields.map(this.fieldToSelectOption)
            }
          </SelectField>
        </FieldGroup>
      </div>
    )
  };

  render = () => {
    const { contentType } = this.props.sdk;
    const imageFields = getAssetFields(contentType);
    const tagFields = getTagFields(contentType);
    const { loadingTags, overwriteTags } = (this.state || {});

    const hasTagField = tagFields.length > 0;
    const hasImageField = imageFields.length > 0;

    return (<div className='f36-color--text-light'>{
      hasImageField && hasTagField ?
        <div>
          {imageFields.length > 1 || tagFields.length > 1 ?
            this.renderFieldSelector(contentType, imageFields, tagFields) : ''}
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
        </div> : <ImageTaggingHelp contentType={contentType} hasImageField={hasImageField} hasTagField={hasTagField}/>
    }</div>);
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
