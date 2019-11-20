import React from 'react';
import { render } from 'react-dom';
import { SkuPicker } from './SkuPicker';

export function renderSkuPicker(elementId: string, onSearch: Function): void {
  const root = document.getElementById(elementId);
  render(<SkuPicker onSearch={onSearch} />, root);
}
