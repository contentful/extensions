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

export interface SidebarExtensionProps {
  sdk: AppExtensionSDK;
}

export interface SidebarExtensionState {
  parameters: object;
  isAuthorized: boolean;
  hasSlug: boolean;
  pagePath: boolean;
  contentTypeId: string;
}
