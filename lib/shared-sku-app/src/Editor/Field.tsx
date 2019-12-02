import * as React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import get from 'lodash/get';
import { css } from 'emotion';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { SortableComponent } from './SortableComponent';
import { ProductPreviewFn, OpenDialogFn, DisabledPredicateFn, MakeCTAFn } from '../interfaces';

interface Props {
  sdk: FieldExtensionSDK;
  makeCTA: MakeCTAFn;
  logo: string;
  fetchProductPreview: ProductPreviewFn;
  openDialog: OpenDialogFn;
  isDisabled: DisabledPredicateFn;
}

interface State {
  value: string[] | string;
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

function getEmptyValue(sdk: FieldExtensionSDK) {
  const isArray = sdk.field.type === 'Array';
  return isArray ? [] : '';
}

export default class Field extends React.Component<Props, State> {
  state = {
    value: this.props.sdk.field.getValue() || getEmptyValue(this.props.sdk),
    editingDisabled: false
  };

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handle external changes (e.g. when multiple authors are working on the same entry).
    this.props.sdk.field.onValueChanged((value?: string[] | string) => {
      this.setState({ value: value || getEmptyValue(this.props.sdk) });
    });

    // Disable editing (e.g. when field is not editable due to R&P).
    this.props.sdk.field.onIsDisabledChanged((editingDisabled: boolean) => {
      this.setState({ editingDisabled });
    });
  }

  updateStateValue = async (value: string[] | string) => {
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
    const isArray = this.props.sdk.field.type === 'Array';
    if (isArray) {
      const result = await this.props.openDialog(this.props.sdk, currentValue, {
        ...config,
        fieldValue: this.props.sdk.field.getValue(),
        fieldType: this.props.sdk.field.type
      });
      if (result.length) {
        await this.updateStateValue(result);
      }
    } else {
      const fieldValue = this.props.sdk.field.getValue();
      const result = await this.props.openDialog(this.props.sdk, currentValue, {
        ...config,
        fieldValue: fieldValue && [fieldValue],
        fieldType: this.props.sdk.field.type
      });
      const product = get(result, ['0'], null);
      if (product) {
        await this.updateStateValue(product);
      }
    }
  };

  render = () => {
    const { value, editingDisabled } = this.state;

    const hasItems = value.length > 0;
    const config = this.props.sdk.parameters.installation;
    const resources = (Array.isArray(value) ? value : [value]) as string[];
    const isDisabled = editingDisabled || this.props.isDisabled(resources as any, config);

    return (
      <>
        {hasItems && (
          <div className={styles.sortable}>
            <SortableComponent
              disabled={editingDisabled}
              resources={resources}
              onChange={this.updateStateValue}
              config={config}
              fetchProductPreview={this.props.fetchProductPreview}
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
