import get from 'lodash/get';

import { Hash } from '../interfaces';

export function toInputParameters(
  parameterDefinitions: Hash[],
  parameterValues: Hash | null
): Record<string, string> {
  return parameterDefinitions.reduce((acc, def) => {
    const isFieldsConfig = !def.id || typeof def.id === 'object';
    const defaultValue = typeof def.default === 'undefined' ? '' : `${def.default}`;
    return isFieldsConfig
      ? acc
      : {
          ...acc,
          [def.id]: `${get(parameterValues, [def.id], defaultValue)}`
        };
  }, {});
}

export function toAppParameters(
  parameterDefinitions: Hash[],
  inputValues: Record<string, string>
): Hash {
  return parameterDefinitions.reduce((acc, def) => {
    const value = inputValues[def.id];
    return {
      ...acc,
      [def.id]: def.type === 'Number' ? parseInt(value, 10) : value
    };
  }, {});
}
