import createInputUpdater from '../../_shared/input-updater'
import {h} from './preact'
import omit from 'lodash/omit'
import {create as component} from './component'

/**
 * We do not have an implementation for virtual-dom yet :(
 */
export default function input (props) {
  return component((paint) => {
    paint(
      h('input', omit(props, 'value')),
      (el) => {
        createInputUpdater(el, document)(props.value)
      }
    )
  })
}
