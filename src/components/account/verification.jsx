import { useState } from 'react';
import Link from '@/router';
import { Clock, CheckCircle2, AlertCircle, XCircle, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/common';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/developer/card';
import { StatusBadge } from '@/components/ui/status-badges';
import { AuthError, useAuth } from '@/lib/auth';
import { api, useResource, verificationLabel } from '@/lib/api';
import { EmailNotice, FileUpload, LoadingProfile } from './profile-tools';

export function AccountVerification({ role }) {
  const { data, error, setError, reload } = useResource('/profile');
  const { refreshUser } = useAuth(); const [busy, setBusy] = useState(false);
  if (!data) return <LoadingProfile error={error} />;
  const status = data.verification.status;
  const Icon = { verified: CheckCircle2, pending: Clock, rejected: XCircle }[status] || AlertCircle;
  const edit = role === 'developer' ? '/developer/onboarding' : '/company/profile';
  async function submit() {
    setBusy(true); setError('');
    try { await api('/profile/submit', { method: 'POST', body: {} }); await reload(); await refreshUser(); }
    catch (error) { setError(error.message); } finally { setBusy(false); }
  }
  return <div className="mx-auto max-w-3xl min-w-0 space-y-6">
    <PageHeader title={role === 'developer' ? 'Account Verification' : 'Company Verification'} description="Track the review of your submitted information and documents." />
    <EmailNotice /><AuthError message={error} />
    <Card className="text-center"><div className={'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full '+(status === 'verified' ? 'bg-teal/10 text-teal' : 'bg-amber-50 text-amber-700')}><Icon className="h-8 w-8" /></div>
      <StatusBadge status={verificationLabel(status)} />
      <p className="mx-auto mt-4 max-w-lg text-sm text-muted">{{ draft: 'Complete your profile and upload the required documents, then submit for review.', pending: 'Your submission is in the admin review queue. Refresh to check for a decision.', verified: 'Your account has been approved. This is account verification; performance verification is earned separately.', 'more-info': 'Please address the reviewer feedback and submit your updated information.', rejected: 'Review the feedback, correct your information, and submit again.' }[status]}</p>
      {data.verification.feedback && <div className="mt-5 rounded-lg border border-border bg-surface p-4 text-left"><p className="mb-1 text-label">Reviewer feedback</p><p className="whitespace-pre-wrap break-words text-sm">{data.verification.feedback}</p></div>}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="secondary" asChild><Link href={edit}>Edit Profile</Link></Button>
        <Button variant="secondary" disabled={busy} onClick={async () => { setError(''); try { await reload(); await refreshUser(); } catch (error) { setError(error.message); } }}>Refresh status</Button>
        {!['pending','verified'].includes(status) && <Button loading={busy} onClick={submit}>Submit for review</Button>}
        {status === 'verified' && <Button asChild><Link href={role === 'developer' ? '/developer/career-path' : '/company/dashboard'}>{role === 'developer' ? 'Choose Career Path' : 'Go to Dashboard'}</Link></Button>}
      </div>
    </Card>
    <Card><h3 className="mb-4 text-h4">Submitted Information</h3><dl className="space-y-3 text-sm">{[['Name', role === 'developer' ? data.user.name : data.profile.name], ['Email', data.ownerEmail || data.user.email], ['Location', data.profile.location], ['Submitted', data.verification.submittedAt ? new Date(data.verification.submittedAt).toLocaleString() : 'Not submitted']].map(([key,value]) => <div key={key} className="grid gap-1 sm:grid-cols-2"><dt className="text-muted">{key}</dt><dd className="break-all">{value}</dd></div>)}</dl>
      <div className="mt-5 space-y-2">{data.files.map(file => <a key={file.id} href={'/api/files/'+file.id} className="flex items-center gap-2 break-all text-sm text-primary underline"><FileText className="h-4 w-4 shrink-0" />{file.name}</a>)}</div>
    </Card>
    <Card><FileUpload kind={role === 'developer' ? 'identity' : 'registration'} title={role === 'developer' ? 'Additional verification document' : 'Business registration document'} files={data.files} onChange={async () => { await reload(); await refreshUser(); }} /></Card>
    {data.history.length > 0 && <Card><h3 className="mb-4 text-h4">Review history</h3><ol className="space-y-4">{data.history.map((event,index) => <li key={index} className="border-l-2 border-border pl-4 text-sm"><p className="font-medium">{verificationLabel(event.status)}</p><p className="text-caption">{new Date(event.createdAt).toLocaleString()}</p><p className="whitespace-pre-wrap break-words">{event.feedback}</p></li>)}</ol></Card>}
  </div>;
}
