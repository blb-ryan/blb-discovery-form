const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Call a Vercel serverless API endpoint.
 */
export async function callApi(path, body) {
  const url = `${BASE_URL}${path}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await resp.json();

  if (!resp.ok) {
    const error = new Error(data.error || `API error ${resp.status}`);
    error.status = resp.status;
    error.data = data;
    throw error;
  }

  return data;
}
