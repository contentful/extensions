const BACKEND_URL = 'https://backends.ctffns.net/image-tagging';

export const requestTags = async (imageUrl) => {
  const response = await fetch(`${BACKEND_URL}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: imageUrl
    }),
  });

  if (response.ok) {
    const body = await response.json();
    return body.tags
  } else {
    throw new Error('Failed to load tags for image')
  }
};

export const mergeTags = (oldTags, newTags) =>
  Array.from(new Set((oldTags).concat(newTags)));
