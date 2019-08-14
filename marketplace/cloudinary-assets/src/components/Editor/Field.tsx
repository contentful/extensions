import * as React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { SortableComponent } from './SortableComponent';
import { ExtensionParameters } from '../AppConfig/parameters';

type Hash = Record<string, any>;

interface Props {
  sdk: FieldExtensionSDK;
  makeThumbnail: (resource: Hash, config: Hash) => (string | undefined)[];
  openDialog: (sdk: FieldExtensionSDK, currentValue: Hash[], config: Hash) => Promise<Hash[]>;
}

interface State {
  value: Hash[];
}

export default class Field extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const value = props.sdk.field.getValue();
    this.state = {
      value: Array.isArray(value) ? value : []
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

  onExternalChange = (value?: Hash[]) => {
    this.setState({ value: Array.isArray(value) ? value : [] });
  };

  updateStateValue = async (value: Hash[]) => {
    this.setState({ value });
    if (value.length > 0) {
      await this.props.sdk.field.setValue(value);
    } else {
      await this.props.sdk.field.removeValue();
    }
  };

  onDialogOpen = async () => {
    const config = this.props.sdk.parameters.installation as ExtensionParameters;

    const result = await this.props.openDialog(this.props.sdk, this.state.value, config);

    if (result.length > 0) {
      const newValue = [...(this.state.value || []), ...result];

      await this.updateStateValue(newValue);
    }
  };

  render = () => {
    const config = this.props.sdk.parameters.installation as ExtensionParameters;
    const hasItems = this.state.value.length > 0;
    const isDisabled = this.state.value.length >= config.maxFiles;

    return (
      <>
        {hasItems && (
          <SortableComponent
            resources={this.state.value}
            onChange={this.updateStateValue}
            config={config}
            makeThumbnail={this.props.makeThumbnail}
          />
        )}
        <div className="actions">
          <div className="logo" />
          <Button
            icon="Asset"
            buttonType="muted"
            size="small"
            onClick={this.onDialogOpen}
            disabled={isDisabled}>
            Select or upload a file
          </Button>
        </div>
      </>
    );
  };
}
