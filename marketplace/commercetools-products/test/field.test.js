'use strict';

const React = require('react');
const renderer = require('react-test-renderer');

const { mockComponent, flushPromises } = require('./helpers.js');

jest.mock('@contentful/forma-36-react-components', () => ({
  Button: mockComponent('button'),
  Spinner: mockComponent('spinner')
}));

jest.mock('react-sortable-hoc', () => ({
  SortableContainer: component => component
}));

jest.mock('../src/product-card.js', () => ({
  SortableProductCard: mockComponent('sortable-product-card')
}));

jest.mock('../src/apollo.js', () => ({
  getApolloClient: function() {
    class ApolloClient {}

    return Promise.resolve(new ApolloClient());
  }
}));

const { CommerceToolsField } = require('./../src/field.js');

describe('CommerceToolsField', function() {
  test('Renders a spinner while loading ApolloClient', function() {
    const extension = {
      field: {
        getValue() {
          return undefined;
        },
        onValueChanged() {},
        onIsDisabledChanged() {}
      }
    };
    const parameters = {
      projectKey: '',
      clientId: '',
      clientSecret: '',
      apiUri: '',
      authUri: '',
      locale: 'en'
    };

    const tree = renderer
      .create(<CommerceToolsField extension={extension} parameters={parameters} isSingle={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test.each([['single', true], ['multiple', false]])(
    'Renders empty state for %s product(s)',
    function(_, isSingle) {
      const extension = {
        field: {
          getValue() {
            return undefined;
          },
          onValueChanged() {},
          onIsDisabledChanged() {}
        }
      };
      const parameters = {
        projectKey: '',
        clientId: '',
        clientSecret: '',
        apiUri: '',
        authUri: '',
        locale: 'en'
      };

      const component = renderer.create(
        <CommerceToolsField extension={extension} parameters={parameters} isSingle={isSingle} />
      );

      return flushPromises().then(() => expect(component.toJSON()).toMatchSnapshot());
    }
  );

  test.each([
    ['single', true, 'ABCDE1234'],
    ['multiple', false, ['ABCDE1234', 'FGHHI1234', 'JKLMN5678']]
  ])('Renders with existing values for %s product(s)', function(_, isSingle, existingValue) {
    const extension = {
      field: {
        getValue() {
          return existingValue;
        },
        onValueChanged() {},
        onIsDisabledChanged() {}
      }
    };
    const parameters = {
      projectKey: '',
      clientId: '',
      clientSecret: '',
      apiUri: '',
      authUri: '',
      locale: 'en'
    };

    const component = renderer.create(
      <CommerceToolsField extension={extension} parameters={parameters} isSingle={isSingle} />
    );

    return flushPromises().then(() => expect(component.toJSON()).toMatchSnapshot());
  });

  describe('disabled state', function() {
    test.each([['single', true], ['multiple', false]])(
      'Renders empty state for %s product(s)',
      function(_, isSingle) {
        const extension = {
          field: {
            getValue() {
              return undefined;
            },
            onValueChanged() {},
            onIsDisabledChanged(fn) {
              fn(true);
            }
          }
        };
        const parameters = {
          projectKey: '',
          clientId: '',
          clientSecret: '',
          apiUri: '',
          authUri: '',
          locale: 'en'
        };

        const component = renderer.create(
          <CommerceToolsField extension={extension} parameters={parameters} isSingle={isSingle} />
        );

        return flushPromises().then(() => expect(component.toJSON()).toMatchSnapshot());
      }
    );

    test.each([
      ['single', true, 'ABCDE1234'],
      ['multiple', false, ['ABCDE1234', 'FGHHI1234', 'JKLMN5678']]
    ])('Renders with existing values for %s product(s)', function(_, isSingle, existingValue) {
      const extension = {
        field: {
          getValue() {
            return existingValue;
          },
          onValueChanged() {},
          onIsDisabledChanged(fn) {
            fn(true);
          }
        }
      };
      const parameters = {
        projectKey: '',
        clientId: '',
        clientSecret: '',
        apiUri: '',
        authUri: '',
        locale: 'en'
      };

      const component = renderer.create(
        <CommerceToolsField extension={extension} parameters={parameters} isSingle={isSingle} />
      );

      return flushPromises().then(() => expect(component.toJSON()).toMatchSnapshot());
    });
  });
});
