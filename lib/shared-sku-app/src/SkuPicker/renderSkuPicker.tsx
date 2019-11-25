import React from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import { render } from 'react-dom';
import { SkuPicker } from './SkuPicker';

interface Props {
  sdk: AppExtensionSDK;
  fetchProducts: Function;
}

export function renderSkuPicker(elementId: string, props: Props): void {
  const root = document.getElementById(elementId);
  render(<SkuPicker {...props} />, root);
}
