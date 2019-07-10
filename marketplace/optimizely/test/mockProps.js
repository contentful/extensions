export default {
  sdk: {
    location: {},
    user: {
      sys: {
        type: 'User',
        id: '2userId252'
      },
      firstName: 'leroy',
      lastName: 'jenkins',
      email: 'leroy.jenkins@contentful.com',
      avatarUrl: 'something.com',
      spaceMembership: {
        sys: {
          type: 'SpaceMembership',
          id: 'cyu19ucaypb9-2userId252'
        },
        admin: true,
        roles: []
      }
    },
    parameters: {
      instance: {},
      installation: {
        optimizelyProjectId: '14632250064'
      }
    },
    locales: {
      available: ['en-US'],
      default: 'en-US',
      names: {
        'en-US': 'English (United States)'
      }
    },
    space: {},
    dialogs: {},
    navigator: {},
    notifier: {},
    ids: {
      extension: 'optimizely',
      space: 'cyu19ucaypb9',
      environment: 'master',
      contentType: 'variationContainer',
      entry: '928dNykvv7L31PNIH8d0W',
      user: '2userId252'
    },
    contentType: {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'cyu19ucaypb9'
          }
        },
        id: 'variationContainer',
        type: 'ContentType',
        createdAt: '2019-05-24T07:45:48.863Z',
        updatedAt: '2019-07-10T07:19:11.217Z',
        environment: {
          sys: {
            id: 'master',
            type: 'Link',
            linkType: 'Environment'
          }
        },
        revision: 4
      },
      name: 'Variation Container',
      description: null,
      displayField: 'experimentTitle',
      fields: [
        {
          id: 'experimentTitle',
          name: 'Experiment title',
          type: 'Symbol',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false
        },
        {
          id: 'experimentId',
          name: 'Experiment ID',
          type: 'Symbol',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false
        },
        {
          id: 'meta',
          name: 'Meta',
          type: 'Object',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false
        },
        {
          id: 'variations',
          name: 'Variations',
          type: 'Array',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false,
          items: {
            type: 'Link',
            validations: [],
            linkType: 'Entry'
          }
        },
        {
          id: 'experimentKey',
          name: 'Experiment Key',
          type: 'Symbol',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false
        }
      ]
    },
    entry: {
      fields: {
        experimentTitle: {
          id: 'experimentTitle',
          locales: ['en-US'],
          type: 'Symbol',
          required: false,
          validations: [],
          _defaultLocale: 'en-US',
          _fieldLocales: {
            'en-US': {
              id: 'experimentTitle',
              locale: 'en-US',
              _valueSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _isDisabledSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _schemaErrorsChangedSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _channel: {
                _messageHandlers: {
                  sysChanged: {
                    _id: 1,
                    _listeners: {}
                  },
                  valueChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  isDisabledChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  schemaErrorsChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  localeSettingsChanged: {
                    _id: 1,
                    _listeners: {}
                  },
                  showDisabledFieldsChanged: {
                    _id: 1,
                    _listeners: {}
                  }
                },
                _responseHandlers: {}
              }
            }
          }
        },
        experimentId: {
          getValue: jest.fn(),
          onValueChanged: jest.fn(() => () => {}),
          id: 'experimentId',
          locales: ['en-US'],
          type: 'Symbol',
          required: false,
          validations: [],
          _defaultLocale: 'en-US',
          _fieldLocales: {
            'en-US': {
              id: 'experimentId',
              locale: 'en-US',
              _value: '14942730290',
              _valueSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: ['14942730290']
              },
              _isDisabledSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _schemaErrorsChangedSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _channel: {
                _messageHandlers: {
                  sysChanged: {
                    _id: 1,
                    _listeners: {}
                  },
                  valueChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  isDisabledChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  schemaErrorsChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  localeSettingsChanged: {
                    _id: 1,
                    _listeners: {}
                  },
                  showDisabledFieldsChanged: {
                    _id: 1,
                    _listeners: {}
                  }
                },
                _responseHandlers: {}
              }
            }
          }
        },
        meta: {
          getValue: jest.fn(),
          onValueChanged: jest.fn(() => () => {}),
          id: 'meta',
          locales: ['en-US'],
          type: 'Object',
          required: false,
          validations: [],
          _defaultLocale: 'en-US',
          _fieldLocales: {
            'en-US': {
              id: 'meta',
              locale: 'en-US',
              _value: {},
              _valueSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [{}]
              },
              _isDisabledSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _schemaErrorsChangedSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _channel: {
                _messageHandlers: {
                  sysChanged: {
                    _id: 1,
                    _listeners: {}
                  },
                  valueChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  isDisabledChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  schemaErrorsChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  localeSettingsChanged: {
                    _id: 1,
                    _listeners: {}
                  },
                  showDisabledFieldsChanged: {
                    _id: 1,
                    _listeners: {}
                  }
                },
                _responseHandlers: {}
              }
            }
          }
        },
        variations: {
          getValue: jest.fn(),
          onValueChanged: jest.fn(() => () => {}),
          id: 'variations',
          locales: ['en-US'],
          type: 'Array',
          required: false,
          validations: [],
          items: {
            type: 'Link',
            validations: [],
            linkType: 'Entry'
          },
          _defaultLocale: 'en-US',
          _fieldLocales: {
            'en-US': {
              id: 'variations',
              locale: 'en-US',
              _valueSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _isDisabledSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _schemaErrorsChangedSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _channel: {
                _messageHandlers: {
                  sysChanged: {
                    _id: 1,
                    _listeners: {}
                  },
                  valueChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  isDisabledChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  schemaErrorsChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  localeSettingsChanged: {
                    _id: 1,
                    _listeners: {}
                  },
                  showDisabledFieldsChanged: {
                    _id: 1,
                    _listeners: {}
                  }
                },
                _responseHandlers: {}
              }
            }
          }
        },
        experimentKey: {
          id: 'experimentKey',
          locales: ['en-US'],
          type: 'Symbol',
          required: false,
          validations: [],
          _defaultLocale: 'en-US',
          _fieldLocales: {
            'en-US': {
              id: 'experimentKey',
              locale: 'en-US',
              _valueSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _isDisabledSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _schemaErrorsChangedSignal: {
                _id: 0,
                _listeners: {},
                __private__memoized__arguments__: [null]
              },
              _channel: {
                _messageHandlers: {
                  sysChanged: {
                    _id: 1,
                    _listeners: {}
                  },
                  valueChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  isDisabledChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  schemaErrorsChanged: {
                    _id: 5,
                    _listeners: {}
                  },
                  localeSettingsChanged: {
                    _id: 1,
                    _listeners: {}
                  },
                  showDisabledFieldsChanged: {
                    _id: 1,
                    _listeners: {}
                  }
                },
                _responseHandlers: {}
              }
            }
          }
        }
      }
    },
    editor: {
      editorInterface: {
        sys: {
          id: 'default',
          type: 'EditorInterface',
          space: {
            sys: {
              id: 'cyu19ucaypb9',
              type: 'Link',
              linkType: 'Space'
            }
          },
          version: 8,
          createdAt: '2019-05-24T07:45:48.999Z',
          createdBy: {
            sys: {
              id: '5aZ5pwqlNWeMnNIZP6lCE1',
              type: 'Link',
              linkType: 'User'
            }
          },
          updatedAt: '2019-07-10T07:19:11.763Z',
          updatedBy: {
            sys: {
              id: '2userId252',
              type: 'Link',
              linkType: 'User'
            }
          },
          contentType: {
            sys: {
              id: 'variationContainer',
              type: 'Link',
              linkType: 'ContentType'
            }
          },
          environment: {
            sys: {
              id: 'master',
              type: 'Link',
              linkType: 'Environment'
            }
          }
        },
        editor: {
          settings: {},
          widgetId: 'optimizely',
          widgetNamespace: 'extension'
        },
        sidebar: [
          {
            settings: {},
            widgetId: 'optimizely-app-olocz4yVWMnb79x6',
            widgetNamespace: 'extension'
          },
          {
            settings: {},
            widgetId: 'publication-widget',
            widgetNamespace: 'sidebar-builtin'
          },
          {
            settings: {},
            widgetId: 'content-preview-widget',
            widgetNamespace: 'sidebar-builtin'
          },
          {
            disabled: true,
            widgetId: 'jobs-widget',
            widgetNamespace: 'sidebar-builtin'
          },
          {
            disabled: true,
            widgetId: 'content-workflows-tasks-widget',
            widgetNamespace: 'sidebar-builtin'
          },
          {
            disabled: true,
            widgetId: 'incoming-links-widget',
            widgetNamespace: 'sidebar-builtin'
          },
          {
            disabled: true,
            widgetId: 'translation-widget',
            widgetNamespace: 'sidebar-builtin'
          },
          {
            disabled: true,
            widgetId: 'versions-widget',
            widgetNamespace: 'sidebar-builtin'
          },
          {
            disabled: true,
            widgetId: 'users-widget',
            widgetNamespace: 'sidebar-builtin'
          },
          {
            disabled: true,
            widgetId: 'entry-activity-widget',
            widgetNamespace: 'sidebar-builtin'
          }
        ],
        controls: [
          {
            fieldId: 'experimentTitle',
            widgetId: 'singleLine',
            widgetNamespace: 'builtin'
          },
          {
            fieldId: 'experimentId',
            widgetId: 'singleLine',
            widgetNamespace: 'builtin'
          },
          {
            fieldId: 'meta',
            widgetId: 'objectEditor',
            widgetNamespace: 'builtin'
          },
          {
            fieldId: 'variations',
            widgetId: 'entryLinksEditor',
            widgetNamespace: 'builtin'
          },
          {
            fieldId: 'experimentKey',
            widgetId: 'singleLine',
            widgetNamespace: 'builtin'
          }
        ]
      }
    }
  },
  client: {
    sdk: {
      location: {},
      user: {
        sys: {
          type: 'User',
          id: '2userId252'
        },
        firstName: 'leroy',
        lastName: 'jenkins',
        email: 'leroy.jenkins@contentful.com',
        avatarUrl: 'something.com',
        spaceMembership: {
          sys: {
            type: 'SpaceMembership',
            id: 'cyu19ucaypb9-2userId252'
          },
          admin: true,
          roles: []
        }
      },
      parameters: {
        instance: {},
        installation: {
          optimizelyProjectId: '14632250064'
        }
      },
      locales: {
        available: ['en-US'],
        default: 'en-US',
        names: {
          'en-US': 'English (United States)'
        }
      },
      space: {},
      dialogs: {},
      navigator: {},
      notifier: {},
      ids: {
        extension: 'optimizely',
        space: 'cyu19ucaypb9',
        environment: 'master',
        contentType: 'variationContainer',
        entry: '928dNykvv7L31PNIH8d0W',
        user: '2userId252'
      },
      contentType: {
        sys: {
          space: {
            sys: {
              type: 'Link',
              linkType: 'Space',
              id: 'cyu19ucaypb9'
            }
          },
          id: 'variationContainer',
          type: 'ContentType',
          createdAt: '2019-05-24T07:45:48.863Z',
          updatedAt: '2019-07-10T07:19:11.217Z',
          environment: {
            sys: {
              id: 'master',
              type: 'Link',
              linkType: 'Environment'
            }
          },
          revision: 4
        },
        name: 'Variation Container',
        description: null,
        displayField: 'experimentTitle',
        fields: [
          {
            id: 'experimentTitle',
            name: 'Experiment title',
            type: 'Symbol',
            localized: false,
            required: false,
            validations: [],
            disabled: false,
            omitted: false
          },
          {
            id: 'experimentId',
            name: 'Experiment ID',
            type: 'Symbol',
            localized: false,
            required: false,
            validations: [],
            disabled: false,
            omitted: false
          },
          {
            id: 'meta',
            name: 'Meta',
            type: 'Object',
            localized: false,
            required: false,
            validations: [],
            disabled: false,
            omitted: false
          },
          {
            id: 'variations',
            name: 'Variations',
            type: 'Array',
            localized: false,
            required: false,
            validations: [],
            disabled: false,
            omitted: false,
            items: {
              type: 'Link',
              validations: [],
              linkType: 'Entry'
            }
          },
          {
            id: 'experimentKey',
            name: 'Experiment Key',
            type: 'Symbol',
            localized: false,
            required: false,
            validations: [],
            disabled: false,
            omitted: false
          }
        ]
      },
      entry: {
        fields: {
          experimentTitle: {
            id: 'experimentTitle',
            locales: ['en-US'],
            type: 'Symbol',
            required: false,
            validations: [],
            _defaultLocale: 'en-US',
            _fieldLocales: {
              'en-US': {
                id: 'experimentTitle',
                locale: 'en-US',
                _valueSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _isDisabledSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _schemaErrorsChangedSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _channel: {
                  _messageHandlers: {
                    sysChanged: {
                      _id: 1,
                      _listeners: {}
                    },
                    valueChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    isDisabledChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    schemaErrorsChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    localeSettingsChanged: {
                      _id: 1,
                      _listeners: {}
                    },
                    showDisabledFieldsChanged: {
                      _id: 1,
                      _listeners: {}
                    }
                  },
                  _responseHandlers: {}
                }
              }
            }
          },
          experimentId: {
            id: 'experimentId',
            locales: ['en-US'],
            type: 'Symbol',
            required: false,
            validations: [],
            _defaultLocale: 'en-US',
            _fieldLocales: {
              'en-US': {
                id: 'experimentId',
                locale: 'en-US',
                _value: '14942730290',
                _valueSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: ['14942730290']
                },
                _isDisabledSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _schemaErrorsChangedSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _channel: {
                  _messageHandlers: {
                    sysChanged: {
                      _id: 1,
                      _listeners: {}
                    },
                    valueChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    isDisabledChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    schemaErrorsChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    localeSettingsChanged: {
                      _id: 1,
                      _listeners: {}
                    },
                    showDisabledFieldsChanged: {
                      _id: 1,
                      _listeners: {}
                    }
                  },
                  _responseHandlers: {}
                }
              }
            }
          },
          meta: {
            id: 'meta',
            locales: ['en-US'],
            type: 'Object',
            required: false,
            validations: [],
            getValue: jest.fn(),
            _defaultLocale: 'en-US',
            _fieldLocales: {
              'en-US': {
                id: 'meta',
                locale: 'en-US',
                _value: {},
                _valueSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [{}]
                },
                _isDisabledSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _schemaErrorsChangedSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _channel: {
                  _messageHandlers: {
                    sysChanged: {
                      _id: 1,
                      _listeners: {}
                    },
                    valueChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    isDisabledChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    schemaErrorsChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    localeSettingsChanged: {
                      _id: 1,
                      _listeners: {}
                    },
                    showDisabledFieldsChanged: {
                      _id: 1,
                      _listeners: {}
                    }
                  },
                  _responseHandlers: {}
                }
              }
            }
          },
          variations: {
            id: 'variations',
            locales: ['en-US'],
            type: 'Array',
            required: false,
            validations: [],
            items: {
              type: 'Link',
              validations: [],
              linkType: 'Entry'
            },
            _defaultLocale: 'en-US',
            _fieldLocales: {
              'en-US': {
                id: 'variations',
                locale: 'en-US',
                _valueSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _isDisabledSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _schemaErrorsChangedSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _channel: {
                  _messageHandlers: {
                    sysChanged: {
                      _id: 1,
                      _listeners: {}
                    },
                    valueChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    isDisabledChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    schemaErrorsChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    localeSettingsChanged: {
                      _id: 1,
                      _listeners: {}
                    },
                    showDisabledFieldsChanged: {
                      _id: 1,
                      _listeners: {}
                    }
                  },
                  _responseHandlers: {}
                }
              }
            }
          },
          experimentKey: {
            id: 'experimentKey',
            locales: ['en-US'],
            type: 'Symbol',
            required: false,
            validations: [],
            _defaultLocale: 'en-US',
            _fieldLocales: {
              'en-US': {
                id: 'experimentKey',
                locale: 'en-US',
                _valueSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _isDisabledSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _schemaErrorsChangedSignal: {
                  _id: 0,
                  _listeners: {},
                  __private__memoized__arguments__: [null]
                },
                _channel: {
                  _messageHandlers: {
                    sysChanged: {
                      _id: 1,
                      _listeners: {}
                    },
                    valueChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    isDisabledChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    schemaErrorsChanged: {
                      _id: 5,
                      _listeners: {}
                    },
                    localeSettingsChanged: {
                      _id: 1,
                      _listeners: {}
                    },
                    showDisabledFieldsChanged: {
                      _id: 1,
                      _listeners: {}
                    }
                  },
                  _responseHandlers: {}
                }
              }
            }
          }
        }
      },
      editor: {
        editorInterface: {
          sys: {
            id: 'default',
            type: 'EditorInterface',
            space: {
              sys: {
                id: 'cyu19ucaypb9',
                type: 'Link',
                linkType: 'Space'
              }
            },
            version: 8,
            createdAt: '2019-05-24T07:45:48.999Z',
            createdBy: {
              sys: {
                id: '5aZ5pwqlNWeMnNIZP6lCE1',
                type: 'Link',
                linkType: 'User'
              }
            },
            updatedAt: '2019-07-10T07:19:11.763Z',
            updatedBy: {
              sys: {
                id: '2userId252',
                type: 'Link',
                linkType: 'User'
              }
            },
            contentType: {
              sys: {
                id: 'variationContainer',
                type: 'Link',
                linkType: 'ContentType'
              }
            },
            environment: {
              sys: {
                id: 'master',
                type: 'Link',
                linkType: 'Environment'
              }
            }
          },
          editor: {
            settings: {},
            widgetId: 'optimizely',
            widgetNamespace: 'extension'
          },
          sidebar: [
            {
              settings: {},
              widgetId: 'optimizely-app-olocz4yVWMnb79x6',
              widgetNamespace: 'extension'
            },
            {
              settings: {},
              widgetId: 'publication-widget',
              widgetNamespace: 'sidebar-builtin'
            },
            {
              settings: {},
              widgetId: 'content-preview-widget',
              widgetNamespace: 'sidebar-builtin'
            },
            {
              disabled: true,
              widgetId: 'jobs-widget',
              widgetNamespace: 'sidebar-builtin'
            },
            {
              disabled: true,
              widgetId: 'content-workflows-tasks-widget',
              widgetNamespace: 'sidebar-builtin'
            },
            {
              disabled: true,
              widgetId: 'incoming-links-widget',
              widgetNamespace: 'sidebar-builtin'
            },
            {
              disabled: true,
              widgetId: 'translation-widget',
              widgetNamespace: 'sidebar-builtin'
            },
            {
              disabled: true,
              widgetId: 'versions-widget',
              widgetNamespace: 'sidebar-builtin'
            },
            {
              disabled: true,
              widgetId: 'users-widget',
              widgetNamespace: 'sidebar-builtin'
            },
            {
              disabled: true,
              widgetId: 'entry-activity-widget',
              widgetNamespace: 'sidebar-builtin'
            }
          ],
          controls: [
            {
              fieldId: 'experimentTitle',
              widgetId: 'singleLine',
              widgetNamespace: 'builtin'
            },
            {
              fieldId: 'experimentId',
              widgetId: 'singleLine',
              widgetNamespace: 'builtin'
            },
            {
              fieldId: 'meta',
              widgetId: 'objectEditor',
              widgetNamespace: 'builtin'
            },
            {
              fieldId: 'variations',
              widgetId: 'entryLinksEditor',
              widgetNamespace: 'builtin'
            },
            {
              fieldId: 'experimentKey',
              widgetId: 'singleLine',
              widgetNamespace: 'builtin'
            }
          ]
        }
      }
    },
    project: '14632250064',
    baseURL: 'https://api.optimizely.com/v2'
  }
};
