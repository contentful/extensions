import get from 'lodash/get';

/**
 * Transforms the API response of Shopify into
 * the product schema expected by the SkuPicker component
 */
export const dataTransformer = () => product => {
  // const { id } = product;
  // const image = get(product, ['imageUrl']) || get(product, ['attributes', 'image_url']);
  // const name = get(product, ['name']) || get(product, ['attributes', 'name']);
  // const sku = get(product, ['code']) || get(product, ['attributes', 'code']);
  const image = get(product, ['images', 0, 'src'], '');
  const sku = get(product, ['variants', 0, 'sku'], '');
  return {
    id: product.id,
    image,
    name: product.title,
    sku
    // externalLink: `${projectUrl}/admin/skus/${id}/edit`
  };
};
