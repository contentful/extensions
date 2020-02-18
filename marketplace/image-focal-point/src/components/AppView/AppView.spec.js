import React from 'react';
import { cleanup, render, wait, configure, fireEvent } from '@testing-library/react';

import mockProps from '../../test/mockProps';
import { AppView } from './AppView';

configure({ testIdAttribute: 'data-test-id' });

const props = {
  sdk: {
    ...mockProps.sdk,
    space: {
      getContentTypes: jest.fn(() => ({
        items: []
      }))
    },
    app: {
      setReady: jest.fn(),
      isInstalled: jest.fn(),
      onConfigure: jest.fn(),
      onConfigurationCompleted: jest.fn()
    }
  }
};

describe('AppView', () => {
  afterEach(() => cleanup());

  describe('when the app is not installed', () => {
    beforeEach(() => props.sdk.app.isInstalled.mockImplementation(() => Promise.resolve(false)));

    it('should render the app view with installation screen', async () => {
      const appView = render(<AppView {...props} />);
      await wait();
      expect(appView.container).toMatchSnapshot();
    });

    it('should render inline validation if the content type id is taken', async () => {
      props.sdk.space.getContentTypes.mockImplementation(() => ({
        items: [{ sys: { id: 'imageWithFocalPoint' } }]
      }));
      const { getByTestId } = render(<AppView {...props} />);
      await wait();
      expect(getByTestId('content-type-name')).toMatchSnapshot();
      expect(getByTestId('content-type-id')).toMatchSnapshot();
    });

    it('should update the content type id field if it is pristine and the content type name is changed', async () => {
      const { getByTestId } = render(<AppView {...props} />);
      await wait();
      fireEvent.change(getByTestId('content-type-name-input'), { target: { value: 'Test Name' } });
      expect(getByTestId('content-type-id-input').value).toEqual('testName');
    });

    it('should not update the content type id field if it is dirty and the content type name is changed', async () => {
      const { getByTestId } = render(<AppView {...props} />);
      await wait();
      fireEvent.change(getByTestId('content-type-id-input'), { target: { value: 'someTestId' } });
      fireEvent.change(getByTestId('content-type-name-input'), { target: { value: 'Test Name' } });
      expect(getByTestId('content-type-id-input').value).toEqual('someTestId');
    });
  });

  describe('when the app is installed', () => {
    it('should render the app view with configuration screen', async () => {
      props.sdk.app.isInstalled.mockImplementation(() => true);
      const appView = render(<AppView {...props} />);
      await wait();
      expect(appView.container).toMatchSnapshot();
    });
  });
});
