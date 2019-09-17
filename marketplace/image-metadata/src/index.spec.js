import React from 'react';
import { locations } from 'contentful-ui-extensions-sdk';
import { App, renderDialog } from './index';
import { render, fireEvent, cleanup, configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-test-id'
});

function renderComponent(sdk) {
  return render(<App sdk={sdk} />);
}

const sdk = {
  field: {
    getValue: jest.fn(),
    onValueChanged: jest.fn(),
    setValue: jest.fn(),
    removeValue: jest.fn()
  },
  window: {
    startAutoResizer: jest.fn()
  }
};

describe('App', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(cleanup);

  it('should read a value from field.getValue() and subscribe for external changes', () => {
    const initialValue = 'x: 0px / y: 0px';
    sdk.field.getValue.mockImplementation(() => initialValue);
    const { getByTestId } = renderComponent(sdk);

    expect(sdk.field.getValue).toHaveBeenCalled();
    expect(sdk.field.onValueChanged).toHaveBeenCalled();
    expect(getByTestId('focal-point').value).toEqual(initialValue);
  });

  it('should call startAutoResizer', () => {
    renderComponent(sdk);
    expect(sdk.window.startAutoResizer).toHaveBeenCalled();
  });
});
