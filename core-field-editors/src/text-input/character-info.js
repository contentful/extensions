import {h} from './framework'
import {makeChecker, Constraint} from './character-constraint'
import {caseof} from 'sum-types'

/**
 * Given a constraint return a function that accepts a string length
 * and renders information about the character count given the
 * constraint.
 */
export default function createCharacterInfo (constraint) {
  const checkConstraint = makeChecker(constraint)

  return function render (count) {
    const valid = count === 0 || checkConstraint(count)
    const characterStyle =
      valid ? {} : {color: '#df3537'}
    const characterStatusCode =
      valid ? null : 'invalid-size'

    return h('div', {
      style: {
        'font-size': '90%',
        'display': 'flex',
        'margin-top': '0.64em',
      },
    }, [
      h('div', {
        style: characterStyle,
        role: 'status',
        'data-status-code': characterStatusCode,
      }, [
        `${count} characters`,
      ]),
      h('div', {
        'data-ref': 'character-constraints',
        'style': {'margin-left': 'auto'},
      }, [caseof(constraint, [
        [Constraint.None, () => ''],
        [Constraint.Min, ({min}) => `Requires at least ${min} characters`],
        [Constraint.Max, ({max}) => `Requires less than ${max} characters`],
        [Constraint.MinMax, ({min, max}) =>
          `Requires between ${min} and ${max} characters`,
        ],
      ])]),
    ])
  }
}
