import React from 'react';
import { App } from './index';
import { render, cleanup, configure } from '@testing-library/react';

import mockProps from './test/mockProps';

const sdk = {
  ...mockProps.sdk,
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

jest.mock('./utils', () => ({
  getField: jest.fn(),
  isCompatibleImageField: () => true
}));

configure({
  testIdAttribute: 'data-test-id'
});

function renderComponent(sdk) {
  return render(<App sdk={sdk} />);
}

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

  describe('#render', () => {
    it('should render the extension field view', () => {
      const { container } = renderComponent(sdk);
      expect(container).toMatchSnapshot();
    });
  });
});
