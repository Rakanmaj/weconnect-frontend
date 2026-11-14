import { useState } from 'react';
import Link from '@/router';
import { CheckCircle2 } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { AuthLayout } from '@/components/public/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthError } from '@/lib/auth';
import { api, useLinkToken } from '@/lib/api';
export default function ResetPasswordPage(){
  const token=useLinkToken();const [busy,setBusy]=useState(false),[done,setDone]=useState(false),[error,setError]=useState('');
  async function submit(event){event.preventDefault();const form=new FormData(event.currentTarget);setBusy(true);setError('');try{await api('/auth/reset-password',{method:'POST',body:{token,password:form.get('password'),confirmPassword:form.get('confirmPassword')}});setDone(true);window.history.replaceState(null,'',window.location.pathname);}catch(error){setError(error.message);}finally{setBusy(false);}}
  return <PublicLayout><AuthLayout title="Set new password" description="Your reset link is valid for 30 minutes" footer={<Link href="/login" className="text-primary">Back to sign in</Link>}>
    <AuthError message={error} />{done?<div className="py-4 text-center"><CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-teal" /><h2 className="text-h4">Password updated</h2><p className="mt-3 text-sm text-muted">Sign in with your new password. Previous sessions have been signed out.</p><Button asChild className="mt-6"><Link href="/login">Sign in</Link></Button></div>:!token?<div className="space-y-4"><p className="text-sm">Open the reset link from your email to choose a new password.</p><Button asChild><Link href="/login/forgot-password">Request reset link</Link></Button></div>:<form onSubmit={submit} className="space-y-5">{[['password','New password'],['confirmPassword','Confirm password']].map(([key,label])=><div className="space-y-2" key={key}><Label htmlFor={key}>{label}</Label><Input id={key} name={key} type="password" autoComplete="new-password" required minLength={8} maxLength={128} /></div>)}<p className="text-caption">Use 8–128 characters.</p><Button type="submit" loading={busy} className="w-full">Update password</Button></form>}
  </AuthLayout></PublicLayout>;
}
