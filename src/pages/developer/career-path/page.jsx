import { useState } from 'react';
import Link from '@/router';
import { PageHeader } from '@/components/ui/common';
import { Card } from '@/components/developer/card';
import { Button } from '@/components/ui/button';
import { CAREER_PATHS } from '@/lib/platform-config';
import { api, useResource } from '@/lib/api';
import { AuthError } from '@/lib/auth';
import { LoadingProfile, Notice } from '@/components/account/profile-tools';
export default function CareerPathPage() {
  const {data,error,reload} = useResource('/profile');
  const [path,setPath] = useState(''); const [message,setMessage] = useState(''); const [failure,setFailure] = useState(''); const [busy,setBusy] = useState(false);
  if (!data) return <LoadingProfile error={error} />;
  const selected = path || data.profile.careerPath || data.profile.preferredPosition;
  const approved = data.verification.status === 'verified';
  async function save() { setBusy(true); setFailure(''); try { await api('/profile/career-path',{method:'PUT',body:{careerPath:selected}}); await reload(); setMessage('Career path saved.'); } catch(error){setFailure(error.message);} finally{setBusy(false);} }
  return <div className="mx-auto max-w-2xl"><PageHeader title="Choose Career Path" description="Choose the career path for your initial assessment after account approval." /><Card>
    <AuthError message={failure} /><Notice message={message} />
    {!approved && <p className="mb-5 text-sm text-amber-800">Your account is awaiting approval. <Link href="/developer/verification" className="underline">View verification</Link></p>}
    <div className="space-y-3">{CAREER_PATHS.map(item=><button key={item} type="button" disabled={!approved} onClick={()=>setPath(item)} className={'w-full rounded-lg border p-4 text-left '+(selected===item?'border-primary bg-blue-50':'border-border')}><p className="text-label">{item}</p></button>)}</div>
    <Button className="mt-6" disabled={!approved||!selected} loading={busy} onClick={save}>Confirm career path</Button>
    {approved && data.profile.careerPath && <Button className="ml-3 mt-6" variant="secondary" asChild><Link href="/developer/assessment?view=intro">Continue to Assessment</Link></Button>}
  </Card></div>;
}
