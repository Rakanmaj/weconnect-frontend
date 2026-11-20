import { useEffect, useMemo, useRef, useState } from 'react';
import Link, { useRouter, useSearchParams } from '@/router';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, Code2, FileText, Trophy, Upload, Trash2, LockKeyhole } from 'lucide-react';
import { PageHeader as CommonPageHeader, FormField } from '@/components/ui/common';
import { Card, StatCard } from '@/components/developer/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProgressBar } from '@/components/ui/progress';
import { AuthError } from '@/lib/auth';
import { api, useResource } from '@/lib/api';
import { LoadingProfile, Notice } from '@/components/account/profile-tools';
import { QuestionPrivacy } from './exam-privacy';
import {
  LearnContinueHero,
  LearnPathTabs,
  MilestoneLearningPath,
  PlacementAssessmentHero,
  PlacementExamCard,
  PlacementFirstStepHero,
  PlacementHistoryList,
  PlacementIntegrityRules,
  PlacementLevelBands,
  PlacementPrepJourney,
  PlacementPrepRetakeLocked,
  PlacementPrepRetakeReady,
  PlacementUnlockBanner,
  SkillCredentialCard,
  SkillsProfileHero,
  TrackPathHeader,
  InternalProjectsHero,
  InternalProjectsLockedBanner,
  InternalProjectCard,
  InternalProjectBrief,
  InternalProjectSubmitFooter,
  placementPrepActive,
  useEnrichedSections,
} from './learning-experience';

