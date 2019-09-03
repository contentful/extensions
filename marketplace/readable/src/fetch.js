import md5 from 'blueimp-md5';

export async function fetchReadableResults(apiKey, text) {
  const requestTime = Math.floor(Date.now() / 1000);
  const body = new URLSearchParams([['text', text]]);

  const request = new Request('https://api.readable.com/api/text/', {
    method: 'POST',
    headers: {
      API_REQUEST_TIME: requestTime,
      API_SIGNATURE: md5(`${apiKey}${requestTime}`)
    },
    body
  });

  const response = await fetch(request);
  const result = await response.json();

  return result;
}
