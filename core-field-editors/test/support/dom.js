/**
 * This module exports a collection of utilities to simulate user
 * interaction with the DOM
 */


/**
 * Change the `value` of an input element and trigger an 'input' event.
 */
export function input (el, value) {
  el.value = value
  const win = el.ownerDocument.defaultView
  el.dispatchEvent(new win.Event('input'))
}


/**
 * Change the `value` of an input element and trigger the 'input',
 * 'change' and 'bluar' events.
 */
export function change (el, value) {
  el.value = value
  const win = el.ownerDocument.defaultView
  el.dispatchEvent(new win.Event('input'))
  el.dispatchEvent(new win.Event('change'))
  el.dispatchEvent(new win.Event('blur'))
}
