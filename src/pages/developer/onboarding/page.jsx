import { useRouter, useSearchParams } from '@/router';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { PageHeader, FormField } from '@/components/ui/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProgressBar } from '@/components/ui/progress';
import { Card } from '@/components/developer/card';
import { AuthError, useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { EmailNotice, FileUpload, LoadingProfile, Notice, useEditableProfile } from '@/components/account/profile-tools';
import { CAREER_PATHS } from '@/lib/platform-config';
import { cn } from '@/lib/utils';
const STEPS = ['Personal Info', 'Education', 'Preferred Position', 'Skills', 'Certificates', 'Links', 'CV', 'Availability', 'Review'];
export default function OnboardingPage() {
  const { user, refreshUser } = useAuth();
  const editor = useEditableProfile();
  const { data, draft, setDraft, field, busy, error, message } = editor;
  const router = useRouter(); const params = useSearchParams();
  const step = Math.min(9, Math.max(1, parseInt(params.get('step'), 10) || draft?.onboardingStep || 1));
  if (!data || !draft) return <LoadingProfile error={error} />;
  async function go(next) { if (await editor.save({ onboardingStep: next })) router.push('/developer/onboarding?step=' + next); }
  async function submit() {
    if (!await editor.save()) return;
    try { await api('/profile/submit', { method: 'POST', body: {} }); await refreshUser(); router.push('/developer/verification'); }
    catch (error) { editor.setError(error.message); }
  }
  const education = draft.education[0] || { degree: '', institution: '', graduationYear: new Date().getFullYear(), coursework: '' };
  function educationField(key, value) { setDraft(current => ({ ...current, education: [{ ...education, [key]: value }] })); }
  function toggle(key, value) { setDraft(current => ({ ...current, [key]: current[key].includes(value) ? current[key].filter(item => item !== value) : [...current[key], value] })); }
  return <div className="mx-auto max-w-3xl min-w-0">
    <PageHeader title="Developer Onboarding" description="Complete and save your profile, then submit it for account review." />
    <EmailNotice /><ProgressBar value={step} max={9} showLabel className="mb-6" />
    <div className="mb-6 flex gap-1 overflow-x-auto pb-2">
      {STEPS.map((label, i) => <button key={label} disabled={busy} onClick={() => go(i + 1)} className={cn('flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium', step === i + 1 ? 'bg-primary text-white' : 'bg-surface text-muted')}>
        {i + 1 < step ? <Check className="h-3 w-3" /> : i + 1}<span className="hidden sm:inline">{label}</span>
      </button>)}
    </div>
    <Card><h2 className="mb-5 text-h3">{STEPS[step - 1]}</h2>
      <AuthError message={error} /><Notice message={message} />
      {step === 1 && <>
        <div className="grid gap-x-4 sm:grid-cols-2"><FormField label="First Name" required><Input {...field('firstName')} /></FormField><FormField label="Last Name" required><Input {...field('lastName')} /></FormField></div>
        <FormField label="Email"><Input value={user.email} readOnly aria-label="Email" /></FormField>
        <FormField label="Location" required><Input {...field('location')} /></FormField>
        <FormField label="Phone"><Input {...field('phone')} /></FormField>
        <FormField label="Bio"><Textarea {...field('bio')} rows={4} /></FormField>
      </>}
      {step === 2 && <>
        {Object.entries({ degree: 'Degree', institution: 'University', graduationYear: 'Graduation Year', coursework: 'Relevant Coursework' }).map(([key, label]) => <FormField key={key} label={label}><Input aria-label={label} type={key === 'graduationYear' ? 'number' : 'text'} value={education[key]} onChange={e => educationField(key, key === 'graduationYear' ? Number(e.target.value) : e.target.value)} /></FormField>)}
        <p className="text-caption">Education is optional. Complete the degree and university if you add a record.</p>
        {draft.education.length > 0 && <Button variant="secondary" onClick={() => setDraft(current => ({ ...current, education: [] }))}>Remove education record</Button>}
      </>}
      {step === 3 && <>
        <FormField label="Preferred job position" required><select {...field('preferredPosition')} className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm"><option value="">Select a position</option>{CAREER_PATHS.map(path => <option key={path}>{path}</option>)}</select></FormField>
        <FormField label="Years of Experience"><Input type="number" min="0" max="60" aria-label="Years of Experience" value={draft.yearsExperience} onChange={e => setDraft(current => ({ ...current, yearsExperience: Number(e.target.value) }))} /></FormField>
        <FormField label="Career Goals"><Textarea {...field('careerGoals')} rows={3} /></FormField>
      </>}
      {step === 4 && <><p className="mb-4 text-sm text-muted">Choose your skills. Verified levels are earned through later assessments and challenges.</p><div className="flex flex-wrap gap-2">{['React', 'JavaScript', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'CSS', 'Git'].map(skill => <label key={skill} className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm"><input type="checkbox" checked={draft.skills.includes(skill)} onChange={() => toggle('skills', skill)} />{skill}</label>)}</div></>}
      {step === 5 && <FileUpload kind="certificate" title="Upload certificates" files={data.files} onChange={editor.reload} />}
      {step === 6 && ['github', 'linkedin', 'portfolio'].map(key => <FormField key={key} label={{ github: 'GitHub', linkedin: 'LinkedIn', portfolio: 'Portfolio' }[key]}><Input type="url" {...field(key)} placeholder="https://" /></FormField>)}
      {step === 7 && <FileUpload kind="cv" title="Upload your CV" files={data.files} onChange={editor.reload} />}
      {step === 8 && <>
        <FormField label="Weekly Hours"><Input type="number" min="1" max="80" aria-label="Weekly Hours" value={draft.weeklyHours} onChange={e => setDraft(current => ({ ...current, weeklyHours: Number(e.target.value) }))} /></FormField>
        <FormField label="Preferred Project Types"><div className="space-y-3">{['Paid Project', 'Training Project', 'Hiring Challenge'].map(type => <label key={type} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.projectTypes.includes(type)} onChange={() => toggle('projectTypes', type)} />{type}</label>)}</div></FormField>
        <FormField label="Start Availability"><Input type="date" {...field('availableFrom')} /></FormField>
      </>}
      {step === 9 && <div className="space-y-3">{[['Name', draft.firstName + ' ' + draft.lastName], ['Email', user.email], ['Preferred role', draft.preferredPosition || 'Not selected'], ['Location', draft.location], ['Skills', draft.skills.join(', ') || 'None selected'], ['Availability', draft.weeklyHours + ' hrs/week'], ['CV', data.files.find(file => file.kind === 'cv')?.name || 'Required: upload your CV in step 7']].map(([key, value]) => <div key={key} className="grid gap-1 border-b border-border py-2 text-sm sm:grid-cols-2"><span className="text-muted">{key}</span><span className="break-words">{value}</span></div>)}</div>}
      <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-border pt-6">
        <Button variant="secondary" disabled={step === 1 || busy} onClick={() => go(step - 1)}><ChevronLeft className="h-4 w-4" />Back</Button>
        <Button variant="secondary" loading={busy} onClick={() => editor.save()}>Save draft</Button>
        {step < 9 ? <Button loading={busy} onClick={() => go(step + 1)}>Continue<ChevronRight className="h-4 w-4" /></Button> : <Button loading={busy} onClick={submit}>Submit Profile</Button>}
      </div>
    </Card>
  </div>;
}
