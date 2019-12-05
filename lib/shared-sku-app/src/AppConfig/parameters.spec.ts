import { toInputParameters, toAppParameters } from './parameters';

export const definitions = [
  {
    id: 'projectKey',
    name: 'Commercetools Project Key',
    description: 'The Commercetools project key',
    type: 'Symbol',
    required: true
  },
  {
    id: 'clientId',
    name: 'Client ID',
    description: 'The client ID',
    type: 'Symbol',
    required: true
  },
  {
    id: 'clientSecret',
    name: 'Client Secret',
    description: 'The client secret',
    type: 'Symbol',
    required: true
  },
  {
    id: 'apiEndpoint',
    name: 'API Endpoint',
    description: 'The Commercetools API endpoint',
    type: 'Symbol',
    required: true
  },
  {
    id: 'authApiEndpoint',
    name: 'Auth API Endpoint',
    description: 'The auth API endpoint',
    type: 'Symbol',
    required: true
  },
  {
    id: 'locale',
    name: 'Commercetools data locale',
    description: 'The Commercetools data locale to display',
    type: 'Symbol',
    required: true
  }
];

describe('parameters', () => {
  describe('toInputParameters', () => {
    it('handles lack of paramters', () => {
      const result = toInputParameters(definitions, {});

      expect(result).toEqual({
        projectKey: '',
        clientId: '',
        clientSecret: '',
        apiEndpoint: '',
        authApiEndpoint: '',
        locale: ''
      });
    });

    it('resolves parameters to string values', () => {
      const result = toInputParameters(definitions, {
        projectKey: 'some-key',
        clientId: 12345,
        clientSecret: 'some-secret',
        apiEndpoint: 'some-endpoint',
        authApiEndpoint: 'some-auth-endpoint',
        locale: 'en'
      });

      expect(result).toEqual({
        projectKey: 'some-key',
        clientId: '12345',
        clientSecret: 'some-secret',
        apiEndpoint: 'some-endpoint',
        authApiEndpoint: 'some-auth-endpoint',
        locale: 'en'
      });
    });
  });

  describe('toAppParameters', () => {
    it('converts Number parameters to integers', () => {
      const result = toAppParameters(
        [
          ...definitions,
          {
            id: 'numParam',
            name: 'Some number param',
            description: 'Description',
            type: 'Number',
            required: true
          }
        ],
        {
          projectKey: 'some-key',
          clientId: '12345',
          clientSecret: 'some-secret',
          apiEndpoint: 'some-endpoint',
          authApiEndpoint: 'some-auth-endpoint',
          locale: 'en',
          numParam: '12345'
        }
      );

      expect(result).toEqual({
        projectKey: 'some-key',
        clientId: '12345',
        clientSecret: 'some-secret',
        apiEndpoint: 'some-endpoint',
        authApiEndpoint: 'some-auth-endpoint',
        locale: 'en',
        numParam: 12345
      });
    });
  });
});
