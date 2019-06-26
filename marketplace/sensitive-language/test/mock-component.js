'use strict';

const React = require('react');

function mockComponent(componentClassName) {
  return props => {
    const className = props.className
      ? `${componentClassName} ${props.className}`
      : componentClassName;

    return (
      <div className={className} {...props}>
        {props.children}
      </div>
    );
  };
}

module.exports = { mockComponent };
