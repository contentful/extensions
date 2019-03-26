import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { init, locations } from 'contentful-ui-extensions-sdk';

import { ImageTaggingHelp } from './components/ImageTaggingHelp'
import { ImageTaggingLocationError } from './components/ImageTaggingLocationError';
import { isCompatibleTagField, isCompatibleImageField, getField } from './lib/content-type';

import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss'
import './index.css';
import { ImageTagging } from './components/ImageTagging';

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
  }

  render() {
    const { contentType, field, location, parameters: { instance: { imageFieldId, tagFieldId } } } = this.props.sdk;

    const hasImageField = isCompatibleImageField(getField(contentType, imageFieldId));
    const hasTagField = isCompatibleTagField(getField(contentType, tagFieldId));
    const isInCorrectLocation = location.is(locations.LOCATION_ENTRY_SIDEBAR);

    if (!isInCorrectLocation) {
      return <ImageTaggingLocationError contentType={contentType} configuredForField={field} />
    }

    if (!hasImageField || !hasTagField) {
      return <ImageTaggingHelp
        contentType={contentType}
        tagFieldId={tagFieldId}
        imageFieldId={imageFieldId}
      />
    }

    return <ImageTagging sdk={this.props.sdk}/>
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
