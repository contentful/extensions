import * as assert from 'support/assert'
import {jsdom} from 'jsdom'
import * as Preact from 'preact'

/**
 * Create a DOM API and expose it to the global namespace.
 *
 * Returns a collection of functions to interact with the document.
 */
export default function create () {
  const doc = jsdom()
  Preact.options.debounceRendering = (fn) => fn()

  const unexpose = expose(global, {
    document: doc,
    SVGElement: function () {},
    Element: doc.defaultView.Element,
    Text: doc.defaultView.Text,
  })

  const docAssert = assert.dom(doc)

  return {
    document: document,

    // TODO belongs in a separate module that deals with interacting
    // with the dom.
    querySelector: function (selector) {
      return docAssert.unique(selector)
    },

    // TODO belongs in a separate module that deals with interacting
    // with the dom.
    query (ref, role) {
      if (role) {
        return this.querySelector(`[role="${role}"][data-ref="${ref}"]`)
      } else {
        return this.querySelector(`[data-ref="${ref}"]`)
      }
    },

    makeEvent (type) {
      return new doc.defaultView.Event(type)
    },

    assert: docAssert,

    destroy: unexpose,

    add (el) {
      doc.body.appendChild(el)
    },
  }
}

function expose (global, api) {
  const original = {}

  for (const k in api) {
    original[k] = global[k]
    global[k] = api[k]
  }

  return function dispose () {
    for (const k in api) {
      if (k in original) {
        global[k] = original[k]
      } else {
        delete global[k]
      }
    }
  }
}
