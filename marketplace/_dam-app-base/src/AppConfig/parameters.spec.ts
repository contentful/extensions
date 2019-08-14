import { toInputParameters, toExtensionParameters } from './parameters';

export const definitions = [
  {
    id: 'cloudName',
    name: 'Cloud name',
    description: 'The cloud_name of the account to access.',
    type: 'Symbol',
    required: true
  },
  {
    id: 'apiKey',
    name: 'API key',
    description: 'The account API key.',
    type: 'Symbol',
    required: true
  },
  {
    id: 'maxFiles',
    name: 'Max number of files',
    description: 'Max number of files that can be added to a single field. Between 1 and 25.',
    type: 'Number',
    required: false,
    default: 10
  }
];

describe('parameters', () => {
  describe('toInputParameters', () => {
    it('handles lack of paramters', () => {
      const result = toInputParameters(definitions, {});

      expect(result).toEqual({
        cloudName: '',
        apiKey: '',
        maxFiles: '10'
      });
    });

    it('resolves parameters to string values', () => {
      const result = toInputParameters(definitions, {
        cloudName: 'cloud',
        apiKey: 'key',
        maxFiles: 15
      });

      expect(result).toEqual({
        cloudName: 'cloud',
        apiKey: 'key',
        maxFiles: '15'
      });
    });
  });

  describe('toExtensionParameters', () => {
    it('converts Number parameters to integers', () => {
      const result = toExtensionParameters(definitions, {
        cloudName: 'CLOUD',
        apiKey: 'KEY',
        maxFiles: '17'
      });

      expect(result).toEqual({
        cloudName: 'CLOUD',
        apiKey: 'KEY',
        maxFiles: 17
      });
    });
  });
});
