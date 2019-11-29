import React from 'react';
import { render, cleanup, wait, fireEvent } from '@testing-library/react';

import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';

import AppConfig from './AppConfig';
import { definitions } from './parameters.spec';

const contentTypes = [
  {
    sys: { id: 'ct1' },
    name: 'CT1',
    fields: [{ id: 'x', name: 'X', type: 'Symbol' }, { id: 'y', name: 'Y', type: 'Object' }]
  },
  {
    sys: { id: 'ct2' },
    name: 'CT2',
    fields: [
      { id: 'foo', name: 'FOO', type: 'Text' },
      { id: 'z', name: 'Z', type: 'Array', items: { type: 'Symbol' } }
    ]
  },
  {
    sys: { id: 'ct3' },
    name: 'CT3',
    fields: [
      { id: 'bar', name: 'BAR', type: 'Object' },
      { id: 'baz', name: 'BAZ', type: 'Object' },
      { id: 'd', name: 'D', type: 'Array', items: { type: 'Symbol' } },
      { id: 'a', name: 'A', type: 'Symbol' }
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
      onConfigure: jest.fn().mockReturnValue(undefined),
      setReady: jest.fn()
    }
  }
});

const validate = () => null; // Means no error

const renderComponent = (sdk: unknown) => {
  return render(
    <AppConfig
      name="Some app"
      sdk={sdk as AppExtensionSDK}
      parameterDefinitions={definitions}
      validateParameters={validate}
      logo="some-logo.svg"
      color="red"
      description="App description"
    />
  );
};

describe('AppConfig', () => {
  afterEach(cleanup);

  it('renders app before installation', async () => {
    const sdk = makeSdkMock();
    const { getByLabelText } = renderComponent(sdk);
    await wait(() => getByLabelText(/Commercetools Project Key/));

    [
      [/Commercetools Project Key/, ''],
      [/Client ID/, ''],
      [/Client Secret/, ''],
      [/^API Endpoint/, ''],
      [/Auth API Endpoint/, ''],
      [/Commercetools data locale/, '']
    ].forEach(([labelRe, expected]) => {
      const configInput = getByLabelText(labelRe) as HTMLInputElement;
      expect(configInput.value).toEqual(expected);
    });

    [/X$/, /D$/].forEach(labelRe => {
      const fieldCheckbox = getByLabelText(labelRe) as HTMLInputElement;
      expect(fieldCheckbox.checked).toBe(false);
    });
  });

  it('renders app after installation', async () => {
    const sdk = makeSdkMock();
    sdk.platformAlpha.app.getParameters.mockResolvedValueOnce({
      projectKey: 'some-key',
      clientId: '12345',
      clientSecret: 'some-secret',
      apiEndpoint: 'some-endpoint',
      authApiEndpoint: 'some-auth-endpoint',
      locale: 'en'
    });
    sdk.platformAlpha.app.getCurrentState.mockResolvedValueOnce({
      EditorInterface: {
        ct3: {
          controls: [{ fieldId: 'a' }, { fieldId: 'd' }]
        }
      }
    });

    const { getByLabelText } = renderComponent(sdk);
    await wait(() => getByLabelText(/Commercetools Project Key/));

    [
      [/Commercetools Project Key/, 'some-key'],
      [/Client ID/, '12345'],
      [/Client Secret/, 'some-secret'],
      [/^API Endpoint/, 'some-endpoint'],
      [/Auth API Endpoint/, 'some-auth-endpoint'],
      [/Commercetools data locale/, 'en']
    ].forEach(([labelRe, expected]) => {
      const configInput = getByLabelText(labelRe as RegExp) as HTMLInputElement;
      expect(configInput.value).toEqual(expected);
    });

    [[/X$/, false], [/D$/, true]].forEach(([labelRe, expected]) => {
      const fieldCheckbox = getByLabelText(labelRe as RegExp) as HTMLInputElement;
      expect(fieldCheckbox.checked).toBe(expected);
    });
  });

  it('updates configuration', async () => {
    const sdk = makeSdkMock();
    const { getByLabelText } = renderComponent(sdk);
    await wait(() => getByLabelText(/Commercetools Project Key/));
    [
      [/Commercetools Project Key/, 'some-key'],
      [/Client ID/, '12345'],
      [/Client Secret/, 'some-secret'],
      [/^API Endpoint/, 'some-endpoint'],
      [/Auth API Endpoint/, 'some-auth-endpoint'],
      [/Commercetools data locale/, 'en']
    ].forEach(([labelRe, value]) => {
      const configInput = getByLabelText(labelRe as RegExp) as HTMLInputElement;
      fireEvent.change(configInput, { target: { value } });
    });

    const fieldCheckbox = getByLabelText(/D$/) as HTMLInputElement;
    fireEvent.click(fieldCheckbox);

    const onConfigure = sdk.platformAlpha.app.onConfigure.mock.calls[0][0];
    const configurationResult = onConfigure();

    expect(configurationResult).toEqual({
      parameters: {
        projectKey: 'some-key',
        clientId: '12345',
        clientSecret: 'some-secret',
        apiEndpoint: 'some-endpoint',
        authApiEndpoint: 'some-auth-endpoint',
        locale: 'en'
      },
      targetState: {
        EditorInterface: {
          ct1: {},
          ct2: {},
          ct3: { controls: [{ fieldId: 'd' }] }
        }
      }
    });
  });
});
