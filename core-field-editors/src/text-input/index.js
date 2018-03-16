import throttle from 'lodash/throttle'

import makeBoot from '../_shared/boot'
import { FormInputClassList } from '../_shared/constants';
import {State, input, createElement, h} from './framework'
import createFieldProperties from './framework/extension-field-properties'
import {fromProperty as component} from './framework/component'

import createCharacterInfo from './character-info'
import * as Constraint from './character-constraint'

export const boot = makeBoot(create)

/**
 * Given an instance of the UI extensions API returns a DOM element
 * that contains the text input field editor.
 */
export default function create (widgetApi) {
  const field = widgetApi.field
  const fieldProps = createFieldProperties(field)

  const state = State.fromProperties({
    // Value might be undefined but we only need to handle strings
    value: fieldProps.value.map((val) => val || ''),
    disabled: fieldProps.disabled,
    invalid: fieldProps.schemaErrors.map((errors) => errors && errors.length),
  })

  const setFieldValue = throttle(function (value) {
    field.setValue(value)
    // TODO remove this when SDK is upgraded.
    // We need to update the state manually because the the
    // `onValueChanged()` signal does not fire
    state.set('value', value)
  }, 300, {leading: false})


  function setValue (value) {
    setFieldValue(value)
    state.set('value', value)
  }


  const constraint = Constraint.fromFieldValidations(field.type, field.validations)
  const charInfo = createCharacterInfo(constraint)

  return createElement(component(state.prop, render))

  function render ({value, disabled, invalid}) {
    return h('div', null, [
      input({
        value,
        disabled,
        className: FormInputClassList,
        oninput: (ev) => setValue(ev.target.value),
        'aria-invalid': invalid ? 'true' : undefined,
      }),
      charInfo(value ? value.length : 0),
    ])
  }
}
