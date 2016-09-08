import * as P from 'preact'


/**
 * This module exposes the vdom adapter for the 'preact' library.
 */


export function h (tag, props, children) {
  if (!children && Array.isArray(props)) {
    children = props
    props = null
  }

  return P.h(tag, props, children)
}

/**
 * Takes a virtual DOM node and creates a native DOM element for it.
 */
export function createElement (node) {
  const container = document.createElement('div')
  P.render(node, container)
  return container
}

/**
 * The component factory receives a mount function that is called when
 * the component is mounted. If called it gets a `paint` function as
 * its argument. The paint function accepts a VDom Node and renders it
 * as the component. The mount function returns a function that is
 * called when the component is unmounted.
 *
 * This is an example of a component rendering the current time in a
 * <span>.
 * ~~~js
 * component((paint) => {
 *   const interval = setInterval(() => {
 *     const now = (new Date()).toISOString()
 *     paint(h('span', [now]))
 *   })
 *
 *   return () => clearInterval(interval)
 * })
 * ~~~
 */
export function component (mount) {
  return P.h(C, {mount})
}

class C extends P.Component {
  componentWillMount () {
    mountComponent(this, this.props.mount)
  }

  componentWillUnmount () {
    unmount(this)
  }

  componentDidMount () {
    runPaintCallback(this)
  }

  componentDidUpdate () {
    runPaintCallback(this)
  }

  componentWillReceiveProps ({mount}) {
    if (mount !== this.props.mount) {
      mountComponent(this, mount)
    }
  }

  render () {
    return this.state.node
  }
}

function runPaintCallback (component) {
  if (component.state.cb) {
    component.state.cb(component.base)
    component.state.cb = null
  }
}

function unmount (component) {
  if (component.onUnmount) {
    component.onUnmount()
    component.onUnmount = null
  }
}

function mountComponent (component, mount) {
  unmount(component)

  const paint = (node, cb) => {
    component.setState({node, cb})
  }
  component.onUnmount = mount(paint)
}
