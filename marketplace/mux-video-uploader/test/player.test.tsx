import * as React from 'react';
import { mount } from 'enzyme';

import Player from '../src/player';

test('preview player has a Mux poster image', () => {
  const wrapper = mount(<Player playbackId="asdf" />);

  expect(wrapper.find('video').props().poster).toContain('https://image.mux.com/asdf/thumbnail.jpg');
})
