import React from 'react';
import { render } from 'react-dom';
import { SkuPicker } from './SkuPicker';

interface Props {
  onSearch: Function;
}

export function renderSkuPicker(elementId: string, props: Props): void {
  const root = document.getElementById(elementId);
  render(<SkuPicker {...props} />, root);
}
