import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';

export type Hash = Record<string, any>;

export type ValidateParametersFn = (parameters: Record<string, string>) => string | null;
export type ThumbnailFn = (resource: Hash, config: Hash) => (string | undefined)[];
export type DeleteFn = (index: number) => void;
export type OpenDialogFn = (
  sdk: FieldExtensionSDK,
  currentValue: Hash[],
  config: Hash
) => Promise<Hash[]>;
export type DisabledPredicateFn = (currentValue: Hash[], config: Hash) => boolean;

export interface Integration {
  cta: string;
  name: string;
  logo: string;
  color: string;
  description: string;
  parameterDefinitions: Hash[];
  validateParameters: ValidateParametersFn;
  makeThumbnail: ThumbnailFn;
  renderDialog: Function;
  openDialog: OpenDialogFn;
  isDisabled: DisabledPredicateFn;
}
