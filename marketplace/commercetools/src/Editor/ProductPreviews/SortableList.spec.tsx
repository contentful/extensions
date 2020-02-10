import React from 'react';
import identity from 'lodash/identity';
import { render, cleanup } from '@testing-library/react';
import { Props, SortableList } from './SortableList';
import productPreviews from '../../__mocks__/productPreviews';

const defaultProps: Props = {
  disabled: false,
  productPreviews,
  deleteFn: jest.fn()
};

const renderComponent = (props: Props) => {
  return render(<SortableList {...props} />);
};

jest.mock('react-sortable-hoc', () => ({
  SortableContainer: identity,
  SortableElement: identity,
  SortableHandle: identity
}));

describe('SortableList', () => {
  afterEach(cleanup);

  it('should render successfully', async () => {
    const component = renderComponent(defaultProps);
    expect(component.container).toMatchSnapshot();
  });
});
