import React from 'react';
import { render, cleanup } from '@testing-library/react';
import NetlifyExtension from '../src/index.js';
import { createPubSub } from '../src/pubnub-client';

jest.mock('pubnub', () => {
  const addListener = jest.fn();
  const subscribe = jest.fn();
  const publish = jest.fn();
  const history = jest.fn(() => Promise.resolve({}));

  return {
    __esModule: true,
    default: jest.fn(() => ({
      addListener,
      subscribe,
      publish,
      history,
      removeListener: jest.fn(),
      unsubscribe: jest.fn()
    }))
  };
});

describe('NetlifyExtension', () => {
  afterEach(cleanup);

  it('should render the NetlifySideBarBuildButton and be interactive', async () => {
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
          netlifySiteIds:
            '5133ac93-7fc0-463b-96d0-bb799e7fcb07,119493e8-f2a3-4771-8b3c-f402b5966e84',
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

    const { container } = render(<NetlifyExtension sdk={sdkMock} createPubSub={createPubSub} />);

    expect(container).toMatchSnapshot();
  });
});
