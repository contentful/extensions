import React from 'react';

import Projects from './Projects';
import ContentTypes from './ContentTypes';

export default class Config extends React.Component {
  render() {
    return (
      <>
        <Projects />
        <ContentTypes />
      </>
    );
  }
}
