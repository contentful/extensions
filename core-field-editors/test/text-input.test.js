import {create as createApi} from 'support/extension-api-mock'
import * as sinon from 'support/sinon'
import * as assert from 'support/assert'
import createDoc from 'support/document'
import * as DOM from 'support/dom'

import createTextInput from 'src/text-input'
import repeat from 'lodash/repeat'

describe('text-input', function () {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers()
    this.doc = createDoc()

    const extensionApi = createApi()

    this.fieldApi = extensionApi.field

    this.dispatchValue = function (value) {
      this.fieldApi.onValueChanged.yield(value)
    }

    this.createTextInput = function (sizeValidation, type) {
      extensionApi.field.type = type
      if (sizeValidation) {
        extensionApi.field.validations = [{size: sizeValidation}]
      }
      const el = createTextInput(extensionApi)
      this.doc.add(el)
      return el
    }
  })

  afterEach(function () {
    this.doc.destroy()
    this.clock.restore()
  })

  it('sets input value when external value changes', function () {
    this.createTextInput()
    this.dispatchValue('VAL')
    this.doc.assert.value('input', 'VAL')
  })

  it('updates entry field value after user input', function () {
    this.createTextInput()
    const inputEl = this.doc.querySelector('input')
    DOM.input(inputEl, 'NEW')
    this.clock.tick(300)
    sinon.assert.calledOnce(this.fieldApi.setValue)
    sinon.assert.calledWithExactly(this.fieldApi.setValue, 'NEW')
  })

  it('counts characters correctly', function () {
    const testData = [
      {input: 'Test', expected: '4 characters'},
      {input: 'A  sentence with lots of  spaces', expected: '32 characters'},
      {input: '', expected: '0 characters'},
      {input: undefined, expected: '0 characters'},
    ]

    this.clock.restore()
    this.createTextInput()

    for (const {input, expected} of testData) {
      this.dispatchValue(input)
      assert.equal(
        this.doc.querySelector('[role=status]').textContent,
        expected
      )
    }
  })

  it('displays validation hints', function () {
    const testData = [
      {
        validation: {max: 20, min: 10},
        hint: 'Requires between 10 and 20 characters',
      }, {
        validation: {max: null, min: 10},
        hint: 'Requires at least 10 characters',
      }, {
        validation: {max: 20, min: null},
        hint: 'Requires less than 20 characters',
      },
    ]

    testData.forEach(({validation, hint}) => {
      const el = this.createTextInput(validation)
      assert.equal(
        this.doc.query('character-constraints').textContent,
        hint
      )
      el.remove()
    })
  })

  it('changes character info status code according to validation', function () {
    this.createTextInput({min: 2, max: 3})

    this.dispatchValue('1')
    this.doc.assert.hasStatus('invalid-size')

    this.dispatchValue('12')
    this.doc.assert.notHasStatus('invalid-size')

    this.dispatchValue('123')
    this.doc.assert.notHasStatus('invalid-size')

    this.dispatchValue('1234')
    this.doc.assert.hasStatus('invalid-size')
  })

  it('adds max constraints for symbol fields', function () {
    this.createTextInput(false, 'Symbol')

    assert.equal(
      this.doc.query('character-constraints').textContent,
      'Requires less than 256 characters'
    )

    this.doc.assert.notHasStatus('invalid-size')
    this.dispatchValue(repeat('a', 257))
    this.doc.assert.hasStatus('invalid-size')
  })

  it('adds max constraints to symbol fields with min validation', function () {
    this.createTextInput({min: 20, max: null}, 'Symbol')

    assert.equal(
      this.doc.query('character-constraints').textContent,
      'Requires between 20 and 256 characters'
    )
  })

  it('does not overwrite constraints for symbol fields', function () {
    this.createTextInput({min: null, max: 50}, 'Symbol')

    assert.equal(
      this.doc.query('character-constraints').textContent,
      'Requires less than 50 characters'
    )
  })

  it('sets input to invalid when there are schema errors', function () {
    this.createTextInput()

    this.fieldApi.onSchemaErrorsChanged.yield(null)
    this.doc.assert.valid('input', true)
    this.fieldApi.onSchemaErrorsChanged.yield([{}])
    this.doc.assert.valid('input', false)
  })
})
