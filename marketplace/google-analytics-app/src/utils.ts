import get from 'lodash.get';
import { CollectionResponse, EditorInterface } from 'contentful-ui-extensions-sdk';

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