const labels={active:'In progress','pending-review':'Awaiting review',passed:'Passed',failed:'Not passed'};
function PageHeader(props){return <CommonPageHeader {...props} className={`[&_h1]:whitespace-normal [&_h1]:overflow-visible [&_h1]:text-clip ${props.className||''}`}/>;}
function ExamTimer({remaining}){return <span role="timer" aria-label="Remaining exam time" className={`inline-flex items-center gap-2 rounded-lg border px-4 py-3 tabular-nums ${remaining<=60?'border-red-300 bg-red-50 text-red-800':remaining<=300?'border-amber-300 bg-amber-50 text-amber-900':'bg-white'}`}><Clock className="h-4 w-4"/><span className="text-xs">Time left</span>{Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}</span>;}
export function GrowthGate({data}) {
  if(!data) return null;
  if(!data.approved) return <Card className="mb-6"><p className="mb-4">Account approval is required before starting assessments and challenges.</p><Button asChild><Link href="/developer/verification">View verification</Link></Button></Card>;
  if(!data.careerPath) return <Card className="mb-6"><p className="mb-4">Confirm your career path to see your assessment and skill challenges.</p><Button asChild><Link href="/developer/career-path">Choose career path</Link></Button></Card>;
  return null;
}
export function GrowthSummary() {
  const {data,error}=useResource('/growth/overview');
  if(!data) return <LoadingProfile error={error}/>;
  const challenges = data.completions.find(c => c.kind === 'challenge')?.count || 0;
  const projects = data.completions.find(c => c.kind === 'project')?.count || 0;
  return <Card className="overflow-hidden border-border/80"><h2 className="text-h3 mb-4">Your learning progress</h2><GrowthGate data={data}/><div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
    <div className="rounded-xl border border-border bg-surface/40 px-3 py-3"><p className="text-caption">Career path</p><p className="font-medium text-sm">{data.careerPath||'Not selected'}</p></div>
    <div className="rounded-xl border border-border bg-surface/40 px-3 py-3"><p className="text-caption">Placement</p><p className="font-medium text-sm">{data.level?`Level ${data.level}`:data.assessmentPassed?'Passed':'Not assessed'}</p></div>
    <div className="rounded-xl border border-border bg-surface/40 px-3 py-3"><p className="text-caption">Milestones</p><p className="font-medium text-sm">{challenges}</p></div>
    <div className="rounded-xl border border-border bg-surface/40 px-3 py-3"><p className="text-caption">Internal projects</p><p className="font-medium text-sm">{projects}</p></div>
  </div><div className="flex flex-wrap gap-3"><Button asChild><Link href="/developer/challenges">Learning lab <ArrowRight className="h-4 w-4"/></Link></Button><Button variant="secondary" asChild><Link href="/developer/assessment">Placement</Link></Button><Button variant="secondary" asChild><Link href="/developer/internal-projects">Internal projects</Link></Button></div></Card>;
}
function attemptHref(attempt) {
  if(attempt.kind==='assessment')return `/developer/assessment?attempt=${attempt.id}`;
  if(attempt.kind==='project')return `/developer/internal-projects/${attempt.activity_id}?attempt=${attempt.id}`;
  return `/developer/challenges/${attempt.skill_slug||'javascript'}?attempt=${attempt.id}`;
}
function retakeRemaining(attempt, now) {
  if(!attempt?.submitted_at || attempt.status==='active' || attempt.status==='pending-review') return 0;
  return Math.max(0, new Date(attempt.submitted_at).getTime() + 24 * 60 * 60 * 1000 - now);
}
function formatCountdown(ms) {
  const total = Math.ceil(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${hours}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}
function StartAssessmentButton({ready, busy, previous, onStart, canRetake = true}) {
  const [now, setNow] = useState(() => Date.now());
  const remaining = retakeRemaining(previous, now);
  useEffect(() => {
    if(!remaining) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [remaining > 0, previous?.id, previous?.submitted_at]);
  const locked = remaining > 0;
  const remediationBlocked = !canRetake;
  const label = previous?.status==='active' ? 'Resume assessment' : previous?.status==='pending-review' ? 'View submitted work' : remediationBlocked ? 'Finish Learning lab prep first' : locked ? `Available in ${formatCountdown(remaining)}` : previous?.status === 'failed' ? 'Retake placement' : 'Start assessment';
  return <Button disabled={!ready || locked || remediationBlocked} className={locked ? 'disabled:opacity-100' : undefined} loading={busy} onClick={onStart} aria-label={locked ? `Start assessment locked. Available in ${formatCountdown(remaining)}` : label}>{(locked || remediationBlocked) && <LockKeyhole className="h-4 w-4"/>}{label}</Button>;
}
export function InternalProjectsPage() {
  const catalog = useResource('/growth/catalog?kind=project');
  const overview = useResource('/growth/overview');
  if (!catalog.data || !overview.data) return <LoadingProfile error={catalog.error || overview.error}/>;
  const completedCount = overview.data.completions.find(c => c.kind === 'project')?.count || 0;
  const unlocked = overview.data.approved && overview.data.assessmentPassed;
  const history = overview.data.history.filter(a => a.kind === 'project');
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Internal projects"
        description="Independent delivery on WeConnect — submit evidence and earn reviewed completions."
        action={
          <Button variant="secondary" asChild>
            <Link href="/developer/challenges">Learning lab</Link>
          </Button>
        }
      />
      <GrowthGate data={overview.data}/>
      <InternalProjectsHero overview={overview.data} catalogCount={catalog.data.items.length} completedCount={completedCount}/>
      {overview.data.careerPath && !overview.data.assessmentPassed && <InternalProjectsLockedBanner/>}
      {!catalog.data.items.length && (
        <Card>No internal projects are published for your career path yet.</Card>
      )}
      {!!catalog.data.items.length && (
        <section>
          <h2 className="text-h3 mb-1">{unlocked ? 'Open projects' : 'Preview (unlock after placement)'}</h2>
          <p className="text-caption mb-6">Each card links to the full brief and submission workspace.</p>
          <div className="grid gap-6 lg:grid-cols-2">
            {catalog.data.items.map(item => {
              const previous = overview.data.history.find(a => a.activity_id === item.id);
              return (
                <InternalProjectCard
                  key={item.id}
                  item={item}
                  previous={previous}
                  statusLabels={labels}
                  href={`/developer/internal-projects/${item.id}`}
                />
              );
            })}
          </div>
        </section>
      )}
      <PlacementHistoryList items={history} statusLabels={labels} hrefFor={attemptHref}/>
    </div>
  );
}
export function ActivityCatalog({kind,title}) {
  const catalog=useResource(`/growth/catalog?kind=${kind}`), overview=useResource('/growth/overview');
  const router=useRouter();const [busy,setBusy]=useState('');const [error,setError]=useState('');
  if(!catalog.data||!overview.data)return <LoadingProfile error={catalog.error||overview.error}/>;
  async function start(item){setBusy(item.id);setError('');try{const {attempt}=await api(`/growth/activities/${item.id}/start`,{method:'POST',body:{}});router.push(attemptHref(attempt));}catch(e){setError(e.message);}finally{setBusy('');}}
  const ready=overview.data.approved&&overview.data.careerPath&&(kind==='assessment'||overview.data.assessmentPassed);
  return <div><PageHeader title={title} description={kind==='assessment'?'Demonstrate your knowledge with a timed assessment. Saved attempts and reviewed results remain in your history.':'Complete an independent project, submit evidence and receive administrator feedback.'}/>
    <GrowthGate data={overview.data}/><AuthError message={error}/>
    {kind!=='assessment'&&overview.data.careerPath&&!overview.data.assessmentPassed&&<Card className="mb-6"><p className="mb-4">Pass your career-path assessment to unlock internal projects.</p><Button asChild><Link href="/developer/assessment">Open assessment</Link></Button></Card>}
    {kind==='assessment'&&<Card className="mb-6"><h2 className="font-semibold mb-2">Before you start</h2><p className="text-sm text-muted">Stay in the exam window and do your own work. Question copying, printing, detected capture shortcuts and leaving the exam window can record warnings. Three warnings stop the exam for administrator review. The timer continues in the background and saved answers are submitted when time ends.</p></Card>}
    {!catalog.data.items.length&&<Card>No published activities are available for your selected path yet.</Card>}
    <div className="grid lg:grid-cols-2 gap-6">{catalog.data.items.map(item=>{
      const previous=overview.data.history.find(a=>a.activity_id===item.id);
      return <Card key={item.id}><div className="flex gap-3 mb-4"><div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{kind==='project'?<Code2 className="h-5 w-5"/>:<FileText className="h-5 w-5"/>}</div><div className="min-w-0"><h2 className="text-h3 break-words">{item.title}</h2><p className="text-caption">{kind==='assessment'?`${item.duration_minutes} minutes · ${item.questionCount} questions`:'Independent project'} · Pass score {item.pass_score}%</p></div></div>
        <p className="text-body-sm text-muted mb-4">{item.description}</p>
        <p className="whitespace-pre-wrap text-sm mb-5">{item.requirements}</p>
        {previous&&<p className="text-caption mb-4">Latest attempt: {labels[previous.status]}{previous.score!==null?` · ${previous.score}%`:''}</p>}
        <div className="flex flex-wrap gap-3">{kind==='project'?<Button asChild><Link href={`/developer/internal-projects/${item.id}`}>View project <ArrowRight className="h-4 w-4"/></Link></Button>:<StartAssessmentButton ready={ready} busy={busy===item.id} previous={previous} onStart={()=>start(item)}/>}
          {previous&&<Button variant="secondary" asChild><Link href={attemptHref(previous)}>View latest attempt</Link></Button>}</div>
      </Card>;
    })}</div>
    {kind==='assessment'&&<History items={overview.data.history.filter(a=>a.kind==='assessment')}/>}
  </div>;
}
function PlacementAssessmentLanding() {
  const catalog = useResource('/growth/catalog?kind=assessment');
  const overview = useResource('/growth/overview');
  const router = useRouter();
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  if (!catalog.data || !overview.data) return <LoadingProfile error={catalog.error || overview.error}/>;
  const item = catalog.data.items[0];
  const previous = item ? overview.data.history.find(a => a.activity_id === item.id) : null;
  const ready = overview.data.approved && overview.data.careerPath;
  const history = overview.data.history.filter(a => a.kind === 'assessment');
  async function start() {
    if (!item) return;
    setBusy(item.id);
    setError('');
    try {
      const { attempt } = await api(`/growth/activities/${item.id}/start`, { method: 'POST', body: {} });
      router.push(attemptHref(attempt));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  }
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Placement assessment"
        description="One timed exam sets your starting level and unlocks milestone learning when you pass."
        action={overview.data.assessmentPassed ? <Button variant="secondary" asChild><Link href="/developer/challenges">Learning lab</Link></Button> : null}
      />
      <GrowthGate data={overview.data}/>
      <AuthError message={error}/>
      <PlacementAssessmentHero overview={overview.data}/>
      {placementPrepActive(overview.data) && (
        <PlacementPrepJourney
          prep={overview.data.placementPrep}
          busySkill=""
          onStartSkill={skill => skill.milestoneSlug && router.push(`/developer/challenges/${skill.slug}`)}
        />
      )}
      {overview.data.placementPrep?.complete && !overview.data.assessmentPassed && <PlacementPrepRetakeReady/>}
      {!item && <Card>No placement assessment is published for your career path yet.</Card>}
      {item && (
        <>
          <PlacementExamCard item={item} previous={previous} statusLabels={labels}>
            <StartAssessmentButton ready={ready} busy={busy === item.id} previous={previous} canRetake={overview.data.canRetakePlacement !== false} onStart={start}/>
            {previous && <Button variant="secondary" asChild><Link href={attemptHref(previous)}>Review last attempt</Link></Button>}
          </PlacementExamCard>
          {placementPrepActive(overview.data) && <PlacementPrepRetakeLocked prep={overview.data.placementPrep}/>}
          <PlacementLevelBands activeLevel={overview.data.level}/>
          <PlacementIntegrityRules/>
          {overview.data.assessmentPassed && <PlacementUnlockBanner/>}
        </>
      )}
      <PlacementHistoryList items={history} statusLabels={labels} hrefFor={attemptHref}/>
    </div>
  );
}
export function AssessmentPage(){const search=useSearchParams();const id=search.get('attempt');return id?<AttemptWorkspace key={id} id={id}/>:<PlacementAssessmentLanding/>;}
export function AssessmentResultPage(){const search=useSearchParams();const id=search.get('attempt');return id?<AttemptWorkspace key={id} id={id}/>:<GrowthProgressPage/>;}
export function AssessmentFollowupPage(){return <div className="max-w-2xl mx-auto"><PageHeader title="Assessment follow-up"/><Card><p className="mb-5">Assessment scoring is automatic. Suspected cheating requires administrator review. Adaptive AI follow-ups are not available yet.</p><Button asChild><Link href="/developer/level">View assessment history</Link></Button></Card></div>;}
function nextLevelCopy(skill) {
  if (skill.completed >= skill.master_threshold) return 'Master. This is the highest level a company sees for this skill.';
  if (skill.completed >= skill.level2_threshold) {
    const left = skill.master_threshold - skill.completed;
    return `${left} more passed ${left === 1 ? 'challenge' : 'challenges'} to reach Master.`;
  }
  const left = skill.level2_threshold - skill.completed;
  return `${left} more passed ${left === 1 ? 'challenge' : 'challenges'} to reach Level 2.`;
}
function passedChallengeIds(history) {
  return new Set(history.filter(a => a.kind === 'challenge' && a.status === 'passed').map(a => a.activity_id));
}
function challengesFor(skill, catalog) {
  return catalog.filter(a => a.skill_id === skill.id).sort((a, b) => a.position - b.position);
}
function challengeActionLabel(previous) {
  if (previous?.status === 'active') return 'Resume';
  if (previous?.status === 'pending-review') return 'View result';
  if (previous?.status === 'failed') return 'Try a new set';
  return 'Start';
}
function challengeUnlocked(overview, items, index, passed) {
  if (!overview.approved) return false;
  if (!overview.assessmentPassed) {
    const prep = overview.placementPrep;
    if (!prep?.attempted) return false;
    if (index > 0) return false;
    return true;
  }
  return items.slice(0, index).every(item => passed.has(item.id));
}
function challengeTitle(title, skillName) {
  const prefix = `${skillName}: `;
  return title.startsWith(prefix) ? title.slice(prefix.length) : title;
}
function challengeRowStatus(item, index, items, overview, passed) {
  const complete = passed.has(item.id);
  const unlocked = challengeUnlocked(overview, items, index, passed);
  const previous = overview.history.find(a => a.activity_id === item.id);
  if (complete) return { key: 'passed', previous, unlocked, complete };
  if (previous?.status === 'active') return { key: 'active', previous, unlocked, complete };
  if (previous?.status === 'pending-review') return { key: 'pending-review', previous, unlocked, complete };
  if (previous?.status === 'failed') return { key: 'failed', previous, unlocked, complete };
  if (!unlocked) return { key: 'locked', previous, unlocked, complete };
  return { key: 'ready', previous, unlocked, complete };
}
const challengeStatusLabel = { passed: 'Passed', active: 'In progress', 'pending-review': 'Awaiting review', failed: 'Not passed', locked: 'Locked', ready: 'Ready' };
function renderMilestonePath(slug, skillName, items, overview, passed, busy, onStart) {
  return (
    <MilestoneLearningPath
      slug={slug}
      skillName={skillName}
      items={items}
      rowState={(item, index) => challengeRowStatus(item, index, items, overview, passed)}
      statusLabel={challengeStatusLabel}
      actionLabel={challengeActionLabel}
      busy={busy}
      onStart={onStart}
    />
  );
}
export function SkillsPage() {
  const skills = useResource('/growth/skills'), overview = useResource('/growth/overview');
  if (!skills.data || !overview.data) return <LoadingProfile error={skills.error || overview.error}/>;
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Skills" description="Your verified skill record for matching — updated when you pass milestones in the Learning lab." action={<Button asChild><Link href="/developer/challenges">Open Learning lab <ArrowRight className="h-4 w-4"/></Link></Button>}/>
      <GrowthGate data={overview.data}/>
      <SkillsProfileHero overview={overview.data} skills={skills.data.items}/>
      {!overview.data.assessmentPassed && overview.data.careerPath && !placementPrepActive(overview.data) && (
        <Card className="mb-6">
          <p className="mb-4">
            {overview.data.placementPrep?.attempted
              ? 'Finish placement prep milestones in the Learning lab — then retake placement so companies see your verified level.'
              : 'Take placement first. Pass to unlock your full match profile, or follow the guided prep path if you need another try.'}
          </p>
          <Button asChild><Link href={overview.data.placementPrep?.attempted ? '/developer/challenges' : '/developer/assessment'}>{overview.data.placementPrep?.attempted ? 'Open Learning lab' : 'Open assessment'}</Link></Button>
        </Card>
      )}
      <h2 className="text-h3 mb-4">Skill credentials</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        {skills.data.items.map(skill => (
          <SkillCredentialCard
            key={skill.id}
            skill={skill}
            cta={<Button variant="secondary" asChild><Link href={`/developer/challenges/${skill.slug}`}>Practice {skill.name} <ArrowRight className="h-4 w-4"/></Link></Button>}
          />
        ))}
      </div>
      {!skills.data.items.length && <Card>No published skills are available for your current career path.</Card>}
    </div>
  );
}
export function ChallengesPage() {
  const catalog = useResource('/growth/catalog?kind=challenge'), overview = useResource('/growth/overview'), skills = useResource('/growth/skills');
  const router = useRouter();
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const sections = useMemo(() => {
    if (!skills.data || !catalog.data) return [];
    return skills.data.items.map(skill => ({ skill, items: challengesFor(skill, catalog.data.items) }));
  }, [skills.data, catalog.data]);
  const enrichedSections = useEnrichedSections(sections, challengeTitle);
  const inPrep = placementPrepActive(overview.data);
  const displaySections = useMemo(() => {
    if (!inPrep) return enrichedSections;
    return enrichedSections.map(section => ({
      ...section,
      items: section.items.filter(item => item.position === 1),
      prepMode: true,
    }));
  }, [enrichedSections, inPrep]);
  if (!catalog.data || !overview.data || !skills.data) return <LoadingProfile error={catalog.error || overview.error || skills.error}/>;
  const passed = passedChallengeIds(overview.data.history);
  const next = displaySections.flatMap(section => section.items.map((item, index) => ({ section, item, index }))).find(({ section, item, index }) => !passed.has(item.id) && challengeUnlocked(overview.data, section.items, index, passed));
  const nextHero = next ? { section: next.section, shortTitle: next.item.shortTitle, lessonUrl: next.item.lessonUrl, item: next.item } : null;
  async function start(slug, item) {
    setBusy(item.id);
    setError('');
    try {
      const { attempt } = await api(`/growth/activities/${item.id}/start`, { method: 'POST', body: {} });
      router.push(`/developer/challenges/${slug}?attempt=${attempt.id}`);
    } catch (e) { setError(e.message); } finally { setBusy(''); }
  }
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Learning lab" description="Study on W3Schools, then pass milestone quizzes to unlock the next step on your path." action={<Button variant="secondary" asChild><Link href="/developer/skills">Match profile</Link></Button>}/>
      <AuthError message={error}/>
      <GrowthGate data={overview.data}/>
      {!overview.data.assessmentPassed && overview.data.careerPath && !overview.data.placementPrep?.attempted && (
        <PlacementFirstStepHero careerPath={overview.data.careerPath}/>
      )}
      {inPrep && (
        <PlacementPrepJourney
          prep={overview.data.placementPrep}
          busySkill={busy}
          onStartSkill={async skill => {
            if (!skill.milestoneSlug) return;
            setBusy(skill.slug);
            setError('');
            try {
              const { attempt } = await api(`/growth/activities/${skill.milestoneSlug}/start`, { method: 'POST', body: {} });
              router.push(`/developer/challenges/${skill.slug}?attempt=${attempt.id}`);
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy('');
            }
          }}
        />
      )}
      {overview.data.placementPrep?.complete && !overview.data.assessmentPassed && <PlacementPrepRetakeReady/>}
      {(overview.data.assessmentPassed || inPrep) && (
        <LearnContinueHero
          next={nextHero}
          busy={busy === next?.item.id}
          lessonUrl={nextHero?.lessonUrl}
          actionLabel={nextHero ? challengeActionLabel(overview.data.history.find(a => a.activity_id === nextHero.item.id)) : inPrep ? 'Pick a milestone' : 'Continue'}
          onStart={() => nextHero && start(nextHero.section.skill.slug, nextHero.item)}
        />
      )}
      {!displaySections.length && <Card>No challenges are published for your current career path.</Card>}
      {!!displaySections.length && (
        <section>
          <h2 className="text-h3 mb-1">{inPrep ? 'Placement prep tracks' : 'Skill tracks'}</h2>
          <p className="text-caption mb-4">
            {inPrep
              ? 'Only milestone 1 in each skill is open until you pass placement. Later steps unlock after you place.'
              : 'Pick a track and follow milestones in order — each one is study first, then quiz.'}
          </p>
          <LearnPathTabs
            sections={displaySections}
            defaultSlug={next?.section.skill.slug}
            renderPath={section => (
              <>
                <TrackPathHeader skill={section.skill}/>
                {renderMilestonePath(section.skill.slug, section.skill.name, section.items, overview.data, passed, busy, item => start(section.skill.slug, item))}
                {inPrep && (
                  <p className="mt-4 rounded-xl border border-dashed border-border bg-surface/40 px-4 py-3 text-sm text-muted">
                    Milestones 2–10 stay locked until placement passes — then the full vertical path opens here.
                  </p>
                )}
              </>
            )}
          />
        </section>
      )}
    </div>
  );
}
export function SkillPathPage({slug}){
  const search=useSearchParams();const id=search.get('attempt');
  return id?<AttemptWorkspace key={id} id={id}/>:<SkillPath slug={slug}/>;
}
function SkillPath({slug}){
  const catalog=useResource('/growth/catalog?kind=challenge'),overview=useResource('/growth/overview'),skills=useResource('/growth/skills');
  const router=useRouter();const [busy,setBusy]=useState('');const [error,setError]=useState('');
  if(!catalog.data||!overview.data||!skills.data)return <LoadingProfile error={catalog.error||overview.error||skills.error}/>;
  const skill=skills.data.items.find(s=>s.slug===slug);if(!skill)return <Card>This skill is unavailable for your selected career path. <Link href="/developer/skills" className="text-primary underline">Browse skills</Link></Card>;
  const items=challengesFor(skill, catalog.data.items).map(item=>({ ...item, shortTitle: challengeTitle(item.title, skill.name) }));
  const passed=passedChallengeIds(overview.data.history);
  async function start(item){setBusy(item.id);setError('');try{const {attempt}=await api(`/growth/activities/${item.id}/start`,{method:'POST',body:{}});router.push(`/developer/challenges/${slug}?attempt=${attempt.id}`);}catch(e){setError(e.message);}finally{setBusy('');}}
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader breadcrumb={<Link href="/developer/challenges" className="inline-flex items-center gap-2 text-primary"><ArrowLeft className="h-4 w-4"/> Learning lab</Link>} title={`${skill.name} track`} description="Work through milestones top to bottom. Study the lesson, then take the quiz."/>
      <AuthError message={error}/>
      <GrowthGate data={overview.data}/>
      <TrackPathHeader skill={skill}/>
      {renderMilestonePath(slug, skill.name, items, overview.data, passed, busy, start)}
    </div>
  );
}
export function InternalProjectPage({id}){
  const search=useSearchParams(),attempt=search.get('attempt');return attempt?<AttemptWorkspace key={attempt} id={attempt}/>:<ProjectIntro id={id}/>;
}
function ProjectIntro({id}){
  const item=useResource(`/growth/activities/${id}`),overview=useResource('/growth/overview');const router=useRouter();const [error,setError]=useState('');const [busy,setBusy]=useState(false);
  if(!item.data||!overview.data)return <LoadingProfile error={item.error||overview.error}/>;
  const p=item.data.item;const previous=overview.data.history.find(a=>a.activity_id===p.id);
  async function join(){setBusy(true);try{const {attempt}=await api(`/growth/activities/${id}/start`,{method:'POST',body:{}});router.push(`/developer/internal-projects/${p.id}?attempt=${attempt.id}`);}catch(e){setError(e.message);}finally{setBusy(false);}}
  const joinLabel = previous?.status === 'active' ? 'Open workspace' : previous?.status === 'pending-review' ? 'View submission' : 'Start project';
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={p.title} breadcrumb={<Link href="/developer/internal-projects" className="inline-flex gap-2 items-center text-primary"><ArrowLeft className="h-4 w-4"/> Internal projects</Link>}/>
      <AuthError message={error}/>
      <GrowthGate data={overview.data}/>
      {!overview.data.assessmentPassed && overview.data.careerPath && <InternalProjectsLockedBanner/>}
      <InternalProjectBrief title={p.title} description={p.description} requirements={p.requirements} passScore={p.pass_score}>
        <article className="public-card flex flex-wrap gap-3 p-5 sm:p-6">
          <Button disabled={!overview.data.approved || !overview.data.assessmentPassed} loading={busy} onClick={join}>{joinLabel} <ArrowRight className="h-4 w-4"/></Button>
          {previous && (
            <Button asChild variant="secondary">
              <Link href={`/developer/internal-projects/${p.id}?attempt=${previous.id}`}>View latest result</Link>
            </Button>
          )}
        </article>
      </InternalProjectBrief>
    </div>
  );
}

