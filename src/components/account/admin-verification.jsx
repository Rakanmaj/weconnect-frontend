import { useState } from 'react';
import Link from '@/router';
import { ArrowLeft, FileText } from 'lucide-react';
import { PageHeader, FormField } from '@/components/ui/common';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badges';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { AuthError } from '@/lib/auth';
import { api, useResource, verificationLabel } from '@/lib/api';
import { LoadingProfile, Notice } from './profile-tools';

export function VerificationQueue({ role }) {
  const {data,error,setError,reload} = useResource('/admin/verifications?role='+role); const [filter,setFilter] = useState('all');
  if (!data) return <LoadingProfile error={error} />;
  const columns = [
    {key:'name',header:role === 'company'?'Company':'Developer',cell:row=><Link className="text-primary underline" href={'/admin/'+role+'-verification/'+row.id}>{row.name}</Link>},
    {key:'email',header:'Email',cell:row=>row.email},
    {key:'description',header:role==='company'?'Industry':'Preferred role',cell:row=>row.description},
    {key:'status',header:'Status',cell:row=><StatusBadge status={verificationLabel(row.status)} />},
    {key:'submittedAt',header:'Submitted',cell:row=>new Date(row.submittedAt).toLocaleDateString()},
    {key:'documents',header:'Documents',cell:row=>row.documents},
  ];
  return <><PageHeader title={role==='company'?'Company Verification':'Developer Verification'} description="Review real submitted accounts. Decisions are saved and visible to the account owner." action={<Button variant="secondary" onClick={async()=>{try{await reload();}catch(error){setError(error.message);}}}>Refresh queue</Button>} /><AuthError message={error} />
    <DataTable data={data.items.filter(item=>filter==='all'||item.status===filter)} columns={columns} searchKeys={['name','email','description']} searchPlaceholder="Search submitted accounts..." filters={<select className="h-10 rounded-lg border border-border px-3 text-sm" aria-label="Verification status" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All statuses</option>{['pending','verified','more-info','rejected'].map(status=><option key={status} value={status}>{verificationLabel(status)}</option>)}</select>} />
  </>;
}
export function VerificationReview({ id, role }) {
  const {data,error,setError,reload} = useResource('/admin/verifications/'+id);
  const [feedback,setFeedback] = useState(''); const [decision,setDecision] = useState(''); const [busy,setBusy] = useState(false); const [message,setMessage] = useState('');
  if (!data) return <LoadingProfile error={error} />;
  if (data.user.role !== role) return <AuthError message="This account belongs to the other verification queue." />;
  async function review() {
    setBusy(true); setError('');
    try { await api('/admin/verifications/'+id,{method:'POST',body:{status:decision,feedback,revision:data.verification.revision}}); await reload(); setMessage('Review saved. The account owner can now see this decision and feedback.'); setDecision(''); }
    catch(error){setError(error.message);setDecision('');}finally{setBusy(false);}
  }
  const entries = Object.entries(data.profile).filter(([key,value])=>!['education','skills','projectTypes','onboardingStep','onboardingCompletedAt'].includes(key)&&value!==null&&value!=='');
  const label = key => ({ preferredPosition:'Preferred position',yearsExperience:'Years of experience',weeklyHours:'Weekly hours',firstName:'First name',lastName:'Last name',registrationNumber:'Registration number',registrationCountry:'Registration country',contactName:'Contact name',contactTitle:'Contact title',availableFrom:'Available from',careerPath:'Career path',careerGoals:'Career goals' }[key] || key.charAt(0).toUpperCase()+key.slice(1));
  return <><Link href={'/admin/'+role+'-verification'} className="mb-5 inline-flex items-center gap-2 text-sm text-muted"><ArrowLeft className="h-4 w-4" />Back to queue</Link><PageHeader title={role==='company'?data.profile.name:data.user.name} description={data.user.email} action={<StatusBadge status={verificationLabel(data.verification.status)} />} />
    <AuthError message={error} /><Notice message={message} />
    <div className="grid items-start gap-6 lg:grid-cols-3"><div className="space-y-6 lg:col-span-2"><Card><CardContent className="pt-6"><h2 className="mb-4 text-h3">Profile information</h2><dl className="grid gap-4 sm:grid-cols-2">{entries.map(([key,value])=><div key={key} className="min-w-0"><dt className="text-caption">{label(key)}</dt><dd className="break-words text-sm">{String(value)}</dd></div>)}</dl>
      {data.profile.education?.map((item,i)=><p key={i} className="mt-4 text-sm">{item.degree} · {item.institution} · {item.graduationYear}</p>)}<p className="mt-4 text-sm">{data.profile.skills?.join(', ')}</p></CardContent></Card>
      <Card><CardContent className="pt-6"><h2 className="mb-4 text-h3">Private documents</h2><div className="space-y-3">{data.files.map(file=><a key={file.id} href={'/api/files/'+file.id} className="flex items-center gap-2 break-all text-sm text-primary underline"><FileText className="h-4 w-4 shrink-0" />{file.kind}: {file.name}</a>)}</div></CardContent></Card>
      <Card><CardContent className="pt-6"><h2 className="mb-4 text-h3">Review history</h2>{data.history.map((event,i)=><div key={i} className="border-b border-border py-3 text-sm"><p className="font-medium">{verificationLabel(event.status)} · {new Date(event.createdAt).toLocaleString()}</p><p className="whitespace-pre-wrap break-words">{event.feedback}</p></div>)}</CardContent></Card>
    </div><Card><CardContent className="space-y-4 pt-6"><p className="text-caption">Approval verifies the account only. It does not award a performance badge.</p><p className="whitespace-pre-wrap text-sm">{data.verification.feedback}</p><FormField label="Feedback to account owner" helper="Required when rejecting or requesting information."><Textarea aria-label="Reviewer feedback" value={feedback} onChange={e=>setFeedback(e.target.value)} rows={5} /></FormField>
      {['verified','more-info','rejected'].map(status=><Button key={status} className="w-full" disabled={data.verification.status!=='pending'} variant={status==='verified'?'primary':status==='rejected'?'destructive':'secondary'} onClick={()=>setDecision(status)}>{status==='verified'?'Approve Account':status==='more-info'?'Request more information':'Reject'}</Button>)}
    </CardContent></Card></div>
    <ConfirmDialog open={Boolean(decision)} onOpenChange={()=>setDecision('')} title="Save verification decision?" description={'Set this account to '+verificationLabel(decision)+'. Feedback will be visible to its owner.'} confirmLabel="Save decision" loading={busy} onConfirm={review} />
  </>;
}
