import React from 'react';
import TestRenderer from 'react-test-renderer';
import NetlifyExtension from '../src/index.js';

const sdkMock = {
    parameters: {
        instance: {},
        installation: {
            names: 'friendly',
            channels: 'c-wj2QelNg1OvkkWDF-119493e8-f2a3-4771-8b3c-f402b5966e84',
            publishKey: 'pub-c-a99421b9-4f21-467b-ac0c-d0292824e8e1',
            subscribeKey: 'sub-c-3992b1ae-f7c9-11e8-adf7-5a5b31762c0f',
            buildHookUrls: 'https://api.netlify.com/build_hooks/5d16017189dd0f2c32335387',
            netlifySiteIds: '119493e8-f2a3-4771-8b3c-f402b5966e84',
            netlifySiteUrls: 'https://friendly-easley-6bcf4a.netlify.com'
        }
    },
    window: {
        startAutoResizer: jest.fn(),
    },
    space: {
        getUsers: jest.fn(),
    },
    user: {
        sys: {
            id: 'test-user-id',
        },
    },
};

const pubsubMock = jest.fn();

describe('NetlifyExtension', () => {
    const wrapper = TestRenderer.create(<NetlifyExtension sdk={sdkMock} createPubSub={pubsubMock} />);
    console.log(wrapper);
});