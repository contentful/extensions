import React from 'react';
import { render, cleanup, wait, fireEvent } from '@testing-library/react';

import AppConfig from './index';

const contentTypes = [
  {
    sys: { id: 'ct1' },
    name: 'CT no 1',
    fields: [{ id: 'obj', name: 'Some object', type: 'Object' }]
  },
  {
    sys: { id: 'ct2' },
    name: 'CT no 2',
    fields: [{ id: 'txt', name: 'Some text', type: 'Text' }]
  },
  {
    sys: { id: 'ct3' },
    name: 'CT no 3',
    fields: [
      { id: 'txt', name: 'Some other text', type: 'Text' },
      { id: 'obj', name: 'Some other object', type: 'Object' }
    ]
  }
];

const makeSdkMock = () => ({
  space: {
    getContentTypes: jest.fn().mockResolvedValue({ items: contentTypes })
  },
  platformAlpha: {
    app: {
      getParameters: jest.fn().mockResolvedValue(null),
      getCurrentState: jest.fn().mockResolvedValue(null),
      onConfigure: jest.fn().mockReturnValue(undefined)
    }
  }
});

const renderComponent = sdk => render(<AppConfig sdk={sdk} />);

describe('AppConfig', () => {
  afterEach(cleanup);

  it('renders app before installation', async () => {
    const sdk = makeSdkMock();
    const { getByLabelText } = renderComponent(sdk);
    await wait(() => getByLabelText(/Bynder URL/));

    const configInput = getByLabelText(/Bynder URL/);
    expect(configInput.value).toEqual('');

    [/Some object/, /Some other object/].forEach(labelRe => {
      const fieldCheckbox = getByLabelText(labelRe);
      expect(fieldCheckbox.checked).toBe(false);
    });
  });

  it('renders app after installation', async () => {
    const sdk = makeSdkMock();
    sdk.platformAlpha.app.getParameters.mockResolvedValueOnce({
      bynderURL: 'https://someaccount.getbynder.com'
    });
    sdk.platformAlpha.app.getCurrentState.mockResolvedValueOnce({
      EditorInterface: {
        ct3: {
          controls: [{ fieldId: 'obj' }]
        }
      }
    });

    const { getByLabelText } = renderComponent(sdk);
    await wait(() => getByLabelText(/Bynder URL/));

    const configInput = getByLabelText(/Bynder URL/);
    expect(configInput.value).toEqual('https://someaccount.getbynder.com');

    [[/Some object/, false], [/Some other object/, true]].forEach(([labelRe, expected]) => {
      const fieldCheckbox = getByLabelText(labelRe);
      expect(fieldCheckbox.checked).toBe(expected);
    });
  });

  it('updates configuration', async () => {
    const sdk = makeSdkMock();
    const { getByLabelText } = renderComponent(sdk);
    await wait(() => getByLabelText(/Bynder URL/));

    const configInput = getByLabelText(/Bynder URL/);
    fireEvent.change(configInput, { target: { value: 'https://otheraccount.getbynder.com' } });

    const fieldCheckbox = getByLabelText(/Some other object/);
    fireEvent.click(fieldCheckbox);

    const onConfigure = sdk.platformAlpha.app.onConfigure.mock.calls[0][0];
    const configurationResult = onConfigure();

    expect(configurationResult).toEqual({
      parameters: {
        bynderURL: 'https://otheraccount.getbynder.com'
      },
      targetState: {
        EditorInterface: {
          ct1: {},
          ct3: { controls: [{ fieldId: 'obj' }] }
        }
      }
    });
  });
});
