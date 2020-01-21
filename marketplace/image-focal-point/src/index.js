import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Note } from '@contentful/forma-36-react-components';
import { init, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

import { AppView } from './components/AppView';
import { FocalPointView } from './components/FocalPointView';
import { FocalPointDialog } from './components/FocalPointDialog';
import { getField, isCompatibleImageField } from './utils';

const IMAGE_FIELD_ID = 'image';

export class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  detachExternalChangeHandler = null;

  constructor(props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue() || { focalPoint: null }
    };
  }

  componentDidMount() {
    const { sdk } = this.props;

    sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = sdk.field.onValueChanged(this.onExternalChange);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = value => {
    if (value) {
      this.setState({ value });
    }
  };

  onChange = e => {
    const value = e.currentTarget.value;
    this.setState({ value });
    if (value) {
      this.props.sdk.field.setValue(value);
    } else {
      this.props.sdk.field.removeValue();
    }
  };

  findProperLocale() {
    if (this.props.sdk.entry.fields[this.props.sdk.field.id].type === 'Link') {
      return this.props.sdk.locales.default;
    }

    return this.props.sdk.field.locale;
  }

  setFocalPoint = focalPoint => {
    this.setState(
      oldState => ({
        value: {
          ...oldState.value,
          focalPoint
        }
      }),
      () => this.props.sdk.field.setValue(this.state.value)
    );
  };

  showFocalPointDialog = async () => {
    const {
      sdk: { notifier, space, entry }
    } = this.props;

    try {
      const imageField = entry.fields[IMAGE_FIELD_ID];
      const asset = await space.getAsset(imageField.getValue().sys.id);
      const file = asset.fields.file[this.findProperLocale()];
      const imageUrl = file.url;
      const isOfImageMimeType = /image\/.*/.test(file.contentType);

      if (!isOfImageMimeType) {
        notifier.error('The uploaded asset must be an image');
        return;
      }

      if (!imageUrl) {
        notifier.error('Add an image to the entry first');
        return;
      }

      const focalPoint = await this.props.sdk.dialogs.openCurrentApp({
        width: 1000,
        parameters: {
          file,
          focalPoint: this.state.value.focalPoint
        }
      });

      if (focalPoint) {
        this.setFocalPoint(focalPoint);
      }
    } catch (e) {
      notifier.error('Add an image to the entry first');
      return;
    }
  };

  render() {
    const { sdk } = this.props;
    const imageField = getField(sdk.contentType, IMAGE_FIELD_ID);
    const isImageField = isCompatibleImageField(imageField);

    if (isImageField) {
      return (
        <FocalPointView
          showFocalPointDialog={this.showFocalPointDialog}
          focalPoint={this.state.value.focalPoint}
        />
      );
    }

    return (
      <Note noteType="negative">
        Could not find a field of type Asset with the ID &quot;{IMAGE_FIELD_ID}&quot;
      </Note>
    );
  }
}

function renderDialog(sdk) {
  const { invocation: otherProps } = sdk.parameters;
  const container = document.createElement('div');
  const CONTAINER_ID = 'focal-point-dialog';

  container.id = CONTAINER_ID;
  document.body.appendChild(container);

  sdk.window.startAutoResizer();

  ReactDOM.render(
    <FocalPointDialog
      sdk={sdk}
      onSave={data => sdk.close(data)}
      onClose={() => sdk.close()}
      {...otherProps}
    />,
    document.getElementById(CONTAINER_ID)
  );
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    renderDialog(sdk);
  } else if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    ReactDOM.render(<AppView sdk={sdk} />, document.getElementById('root'));
  } else {
    ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
  }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
if (module.hot) {
  module.hot.accept();
}
