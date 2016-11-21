// IE does not have Array#find
import find from 'lodash/find'
import isNumber from 'lodash/isNumber'
import {caseof, makeSum} from 'sum-types'

/**
 * This module parses field validations as a constraint and checks
 * values against that constraint.
 */


export const Constraint = makeSum({
  None: [],
  Min: ['min'],
  Max: ['max'],
  MinMax: ['min', 'max'],
})

export function makeChecker (constraint) {
  return function checkConstraint (length) {
    return caseof(constraint, [
      [Constraint.None, () => true],
      [Constraint.Min, ({min}) => length >= min],
      [Constraint.Max, ({max}) => length <= max],
      [Constraint.MinMax, ({min, max}) => length >= min && length <= max],
    ])
  }
}

export function fromFieldValidations (type, validations = []) {
  const sizeValidation = find(validations, (v) => 'size' in v)
  const size = (sizeValidation && sizeValidation.size) || {}
  const min = size.min
  let max = size.max

  if (type === 'Symbol' && !isNumber(max)) {
    max = 256
  }

  if (isNumber(min) && isNumber(max)) {
    return Constraint.MinMax(min, max)
  } else if (isNumber(min)) {
    return Constraint.Min(min)
  } else if (isNumber(max)) {
    return Constraint.Max(max)
  } else {
    return Constraint.None()
  }
}
