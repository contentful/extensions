import { FieldsConfig } from './AppConfig/fields';

export interface ConfigurationParameters {
  projectKey?: string;
  clientId?: string;
  clientSecret?: string;
  apiEndpoint?: string;
  authApiEndpoint?: string;
  locale?: string;
  fieldsConfig?: FieldsConfig;
}

export type Hash = Record<string, any>;

export interface Category {
  slug: string;
  id: string;
  name: string;
  externalLink?: string;
}

export interface Product {
  sku: string;
  image: string;
  id: string;
  name: string;
  externalLink?: string;
}

export type PreviewsFn = (skus: string[]) => Promise<Product[]>;

export type DeleteFn = (index: number) => void;
