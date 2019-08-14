import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';

export type Hash = Record<string, any>;

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
  logo: string;
  makeThumbnail: ThumbnailFn;
  renderDialog: Function;
  openDialog: OpenDialogFn;
  isDisabled: DisabledPredicateFn;
}
