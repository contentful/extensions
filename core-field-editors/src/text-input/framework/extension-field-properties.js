import * as K from 'kefir'

/**
 * Takes the `field` object of the UI extensions API and returns a
 * collection of Kefir properties that wrap the field’s signals.
 */
export default function create (field) {
  return {
    value: propertyFromSignal(field.onValueChanged.bind(field)),
    disabled: propertyFromSignal(field.onIsDisabledChanged.bind(field)),
    schemaErrors: propertyFromSignal(field.onSchemaErrorsChanged.bind(field)),
  }
}

/**
 * Takes a memozied signal and returns a kefir property
 */
function propertyFromSignal (signal) {
  return K.stream((emitter) => {
    return signal((value) => {
      emitter.emit(value)
    })
  }).toProperty()
}

