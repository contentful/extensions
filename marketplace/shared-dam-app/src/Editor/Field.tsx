import * as React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { SortableComponent } from './SortableComponent';
import { ThumbnailFn, OpenDialogFn, DisabledPredicateFn, Hash } from '../interfaces';

interface Props {
  sdk: FieldExtensionSDK;
  cta: string;
  logo: string;
  makeThumbnail: ThumbnailFn;
  openDialog: OpenDialogFn;
  isDisabled: DisabledPredicateFn;
}

interface State {
  value: Hash[];
}

const styles = {
  sortable: css({
    marginBottom: tokens.spacingM
  }),
  container: css({
    display: 'flex'
  }),
  logo: css({
    display: 'block',
    width: '30px',
    height: '30px',
    marginRight: tokens.spacingM
  })
};

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
    const currentValue = this.state.value;
    const config = this.props.sdk.parameters.installation;
    const result = await this.props.openDialog(this.props.sdk, currentValue, config);

    if (result.length > 0) {
      const newValue = [...(this.state.value || []), ...result];

      await this.updateStateValue(newValue);
    }
  };

  render = () => {
    const currentValue = this.state.value;
    const hasItems = currentValue.length > 0;
    const config = this.props.sdk.parameters.installation;
    const isDisabled = this.props.isDisabled(currentValue, config);

    return (
      <>
        {hasItems && (
          <div className={styles.sortable}>
            <SortableComponent
              resources={this.state.value}
              onChange={this.updateStateValue}
              config={config}
              makeThumbnail={this.props.makeThumbnail}
            />
          </div>
        )}
        <div className={styles.container}>
          <img src={this.props.logo} alt="Logo" className={styles.logo} />
          <Button
            icon="Asset"
            buttonType="muted"
            size="small"
            onClick={this.onDialogOpen}
            disabled={isDisabled}>
            {this.props.cta}
          </Button>
        </div>
      </>
    );
  };
}
