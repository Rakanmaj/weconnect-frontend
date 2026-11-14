import { useState } from 'react';
import Link from '@/router';
import { Mail, CheckCircle2 } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { AuthLayout } from '@/components/public/auth-layout';
import { Button } from '@/components/ui/button';
import { AuthError, useAuth } from '@/lib/auth';
import { api, useLinkToken } from '@/lib/api';
import { Notice } from '@/components/account/profile-tools';
export default function VerifyEmailPage(){
  const {user,refreshUser}=useAuth();const token=useLinkToken();const [busy,setBusy]=useState(false),[verified,setVerified]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState('');
  async function perform(consume){setBusy(true);setError('');try{const result=await api('/auth/'+(consume?'verify-email':'send-verification'),{method:'POST',body:consume?{token}:{}});setMessage(result.message);if(consume){setVerified(true);window.history.replaceState(null,'',window.location.pathname);if(user)await refreshUser();}}catch(error){setError(error.message);}finally{setBusy(false);}}
  const success=verified||user?.emailVerified; const next=user?.role==='company'?'/company/verification':'/developer/onboarding';
  return <PublicLayout><AuthLayout title="Email verification" description="Confirm the email address used for your account" footer={<Link href={user?next:'/login'} className="text-primary">{user?'Continue account setup':'Sign in'}</Link>}>
    <div className="py-4 text-center">{success?<CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-teal" />:<Mail className="mx-auto mb-5 h-12 w-12 text-primary" />}<AuthError message={error} /><Notice message={message} />
    {success?<><h2 className="text-h4">Email verified</h2><p className="mt-3 text-sm text-muted">Continue with your account setup and verification review.</p><Button asChild className="mt-6"><Link href={user?next:'/login'}>Continue</Link></Button></>:token?<><p className="mb-5 text-sm">Use this link to verify your email. Links expire after 24 hours and can be used once.</p><Button loading={busy} onClick={()=>perform(true)}>Verify my email</Button></>:user?<><p className="mb-5 break-all text-sm">Send a verification link to {user.email}.</p><Button loading={busy} onClick={()=>perform(false)}>Send verification link</Button></>:<><p className="mb-5 text-sm">Sign in to request a new verification email, or open the link you received.</p><Button asChild><Link href="/login">Sign in</Link></Button></>}
    </div>
  </AuthLayout></PublicLayout>;
}