export function AttemptWorkspace({id}){
  const resource=useResource(`/growth/attempts/${id}`);
  const saveRef=useRef(async()=>{});
  const attempt=resource.data?.attempt;
  async function reloadAttempt(){try{await resource.reload();resource.setError('');}catch(error){resource.setError(error.message);}}
  useEffect(()=>{
    if(!attempt||attempt.status!=='active'||attempt.kind==='project')return;
    const timer=setInterval(()=>{void reloadAttempt();},10000);
    return()=>clearInterval(timer);
  },[id,attempt?.status,attempt?.kind]);
  if(!resource.data)return <div><LoadingProfile error={resource.error}/>{resource.error&&<Button variant="secondary" onClick={reloadAttempt}>Retry loading saved attempt</Button>}</div>;
  const editor=<AttemptEditor key={`${id}-${resource.data.attempt.status}`} attempt={resource.data.attempt} refresh={resource.reload} saveRef={saveRef} serverError={resource.error}/>;
  if(resource.data.attempt.kind==='project')return <div className="mx-auto max-w-5xl" data-count-up-ignore>{editor}</div>;
  return <div className={resource.data.attempt.kind==='challenge'?'mx-auto max-w-5xl':undefined} data-count-up-ignore><QuestionPrivacy key={id} attempt={resource.data.attempt} beforeReport={()=>saveRef.current()} onStopped={resource.reload}>{editor}</QuestionPrivacy></div>;
}
function AttemptEditor({attempt,refresh,saveRef,serverError}){
  const challenge=attempt.kind==='challenge';
  const [answers,setAnswers]=useState(()=>Object.fromEntries(attempt.questions.map(q=>[q.id,{answer:attempt.answers.find(a=>a.question_id===q.id)?.answer||'',flagged:attempt.answers.find(a=>a.question_id===q.id)?.flagged||false}])));
  const [project,setProject]=useState({repositoryUrl:attempt.project?.repository_url||'',demoUrl:attempt.project?.demo_url||'',summary:attempt.project?.summary||''});
  const [index,setIndex]=useState(0),[error,setError]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[checking,setChecking]=useState(false),[check,setCheck]=useState(null),[now,setNow]=useState(Date.now());
  const latest=useRef({answers,project}),revision=useRef(attempt.answer_revision),change=useRef(0),saved=useRef(0),pending=useRef(null),alive=useRef(true),autoSubmitted=useRef(false);
  const offset=useRef(new Date(attempt.serverNow).getTime()-Date.now());
  const active=attempt.status==='active';
  const remaining=attempt.deadline_at?Math.max(0,Math.ceil((new Date(attempt.deadline_at).getTime()-now-offset.current)/1000)):null;
  function editAnswer(id,patch){setAnswers(current=>{const value={...current,[id]:{...current[id],...patch}};latest.current={...latest.current,answers:value};change.current++;return value;});if(!challenge)setMessage('Unsaved changes');setCheck(null);}
  function editProject(patch){setProject(current=>{const value={...current,...patch};latest.current={...latest.current,project:value};change.current++;return value;});if(!challenge)setMessage('Unsaved changes');}
  async function save(){
    if(pending.current)return pending.current.then(()=>save());
    if(saved.current===change.current)return;
    const operation=(async()=>{while(saved.current<change.current){const snapshot=latest.current;const version=change.current;
      const result=await api(`/growth/attempts/${attempt.id}/answers`,{method:'PUT',body:{revision:revision.current,answers:Object.entries(snapshot.answers).map(([questionId,a])=>({questionId,...a})),...(attempt.kind==='project'?{project:snapshot.project}:{})}});
      revision.current=result.revision;saved.current=version;if(alive.current){if(!challenge)setMessage('All changes saved');setError('');}
    }})();pending.current=operation;
    try{await operation;}finally{if(pending.current===operation)pending.current=null;}
  }
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
  useEffect(()=>{saveRef.current=save;},[answers,project,active]);
  useEffect(()=>{if(!active)return;const timer=setTimeout(()=>save().catch(e=>{if(alive.current)setError(e.message);}),1000);return()=>clearTimeout(timer);},[answers,project,active]);
  useEffect(()=>{if(!active||!attempt.deadline_at)return;const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[active,attempt.deadline_at]);
  async function submit(expired=false){
    setBusy(true);setError('');
    try{try{await save();}catch(e){if(!expired)throw e;}await api(`/growth/attempts/${attempt.id}/submit`,{method:'POST',body:{}});await refresh();}
    catch(e){setError(e.message);}finally{setBusy(false);}
  }
  useEffect(()=>{if(active&&!challenge&&remaining===0&&!autoSubmitted.current){autoSubmitted.current=true;submit(true);}},[active,challenge,remaining]);
  async function testCode(execute){setChecking(true);setError('');try{await save();const q=attempt.questions[index];setCheck(await api(`/growth/attempts/${attempt.id}/check`,{method:'POST',body:{questionId:q.id,source:answers[q.id]?.answer||'',execute}}));}catch(e){setError(e.message);}finally{setChecking(false);}}
  async function upload(event){const file=event.target.files?.[0];if(!file)return;setBusy(true);setError('');try{await save();const body=new FormData();body.append('file',file);await api(`/growth-files/${attempt.id}`,{method:'POST',body});await refresh();setMessage('Evidence uploaded');}catch(e){setError(e.message);}finally{setBusy(false);event.target.value='';}}
  async function removeFile(id){setBusy(true);try{await api(`/growth-files/${id}`,{method:'DELETE',body:{}});await refresh();}catch(e){setError(e.message);}finally{setBusy(false);}}
  const back=attempt.kind==='assessment'?'/developer/assessment':attempt.kind==='project'?'/developer/internal-projects':'/developer/challenges';
  const q=attempt.questions[index];const answered=Object.values(answers).filter(a=>a.answer.trim()).length;
  const challengeMeta=challenge?`${answered}/${attempt.questions.length} answered · Pass ${attempt.pass_score}%`:null;
  return <div className="min-w-0"><PageHeader title={attempt.title} description={challenge?challengeMeta:`Version ${attempt.version} · ${labels[attempt.status]}`} breadcrumb={<Link href={back} className="inline-flex items-center gap-2 text-primary"><ArrowLeft className="h-4 w-4"/> Back to {challenge?'challenges':attempt.kind==='project'?'internal projects':'assessments'}</Link>} action={remaining!==null&&active&&!challenge?<ExamTimer remaining={remaining}/>:null}/>
    <AuthError message={error||serverError}/>{!challenge&&<Notice message={message}/>}
    {challenge&&(attempt.lessonUrl||attempt.coach?.hints?.length>0)&&<Card className="mb-6 border-border bg-surface/40"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0 flex-1">{attempt.lessonUrl&&<a className="text-sm font-medium text-primary underline" href={attempt.lessonUrl} target="_blank" rel="noreferrer">Study on W3Schools before you answer</a>}{active&&attempt.coach?.hints?.length>0&&<ul className="mt-2 space-y-1 text-sm text-muted">{attempt.coach.hints.map(hint=><li key={hint}>{hint}</li>)}</ul>}</div>{active&&<p className="text-caption shrink-0 sm:text-right">60% unlocks the next milestone</p>}</div></Card>}
    {active&&!challenge&&remaining!==null&&remaining<=300&&<p role="alert" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{remaining<=60?'Less than one minute remains.':'Five minutes or less remain.'} Your last saved answers will be submitted automatically when time ends.</p>}
    {attempt.security_stopped_at&&<Card className="mb-6 border-red-200 bg-red-50"><h2 className="text-h3 text-red-800">Exam stopped for review</h2><p className="text-sm mt-3">{attempt.security_stop_reason}</p><p className="text-sm mt-2">Your saved answers are locked. An administrator must review the recorded events before a final result is published.</p></Card>}
    {!active&&challenge&&<Card className="mb-6"><h2 className="text-h3">{labels[attempt.status]}</h2><p className="mt-2 text-sm text-muted">{attempt.score!==null?`${attempt.score}% · ${attempt.score>=attempt.pass_score?'You passed this milestone.':`You need ${attempt.pass_score}% to unlock the next challenge.`}`:''}</p>{(attempt.question_results||[]).length>0&&<p className="mt-3 text-sm">Use the question list below to review each answer.</p>}{attempt.status==='failed'&&<p className="mt-2 text-sm text-muted">Start again from Challenges for a different set of 10 questions.</p>}<div className="mt-5"><Button asChild><Link href={back}>Back to challenges</Link></Button></div></Card>}
    {!active&&!challenge&&<Card className="mb-6"><div className="flex flex-wrap items-center gap-4 mb-4"><Trophy className="h-8 w-8 text-teal"/><div><h2 className="text-h3">{labels[attempt.status]}</h2><p>{attempt.score!==null?`${attempt.score}% · Pass score ${attempt.pass_score}%`:'Your saved submission is waiting for administrator review.'}</p>{attempt.level&&<p className="text-sm">Initial assessment level: {attempt.level}</p>}</div></div>{attempt.expired&&<p className="text-sm mb-3">Time expired. Your last saved answers were submitted automatically.</p>}<p className="mb-4 text-sm">{(attempt.question_results||[]).length?'Open each question to see your answer and why it scored that way.':attempt.feedback||(attempt.status==='pending-review'?'An administrator reviews stopped exams and project submissions before a score is published.':'Your result is saved.')}</p><div className="flex flex-wrap gap-3">{attempt.status==='pending-review'&&<Button variant="secondary" onClick={refresh}>Refresh result</Button>}<Button asChild><Link href={back}>Continue <ArrowRight className="h-4 w-4"/></Link></Button><Button variant="secondary" asChild><Link href="/developer/level">View history</Link></Button></div></Card>}
    {attempt.kind==='project'?<div className="space-y-6">
      <article className="public-card p-5 sm:p-6 lg:col-span-2">
        <h2 className="text-h3 mb-3">Requirements</h2>
        <p className="whitespace-pre-wrap mb-6 rounded-xl border border-border bg-surface/40 p-4 text-sm">{attempt.requirements}</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Repository URL"><Input aria-label="Repository URL" type="url" disabled={!active||busy} value={project.repositoryUrl} onChange={e=>editProject({repositoryUrl:e.target.value})}/></FormField>
          <FormField label="Demo URL"><Input aria-label="Demo URL" type="url" disabled={!active||busy} value={project.demoUrl} onChange={e=>editProject({demoUrl:e.target.value})}/></FormField>
        </div>
        <FormField label="Submission summary" required className="mt-5"><Textarea aria-label="Submission summary" rows={7} disabled={!active||busy} value={project.summary} onChange={e=>editProject({summary:e.target.value})} placeholder="What you built, how to run it, and how it meets the brief."/></FormField>
      </article>
      <article className="public-card p-5 sm:p-6">
        <h2 className="text-h3 mb-3">Project evidence</h2>
        <p className="text-caption mb-4">PDF, PNG or JPEG · Up to 10 MB each · Five files and 25 MB total. Use a repository link for code.</p>
        <ul className="divide-y divide-border">
          {attempt.files.map(f=><li className="flex items-center gap-2 py-3" key={f.id}><a className="flex-1 break-all text-primary underline text-sm" href={`/api/growth-files/${f.id}`}>{f.original_name}</a>{active&&<Button disabled={busy} variant="ghost" size="icon" aria-label={`Remove ${f.original_name}`} onClick={()=>removeFile(f.id)}><Trash2 className="h-4 w-4"/></Button>}</li>)}
        </ul>
        {active&&<label className="mt-4 flex cursor-pointer flex-col gap-2 rounded-xl border border-dashed border-primary/30 bg-blue-50/50 p-4 text-sm font-medium text-primary"><span className="inline-flex items-center gap-2"><Upload className="h-4 w-4"/> Upload evidence</span><input aria-label="Upload project evidence" disabled={busy} type="file" accept="application/pdf,image/png,image/jpeg" className="text-xs" onChange={upload}/></label>}
      </article>
    </div>:challenge?<div className="space-y-4"><ProgressBar value={answered} max={attempt.questions.length||1}/><nav aria-label="Challenge questions" className="flex flex-wrap gap-2">{attempt.questions.map((question,i)=><button type="button" key={question.id} onClick={()=>{setIndex(i);setCheck(null);}} className={`h-9 min-w-[2.25rem] rounded-md border px-2 text-sm font-medium ${i===index?'border-primary bg-primary text-white':'border-border bg-white'} ${answers[question.id]?.answer?'ring-1 ring-teal/40':''}`}>{i+1}</button>)}</nav>
      {q&&<Card><div className="mb-4 flex items-baseline justify-between gap-3"><h2 className="text-lg font-semibold">Question {index+1}</h2><span className="text-caption">{q.points} pts</span></div><p className="whitespace-pre-wrap mb-6">{q.prompt}</p>
        <fieldset disabled={!active||busy} className="space-y-2"><legend className="sr-only">Choose your answer</legend>{q.options.map((option,i)=><label className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer ${answers[q.id]?.answer===option?'border-primary bg-blue-50':'border-border'}`} key={i}><input className="mt-1" type="radio" name={q.id} checked={answers[q.id]?.answer===option} onChange={()=>editAnswer(q.id,{answer:option})}/><span className="break-words text-sm">{option}</span></label>)}</fieldset>
        {!active&&(()=>{const result=(attempt.question_results||[]).find(item=>item.id===q.id);if(!result)return null;const correct=result.percent===100;return <div className={`mt-5 rounded-lg border p-4 text-sm ${correct?'border-teal/40 bg-teal/5':result.percent>0?'border-amber-200 bg-amber-50':'border-red-200 bg-red-50'}`}><p className="font-medium">{correct?'Correct':'Not correct'} · {result.earned} / {result.points} points</p>{result.note&&<p className="mt-2 whitespace-pre-wrap text-muted">{result.note}</p>}</div>;})()}
        <div className="mt-6 flex justify-between gap-3"><Button variant="secondary" size="sm" disabled={!index} onClick={()=>setIndex(index-1)}><ArrowLeft className="h-4 w-4"/> Back</Button><Button variant="secondary" size="sm" disabled={index>=attempt.questions.length-1} onClick={()=>setIndex(index+1)}>Next <ArrowRight className="h-4 w-4"/></Button></div>
      </Card>}</div>:<div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-6"><Card><h2 className="text-sm font-semibold mb-3">Questions</h2><ProgressBar value={answered} max={attempt.questions.length||1}/><p className="text-caption my-3">{answered}/{attempt.questions.length} answered</p><nav aria-label="Assessment questions" className="flex flex-wrap lg:flex-col gap-2">{attempt.questions.map((question,i)=><button type="button" key={question.id} onClick={()=>{setIndex(i);setCheck(null);}} className={`rounded-lg border p-3 text-left text-sm flex gap-2 items-center ${i===index?'border-primary bg-blue-50 text-primary':'border-border'}`}><span>Question {i+1}</span>{answers[question.id]?.flagged&&<Flag className="h-3 w-3"/>}{answers[question.id]?.answer&&<CheckCircle2 className="h-3 w-3 ml-auto"/>}</button>)}</nav></Card>
      {q&&<Card><div className="flex flex-wrap items-center justify-between gap-3 mb-5"><h2 className="text-h3">Question {index+1}</h2><span className="text-caption">{q.type==='mcq'?'Multiple choice':q.type==='code'?(q.tests?.length?'JavaScript coding':'Pseudocode'):'Written response'} · {q.points} points</span></div><p className="whitespace-pre-wrap mb-6">{q.prompt}</p>
        {q.type==='mcq'?<fieldset disabled={!active||busy} className="space-y-3"><legend className="sr-only">Choose your answer</legend>{q.options.map((option,i)=><label className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer ${answers[q.id]?.answer===option?'border-primary bg-blue-50':'border-border'}`} key={i}><input className="mt-1" type="radio" name={q.id} checked={answers[q.id]?.answer===option} onChange={()=>editAnswer(q.id,{answer:option})}/><span className="break-words">{option}</span></label>)}</fieldset>:<><Textarea aria-label={q.type==='code'?(q.tests?.length?'Code answer':'Pseudocode answer'):'Written answer'} disabled={!active||busy} value={answers[q.id]?.answer||''} rows={q.type==='code'?16:10} maxLength={30000} className={q.type==='code'?'font-mono text-sm':''} placeholder={q.starterCode||'Write your response here…'} onChange={e=>editAnswer(q.id,{answer:e.target.value})}/>{q.type==='code'&&q.tests?.length>0&&active&&<div className="flex flex-wrap gap-3 mt-4"><Button size="sm" variant="secondary" disabled={checking||!answers[q.id]?.answer} onClick={()=>testCode(false)}>Check syntax</Button><Button size="sm" variant="secondary" disabled={checking||!answers[q.id]?.answer} onClick={()=>testCode(true)}>Run example tests</Button><Button size="sm" variant="ghost" disabled={busy} onClick={()=>editAnswer(q.id,{answer:q.starterCode})}>Use starter code</Button></div>}{q.type==='code'&&!q.tests?.length&&<p className="mt-2 text-caption">Pseudocode is not executed. Submit when you are ready — the same rubric is applied for every student.</p>}</>}
        {check&&<div role="status" className="mt-4 border rounded-lg p-4 text-sm"><p>{check.syntax.message}</p>{check.execution&&<><p className="mt-2">{check.execution.message}</p>{check.execution.tests.map((t,i)=><p key={i}>{t.name}: {t.passed?'Passed':t.status}</p>)}</>}</div>}
        {q.tests.length>0&&<div className="mt-5"><h3 className="font-semibold text-sm mb-2">Example cases</h3>{q.tests.map((t,i)=><div className="text-xs rounded bg-surface p-3 my-2 overflow-auto" key={i}><p>{t.name}</p><pre>Input: {t.input}{'\n'}Output: {t.output}</pre></div>)}</div>}
        {!active&&(()=>{const result=(attempt.question_results||[]).find(item=>item.id===q.id);if(!result)return null;const correct=result.percent===100;return <div className={`mt-5 rounded-lg border p-4 text-sm ${correct?'border-teal/40 bg-teal/5':result.percent>0?'border-amber-200 bg-amber-50':'border-red-200 bg-red-50'}`}><p className="font-medium">{correct?'Correct':result.percent>0?'Partial credit':'Not correct'} · {result.earned} / {result.points} points</p><p className="mt-2 whitespace-pre-wrap">{result.note}</p></div>;})()}
        <div className="flex flex-wrap justify-between gap-3 mt-6"><Button variant="secondary" disabled={!index} onClick={()=>setIndex(index-1)}><ArrowLeft className="h-4 w-4"/> Previous</Button>{active&&!challenge&&<Button variant="ghost" onClick={()=>editAnswer(q.id,{flagged:!answers[q.id]?.flagged})}><Flag className="h-4 w-4"/>{answers[q.id]?.flagged?'Unflag':'Flag for review'}</Button>}<Button variant="secondary" disabled={index>=attempt.questions.length-1} onClick={()=>setIndex(index+1)}>Next <ArrowRight className="h-4 w-4"/></Button></div>
      </Card>}</div>}
    {active&&challenge&&<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-caption">Answers save automatically.</p><Button className="sm:min-w-[180px]" loading={busy} onClick={()=>submit()}>Submit challenge <ArrowRight className="h-4 w-4"/></Button></div>}
    {active&&!challenge&&(attempt.kind==='project'?<InternalProjectSubmitFooter active={active} busy={busy} onSave={()=>save().catch(e=>setError(e.message))} onSubmit={()=>submit()}/>:<Card className="mt-6"><p className="text-sm text-muted mb-4">Answers autosave while you work. The server enforces the deadline even if you close this tab. Submission locks your answers.</p><div className="flex flex-wrap gap-3"><Button variant="secondary" loading={busy} onClick={()=>save().catch(e=>setError(e.message))}>Save progress</Button><Button loading={busy} onClick={()=>submit()}>Submit assessment <ArrowRight className="h-4 w-4"/></Button></div></Card>)}
  </div>;
}
function History({items}){return <div className="mt-8"><h2 className="text-h3 mb-4">Attempt history</h2><div className="space-y-3">{!items.length&&<Card>No attempts yet. Start a published activity above.</Card>}{items.map(a=><Card key={a.id}><div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between"><div><p className="font-medium">{a.title}</p><p className="text-caption">{new Date(a.started_at).toLocaleString()} · {labels[a.status]}{a.score!==null?` · ${a.score}%`:''}</p></div><Button variant="secondary" size="sm" asChild><Link href={attemptHref(a)}>Open attempt</Link></Button></div></Card>)}</div></div>;}
export function GrowthVerifiedPage(){
  const overview=useResource('/growth/overview'),skills=useResource('/growth/skills');
  if(!overview.data||!skills.data)return <LoadingProfile error={overview.error||skills.error}/>;
  const d=overview.data,projects=d.completions.find(c=>c.kind==='project')?.count||0;
  const criteria=[['Account approved',d.approved],['Initial assessment passed',d.assessmentPassed],[`Internal projects completed: ${projects}/5`,projects>=5],['At least one completed skill challenge',skills.data.items.some(s=>s.completed>0)],['Company evaluations and performance requirements',false]];
  return <div><PageHeader title="WeConnect Verification Progress" description="Account approval and earned performance status are separate. This page shows saved learning milestones."/><div className="space-y-4">{criteria.map(([label,met])=><Card key={label}><div className="flex items-center gap-3"><CheckCircle2 className={`h-5 w-5 shrink-0 ${met?'text-teal':'text-gray-300'}`}/><p>{label}</p><span className="ml-auto text-caption">{met?'Complete':'Not yet complete'}</span></div></Card>)}</div><Card className="mt-6"><p className="text-sm text-muted mb-4">Company-performance evaluation is scheduled for a later delivery. Completing these learning milestones does not automatically award the WeConnect Verified badge.</p><div className="flex flex-wrap gap-3"><Button asChild><Link href="/developer/internal-projects">Browse internal projects</Link></Button><Button variant="secondary" asChild><Link href="/developer/skills">View skill progress</Link></Button></div></Card></div>;
}
export function GrowthProgressPage(){
  const {data,error}=useResource('/growth/overview');if(!data)return <LoadingProfile error={error}/>;
  return <div><PageHeader title="Assessment & Learning Progress" description="Your saved assessment results, completed challenges and internal projects."/><GrowthGate data={data}/><div className="grid sm:grid-cols-3 gap-4"><StatCard label="Initial assessment level" value={data.level?`Level ${data.level}`:'Not assessed'} sub={data.careerPath}/><StatCard label="Best passed assessment" value={data.bestScore!==null?`${data.bestScore}%`:'—'}/><StatCard label="Completed internal projects" value={data.completions.find(c=>c.kind==='project')?.count||0}/></div><Card className="mt-6"><h2 className="text-h3 mb-3">Assessment score bands</h2><p className="text-sm text-muted mb-4">70–79%: Level 2 · 80–89%: Level 3 · 90–100%: Level 4. Scores below the pass threshold do not unlock skills. This is your initial assessment level; later company-performance progression belongs to a later delivery.</p><div className="flex flex-wrap gap-3"><Button asChild><Link href="/developer/assessment">Open assessment</Link></Button><Button asChild variant="secondary"><Link href="/developer/skills">View skills</Link></Button><Button asChild variant="secondary"><Link href="/developer/internal-projects">Browse internal projects</Link></Button></div></Card><History items={data.history}/></div>;
}
