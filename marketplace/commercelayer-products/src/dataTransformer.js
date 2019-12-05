/**
 * Transforms the API response of CommerceLayer into
 * the product schema expected by the SkuPicker component
 */
export const dataTransformer = projectUrl => ({
  id,
  attributes: { image_url: imageUrl, name, code }
}) => {
  return {
    id,
    image: imageUrl,
    name,
    sku: code,
    externalLink: `${projectUrl}/admin/skus/${id}/edit`
  };
};

/**
 * Transforms the API response of CommerceLayer into
 * the product schema expected by SkuPicker Preview components
 */
export const previewDataTransformer = projectUrl => ({ id, imageUrl, name, code }) => {
  return {
    id,
    image: imageUrl,
    name,
    sku: code,
    externalLink: `${projectUrl}/admin/skus/${id}/edit`
  };
};
