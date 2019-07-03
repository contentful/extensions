'use strict';

const React = require('react');
const renderer = require('react-test-renderer');

const { mockComponent } = require('./mock-component.js');

jest.mock('../src/analytics.js', () => ({
  Analytics: mockComponent('analytics')
}));

const { App } = require('../src/app.js');

describe('App', function() {
  test('shows nothing when not logged in', function() {
    const auth = {
      on() {},
      authorize() {}
    };
    const parameters = {
      slugId: 'slug'
    };
    const entry = {
      fields: {
        slugId: {}
      }
    };

    const tree = renderer
      .create(<App auth={auth} parameters={parameters} entry={entry} />)
      .toJSON();
    expect(tree).toBeNull();
  });

  test('shows an error when the slug field is not correctly defined', function() {
    const events = {};
    const auth = {
      on(event, fn) {
        events[event] = fn;
      },
      authorize() {}
    };
    const parameters = {
      slugId: 'slug'
    };
    const entry = {
      fields: {}
    };

    const component = renderer.create(<App auth={auth} parameters={parameters} entry={entry} />);

    // Simulate firing the sign-in event
    events.signIn();

    expect(component.toJSON()).toMatchSnapshot();
  });

  test('shows a warning when the entry is not yet published', function() {
    const events = {};
    const auth = {
      on(event, fn) {
        events[event] = fn;
      },
      authorize() {}
    };
    const parameters = {
      slugId: 'slug'
    };
    const entry = {
      getSys() {
        return {
          id: '123'
        };
      },
      fields: {
        slug: {
          getValue() {
            return '/pricing/';
          }
        }
      }
    };

    const component = renderer.create(<App auth={auth} parameters={parameters} entry={entry} />);

    // Simulate firing the sign-in event
    events.signIn();

    expect(component.toJSON()).toMatchSnapshot();
  });

  test('renders analytics', function() {
    const events = {};
    const auth = {
      on(event, fn) {
        events[event] = fn;
      },
      authorize() {}
    };
    const parameters = {
      slugId: 'slug',
      viewId: 'ga:123456'
    };
    const entry = {
      getSys() {
        return {
          id: '123',
          publishedAt: '2015-11-04T11:00:00Z'
        };
      },
      fields: {
        slug: {
          getValue() {
            return 'pricing';
          }
        }
      }
    };

    const component = renderer.create(<App auth={auth} parameters={parameters} entry={entry} />);

    // Simulate firing the sign-in event
    events.signIn();

    expect(component.toJSON()).toMatchSnapshot();
  });

  test('uses the prefix parameter to generate the page path', function() {
    const events = {};
    const auth = {
      on(event, fn) {
        events[event] = fn;
      },
      authorize() {}
    };
    const parameters = {
      slugId: 'slug',
      viewId: 'ga:123456',
      prefix: 'pages'
    };
    const entry = {
      getSys() {
        return {
          id: '123',
          publishedAt: '2015-11-04T11:00:00Z'
        };
      },
      fields: {
        slug: {
          getValue() {
            return 'pricing';
          }
        }
      }
    };

    const component = renderer.create(<App auth={auth} parameters={parameters} entry={entry} />);

    // Simulate firing the sign-in event
    events.signIn();

    expect(component.toJSON()).toMatchSnapshot();
  });
});
