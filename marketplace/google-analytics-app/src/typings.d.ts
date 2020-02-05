import { AppExtensionSDK, SidebarExtensionSDK } from 'contentful-ui-extensions-sdk';

// eslint-disable-next-line no-undef, @typescript-eslint/no-use-before-define
export type Gapi = typeof globalThis.gapi & { analytics: typeof gapi.analytics };

export interface AppConfigParams {
  sdk: AppExtensionSDK;
}

export interface SavedParams {
  contentTypes: ContentTypes;
  clientId: string;
  viewId: string;
}

export interface AllContentTypes {
  [id: string]: {
    name: string;
    fields: {
      id: string;
      name: string;
    }[];
  };
}

export interface ContentTypes {
  [id: string]: {
    urlPrefix: string;
    slugField: string;
  };
}

export interface AppConfigState extends SavedParams {
  allContentTypes: AllContentTypes;
}

export interface SidebarExtensionProps {
  sdk: SidebarExtensionSDK;
  gapi: Gapi;
}

export interface SidebarExtensionState {
  isAuthorized: boolean;
  hasSlug: boolean;
  pagePath: string;
  contentTypeId: string;
}

export interface AnalyticsProps {
  pagePath: string;
  viewId: string;
  sdk: SidebarExtensionSDK;
  gapi: Gapi;
}

export interface AnalyticsState {
  rangeOptionIndex: number;
  totalPageViews: number;
  startEnd: {
    start: Date;
    end: Date;
  };
  loading: boolean;
}

export interface TimelineProps {
  viewId: string;
  dimensions: string;
  pagePath: string;
  start: Date;
  end: Date;
  sdk: SidebarExtensionSDK;
  gapi: Gapi;
  onData: (data: ChartData) => void;
  onQuery: () => void;
  onError: () => void;
}

export interface TimelineState {
  viewUrl: string;
  loading: boolean;
}

export interface RangeOption {
  label: string;
  startDaysAgo: number;
  endDaysAgo: number;
}

export interface ChartData {
  rows: {
    c: {
      v: number;
    }[];
  }[];
}

export class DataChart {
  constructor(options: object);
  query(options: object): void;
  on<T extends object>(type: string, listener: (event: T) => void): void;
  set(options: { [key: string]: object }): DataChart;
  execute(): void;
}

declare namespace gapi.analytics {
  export const googleCharts: {
    DataChart: typeof DataChart;
  };
  export const auth: {
    isAuthorized: () => boolean;
    signOut: () => void;
    authorize: (options: { container: HTMLElement | string; clientid: string }) => void;
    on(type: string, listener: () => void): void;
  };
}

export interface AccountsSummary {
  result: {
    items: {
      id: string;
      webProperties: {
        internalWebPropertyId: string;
        profiles: {
          id: string;
        }[];
      }[];
    }[];
  };
}
