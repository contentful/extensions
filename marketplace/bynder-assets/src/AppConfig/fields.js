export function getCompatibleFields(contentTypes) {
  const compatibleFields = contentTypes.reduce((acc, ct) => {
    return {
      ...acc,
      [ct.sys.id]: (ct.fields || []).filter(field => field.type === 'Object')
    };
  }, {});

  const filteredContentTypes = contentTypes.filter(ct => {
    const fields = compatibleFields[ct.sys.id];
    return fields && fields.length > 0;
  });

  return { compatibleFields, filteredContentTypes };
}

export function currentStateToSelectedFields(currentState) {
  const eiState = (currentState || {}).EditorInterface || {};

  return Object.keys(eiState).reduce((acc, ctId) => {
    const { controls } = eiState[ctId];

    if (controls && controls.length > 0) {
      return { ...acc, [ctId]: controls.map(c => c.fieldId) };
    } else {
      return acc;
    }
  }, {});
}

export function selectedFieldsToTargetState(contentTypes, selectedFields) {
  return {
    EditorInterface: contentTypes.reduce((acc, ct) => {
      const { id } = ct.sys;
      const fields = selectedFields[id] || [];
      const targetState =
        fields.length > 0 ? { controls: fields.map(fieldId => ({ fieldId })) } : {};

      return { ...acc, [id]: targetState };
    }, {})
  };
}
