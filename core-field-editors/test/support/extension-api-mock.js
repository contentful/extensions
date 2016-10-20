import * as sinon from 'support/sinon'

/**
 * Create a mock object for the Extension API.
 */
export function create () {
  return {
    field: {
      id: '',
      name: '',
      locale: 'en-US',
      type: '',

      onValueChanged: sinon.stub().returns(noop).yields(undefined),
      onIsDisabledChanged: sinon.stub().returns(noop).yields(false),
      onSchemaErrorsChanged: sinon.stub().returns(noop).yields(null),

      getValue: sinon.stub(),
      setValue: sinon.stub(),
      removeValue: sinon.stub(),
    },
  }
}

function noop () {}
