import get from 'lodash.get';
import { CollectionResponse, EditorInterface, AppExtensionSDK } from 'contentful-ui-extensions-sdk';

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getSidebarLocations(sdk: AppExtensionSDK) {
  const { space, ids } = sdk;
  const eisResponse = (await space.getEditorInterfaces()) as CollectionResponse<EditorInterface>;
  const selectedContentTypes = eisResponse.items
    .filter(
      ei =>
        !!get(ei, ['sidebar'], []).find(item => {
          return item.widgetNamespace === 'app' && item.widgetId === ids.app;
        })
    )
    .map(ei => get(ei, ['sys', 'contentType', 'sys', 'id']))
    .filter(ctId => typeof ctId === 'string' && ctId.length > 0);

  return selectedContentTypes;
}

const largeNumberBreakpoints = [
  { lowerLimit: 1_000_000, suffix: 'm' },
  { lowerLimit: 1_000, suffix: 'k' }
];

export function formatLargeNumbers(n: number) {
  for (const breakpoint of largeNumberBreakpoints) {
    if (n >= breakpoint.lowerLimit) {
      return Math.round(n / (breakpoint.lowerLimit / 10)) / 10 + breakpoint.suffix;
    }
  }

  return `${n}`;
}

export const DAY_IN_MS = 1000 * 60 * 60 * 24;

const daysBreakpoints = [
  { lowerLimit: 29, interval: 'week' },
  { lowerLimit: 5, interval: 'date' },
  { lowerLimit: -Infinity, interval: 'hour' }
];

export function getDateRangeInterval(start: Date, end: Date) {
  const days = (end.valueOf() - start.valueOf()) / DAY_IN_MS;

  for (const breakpoint of daysBreakpoints) {
    if (days >= breakpoint.lowerLimit) {
      return breakpoint.interval;
    }
  }
}
