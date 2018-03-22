import {create as createApi} from 'support/extension-api-mock'
import * as sinon from 'support/sinon'
import createDoc from 'support/document'
import * as DOM from 'support/dom'

import createTextarea from 'src/textarea'

describe('textarea', function () {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers()
    this.doc = createDoc()

    const extensionApi = createApi()

    this.fieldApi = extensionApi.field

    this.createTextarea = function () {
      const el = createTextarea(extensionApi, {
        document: this.doc.document,
      })
      this.doc.add(el)
      return el
    }
  })

  afterEach(function () {
    this.doc.destroy()
    this.clock.restore()
  })

  it('sets input value when external value changes', function () {
    this.createTextarea()
    this.fieldApi.onValueChanged.yield('VAL')
    this.doc.assert.value('textarea', 'VAL')
  })

  it('updates entry field value after user input', function () {
    this.createTextarea()
    const inputEl = this.doc.querySelector('textarea')
    DOM.input(inputEl, 'NEW')
    this.clock.tick(300)
    sinon.assert.calledOnce(this.fieldApi.setValue)
    sinon.assert.calledWithExactly(this.fieldApi.setValue, 'NEW')
  })

  it('updates entry field immediately after user blurs textarea', function () {
    this.createTextarea()
    const inputEl = this.doc.querySelector('textarea')
    DOM.change(inputEl, 'NEW')
    sinon.assert.calledOnce(this.fieldApi.setValue)
    sinon.assert.calledWithExactly(this.fieldApi.setValue, 'NEW')
  })

  it('sets input to invalid when there are schema errors', function () {
    this.createTextarea()

    this.fieldApi.onSchemaErrorsChanged.yield(null)
    this.doc.assert.valid('textarea', true)
    this.fieldApi.onSchemaErrorsChanged.yield([{}])
    this.doc.assert.valid('textarea', false)
  })
})
