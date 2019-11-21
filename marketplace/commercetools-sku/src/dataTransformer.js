import get from 'lodash/get';

/**
 * Transforms the API response of Commercetools into
 * the product schema expected by the SkuPicker component
 */
export const dataTransformer = (locale = 'en') => item => ({
  id: get(item, ['id'], ''),
  image: get(item, ['masterVariant', 'images', 0, 'url'], ''),
  name: get(item, ['name', locale], ''),
  sku: get(item, ['masterVariant', 'sku'], '')
});
