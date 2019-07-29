import * as React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { CloudinaryResource } from '../../cloudinaryInterfaces';
import { SortableComponent } from '../sortable/sortable';
import { ExtensionParameters } from '../cloudinaryAppConfig/parameters';

interface Props {
  sdk: FieldExtensionSDK;
}

interface State {
  value: CloudinaryResource[];
}

export default class CloudinaryField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue() || []
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

  onExternalChange = (value?: CloudinaryResource[]) => {
    if (value) {
      this.setState({ value });
    } else {
      this.setState({ value: [] });
    }
  };

  updateStateValue = async (value: CloudinaryResource[]) => {
    this.setState({ value });
    if (value.length > 0) {
      await this.props.sdk.field.setValue(value);
    } else {
      await this.props.sdk.field.removeValue();
    }
  };

  onCloudinaryDialogOpen = async () => {
    const config = this.props.sdk.parameters.installation as ExtensionParameters;

    let maxSelectableFiles = config.maxFiles;

    if (Array.isArray(this.state.value)) {
      maxSelectableFiles -= this.state.value.length;
    }

    const data = await this.props.sdk.dialogs.openExtension({
      position: 'center',
      title: 'Select or Upload Media',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      parameters: {
        ...config,
        maxFiles: maxSelectableFiles
      },
      width: 1400
    });

    const newValue = [...(this.state.value || []), ...data.assets];

    await this.updateStateValue(newValue);
  };

  render = () => {
    const config = this.props.sdk.parameters.installation as ExtensionParameters;
    const { maxFiles } = config;

    const hasItems = this.state.value.length > 0;
    const isDisabled = this.state.value.length >= maxFiles;

    return (
      <>
        {hasItems && (
          <SortableComponent
            resources={this.state.value}
            onChange={this.updateStateValue}
            config={config}
          />
        )}
        <div className="actions">
          <div className="logo" />
          <Button
            icon="Asset"
            buttonType="muted"
            size="small"
            onClick={this.onCloudinaryDialogOpen}
            disabled={isDisabled}>
            Select or upload a file on Cloudinary
          </Button>
        </div>
      </>
    );
  };
}
