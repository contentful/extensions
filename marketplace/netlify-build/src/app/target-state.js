import get from 'lodash.get';

export function editorInterfacesToEnabledContentTypes(eis, appId) {
  const findAppWidget = item => item.widgetNamespace === 'app' && item.widgetId === appId;

  return eis
    .filter(ei => !!get(ei, ['sidebar'], []).find(findAppWidget))
    .map(ei => get(ei, ['sys', 'contentType', 'sys', 'id']))
    .filter(ctId => typeof ctId === 'string' && ctId.length > 0);
}

export function enabledContentTypesToTargetState(contentTypes, enabledContentTypes) {
  return {
    EditorInterface: contentTypes.reduce((acc, [ctId]) => {
      return {
        ...acc,
        [ctId]: enabledContentTypes.includes(ctId) ? { sidebar: { position: 2 } } : {}
      };
    }, {})
  };
}
