import Link from '@/router';
import { PageHeader, FormField } from '@/components/ui/common';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badges';
import { AuthError } from '@/lib/auth';
import { verificationLabel } from '@/lib/api';
import { EmailNotice, FileUpload, LoadingProfile, Notice, useEditableProfile } from '@/components/account/profile-tools';
export default function CompanyProfilePage() {
  const editor = useEditableProfile();
  if (!editor.data || !editor.draft) return <LoadingProfile error={editor.error} />;
  return <div className="max-w-3xl">
    <PageHeader title="Company Profile" description="Save company details and business registration information." action={<Button variant="secondary" asChild><Link href="/company/verification">View Verification Status</Link></Button>} />
    <EmailNotice /><AuthError message={editor.error} /><Notice message={editor.message} />
    <Card><CardContent className="pt-6"><StatusBadge status={verificationLabel(editor.data.verification.status)} />
      <form className="mt-5" onSubmit={event => { event.preventDefault(); editor.save(); }}>
        {Object.entries({ name:'Company name',industry:'Industry',location:'Location',website:'Website',contactName:'Contact name',contactTitle:'Contact title',registrationNumber:'Registration number',registrationCountry:'Registration country' }).map(([key,label]) => <FormField key={key} label={label} required={!key.startsWith('registration')}><Input {...editor.field(key)} required={!key.startsWith('registration')} type={key === 'website' ? 'url' : 'text'} /></FormField>)}
        <FormField label="Company size"><select {...editor.field('size')} className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm">{['1-10','11-50','50-200','200-500','500+'].map(size => <option key={size}>{size}</option>)}</select></FormField>
        <FormField label="About"><Textarea {...editor.field('about')} rows={4} /></FormField>
        <p className="mb-4 text-caption">Changes to reviewed details require a new verification review.</p>
        <Button type="submit" loading={editor.busy}>Save changes</Button>
      </form>
    </CardContent></Card>
    <Card className="mt-6"><CardContent className="pt-6"><FileUpload kind="registration" title="Business registration document" files={editor.data.files} onChange={editor.reload} /></CardContent></Card>
  </div>;
}
