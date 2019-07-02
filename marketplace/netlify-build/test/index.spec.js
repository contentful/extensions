import React from 'react';
import { render, cleanup, wait, fireEvent } from '@testing-library/react';
import NetlifyExtension from '../src/index.js';
import { createPubSub } from '../src/pubnub-client';

const mockaddListener = jest.fn();
const mocksubscribe = jest.fn();
const mockpublish = jest.fn();
const mockhistory = jest.fn(() =>
  Promise.resolve([
    {
      event: 'triggered',
      userId: '2jvc3kU4n7OIABiFMTaGyB',
      userName: null,
      t: '2019-07-02T12:04:59.000Z'
    }
  ])
);

jest.mock('pubnub', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      addListener: mockaddListener,
      subscribe: mocksubscribe,
      publish: mockpublish,
      history: mockhistory,
      removeListener: jest.fn(),
      unsubscribe: jest.fn()
    }))
  };
});

const sdkMock = {
  parameters: {
    instance: {},
    installation: {
      names: 'upbeat,friendly',
      channels:
        'c-wj2QelNg1OvkkWDF-5133ac93-7fc0-463b-96d0-bb799e7fcb07,c-wj2QelNg1OvkkWDF-119493e8-f2a3-4771-8b3c-f402b5966e84',
      publishKey: 'pub-c-a99421b9-4f21-467b-ac0c-d0292824e8e1',
      subscribeKey: 'sub-c-3992b1ae-f7c9-11e8-adf7-5a5b31762c0f',
      buildHookUrls:
        'https://api.netlify.com/build_hooks/5d19c2c1b359da07eca189af,https://api.netlify.com/build_hooks/5d19c2c1b359da2f7da18998',
      netlifySiteIds: '5133ac93-7fc0-463b-96d0-bb799e7fcb07,119493e8-f2a3-4771-8b3c-f402b5966e84',
      netlifySiteUrls:
        'https://upbeat-kare-a02208.netlify.com,https://friendly-easley-6bcf4a.netlify.com'
    }
  },
  window: {
    startAutoResizer: jest.fn()
  },
  space: {
    getUsers: jest.fn(() =>
      Promise.resolve({
        items: [
          {
            sys: {
              type: 'User',
              id: 'test-id'
            },
            firstName: 'John',
            lastName: 'Smith',
            email: 'email@email.com',
            avatarUrl: 'something.com'
          }
        ]
      })
    )
  },
  user: {
    sys: {
      id: 'test-id'
    }
  }
};

describe('NetlifyExtension', () => {
  afterEach(() => {
    cleanup();
    mockaddListener.mockClear();
    mocksubscribe.mockClear();
    mockpublish.mockClear();
    mockhistory.mockClear();
  });

  it('should render the NetlifySideBarBuildButton', async () => {
    const { container } = render(<NetlifyExtension sdk={sdkMock} createPubSub={createPubSub} />);

    expect(container).toMatchSnapshot();
  });

  it('should open the preview window with correct URL', async () => {
    const { getByTestId } = render(<NetlifyExtension sdk={sdkMock} createPubSub={createPubSub} />);

    const openMock = jest.fn();
    global.open = openMock;

    // click with initial preview url selected
    getByTestId('preview-button').click();

    // select second preview url
    fireEvent.change(getByTestId('site-selector'), { target: { value: '1' } });

    // click to preivew the second url
    getByTestId('preview-button').click();

    expect(openMock.mock.calls[0][0]).toEqual('https://upbeat-kare-a02208.netlify.com');
    expect(openMock.mock.calls[1][0]).toEqual('https://friendly-easley-6bcf4a.netlify.com');

    expect(openMock).toHaveBeenCalledTimes(2);
  });

  it('should subscribe to the correct channels', async () => {
    render(<NetlifyExtension sdk={sdkMock} createPubSub={createPubSub} />);

    await wait();
    expect(mocksubscribe).toHaveBeenCalledWith({ channels: ['5d19c2c1b359da07eca189af'] });
    expect(mockhistory).toHaveBeenCalledWith({
      channel: '5d19c2c1b359da07eca189af',
      count: 25,
      stringifiedTimeToken: true
    });
  });

  it('should trigger a build', async () => {
    const { getByTestId } = render(<NetlifyExtension sdk={sdkMock} createPubSub={createPubSub} />);

    await wait();
    getByTestId('build-button').click();

    expect(mockpublish).toHaveBeenCalledWith({
      channel: '5d19c2c1b359da07eca189af',
      message: { contentful: true, event: 'triggered', userId: 'test-id' },
      storeInHistory: true
    });
  });
});
