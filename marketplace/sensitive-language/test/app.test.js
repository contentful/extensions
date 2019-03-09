'use strict';

const React = require('react');
const renderer = require('react-test-renderer');

const { mockComponent } = require('./mock-component.js');

jest.mock('../src/unsupported-language.js', () => ({
  UnsupportedLanguage: mockComponent('unsupported-language')
}));
jest.mock('../src/language-checker.js', () => ({
  LanguageChecker: mockComponent('language-checker')
}));

const { App } = require('../src/app.js');

test('App: bails out for non-english languages', function() {
  const extension = {
    locales: {
      default: 'de-DE',
      names: {
        'de-DE': 'German'
      }
    },
    window: {
      startAutoResizer() {}
    }
  };

  const tree = renderer.create(<App extension={extension} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('App: works for English languages', function() {
  const extension = {
    locales: {
      default: 'en-US',
      names: {
        'en-US': 'English'
      }
    },
    window: {
      startAutoResizer() {}
    },
    contentType: {
      fields: [
        {
          id: '123',
          type: 'Symbol'
        }
      ]
    },
    entry: {
      sys: {
        id: 'ABC'
      }
    }
  };

  const tree = renderer.create(<App extension={extension} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('App: filters out non-text fields', function() {
  const extension = {
    locales: {
      default: 'en-US',
      names: {
        'en-US': 'English'
      }
    },
    window: {
      startAutoResizer() {}
    },
    contentType: {
      fields: [
        {
          id: '123',
          type: 'Symbol'
        },
        {
          id: '456',
          type: 'Number'
        },
        {
          id: '789',
          type: 'Text'
        },
        {
          id: '012',
          type: 'RichText'
        },
        {
          id: '345',
          type: 'Boolean'
        }
      ]
    },
    entry: {
      sys: {
        id: 'ABC'
      }
    }
  };

  const tree = renderer.create(<App extension={extension} />).toJSON();
  expect(tree).toMatchSnapshot();
});
