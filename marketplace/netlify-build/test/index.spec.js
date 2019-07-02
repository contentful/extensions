import React from 'react';
import { render, cleanup, wait, fireEvent } from '@testing-library/react';
import NetlifyExtension from '../src/index.js';
import { createPubSub } from '../src/pubnub-client';

const mockaddListener = jest.fn();
const mocksubscribe = jest.fn();
const mockpublish = jest.fn();
const mockhistory = jest.fn(() =>
  Promise.resolve({
    messages: [
      {
        timetoken: '15620690994438613',
        entry: {
          contentful: true,
          event: 'triggered',
          userId: '2jvc3kU4n7OIABiFMTaGyB'
        }
      }
    ],
    startTimeToken: '15620690994438613',
    endTimeToken: '15620690994438613'
  })
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


// date-fns provides functions such as `distanceInWordsToNow` which will change as the time changes
// it is necessary to ensure the date will remain the same no matter when these tests are run
global.Date.now = jest.fn(() => 1562082624100);

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

    expect(getByTestId('preview-button').href).toEqual('https://upbeat-kare-a02208.netlify.com/');

    // select second preview url
    fireEvent.change(getByTestId('site-selector'), { target: { value: '1' } });

    expect(getByTestId('preview-button').href).toEqual(
      'https://friendly-easley-6bcf4a.netlify.com/'
    );

    // should ensure some basic security practices
    expect(getByTestId('preview-button').rel).toEqual('noopener noreferrer');

    // should open in new window
    expect(getByTestId('preview-button').target).toEqual('_blank');
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

  it('should should show a triggering message when a build is triggered', async () => {
    const { getByTestId, container } = render(
      <NetlifyExtension sdk={sdkMock} createPubSub={createPubSub} />
    );

    await wait();
    expect(container).toMatchSnapshot();

    getByTestId('build-button').click();
  });

  it('should should show a building message when a build is building', async () => {
    mockhistory.mockReturnValue(
      Promise.resolve({
        messages: [
          {
            timetoken: '15620690994438613',
            entry: {
              contentful: true,
              event: 'triggered',
              userId: '2jvc3kU4n7OIABiFMTaGyB'
            }
          },
          {
            timetoken: '15620690994438653',
            entry: {
              contentful: true,
              event: 'build-started',
              userId: '2jvc3kU4n7OIABiFMTaGyB'
            }
          }
        ],
        startTimeToken: '15620690994438613',
        endTimeToken: '15620690994438653'
      })
    );

    const { container } = render(
      <NetlifyExtension sdk={sdkMock} createPubSub={createPubSub} />
    );

    await wait();
    expect(container).toMatchSnapshot();
  });

  it('should should show a clickable build button when build is ready', async () => {
    mockhistory.mockReturnValue(
      Promise.resolve({
        messages: [
          {
            timetoken: '15620690994438613',
            entry: {
              contentful: true,
              event: 'triggered',
              userId: '2jvc3kU4n7OIABiFMTaGyB'
            }
          },
          {
            timetoken: '15620690994438653',
            entry: {
              contentful: true,
              event: 'build-started',
              userId: '2jvc3kU4n7OIABiFMTaGyB'
            }
          },
          {
            timetoken: '15620690994438693',
            entry: {
              contentful: true,
              event: 'build-ready',
              userId: '2jvc3kU4n7OIABiFMTaGyB'
            }
          }
        ],
        startTimeToken: '15620690994438613',
        endTimeToken: '15620690994438693'
      })
    );

    const { container } = render(
      <NetlifyExtension sdk={sdkMock} createPubSub={createPubSub} />
    );

    await wait();
    expect(container).toMatchSnapshot();
  });
});
