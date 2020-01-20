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

// export const productPreviewsToVariantsTransformer = (productPreviews, selectedSKUs) =>
//   productsToVariantsTransformer(productPreviews).filter(variant =>
//     selectedSKUs.includes(variant.sku)
//   );

export const previewsToVariants = ({ apiEndpoint }) => ({ sku, id, image, product }) => ({
  image: image.src,
  variantSKU: sku,
  sku: id,
  productId: product.id,
  name: product.title,
  ...(apiEndpoint && { externalLink: `https://${apiEndpoint}/admin/products?query=${sku}` })
});
