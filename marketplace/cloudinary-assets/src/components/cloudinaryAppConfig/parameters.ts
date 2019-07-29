import get from 'lodash.get';

export const MAX_FILES_UPPER_LIMIT = 25;
const MAX_FILES_DEFAULT = 10;

export interface InputParameters {
  cloudName: string;
  apiKey: string;
  maxFiles: string;
}

export interface ExtensionParameters {
  readonly cloudName: string;
  readonly apiKey: string;
  readonly maxFiles: number;
}

export type ParameterValue = string | boolean | number;

export function toInputParameters(
  parameters: Record<string, ParameterValue> | null
): InputParameters {
  return {
    cloudName: `${get(parameters, ['cloudName'], '')}`,
    apiKey: `${get(parameters, ['apiKey'], '')}`,
    maxFiles: `${get(parameters, ['maxFiles'], MAX_FILES_DEFAULT)}`
  };
}

export function validateParamters(parameters: InputParameters): string | null {
  if (parameters.cloudName.length < 1) {
    return 'Provide your Cloudinary Cloud name.';
  }

  if (parameters.apiKey.length < 1) {
    return 'Provide your Cloudinary API key.';
  }

  const validFormat = /^[1-9][0-9]*$/.test(parameters.maxFiles);
  const int = parseInt(parameters.maxFiles, 10);
  const valid = validFormat && int > 0 && int <= MAX_FILES_UPPER_LIMIT;
  if (!valid) {
    return `Max files should be an integer between 1 and ${MAX_FILES_UPPER_LIMIT}.`;
  }

  return null;
}

export function toExtensionParameters(parameters: InputParameters): ExtensionParameters {
  return {
    ...parameters,
    maxFiles: parseInt(parameters.maxFiles, 10)
  };
}
