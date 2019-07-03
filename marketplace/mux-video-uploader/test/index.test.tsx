/* eslint-disable @typescript-eslint/no-explicit-any */

import Adapter from 'enzyme-adapter-react-16';
import 'isomorphic-fetch';

import * as React from 'react';
import { mount, configure } from 'enzyme';

import { App } from '../src';

configure({ adapter: new Adapter() });

const SDK_MOCK = {
  parameters: {
    installation: {
      muxAccessTokenId: 'abcd1234',
      muxAccessTokenSecret: 'efgh5678',
    },
  },
  field: {
    getValue: () => ({}),
    onValueChanged: () => ({}),
    setValue: () => ({}),
  },
  window: {
    startAutoResizer: () => {},
  },
};

test('throws an error if required installation parameters are not configured', () => {
  const mockedSdk = {
    ...SDK_MOCK,
    parameters: {
      installation: {
        muxAccessTokenId: undefined,
        muxAccessTokenSecret: undefined,
      },
    },
  };

  const wrapper = mount(<App sdk={mockedSdk as any} />);
  expect(wrapper.state('error')).toContain('Mux Access Token ID or Secret');
  expect(wrapper.find('Note').text()).toContain('Access Token ID');
});

test('displays an upload form before the user does anything', () => {
  const mockedSdk = { ...SDK_MOCK };

  const wrapper = mount(<App sdk={mockedSdk as any} />);
  expect(wrapper.find('input').prop('type')).toBe('file');
});

test('displays a player when the asset is ready', () => {
  const mockedSdk = {
    ...SDK_MOCK,
    field: {
      ...SDK_MOCK.field,
      getValue: () => ({
        ready: true,
      }),
    },
  };

  const wrapper = mount(<App sdk={mockedSdk as any} />);
  expect(wrapper.find('Player')).toHaveLength(1);
});

test('displays a loading state between the asset getting created and waiting for it to be ready', () => {
  const mockedSdk = {
    ...SDK_MOCK,
    field: {
      ...SDK_MOCK.field,
      getValue: () => ({
        assetId: 'abcd1234',
        ready: false,
      }),
    },
  };

  const wrapper = mount(<App sdk={mockedSdk as any} />);
  expect(wrapper.find('Spinner')).toHaveLength(1);
  expect(wrapper.find('Paragraph').text()).toContain('Waiting for asset');
});

test('displays upload progress while uploading', () => {
  const mockedSdk = {
    ...SDK_MOCK,
    field: {
      ...SDK_MOCK.field,
      getValue: () => ({}),
    },
  };

  const wrapper = mount(<App sdk={mockedSdk as any} />);

  wrapper.setState({ uploadProgress: 50 });

  expect(wrapper.find('Spinner')).toHaveLength(1);
  expect(wrapper.find('.progress')).toHaveLength(1);
  expect(wrapper.find('.progress').prop('style')).toEqual({ width: '50%' });
});

test('checks the status of an unfinished asset on load', () => {
  const mockedSdk = {
    ...SDK_MOCK,
    field: {
      ...SDK_MOCK.field,
      getValue: () => ({
        uploadId: '1234',
      }),
    },
  };

  const wrapper = mount(<App sdk={mockedSdk as any} />);

  wrapper.setState({ uploadProgress: 50 });

  expect(wrapper.find('Spinner')).toHaveLength(1);
  expect(wrapper.find('.progress')).toHaveLength(1);
  expect(wrapper.find('.progress').prop('style')).toEqual({ width: '50%' });
});
