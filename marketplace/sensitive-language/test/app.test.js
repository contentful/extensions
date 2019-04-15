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

describe('App', function() {
  test('bails out for non-english languages', function() {
    const extension = {
      locales: {
        default: 'de-DE',
        names: {
          'de-DE': 'German'
        }
      }
    };

    const tree = renderer.create(<App extension={extension} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('works for English languages', function() {
    const extension = {
      locales: {
        default: 'en-US',
        names: {
          'en-US': 'English'
        }
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
      },
      parameters: {
        instance: {
          ignoredFields: '',
          ignoredRules: ''
        },
        installation: {
          profanitySureness: '0',
          ignoredRules: ''
        }
      }
    };

    const tree = renderer.create(<App extension={extension} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('parses parameters', function() {
    const extension = {
      locales: {
        default: 'en-US',
        names: {
          'en-US': 'English'
        }
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
      },
      parameters: {
        instance: {
          ignoredFields: '',
          ignoredRules: 'he-she,master-slave'
        },
        installation: {
          profanitySureness: '2',
          ignoredRules: 'slave, boogeyman-boogeywoman'
        }
      }
    };

    const tree = renderer.create(<App extension={extension} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('filters out non-text fields', function() {
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
      },
      parameters: {
        instance: {
          ignoredFields: '',
          ignoredRules: ''
        },
        installation: {
          profanitySureness: '0',
          ignoredRules: ''
        }
      }
    };

    const tree = renderer.create(<App extension={extension} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('filters out ignored fields', function() {
    const extension = {
      locales: {
        default: 'en-US',
        names: {
          'en-US': 'English'
        }
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
      },
      parameters: {
        instance: {
          ignoredFields: '789',
          ignoredRules: ''
        },
        installation: {
          profanitySureness: '0',
          ignoredRules: ''
        }
      }
    };

    const tree = renderer.create(<App extension={extension} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
