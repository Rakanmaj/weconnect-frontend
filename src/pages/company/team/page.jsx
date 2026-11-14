import { useState } from 'react';
import { PageHeader, FormField } from '@/components/ui/common';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuthError, useAuth } from '@/lib/auth';
import { api, useLinkToken, useResource } from '@/lib/api';
import { LoadingProfile, Notice } from '@/components/account/profile-tools';

export default function CompanyTeamPage() {
  const { user, refreshUser } = useAuth();
  const rawToken = useLinkToken();
  const [consumed, setConsumed] = useState(false), [open, setOpen] = useState(false), [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState(''), [message, setMessage] = useState(''), [invitee, setInvitee] = useState({ name: '', email: '' });
  const companyId = user.companyAccess.companyId;
  const token = consumed ? '' : rawToken;
  const teams = useResource('/team/workspaces');
  const resource = useResource('/team?companyId=' + companyId);
  const suffix = '?companyId=' + companyId;
  async function action(path, method, body) {
    setBusy(true); setFailure('');
    try { const result = await api('/team' + path, { method, body }); await resource.reload(); await teams.reload(); await refreshUser(); return result || {}; }
    catch (error) { setFailure(error.message); return null; }
    finally { setBusy(false); }
  }
  function showInvite(row = { name: '', email: '' }) { setInvitee(row); setFailure(''); setOpen(true); }
  async function invite(event) {
    event.preventDefault(); const form = Object.fromEntries(new FormData(event.currentTarget));
    if (await action('/invite' + suffix, 'POST', form)) {
      setOpen(false); setInvitee({ name: '', email: '' });
      setMessage('Member account created. The email contains their sign-in link, email, password and company role. They can sign in immediately.');
    }
  }
  async function accept() {
    if (await action('/accept', 'POST', { token })) { setConsumed(true); window.history.replaceState(null, '', window.location.pathname); setMessage('Invitation accepted. Your company workspace is now selected.'); }
  }
  async function switchWorkspace(event) {
    setBusy(true); setFailure('');
    try { await api('/team/switch', { method: 'POST', body: { companyId: event.target.value } }); await refreshUser(); setMessage('Company workspace changed.'); }
    catch (error) { setFailure(error.message); }
    finally { setBusy(false); }
  }
  if (!resource.data) return <LoadingProfile error={resource.error} />;
  const { members, canManage } = resource.data;
  const columns = [
    { key: 'name', header: 'Name', cell: row => row.name },
    { key: 'email', header: 'Email', cell: row => row.email },
    { key: 'role', header: 'Role', cell: row => canManage && row.role !== 'Owner' ? <select aria-label={'Role for ' + row.email} value={row.role} disabled={busy || row.status === 'revoked'} className="rounded-lg border border-border p-2 text-sm" onChange={event => action('/' + row.id + suffix, 'PATCH', { role: event.target.value })}>{['Admin', 'Evaluator', 'Recruiter'].map(role => <option key={role}>{role}</option>)}</select> : <Badge>{row.role}</Badge> },
    { key: 'status', header: 'Status', cell: row => row.status === 'invited' ? 'Awaiting sign-in setup' : row.status },
    { key: 'actions', header: 'Actions', cell: row => canManage && row.role !== 'Owner' ? <div className="flex flex-wrap gap-1">{row.status === 'invited' && <Button variant="secondary" size="sm" disabled={busy} onClick={() => showInvite(row)}>Set sign-in details</Button>}{row.status === 'revoked' && row.hasAccount ? <Button variant="secondary" size="sm" disabled={busy} onClick={() => action('/' + row.id + suffix, 'PATCH', { restore: true })}>Restore access</Button> : row.status !== 'revoked' && <Button variant="ghost" size="sm" disabled={busy} onClick={() => action('/' + row.id + suffix, 'DELETE', {})}>Revoke</Button>}</div> : null },
  ];
  return <>
    <PageHeader title="Team Management" description={`Manage staff access to ${resource.data.companyName}. Members sign in directly with credentials you provide.`} action={canManage && <Button onClick={() => showInvite()}>Invite member</Button>} />
    <AuthError message={failure || resource.error} /><Notice message={message} />
    {token && <div className="mb-6 rounded-xl border border-primary/20 bg-blue-50 p-5"><p className="mb-4 text-sm">This is an older invitation link. You can accept it with the original verified account. New members receive sign-in credentials instead.</p><Button loading={busy} onClick={accept}>Accept invitation</Button></div>}
    {teams.data?.workspaces.length > 1 && <FormField label="Company workspace"><select aria-label="Company workspace" value={companyId} onChange={switchWorkspace} disabled={busy} className="h-11 w-full max-w-md rounded-lg border border-border bg-card px-3 text-sm">{teams.data.workspaces.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}</select></FormField>}
    <div className="mb-6 grid gap-4 sm:grid-cols-3">{['Admin', 'Evaluator', 'Recruiter'].map(role => <div key={role} className="rounded-xl border border-border bg-card p-4"><Badge>{role}</Badge><p className="mt-2 text-caption">{role === 'Admin' ? 'Manage company settings, team, projects, hiring, evaluations and financial screens.' : role === 'Evaluator' ? 'View projects and submissions, compare work and access evaluations. No hiring, financial or company settings access.' : 'Access talent, matches, hiring, interviews and offers. No evaluations, financial or company settings access.'}</p></div>)}</div>
    <DataTable data={members} columns={columns} searchKeys={['name', 'email', 'role', 'status']} searchPlaceholder="Search team members..." />
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>Invite team member</DialogTitle></DialogHeader><form onSubmit={invite}>
      <AuthError message={failure} />
      <FormField label="Name" required><Input name="name" aria-label="Invitee name" required maxLength={100} defaultValue={invitee.name} /></FormField>
      <FormField label="Email" required><Input name="email" aria-label="Invitee email" type="email" required autoComplete="off" defaultValue={invitee.email} /></FormField>
      <FormField label="Password set by you" required helper="At least 8 characters. This password will be included in the member's email."><Input name="password" aria-label="Member password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" /></FormField>
      <FormField label="Role"><select name="role" aria-label="Invitee role" defaultValue={invitee.role || 'Evaluator'} className="h-11 w-full rounded-lg border border-border px-3">{['Evaluator', 'Recruiter', 'Admin'].map(role => <option key={role}>{role}</option>)}</select></FormField>
      <p className="mb-4 text-caption">A staff login will be created inside {resource.data.companyName}. No separate signup or company profile is needed. Use an email that does not already have an account.</p>
      <DialogFooter><Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button><Button type="submit" loading={busy}>Send invitation</Button></DialogFooter>
    </form></DialogContent></Dialog>
  </>;
}
