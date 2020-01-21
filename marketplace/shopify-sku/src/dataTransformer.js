import get from 'lodash/get';
import flatten from 'lodash/flatten';

/**
 * Transforms the API response of Shopify into
 * the product schema expected by the SkuPicker component
 */
export const dataTransformer = ({ apiEndpoint }) => product => {
  const image = get(product, ['image', 'src'], '');
  const sku = get(product, ['sku'], '');
  return {
    id: product.id,
    image,
    name: product.title,
    sku,
    ...(apiEndpoint && { externalLink: `https://${apiEndpoint}/admin/products?query=${sku}` })
  };
};

export const productsToVariantsTransformer = products =>
  flatten(
    products.map(product => {
      const variants = product.variants.map(variant => ({
        ...variant,
        variantSKU: variant.sku,
        sku: variant.id,
        productId: product.id,
        title: product.title,
        hasNextPage: false
      }));
      variants[variants.length - 1].hasNextPage = product.hasNextPage;
      return variants;
    })
  );

export const previewsToVariants = ({ apiEndpoint }) => ({ sku, id, image, product }) => ({
  id,
  image: image.src,
  // TODO: Remove sku:id when shared-sku-app supports internal IDs
  // as an alternative piece of info to persist instead of the SKU.
  // For now this is a temporary hack.
  sku: id,
  productId: product.id,
  name: product.title,
  ...(apiEndpoint && { externalLink: `https://${apiEndpoint}/admin/products?query=${sku}` })
});
