import get from 'lodash/get';
import { CollectionResponse, EditorInterface, AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import { SavedParams } from './typings';

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getAndUpdateSavedParams(sdk: AppExtensionSDK) {
  const { space, ids } = sdk;
  const [savedParams, eisResponse] = await Promise.all([
    sdk.app.getParameters() as Promise<SavedParams>,
    space.getEditorInterfaces() as Promise<CollectionResponse<EditorInterface>>
  ]);
  const selectedContentTypes = (
    (eisResponse &&
      (eisResponse as { items: { sidebar: { widgetNamespace: string; widgetId: string }[] }[] })
        .items) ||
    []
  )
    .filter(
      ei =>
        !!get(ei, ['sidebar'], []).find(item => {
          return item.widgetNamespace === 'app' && item.widgetId === ids.app;
        })
    )
    .map(ei => get(ei, ['sys', 'contentType', 'sys', 'id']))
    .filter(ctId => typeof ctId === 'string' && ctId.length > 0);

  const savedContentTypes: {
    [key: string]: object;
  } = (savedParams && savedParams.contentTypes) || {};
  // remove content types for which the app has been removed from the sidebar
  const contentTypes = selectedContentTypes.reduce((acc, key: string) => {
    const saved = savedContentTypes[key];

    if (key && saved) {
      acc[key] = saved;
    }

    return acc;
  }, {});

  return {
    ...savedParams,
    contentTypes
  };
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
  { lowerLimit: 29, interval: 'nthWeek' },
  { lowerLimit: 5, interval: 'date' },
  { lowerLimit: -Infinity, interval: 'nthhour' }
];

export function getDateRangeInterval(start: Date, end: Date) {
  const nDays = (end.valueOf() - start.valueOf()) / DAY_IN_MS;

  for (const breakpoint of daysBreakpoints) {
    if (nDays >= breakpoint.lowerLimit) {
      return breakpoint.interval;
    }
  }

  return '';
}
