import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
export async function api(path, options = {}) {
  const { body, ...rest } = options;
  const multipart = body instanceof FormData;
  let response;
  try {
    response = await fetch(`/api${path}`, { credentials: 'same-origin', ...rest,
      ...(body !== undefined ? { body: multipart ? body : JSON.stringify(body), headers: multipart ? undefined : { 'Content-Type': 'application/json' } } : {}) });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Cannot reach the service. Check your connection and try again.');
  }
  if (response.status === 204) return null;
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(result.error || 'The request could not be completed.'), { status: response.status });
  return result;
}
export function useResource(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    setData(null); setError('');
    const controller = new AbortController();
    api(path, { signal: controller.signal }).then(setData).catch(error => { if (error.name !== 'AbortError') setError(error.message); });
    return () => controller.abort();
  }, [path]);
  async function reload() { const result = await api(path); setData(result); return result; }
  return { data, setData, error, setError, reload };
}
export const verificationLabel = status => ({ draft: 'Draft', pending: 'Pending Verification', verified: 'Verified', 'more-info': 'More Information Required', rejected: 'Rejected' }[status] || 'Draft');
export function linkToken() { return new URLSearchParams(window.location.hash.slice(1)).get('token') || ''; }
export function useLinkToken() { const { hash } = useLocation(); return new URLSearchParams(hash.slice(1)).get('token') || ''; }
