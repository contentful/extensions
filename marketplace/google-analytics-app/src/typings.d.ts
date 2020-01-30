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

export interface AnalyticsProps {
  pagePath: string;
  viewId: string;
  sdk: AppExtensionSDK;
}

export interface RangeOption {
  label: string;
  startDaysAgo: number;
  endDaysAgo: number;
}

export interface AnalyticsState {
  rangeOptionIndex: number;
  totalPageViews: number;
  range: RangeOption;
  today: Date;
  startEnd: {
    start: Date;
    end: Date;
  };
}

export interface TimelineProps {
  viewId: string;
  dimension: string;
  pagePath: string;
  range: {
    start: Date;
    end: Date;
  };
  onData: (event: { data: object }) => void;
  sdk: AppExtensionSDK;
}

export interface TimelineState {
  timeline: object;
  viewUrl: string;
}
