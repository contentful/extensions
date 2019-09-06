'use strict';

const React = require('react');
const renderer = require('react-test-renderer');

const { mockComponent } = require('./helpers.js');

jest.mock('@contentful/forma-36-react-components', () => ({
  Card: mockComponent('card'),
  EntryCard: mockComponent('entry-card'),
  DropdownList: mockComponent('dropdown-list'),
  DropdownListItem: mockComponent('dropdown-list-item'),
  IconButton: mockComponent('icon-button'),
  CardDragHandle: mockComponent('card-drag-handle')
}));

jest.mock('react-sortable-hoc', () => ({
  SortableHandle: component => component,
  SortableElement: component => component
}));

jest.mock('@apollo/react-components', () => ({
  Query: mockComponent('query')
}));

const { SortableProductCard, ProductCardRenderer } = require('./../src/product-card.js');

describe('SortableProductCard', function() {
  test('renders correctly', function() {
    const tree = renderer
      .create(
        <SortableProductCard
          sku="ABCD1234"
          itemIndex={0}
          removeItem={() => {}}
          locale="en"
          sortable={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('ProductCardRenderer', function() {
  test('renders error state', function() {
    const tree = renderer
      .create(
        <ProductCardRenderer
          error={new Error('broken!')}
          sku="ABCD1234"
          index={0}
          removeItem={() => {}}
          locale="en"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders loading state', function() {
    const tree = renderer
      .create(
        <ProductCardRenderer
          loading={true}
          sku="ABCD1234"
          index={0}
          removeItem={() => {}}
          locale="en"
          sortable={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders missing product state', function() {
    const data = { products: { results: [] } };

    const tree = renderer
      .create(
        <ProductCardRenderer
          sku="ABCD1234"
          data={data}
          index={0}
          removeItem={() => {}}
          locale="en"
          sortable={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders with data', function() {
    const data = {
      products: {
        results: [
          {
            id: '2c7f2de9-d30a-42cd-bbca-5783381efb9c',
            masterData: {
              current: {
                categories: [
                  {
                    nameAllLocales: [
                      { locale: 'de', value: 'T-shirts' },
                      { locale: 'en', value: 'T-shirts' },
                      { locale: 'it', value: 'T-shirt' }
                    ]
                  },
                  {
                    nameAllLocales: [
                      { locale: 'de', value: 'Bekleidung' },
                      { locale: 'en', value: 'Clothing' },
                      { locale: 'it', value: 'Abbigliamento' }
                    ]
                  }
                ],
                masterVariant: {
                  sku: 'M0E20000000DOSQ',
                  images: [
                    {
                      url:
                        'https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/073315_1_large.jpg'
                    }
                  ]
                },
                nameAllLocales: [
                  { locale: 'de', value: 'Bluse Red Valentino rot' },
                  { locale: 'en', value: 'Shirt Red Valentino red' }
                ]
              }
            }
          }
        ]
      }
    };

    test.each([
      ['', { sortable: false, disabled: false }],
      ['and disabled', { sortable: false, disabled: true }],
      ['and sortable', { sortable: true, disabled: false }],
      ['and sortable and disabled', { sortable: true, disabled: true }]
    ])('%s', function(_, { sortable, disabled }) {
      const tree = renderer
        .create(
          <ProductCardRenderer
            sku="ABCD1234"
            data={data}
            index={0}
            removeItem={() => {}}
            locale="en"
            sortable={sortable}
            disabled={disabled}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
