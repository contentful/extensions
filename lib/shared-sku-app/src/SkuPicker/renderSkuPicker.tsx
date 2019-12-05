import React from 'react';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { render } from 'react-dom';
import { SkuPicker } from './SkuPicker';
import { ProductPreviewsFn, ProductsFn } from '../interfaces';

interface Props {
  sdk: DialogExtensionSDK;
  fetchProductPreviews: ProductPreviewsFn;
  fetchProducts: ProductsFn;
}

export function renderSkuPicker(
  elementId: string,
  { sdk, fetchProductPreviews, fetchProducts }: Props
): void {
  const root = document.getElementById(elementId);
  render(
    <SkuPicker
      sdk={sdk}
      fetchProductPreviews={fetchProductPreviews}
      fetchProducts={fetchProducts}
    />,
    root
  );
}
