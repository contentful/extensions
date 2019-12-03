import * as React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { SortableComponent } from './SortableComponent';
import { ProductPreviewsFn, OpenDialogFn, DisabledPredicateFn, MakeCTAFn } from '../interfaces';

interface Props {
  sdk: FieldExtensionSDK;
  makeCTA: MakeCTAFn;
  logo: string;
  fetchProductPreviews: ProductPreviewsFn;
  openDialog: OpenDialogFn;
  isDisabled: DisabledPredicateFn;
}

interface State {
  value: string[];
  editingDisabled: boolean;
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

function fieldValueToState(value?: string | string[]): string[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export default class Field extends React.Component<Props, State> {
  state = {
    value: fieldValueToState(this.props.sdk.field.getValue()),
    editingDisabled: true
  };

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handle external changes (e.g. when multiple authors are working on the same entry).
    this.props.sdk.field.onValueChanged((value?: string[] | string) => {
      this.setState({ value: fieldValueToState(value) });
    });

    // Disable editing (e.g. when field is not editable due to R&P).
    this.props.sdk.field.onIsDisabledChanged((editingDisabled: boolean) => {
      this.setState({ editingDisabled });
    });
  }

  updateStateValue = (skus: string[]) => {
    this.setState({ value: skus });

    if (skus.length > 0) {
      const value = this.props.sdk.field.type === 'Array' ? skus : skus[0];
      this.props.sdk.field.setValue(value);
    } else {
      this.props.sdk.field.removeValue();
    }
  };

  onDialogOpen = async () => {
    const currentValue = this.state.value;
    const config = this.props.sdk.parameters.installation;
    const result = await this.props.openDialog(this.props.sdk, currentValue, {
      ...config,
      fieldValue: fieldValueToState(this.props.sdk.field.getValue()),
      fieldType: this.props.sdk.field.type
    });
    if (result.length) {
      this.updateStateValue(result);
    }
  };

  render = () => {
    const { value: selectedSKUs, editingDisabled } = this.state;

    const hasItems = selectedSKUs.length > 0;
    const config = this.props.sdk.parameters.installation;
    const isDisabled = editingDisabled || this.props.isDisabled(selectedSKUs, config);

    return (
      <>
        {hasItems && (
          <div className={styles.sortable}>
            <SortableComponent
              sdk={this.props.sdk}
              disabled={editingDisabled}
              skus={selectedSKUs}
              onChange={this.updateStateValue}
              config={config}
              fetchProductPreviews={this.props.fetchProductPreviews}
            />
          </div>
        )}
        <div className={styles.container}>
          <img src={this.props.logo} alt="Logo" className={styles.logo} />
          <Button
            icon="ShoppingCart"
            buttonType="muted"
            size="small"
            onClick={this.onDialogOpen}
            disabled={isDisabled}>
            {this.props.makeCTA(this.props.sdk.field.type)}
          </Button>
        </div>
      </>
    );
  };
}
