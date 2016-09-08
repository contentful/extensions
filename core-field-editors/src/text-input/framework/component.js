import {component as create} from './preact'

export {create}

export function fromProperty (state, render, renderOpts) {
  return create((paint) => {
    const subscription = state.observe({value: onValue})

    return function () {
      subscription.unsubscribe()
    }

    function onValue (state) {
      paint(render(state))
    }
  }, renderOpts)
}
