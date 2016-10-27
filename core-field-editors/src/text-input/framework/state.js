import * as K from 'kefir'
import map from 'lodash/map'
import assignObject from 'lodash/assign'

export function create () {
  let state = {}
  const stateBus = createPropertyBus(state)

  return {
    prop: stateBus.property,
    set: set,
    replace: replace,
    assign: assign,
    end: end,
  }

  function set (prop, value) {
    const newState = assignObject({}, state)
    newState[prop] = value
    replace(newState)
  }

  function assign (newState) {
    replace(assignObject(state, newState))
  }

  function replace (newState) {
    state = assignObject({}, newState)
    stateBus.set(state)
  }

  function end () {
    state = null
    stateBus.end()
  }
}


export function fromProperties (props) {
  const state = create()
  const end = state.end

  const updateProps = map(props, function (prop, key) {
    return prop.map((value) => [key, value])
  })
  const subscription =
    K.merge(updateProps)
    .observe({
      value ([key, val]) {
        state.set(key, val)
      },

      end () {
        end()
      },
    })

  state.end = function () {
    subscription.unsubscribe()
    end()
  }

  return state
}


/**
 * Create a property and corresponding functions to set the property value and
 * end the property.
 */
function createPropertyBus (initial) {
  let currentEmitter

  const property = K.stream(function (emitter) {
    currentEmitter = emitter
  }).toProperty()

  // We activate the stream so that `currentEmitter` gets assigned.
  property.onValue(function () {})
  set(initial)

  return {
    property: property,
    end: end,
    set: set,
  }

  function set (value) {
    currentEmitter.emit(value)
  }

  function end () {
    currentEmitter.end()
  }
}
