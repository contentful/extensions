import * as React from 'react';
import { mount } from 'enzyme';

import Preview from '../src/preview';

test('preview player has a Mux poster image', () => {
  const wrapper = mount(<Preview playbackId="asdf" />);

  expect(wrapper.find('video').props().poster).toContain('https://image.mux.com/asdf/thumbnail.jpg');
})
