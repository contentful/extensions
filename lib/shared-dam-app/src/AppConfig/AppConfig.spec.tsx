import React from 'react';
import { render, cleanup, wait, fireEvent } from '@testing-library/react';

import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';

import AppConfig from './AppConfig';
import { definitions } from './parameters.spec';

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
    getContentTypes: jest.fn().mockResolvedValue({ items: contentTypes }),
    getEditorInterfaces: jest.fn().mockResolvedValue({ items: [] })
  },
  app: {
    setReady: jest.fn(),
    getParameters: jest.fn().mockResolvedValue(null),
    onConfigure: jest.fn().mockReturnValue(undefined)
  },
  ids: {
    app: 'some-app'
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
    await wait(() => getByLabelText(/Cloud name/));

    [[/Cloud name/, ''], [/API key/, ''], [/Max number of files/, '10']].forEach(
      ([labelRe, expected]) => {
        const configInput = getByLabelText(labelRe) as HTMLInputElement;
        expect(configInput.value).toEqual(expected);
      }
    );

    [/Some object/, /Some other object/].forEach(labelRe => {
      const fieldCheckbox = getByLabelText(labelRe) as HTMLInputElement;
      expect(fieldCheckbox.checked).toBe(false);
    });
  });

  it('renders app after installation', async () => {
    const sdk = makeSdkMock();
    sdk.app.getParameters.mockResolvedValueOnce({
      cloudName: 'test-cloud',
      apiKey: 'test-api-key',
      maxFiles: 12
    });
    sdk.space.getEditorInterfaces.mockResolvedValueOnce({
      items: [
        {
          sys: { contentType: { sys: { id: 'ct3' } } },
          controls: [
            {
              fieldId: 'obj',
              widgetNamespace: 'app',
              widgetId: 'some-app'
            }
          ]
        }
      ]
    });

    const { getByLabelText } = renderComponent(sdk);
    await wait(() => getByLabelText(/Cloud name/));

    [
      [/Cloud name/, 'test-cloud'],
      [/API key/, 'test-api-key'],
      [/Max number of files/, '12']
    ].forEach(([labelRe, expected]) => {
      const configInput = getByLabelText(labelRe as RegExp) as HTMLInputElement;
      expect(configInput.value).toEqual(expected);
    });

    [[/Some object/, false], [/Some other object/, true]].forEach(([labelRe, expected]) => {
      const fieldCheckbox = getByLabelText(labelRe as RegExp) as HTMLInputElement;
      expect(fieldCheckbox.checked).toBe(expected);
    });
  });

  it('updates configuration', async () => {
    const sdk = makeSdkMock();
    const { getByLabelText } = renderComponent(sdk);
    await wait(() => getByLabelText(/Cloud name/));
    [
      [/Cloud name/, 'test-cloud'],
      [/API key/, 'test-api-key'],
      [/Max number of files/, '12']
    ].forEach(([labelRe, value]) => {
      const configInput = getByLabelText(labelRe as RegExp) as HTMLInputElement;
      fireEvent.change(configInput, { target: { value } });
    });

    const fieldCheckbox = getByLabelText(/Some other object/) as HTMLInputElement;
    fireEvent.click(fieldCheckbox);

    const onConfigure = sdk.app.onConfigure.mock.calls[0][0];
    const configurationResult = onConfigure();

    expect(configurationResult).toEqual({
      parameters: {
        cloudName: 'test-cloud',
        apiKey: 'test-api-key',
        maxFiles: 12
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
