import { toInputParameters, validateParameters, toExtensionParameters } from './parameters';

describe('parameters', () => {
  describe('toInputParameters', () => {
    it('handles lack of paramters', () => {
      const result = toInputParameters({});

      expect(result).toEqual({
        cloudName: '',
        apiKey: '',
        maxFiles: '10'
      });
    });

    it('resolves parameters to string values', () => {
      const result = toInputParameters({
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

  describe('validateParameters', () => {
    const empty = {
      cloudName: '',
      apiKey: '',
      maxFiles: ''
    };

    const valid = {
      cloudName: 'CLOUD',
      apiKey: 'KEY',
      maxFiles: '12'
    };

    it('validates presence of string parameters', () => {
      const err1 = validateParameters(empty);
      expect(err1).toMatch(/Cloudinary Cloud name/);

      const err2 = validateParameters({
        ...empty,
        cloudName: 'CLOUD'
      });
      expect(err2).toMatch(/Cloudinary API key/);
    });

    it('validates maxFiles format', () => {
      const err = validateParameters({
        ...valid,
        maxFiles: '-123.6'
      });

      expect(err).toMatch(/should be an integer/);
    });

    it('validates maxFiles bounds', () => {
      const err = validateParameters({
        ...valid,
        maxFiles: '123'
      });

      expect(err).toMatch(/between 1 and 25/);
    });

    it('returns null if everything is fine', () => {
      const err = validateParameters(valid);

      expect(err).toBeNull();
    });
  });

  describe('toExtensionParameters', () => {
    it('converts maxFiles to an integer', () => {
      const result = toExtensionParameters({
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
