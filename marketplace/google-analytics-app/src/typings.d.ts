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
  allContentTypeKeys: string[];
  contentTypes: {
    [id: string]: {
      urlPrefix: string;
      slugField: string;
    };
  };
  clientId: string;
  viewId: string;
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

export interface AnalyticsProps {
  pagePath: string;
  viewId: string;
  sdk: AppExtensionSDK;
  gapi: typeof window['gapi'];
}

export interface AnalyticsState {
  rangeOptionIndex: number;
  totalPageViews: number;
  today: Date;
  startEnd: {
    start: Date;
    end: Date;
  };
}

export interface TimelineProps {
  viewId: string;
  dimensions: string;
  pagePath: string;
  start: Date;
  end: Date;
  sdk: AppExtensionSDK;
  gapi: typeof window['gapi'];
  onData: (event: { data: object }) => void;
  onQuery: () => void;
  onError: () => void;
}

export interface TimelineState {
  timeline: object;
  viewUrl: string;
  loading: boolean;
}

export interface RangeOption {
  label: string;
  startDaysAgo: number;
  endDaysAgo: number;
}
