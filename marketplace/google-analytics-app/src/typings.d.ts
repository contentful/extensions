import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';

export interface AppConfigParams {
  sdk: AppExtensionSDK;
}

export interface AppConfigState {
  allContentTypes: {
    [id: string]: {
      fields: {
        [id: string]: string;
        name: string;
      }[];
    };
  };
  contentTypes: {
    [id: string]: {
      urlPrefix: string;
      slugField: string;
    };
  };
}
