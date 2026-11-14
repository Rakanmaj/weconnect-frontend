import Link from '@/router';
import { PageHeader, FormField } from '@/components/ui/common';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/developer/card';
import { Avatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badges';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AuthError, useAuth } from '@/lib/auth';
import { verificationLabel } from '@/lib/api';
import { EmailNotice, FileUpload, LoadingProfile, Notice, useEditableProfile } from '@/components/account/profile-tools';
export default function ProfilePage() {
  const { user } = useAuth(); const editor = useEditableProfile();
  if (!editor.data || !editor.draft) return <LoadingProfile error={editor.error} />;
  return <div className="mx-auto max-w-3xl min-w-0 space-y-6">
    <PageHeader title="Profile" description="Manage your saved developer profile." action={<Button variant="secondary" asChild><Link href="/developer/onboarding">Edit full profile</Link></Button>} />
    <EmailNotice /><AuthError message={editor.error} /><Notice message={editor.message} />
    <form onSubmit={e => { e.preventDefault(); editor.save(); }} className="space-y-6">
      <Card><div className="mb-6 flex items-center gap-4"><Avatar name={user.name} src={editor.data.files.find(file => file.kind === 'avatar') ? '/api/files/'+editor.data.files.find(file => file.kind === 'avatar').id+'?view=photo' : undefined} size="lg" /><div><h2 className="text-h3">{user.name}</h2><StatusBadge status={verificationLabel(editor.data.verification.status)} /></div></div>
        <div className="grid gap-x-4 sm:grid-cols-2">{['firstName','lastName'].map(key => <FormField key={key} label={key === 'firstName' ? 'First Name' : 'Last Name'}><Input required {...editor.field(key)} /></FormField>)}</div>
        <FormField label="Email"><Input value={user.email} readOnly /></FormField>
        <FormField label="Location"><Input required {...editor.field('location')} /></FormField>
        <FormField label="Phone"><Input {...editor.field('phone')} /></FormField>
        <FormField label="Bio"><Textarea {...editor.field('bio')} rows={4} /></FormField>
      </Card>
      <Card><h3 className="mb-4 text-h4">Links</h3>{['github','linkedin','portfolio'].map(key => <FormField key={key} label={{github:'GitHub',linkedin:'LinkedIn',portfolio:'Portfolio'}[key]}><Input type="url" {...editor.field(key)} /></FormField>)}</Card>
      <Card><h3 className="mb-4 text-h4">Skills on Profile</h3><div className="mb-4 flex flex-wrap gap-2">{editor.draft.skills.map(skill => <span key={skill} className="rounded-lg bg-surface px-3 py-2 text-sm">{skill}</span>)}</div><Button variant="secondary" asChild><Link href="/developer/onboarding?step=4">Edit skills and availability</Link></Button></Card>
      <div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={() => editor.setDraft(editor.data.profile)}>Cancel</Button><Button type="submit" loading={editor.busy}>Save Changes</Button></div>
    </form>
    <Card><FileUpload kind="avatar" title="Profile photo" files={editor.data.files} onChange={editor.reload} /></Card>
    <Card><FileUpload kind="cv" title="Upload your CV" files={editor.data.files} onChange={editor.reload} /></Card>
  </div>;
}
