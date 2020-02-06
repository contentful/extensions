import get from 'lodash/get';
import { Product, Hash, ConfigurationParameters } from '../interfaces';

/**
 * Transforms the API response of Commercetools into
 * the product schema expected by the SkuPicker component
 */
export const dataTransformer = ({ projectKey, locale }: ConfigurationParameters) => (
  item: Hash
): Product => {
  const id = get(item, ['id'], '');
  const externalLink =
    (projectKey && id && `https://mc.commercetools.com/${projectKey}/products/${id}/general`) || '';
  return {
    id,
    image: get(item, ['masterVariant', 'images', 0, 'url'], ''),
    name: get(item, ['name', locale || 'en'], ''),
    sku: get(item, ['masterVariant', 'sku'], ''),
    externalLink
  };
};
