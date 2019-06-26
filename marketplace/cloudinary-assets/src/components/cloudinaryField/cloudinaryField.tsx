import * as React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { ExtensionParameters, CloudinaryResponse, CloudinaryResource } from '../../interface';
import { SortableComponent } from '../sortable/sortable';
import extension from '../../../extension.json';

interface Props {
  sdk: FieldExtensionSDK;
}

interface State {
  value?: CloudinaryResource[];
  config: ExtensionParameters;
}

export class CloudinaryField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue() || [],
      config: props.sdk.parameters.instance as any
    };
  }

  detachExternalChangeHandler: Function | null = null;

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = (value: CloudinaryResource[]) => {
    this.setState({ value });
  };

  updateStateValue = (value: CloudinaryResource[]) => {
    this.setState({ value });
    this.props.sdk.field.setValue(value);
  };

  onCloudinaryDialogOpen = () => {
    let maxSelectableFiles = this.state.config.maxFiles;

    if (Array.isArray(this.state.value)) {
      maxSelectableFiles -= this.state.value.length;
    }

    this.props.sdk.dialogs
      .openExtension({
        id: extension.id,
        position: 'center',
        title: 'Select or Upload Media',
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEscapePress: true,
        parameters: { ...this.state.config, maxFiles: maxSelectableFiles },
        width: 1100
      })
      .then(this.handleCloudinaryData);
  };

  handleCloudinaryData = (data: CloudinaryResponse) => {
    const currentState = this.state.value || [];
    const newState = currentState.concat(data.assets);
    this.updateStateValue(newState);
  };

  render = () => {
    return (
      <React.Fragment>
        {this.state.value && this.state.value.length > 0 && (
          <SortableComponent
            resources={this.state.value}
            onChange={this.updateStateValue}
            config={this.state.config}
          />
        )}
        <div className="actions">
          <div className="logo" />
          <Button
            icon="Asset"
            buttonType="muted"
            size="small"
            onClick={this.onCloudinaryDialogOpen}
            disabled={this.state.value && this.state.value.length >= this.state.config.maxFiles}>
            {this.state.config.btnTxt}
          </Button>
        </div>
      </React.Fragment>
    );
  };
}
