import { useEffect, useState } from 'react';
import Link from '@/router';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthError, useAuth } from '@/lib/auth';
import { api, useResource } from '@/lib/api';
export function LoadingProfile({ error }) { return error ? <AuthError message={error} /> : <p role="status" className="p-6 text-muted">Loading saved information…</p>; }
export function Notice({ message }) { return message ? <p role="status" className="my-4 rounded-lg bg-teal/10 p-3 text-sm text-teal-800">{message}</p> : null; }
export function EmailNotice() {
  const { user } = useAuth();
  if (user?.emailVerified || (user?.role === 'company' && !user.companyAccess?.isOwner)) return null;
  return <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><p>Verify {user?.email} before submitting for account review.</p><Button variant="secondary" size="sm" asChild><Link href="/register/verify-email">Verify email</Link></Button></div>;
}
export function useEditableProfile() {
  const resource = useResource('/profile');
  const { refreshUser } = useAuth();
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => { if (resource.data && !draft) setDraft(resource.data.profile); }, [resource.data, draft]);
  const field = name => ({ name, 'aria-label': name, value: draft?.[name] ?? '', onChange: e => setDraft(current => ({ ...current, [name]: e.target.value })) });
  async function save(extra = {}) {
    setBusy(true); resource.setError(''); setMessage('');
    try {
      const result = await api('/profile', { method: 'PUT', body: { ...draft, ...extra } });
      resource.setData(result); setDraft(result.profile); await refreshUser(); setMessage('Profile saved.'); return result;
    } catch (error) { resource.setError(error.message); return null; }
    finally { setBusy(false); }
  }
  async function reload() { const result = await resource.reload(); await refreshUser(); return result; }
  return { ...resource, reload, draft, setDraft, field, busy, message, setMessage, save };
}
export function FileUpload({ kind, files = [], onChange, title }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function upload(event) {
    const file = event.target.files?.[0]; if (!file) return;
    setBusy(true); setError('');
    try { const body = new FormData(); body.append('file', file); await api(`/files/${kind}`, { method: 'POST', body }); await onChange(); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); event.target.value = ''; }
  }
  async function remove(id) {
    setBusy(true); setError('');
    try { await api(`/files/${id}`, { method: 'DELETE', body: {} }); await onChange(); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  return <div className="space-y-4"><div className="rounded-xl border-2 border-dashed border-border p-6 text-center"><Upload className="mx-auto mb-3 h-7 w-7 text-muted" /><p className="font-medium">{title || 'Upload document'}</p><p className="mt-1 text-caption">{kind === 'cv' ? 'PDF up to 5 MB' : kind === 'avatar' ? 'PNG or JPEG up to 2 MB' : 'PDF, PNG or JPEG up to 10 MB'}. Files are private to you and account reviewers.</p><input aria-label={title || `Upload ${kind}`} type="file" accept={kind === 'cv' ? 'application/pdf' : kind === 'avatar' ? 'image/png,image/jpeg' : 'application/pdf,image/png,image/jpeg'} onChange={upload} disabled={busy} className="mt-4 block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-border file:bg-white file:px-4 file:py-2 file:font-medium file:text-navy" />{busy && <p role="status" className="mt-2 text-sm">Updating files…</p>}</div><AuthError message={error} />
    {files.filter(file => file.kind === kind).map(file => <div key={file.id} className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-surface p-3 text-sm"><FileText className="h-4 w-4 shrink-0 text-primary" /><a className="min-w-0 flex-1 break-all text-primary underline" href={`/api/files/${file.id}`}>{file.name}</a><span className="shrink-0 text-caption">{Math.ceil(file.size / 1024)} KB</span><Button type="button" variant="ghost" size="sm" aria-label={`Remove ${file.name}`} disabled={busy} onClick={() => remove(file.id)}><Trash2 className="h-4 w-4" /></Button></div>)}
  </div>;
}
