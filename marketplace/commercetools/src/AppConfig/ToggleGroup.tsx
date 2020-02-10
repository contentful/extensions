import React from 'react';
import { ToggleButton } from '@contentful/forma-36-react-components';
import { PickerMode } from '../interfaces';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  toggleGroup: css({
    marginTop: tokens.spacingXs,
    marginLeft: tokens.spacingM,

    '> :first-child': css({
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    }),
    '> :last-child': css({
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    })
  })
};

interface Props {
  activePickerMode: PickerMode;
  onChange: (pickerMode: PickerMode) => void;
}

export function ToggleGroup({ activePickerMode, onChange }: Props) {
  const isPickerModeSetToSku = activePickerMode === 'sku';
  return (
    <div className={styles.toggleGroup}>
      <ToggleButton onToggle={() => onChange('sku')} isActive={isPickerModeSetToSku}>
        SKU
      </ToggleButton>
      <ToggleButton onToggle={() => onChange('category')} isActive={!isPickerModeSetToSku}>
        Category
      </ToggleButton>
    </div>
  );
}
