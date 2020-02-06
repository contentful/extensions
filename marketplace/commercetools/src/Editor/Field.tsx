import * as React from 'react';
import { Button } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import get from 'lodash/get';
import { css } from 'emotion';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { SortableComponent } from './SortableComponent';
import { fetchProductPreviews } from '../api/fetchProductPreviews';
import * as logo from '../logo.svg';

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

function makeCTAText(fieldType: string) {
  return fieldType === 'Array' ? 'Select products' : 'Select a product';
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
    const { sdk } = this.props;

    const skus = await sdk.dialogs.openCurrentApp({
      allowHeightOverflow: true,
      position: 'center',
      title: makeCTAText(sdk.field.type),
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      parameters: {
        ...sdk.parameters.installation,
        fieldValue: fieldValueToState(sdk.field.getValue()),
        fieldType: sdk.field.type
      },
      width: 1400
    });
    const result = Array.isArray(skus) ? skus : [];

    if (result.length) {
      this.updateStateValue(result);
    }
  };

  render = () => {
    const { value: selectedSKUs, editingDisabled } = this.state;

    const hasItems = selectedSKUs.length > 0;
    const config = this.props.sdk.parameters.installation;
    const fieldType = get(this.props, ['sdk', 'field', 'type'], '');

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
              fetchProductPreviews={fetchProductPreviews}
            />
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
            {makeCTAText(fieldType)}
          </Button>
        </div>
      </>
    );
  };
}
