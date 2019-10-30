export default {
  focalPoint: { x: 925, y: 1312 },
  file: {
    url: 'https://mycdn.com/some_image.png',
    details: { size: 11524052, image: { width: 4534, height: 3050 } },
    fileName: 'Pôr do Sol - Praia do Boldro.jpg',
    contentType: 'image/jpeg'
  },
  sdk: {
    location: {},
    user: {
      sys: { type: 'User', id: '2userId252' },
      firstName: 'Fake',
      lastName: 'User',
      email: 'fake.user@contentful.com',
      avatarUrl: 'somelink.com',
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
      installation: {},
      invocation: {
        file: {
          url: 'https://mycdn.com/some_image.png',
          details: { size: 11524052, image: { width: 4534, height: 3050 } },
          fileName: 'Pôr do Sol - Praia do Boldro.jpg',
          contentType: 'image/jpeg'
        },
        focalPoint: { x: 925, y: 1312 }
      }
    },
    locales: {
      available: ['en-US'],
      default: 'en-US',
      names: { 'en-US': 'English (United States)' }
    },

    contentType: {
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: 'x2rb1es2s3ta' } },
        id: 'article',
        type: 'ContentType',
        createdAt: '2019-09-03T12:19:45.454Z',
        updatedAt: '2019-09-17T14:10:53.642Z',
        environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } },
        revision: 22
      },
      name: 'Article',
      description: 'User written articles.',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false
        },
        {
          id: 'createdAt',
          name: 'Created at',
          type: 'Date',
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
          id: 'person',
          name: 'Person',
          type: 'Object',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false
        },
        {
          id: 'articleImg',
          name: 'Article Image',
          type: 'Link',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false,
          linkType: 'Asset'
        },
        {
          id: 'articleImageFocalPoint',
          name: 'Article Image Focal Point',
          type: 'Object',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false
        }
      ]
    },
    space: {},
    dialogs: {},
    navigator: {},
    notifier: {},
    ids: {
      extension: 'image-focal-point',
      space: 'cyu19ucaypb9',
      environment: 'master',
      user: '2userId252'
    },
    window: {}
  }
};
