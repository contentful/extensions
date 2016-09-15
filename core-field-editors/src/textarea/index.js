import throttle from 'lodash/throttle'
import createUpdater from '../_shared/input-updater'
import makeBooter from '../_shared/boot'

// TODO this forces browserify to bundle the extensions SDK. We do not want to
// do that when we use it internally. Maybe use some node flags.
export const boot = makeBooter(create)

export default function create (api, opts = {}) {
  const document = opts.document || window.document

  const textarea = document.createElement('textarea')
  textarea.classList.add('cf-form-input')
  const field = api.field
  const updateInput = createUpdater(textarea, document)

  field.onValueChanged(function (val) {
    // Might be `null` or `undefined` when value is not present
    updateInput(val || '')
  })

  field.onIsDisabledChanged(function (isDisabled) {
    textarea.disabled = isDisabled
  })

  field.onSchemaErrorsChanged(function (errors) {
    if (errors && errors.length > 0) {
      textarea.setAttribute('aria-invalid', true)
    } else {
      textarea.removeAttribute('aria-invalid')
    }
  })

  const updateValue = throttle(function () {
    field.setValue(textarea.value)
  }, 300, {leading: false})

  textarea.addEventListener('input', updateValue)
  textarea.addEventListener('blur', updateValue.flush)

  return textarea
}
