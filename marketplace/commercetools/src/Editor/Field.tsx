import * as React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import get from 'lodash/get';
import { css } from 'emotion';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { ProductPreviews } from './ProductPreviews/ProductPreviews';
import { CategoryPreviews } from './CategoryPreviews/CategoryPreviews';
import { fetchProductPreviews } from '../api/fetchProductPreviews';
import { fetchCategoryPreviews } from '../api/fetchCategoryPreviews';
import logo from '../logo.svg';

interface Props {
  sdk: FieldExtensionSDK;
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

function makeCTAText(fieldType: string, pickerMode: 'category' | 'product') {
  const isArray = fieldType === 'Array';
  const beingSelected =
    pickerMode === 'category'
      ? isArray
        ? 'categories'
        : 'category'
      : isArray
      ? 'products'
      : 'product';
  return fieldType === 'Array' ? `Select ${beingSelected}` : `Select a ${beingSelected}`;
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

  getPickerMode = () => {
    const { sdk } = this.props;
    const contentTypeId = sdk.contentType.sys.id;
    const fieldId = sdk.field.id;
    const pickerMode = get(sdk, [
      'parameters',
      'installation',
      'fieldsConfig',
      contentTypeId,
      fieldId
    ]);

    // Product is the value expected by the CommerceTools picker widget
    // in order to do SKU picking.
    return pickerMode === 'category' ? 'category' : 'product';
  };

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
    const { sdk } = this.props;

    const skus = await sdk.dialogs.openCurrentApp({
      allowHeightOverflow: true,
      position: 'center',
      title: makeCTAText(sdk.field.type, this.getPickerMode()),
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      parameters: {
        ...sdk.parameters.installation,
        fieldValue: fieldValueToState(sdk.field.getValue()),
        fieldType: sdk.field.type,
        fieldId: sdk.field.id,
        pickerMode: this.getPickerMode()
      },
      width: 1400
    });
    const result = Array.isArray(skus) ? skus : [];

    if (result.length) {
      this.updateStateValue(result);
    }
  };

  render = () => {
    const { value: data, editingDisabled } = this.state;

    const isPickerTypeSetToCategory = this.getPickerMode() === 'category';
    const hasItems = data.length > 0;
    const config = this.props.sdk.parameters.installation;
    const fieldType = get(this.props, ['sdk', 'field', 'type'], '');

    return (
      <>
        {hasItems && (
          <div className={styles.sortable}>
            {isPickerTypeSetToCategory ? (
              <CategoryPreviews
                sdk={this.props.sdk}
                disabled={editingDisabled}
                categories={data}
                onChange={this.updateStateValue}
                config={config}
                fetchCategoryPreviews={categories => fetchCategoryPreviews(categories, config)}
              />
            ) : (
              <ProductPreviews
                sdk={this.props.sdk}
                disabled={editingDisabled}
                skus={data}
                onChange={this.updateStateValue}
                fetchProductPreviews={skus => fetchProductPreviews(skus, config)}
              />
            )}
          </div>
        )}
        <div className={styles.container}>
          <img src={(logo as unknown) as string} alt="Logo" className={styles.logo} />
          <Button
            icon="ShoppingCart"
            buttonType="muted"
            size="small"
            onClick={this.onDialogOpen}
            disabled={editingDisabled}>
            {makeCTAText(fieldType, this.getPickerMode())}
          </Button>
        </div>
      </>
    );
  };
}
