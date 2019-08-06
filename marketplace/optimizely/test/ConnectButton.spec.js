import React from 'react';
import { cleanup, render, fireEvent, configure } from '@testing-library/react';

import ConnectButton from '../src/ConnectButton';

describe('ConnectButton', () => {
  beforeAll(() => {
    configure({ testIdAttribute: 'data-test-id' });
  });
  afterEach(cleanup);

  it('should match snapshot', () => {
    const { container } = render(<ConnectButton openAuth={() => {}} />);

    expect(container).toMatchSnapshot();
  });

  it('should handle the openAuth functionality onClick', () => {
    const openMock = jest.fn();
    const { getByTestId } = render(<ConnectButton openAuth={openMock} />);

    fireEvent.click(getByTestId('connect-button'));

    expect(openMock).toHaveBeenCalledTimes(1);
  });
});
