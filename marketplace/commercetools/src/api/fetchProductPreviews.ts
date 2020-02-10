import { ConfigurationParameters, Product } from './../interfaces';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import { makeCommerceToolsClient } from './makeCommercetoolsClient';
import { productTransformer } from './dataTransformers';

export async function fetchProductPreviews(
  skus: string[],
  config: ConfigurationParameters
): Promise<Product[]> {
  if (!skus.length) {
    return [];
  }

  const client = makeCommerceToolsClient({ parameters: { installation: config } });
  const requestBuilder = (createRequestBuilder as any)({ projectKey: config.projectKey });
  const uri = requestBuilder.productProjectionsSearch
    .parse({
      filter: [`variants.sku:${skus.map(sku => `"${sku}"`).join(',')}`]
    })
    .build();
  const response = await client.execute({ uri, method: 'GET' });
  if (response.statusCode === 200) {
    const products = response.body.results.map(productTransformer(config));
    return products;
  }
  throw new Error(response.statusCode);
}
