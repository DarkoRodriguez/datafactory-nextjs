export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://datafactoryapirest-production.up.railway.app/api/v1';

export async function fetchJSON(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const headers: Record<string,string> = { 'Content-Type': 'application/json', ...(opts.headers || {}) } as any;
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  // if no content
  if (res.status === 204) return null;
  return res.json();
}

export function getSessionId() {
  let sid = localStorage.getItem('sessionId');
  if (!sid) {
    sid = `s_${Math.random().toString(36).slice(2,10)}`;
    localStorage.setItem('sessionId', sid);
  }
  return sid;
}
