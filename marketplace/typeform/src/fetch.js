function rejectFetchOnHttpError(response) {
  if (!response.ok) {
    const error = new Error(response.statusMessage);
    error.response = response;

    if (response.status) {
      error.code = response.status;
    }

    return Promise.reject(error);
  }

  return response;
}

export function fetchForms(workspaceId, accessToken) {
  return fetch(
    `https://api.typeform.com/forms?page_size=200&search=${
      workspaceId ? `workspace_id=${workspaceId}` : ''
    }`,
    {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }
  )
    .then(rejectFetchOnHttpError)
    .then(response => response.json())
    .then(data => data.items);
}
