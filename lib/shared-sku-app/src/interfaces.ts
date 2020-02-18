import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';

export type Hash = Record<string, any>;

export interface Product {
  sku: string;
  image: string;
  id: string;
  name: string;
  externalLink?: string;
}

export interface Pagination {
  offset: number;
  total: number;
  count: number;
  limit: number;
  hasNextPage?: boolean;
}

interface ProductsFnResponse {
  pagination: Pagination;
  products: Product[];
}
export type ProductsFn = (
  search: string,
  pagination?: Partial<Pagination>
) => Promise<ProductsFnResponse>;

export type MakeCTAFn = (fieldType: string) => string;
export type ValidateParametersFn = (parameters: Record<string, string>) => string | null;
export type ProductPreviewsFn = (skus: string[], config: Hash) => Promise<Product[]>;
export type DeleteFn = (index: number) => void;
export type OpenDialogFn = (
  sdk: FieldExtensionSDK,
  currentValue: string[] | string,
  config: Hash
) => Promise<string[]>;
export type DisabledPredicateFn = (currentValue: string[], config: Hash) => boolean;

export interface Integration {
  makeCTA: MakeCTAFn;
  name: string;
  logo: string;
  color: string;
  description: string;
  parameterDefinitions: Hash[];
  validateParameters: ValidateParametersFn;
  fetchProductPreviews: ProductPreviewsFn;
  renderDialog: Function;
  openDialog: OpenDialogFn;
  isDisabled: DisabledPredicateFn;
}
