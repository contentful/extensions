import { get } from 'lodash-es';

export function currentStateToEnabledContentTypes(currentState) {
  const eiState = get(currentState, ['EditorInterface'], {});
  const ctIds = Object.keys(eiState);

  return ctIds.filter(id => !!get(eiState, [id, 'sidebar']));
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
