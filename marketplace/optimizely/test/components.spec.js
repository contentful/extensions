import React from 'react';
import { render, cleanup, configure } from '@testing-library/react';

import { IncorrectContentType, isValidContentType, MissingProjectId } from '../src/errors-messages';

configure({ testIdAttribute: 'data-test-id' });

describe('error message components', () => {
  afterEach(cleanup);
  describe('IncorrectContentType', () => {
    it('should match snapshot', () => {
      const mockSdk = {
        ids: {
          extension: 'test-extension'
        }
      };

      const missingFields = [{ id: 'key', type: 'symbol' }];

      const { container } = render(
        <IncorrectContentType sdk={mockSdk} missingFields={missingFields} />
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('MissingProjectId', () => {
    it('should match snapshot', () => {
      const { container } = render(<MissingProjectId />);

      expect(container).toMatchSnapshot();
    });
  });

  describe('isValidContentType', () => {
    const makeFields = (valid = false) => {
      return {
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
          }
        ].concat(
          valid
            ? {
                id: 'experimentKey',
                name: 'Experiment key',
                type: 'Symbol',
                localized: false,
                required: false,
                validations: [],
                disabled: false,
                omitted: false
              }
            : []
        )
      };
    };
    it('should produce an invalid response', () => {
      expect(isValidContentType(makeFields())).toEqual([
        false,
        [{ id: 'experimentKey', type: 'Symbol' }]
      ]);
    });
    it('should produce a valid response', () => {
      expect(isValidContentType(makeFields(true))).toEqual([true, []]);
    });
  });
});
