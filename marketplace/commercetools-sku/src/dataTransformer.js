import get from 'lodash/get';

/**
 * Transforms the API response of Commercetools into
 * the product schema expected by the SkuPicker component
 */
export const dataTransformer = ({ projectKey, locale }) => item => {
  const id = get(item, ['id'], '');
  const externalLink =
    (projectKey && id && `https://mc.commercetools.com/${projectKey}/products/${id}/general`) || '';
  return {
    id,
    image: get(item, ['masterVariant', 'images', 0, 'url'], ''),
    name: get(item, ['name', locale], ''),
    sku: get(item, ['masterVariant', 'sku'], ''),
    externalLink
  };
};
