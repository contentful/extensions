import get from 'lodash/get';

/**
 * Transforms the API response of CommerceLayer into
 * the product schema expected by the SkuPicker component
 */
export const dataTransformer = projectUrl => product => {
  const { id } = product;
  const image = get(product, ['imageUrl']) || get(product, ['attributes', 'image_url']);
  const name = get(product, ['name']) || get(product, ['attributes', 'name']);
  const sku = get(product, ['code']) || get(product, ['attributes', 'code']);
  return {
    id,
    image,
    name,
    sku,
    externalLink: `${projectUrl}/admin/skus/${id}/edit`
  };
};
