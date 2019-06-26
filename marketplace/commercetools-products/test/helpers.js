/* eslint-disable react/display-name, react/prop-types */

'use strict';

const React = require('react');

function mockComponent(componentClassName) {
  return props => {
    const className = props.className
      ? `${componentClassName} ${props.className}`
      : componentClassName;

    let children = props.children;
    if (children && children instanceof Function) {
      children = '[object Function]';
    }

    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  };
}

function flushPromises() {
  return new Promise(resolve => window.setImmediate(resolve));
}

module.exports = { mockComponent, flushPromises };
