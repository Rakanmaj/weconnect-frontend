import { useState } from 'react';
import Link from '@/router';
import { Mail, ArrowLeft } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { AuthLayout } from '@/components/public/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthError } from '@/lib/auth';
import { api } from '@/lib/api';
export default function ForgotPasswordPage(){
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
  async function submit(event){event.preventDefault();const email=new FormData(event.currentTarget).get('email');setBusy(true);setError('');try{const result=await api('/auth/forgot-password',{method:'POST',body:{email}});setMessage(result.message);}catch(error){setError(error.message);}finally{setBusy(false);}}
  return <PublicLayout><AuthLayout title="Reset your password" description="Request a secure password reset link" footer={<Link href="/login" className="inline-flex items-center gap-2 text-primary"><ArrowLeft className="h-4 w-4" />Back to sign in</Link>}>
    <AuthError message={error} />{message?<div className="py-4 text-center"><Mail className="mx-auto mb-4 h-10 w-10 text-primary" /><h2 className="text-h4">Check for your reset link</h2><p role="status" className="mt-3 text-sm text-muted">{message}</p><Button className="mt-6" variant="secondary" onClick={()=>setMessage('')}>Request another link</Button></div>:<form className="space-y-5" onSubmit={submit}><div className="space-y-2"><Label htmlFor="email" required>Email</Label><Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></div><Button type="submit" loading={busy} className="auth-primary-cta w-full">Send reset link</Button></form>}
  </AuthLayout></PublicLayout>;
}
