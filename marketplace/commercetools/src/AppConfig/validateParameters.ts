import get from 'lodash/get';
import { ConfigurationParameters } from '../interfaces';

export function validateParameters(parameters: ConfigurationParameters): string | null {
  if (get(parameters, ['projectKey'], '').length < 1) {
    return 'Provide your Commercetools project key.';
  }

  if (get(parameters, ['clientId'], '').length < 1) {
    return 'Provide your Commercetools client ID.';
  }

  if (get(parameters, ['clientSecret'], '').length < 1) {
    return 'Provide your Commercetools client secret.';
  }

  if (get(parameters, ['apiEndpoint'], '').length < 1) {
    return 'Provide the Commercetools API endpoint.';
  }

  if (get(parameters, ['authApiEndpoint'], '').length < 1) {
    return 'Provide the Commercetools auth API endpoint.';
  }

  if (get(parameters, ['locale'], '').length < 1) {
    return 'Provide the Commercetools data locale.';
  }

  return null;
}
