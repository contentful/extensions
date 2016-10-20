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
  let sizeValidation = find(validations, (v) => 'size' in v)
  sizeValidation = (sizeValidation && sizeValidation.size) || {}

  if (type === 'Symbol' && !isNumber(sizeValidation.max)) {
    sizeValidation.max = 256
  }

  if (isNumber(sizeValidation.min) && isNumber(sizeValidation.max)) {
    return Constraint.MinMax(sizeValidation.min, sizeValidation.max)
  } else if (isNumber(sizeValidation.min)) {
    return Constraint.Min(sizeValidation.min)
  } else if (isNumber(sizeValidation.max)) {
    return Constraint.Max(sizeValidation.max)
  } else {
    return Constraint.None()
  }
}
