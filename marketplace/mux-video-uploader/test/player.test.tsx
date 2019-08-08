import Adapter from 'enzyme-adapter-react-16';
import 'isomorphic-fetch';

import * as React from 'react';
import { mount, configure } from 'enzyme';

import Player from '../src/player';

configure({ adapter: new Adapter() });

test('preview player has a Mux poster image', () => {
  const wrapper = mount(<Player playbackId="asdf" />);

  expect(wrapper.find('video').props().poster).toContain(
    'https://image.mux.com/asdf/thumbnail.jpg'
  );
});
