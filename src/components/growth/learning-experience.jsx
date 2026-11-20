import { useMemo, useState } from 'react';
import Link from '@/router';
import {
  ArrowRight,
  BookOpen,
  Braces,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Database,
  FileText,
  Layers,
  Lock,
  Monitor,
  Server,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Upload,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SKILL_THEMES = {
  javascript: { icon: Braces, accent: 'from-amber-400 to-orange-500', ring: 'ring-amber-200', chip: 'bg-amber-50 text-amber-900 border-amber-100' },
  react: { icon: Layers, accent: 'from-sky-400 to-blue-600', ring: 'ring-sky-200', chip: 'bg-sky-50 text-sky-900 border-sky-100' },
  node: { icon: Server, accent: 'from-emerald-400 to-teal-600', ring: 'ring-emerald-200', chip: 'bg-emerald-50 text-emerald-900 border-emerald-100' },
  postgresql: { icon: Database, accent: 'from-violet-400 to-indigo-600', ring: 'ring-violet-200', chip: 'bg-violet-50 text-violet-900 border-violet-100' },
};

export function skillTheme(slug) {
  return SKILL_THEMES[slug] || { icon: Target, accent: 'from-primary to-teal', ring: 'ring-primary/20', chip: 'bg-blue-50 text-primary border-blue-100' };
}

export function placementPrepActive(overview) {
  const prep = overview?.placementPrep;
  return Boolean(prep?.attempted && !overview?.assessmentPassed && !prep?.complete);
}

export function PlacementFirstStepHero({ careerPath }) {
  return (
    <section className="relative mb-10 overflow-hidden rounded-[22px] border border-amber-200/60 bg-gradient-to-br from-[#1a1206] via-[#221a0d] to-[#0f1729] p-6 text-white shadow-xl sm:p-8">
      <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
            <Target className="h-4 w-4" />
            Step 1 · Placement
          </div>
          <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">Take your placement exam first</h2>
          <p className="mt-3 max-w-xl text-sm text-white/75">
            One timed assessment for your {careerPath || 'career'} path. If you pass, the full Learning lab unlocks. If you miss the bar, you will earn four short milestone wins here — then retake placement.
          </p>
          <ol className="mt-5 flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:gap-6">
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">1</span>
              Placement exam
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">2</span>
              Learning lab milestones
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">3</span>
              Match profile levels
            </li>
          </ol>
        </div>
        <Button size="lg" className="h-12 w-full bg-white text-navy hover:bg-white/90 sm:w-auto" asChild>
          <Link href="/developer/assessment">
            Start placement <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export function PlacementPrepJourney({ prep, busySkill, onStartSkill }) {
  if (!prep?.attempted || prep.complete) return null;
  const pct = prep.total ? Math.round((prep.doneCount / prep.total) * 100) : 0;
  return (
    <section className="relative mb-10 overflow-hidden rounded-[22px] border border-teal/30 bg-gradient-to-br from-[#071a1a] via-[#0b2430] to-[#0d1b3d] p-6 text-white shadow-xl sm:p-8">
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-teal/20 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal">
              <Sparkles className="h-4 w-4" />
              Placement prep · your comeback path
            </div>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Four short wins, then retake placement</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Pass milestone 1 in each skill on your path. Each is study on W3Schools, then 10 quick questions. When the ring hits 100%, placement retake unlocks.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
            <p className="text-[10px] uppercase tracking-wide text-white/50">Prep progress</p>
            <p className="mt-1 text-3xl font-bold text-teal">{prep.doneCount}/{prep.total}</p>
            <ProgressBar value={prep.doneCount} max={Math.max(prep.total, 1)} className="mt-3 w-32" />
            <p className="mt-2 text-caption text-white/60">{pct}% ready to retake</p>
          </div>
        </div>
        <RecommendPrepGrid prep={prep} busySkill={busySkill} onStartSkill={onStartSkill} />
      </div>
    </section>
  );
}

function PrepSkillCard({ skill, done, busy, onStart }) {
  const theme = skillTheme(skill.slug);
  const Icon = theme.icon;
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-4 transition sm:p-5 ${done ? 'border-teal/40 bg-teal/10' : 'border-white/15 bg-white/5 hover:border-primary/40 hover:bg-white/10'}`}
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${theme.accent}`}>
          <Icon className="h-5 w-5 text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-white">{skill.name}</h3>
            <Badge variant={done ? 'success' : 'warning'} size="sm">
              {done ? 'Milestone 1 done' : 'Milestone 1'}
            </Badge>
          </div>
          <p className="mt-1 text-caption text-white/60">10 questions · lesson-backed quiz</p>
        </div>
        {done ? (
          <CheckCircle2 className="h-6 w-6 shrink-0 text-teal" aria-hidden />
        ) : (
          <Button size="sm" className="shrink-0 bg-white text-navy hover:bg-white/90" loading={busy} onClick={onStart}>
            Start win <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </article>
  );
}

function RecommendPrepGrid({ prep, busySkill, onStartSkill }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {prep.skills.map(skill => (
        <PrepSkillCard
          key={skill.slug}
          skill={skill}
          done={skill.done}
          busy={busySkill === skill.slug}
          onStart={() => onStartSkill?.(skill)}
        />
      ))}
    </div>
  );
}

export function PlacementPrepRetakeReady() {
  return (
    <section className="mb-8 rounded-2xl border border-teal/30 bg-gradient-to-r from-teal/10 to-blue-50 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal text-white">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-navy">You finished placement prep</p>
            <p className="text-sm text-muted">All first milestones are passed. Retake the placement assessment when the 24-hour window allows.</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/developer/assessment">
            Retake placement <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export function PlacementPrepRetakeLocked({ prep }) {
  return (
    <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <Lock className="mr-2 inline h-4 w-4" />
      Complete milestone 1 in each skill ({prep.doneCount}/{prep.total} done) on the Learning lab, then you can retake placement.
    </p>
  );
}

function tierIndex(skill) {
  if (skill.completed >= skill.master_threshold) return 2;
  if (skill.completed >= skill.level2_threshold) return 1;
  return 0;
}

export function SkillTierLadder({ skill }) {
  const tiers = ['Level 1', 'Level 2', 'Master'];
  const active = tierIndex(skill);
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {tiers.map((label, index) => {
        const done = index <= active;
        const current = index === active;
        return (
          <div key={label} className="flex flex-1 items-center gap-1 sm:gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold sm:h-8 sm:w-8 sm:text-xs ${done ? 'border-teal bg-teal text-white' : 'border-border bg-white text-muted'} ${current ? 'ring-2 ring-teal/30' : ''}`}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : index + 1}
            </span>
            <span className={`hidden text-xs font-medium sm:inline ${current ? 'text-navy' : 'text-muted'}`}>{label}</span>
            {index < tiers.length - 1 && <span className={`mx-1 h-0.5 flex-1 rounded-full ${index < active ? 'bg-teal' : 'bg-border'}`} />}
          </div>
        );
      })}
    </div>
  );
}

export function SkillsProfileHero({ overview, skills }) {
  const total = skills.reduce((sum, skill) => sum + skill.completed, 0);
  const max = skills.reduce((sum, skill) => sum + skill.total, 0);
  return (
    <section className="public-card public-card--dark relative mb-8 overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-teal/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="teal" size="sm" className="mb-3 w-fit">
            <Trophy className="h-3 w-3" />
            Match profile
          </Badge>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">What companies see when you are shortlisted</h2>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            Levels here come from passed challenges only — not from browsing lessons. Study and practice in the Learning lab, then your record updates here.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center sm:px-4">
            <p className="text-[10px] uppercase tracking-wide text-white/50">Placement</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {overview.assessmentPassed && overview.level
                ? `L${overview.level}`
                : overview.placementPrep?.attempted
                  ? 'Prep'
                  : '—'}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center sm:px-4">
            <p className="text-[10px] uppercase tracking-wide text-white/50">Milestones</p>
            <p className="mt-1 text-lg font-semibold text-white">{total}/{max}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center sm:px-4">
            <p className="text-[10px] uppercase tracking-wide text-white/50">Path</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{overview.careerPath || '—'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkillCredentialCard({ skill, cta }) {
  const theme = skillTheme(skill.slug);
  const Icon = theme.icon;
  const tier = tierIndex(skill);
  const tierLabel = ['Level 1', 'Level 2', 'Master'][tier];
  return (
    <article className={`public-card group relative overflow-hidden p-5 sm:p-6 ${tier >= 1 ? 'public-card--featured' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.accent} text-white shadow-lg shadow-primary/15`}>
          <Icon className="h-6 w-6" />
        </div>
        <Badge variant={tier >= 2 ? 'teal' : tier >= 1 ? 'primary' : 'default'}>{tierLabel}</Badge>
      </div>
      <h3 className="mt-4 text-h3">{skill.name}</h3>
      <p className="mt-2 text-sm text-muted line-clamp-2">{skill.description}</p>
      <div className="mt-5">
        <SkillTierLadder skill={skill} />
      </div>
      <p className="mt-4 text-caption">{skill.completed} verified passes · Level 2 at {skill.level2_threshold} · Master at {skill.master_threshold}</p>
      <div className="mt-5">{cta}</div>
    </article>
  );
}

export function LearnContinueHero({ next, busy, onStart, actionLabel, lessonUrl }) {
  if (!next) return null;
  const theme = skillTheme(next.section.skill.slug);
  const Icon = theme.icon;
  return (
    <section className="relative mb-10 overflow-hidden rounded-[22px] border border-primary/15 bg-gradient-to-br from-[#0d1b3d] via-[#102347] to-[#0a1732] p-6 text-white shadow-xl shadow-navy/20 sm:p-8">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal">
            <Sparkles className="h-4 w-4" />
            Continue learning
          </div>
          <div className="mt-3 flex items-start gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${theme.accent}`}>
              <Icon className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-sm text-white/60">{next.section.skill.name}</p>
              <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">{next.shortTitle}</h2>
            </div>
          </div>
          <ol className="mt-5 flex flex-col gap-2 text-sm text-white/75 sm:flex-row sm:gap-6">
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">1</span>
              Read the lesson
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">2</span>
              Answer 10 questions
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">3</span>
              Score 60% to unlock the next
            </li>
          </ol>
          {lessonUrl && (
            <a
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
              href={lessonUrl}
              target="_blank"
              rel="noreferrer"
            >
              <BookOpen className="h-4 w-4" />
              Open W3Schools lesson
            </a>
          )}
        </div>
        <Button size="lg" className="h-12 w-full bg-white text-navy hover:bg-white/90 sm:w-auto" loading={busy} onClick={onStart}>
          {actionLabel} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

export function LearnPathTabs({ sections, defaultSlug, renderPath }) {
  const initial = defaultSlug || sections[0]?.skill.slug || '';
  const [tab, setTab] = useState(initial);
  if (!sections.length) return null;
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="mb-4 !grid h-auto w-full grid-cols-2 gap-2 !overflow-visible border-0 bg-transparent p-0 sm:grid-cols-4">
        {sections.map(({ skill }) => {
          const theme = skillTheme(skill.slug);
          const Icon = theme.icon;
          return (
            <TabsTrigger
              key={skill.slug}
              value={skill.slug}
              className="!mb-0 h-auto min-h-[2.75rem] w-full justify-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-sm shadow-none !border-b border-border hover:text-navy data-[state=active]:border-primary data-[state=active]:bg-blue-50 data-[state=active]:text-navy data-[state=active]:!border-b-primary"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-normal leading-snug">{skill.name}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      {sections.map(section => (
        <TabsContent key={section.skill.slug} value={section.skill.slug} className="mt-4">
          {renderPath(section)}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function TrackPathHeader({ skill }) {
  const theme = skillTheme(skill.slug);
  const Icon = theme.icon;
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-center gap-3">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.accent} text-white`}>
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-lg font-semibold">{skill.name} track</h3>
          <p className="text-caption">{skill.completed}/{skill.total} milestones · {skill.level}</p>
        </div>
      </div>
      <ProgressBar value={skill.completed} max={Math.max(skill.total, 1)} showLabel className="w-full sm:max-w-xs" />
    </div>
  );
}

export function MilestoneLearningPath({ slug, skillName, items, rowState, statusLabel, actionLabel, busy, onStart }) {
  return (
    <ul className="relative space-y-4 pl-1">
      {items.map((item, index) => {
        const { key, previous, unlocked, complete } = rowState(item, index);
        const current = key === 'ready' || key === 'active' || key === 'failed';
        const theme = skillTheme(slug);
        return (
          <li key={item.id} className="relative flex gap-4">
            <div className="flex w-9 shrink-0 flex-col items-center pt-1">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold ${complete ? 'border-teal bg-teal text-white' : current ? `border-primary bg-blue-50 text-primary ring-4 ${theme.ring}` : unlocked ? 'border-border bg-white text-navy' : 'border-border bg-surface text-muted'}`}
              >
                {complete ? <CheckCircle2 className="h-4 w-4" /> : !unlocked ? <Lock className="h-3.5 w-3.5" /> : index + 1}
              </span>
              {index < items.length - 1 && <span className={`mt-1 w-0.5 flex-1 min-h-[24px] rounded-full ${complete ? 'bg-teal' : 'bg-border'}`} />}
            </div>
            <article
              className={`mb-2 flex-1 rounded-2xl border p-4 transition sm:p-5 ${current ? 'border-primary/30 bg-gradient-to-br from-blue-50/90 via-white to-white shadow-md shadow-primary/10' : complete ? 'border-teal/20 bg-teal/5' : unlocked ? 'border-border bg-white' : 'border-border/80 bg-surface/40 opacity-80'}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Milestone {index + 1}</p>
                <Badge variant={complete ? 'success' : current ? 'primary' : key === 'locked' ? 'default' : 'warning'} size="sm">
                  {statusLabel[key]}
                </Badge>
              </div>
              <h4 className="mt-1 text-base font-semibold text-navy sm:text-lg">{item.shortTitle || item.title}</h4>
              <p className="mt-1 text-caption">10 questions · no timer · 60% to pass</p>
              {(unlocked || complete) && item.lessonUrl && (
                <a
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary/15 bg-white px-3 py-2 text-sm font-medium text-primary hover:bg-blue-50"
                  href={item.lessonUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <BookOpen className="h-4 w-4" />
                  Study on W3Schools first
                </a>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {!complete && (
                  <Button size="sm" disabled={!unlocked} loading={busy === item.id} onClick={() => onStart(item)}>
                    {actionLabel(previous)}
                  </Button>
                )}
                {previous && (complete || key === 'failed' || key === 'pending-review') && (
                  <Link className="text-sm font-medium text-primary underline" href={`/developer/challenges/${slug}?attempt=${previous.id}`}>
                    Review answers
                  </Link>
                )}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}

export function useEnrichedSections(sections, challengeTitle) {
  return useMemo(
    () =>
      sections.map(section => ({
        ...section,
        items: section.items.map(item => ({
          ...item,
          shortTitle: challengeTitle(item.title, section.skill.name),
        })),
      })),
    [sections, challengeTitle]
  );
}

const PLACEMENT_LEVELS = [
  { level: 2, range: '70–79%', label: 'Level 2' },
  { level: 3, range: '80–89%', label: 'Level 3' },
  { level: 4, range: '90–100%', label: 'Level 4' },
];

export function PlacementAssessmentHero({ overview }) {
  const placed = overview.assessmentPassed;
  const prep = overview.placementPrep;
  const inPrep = placementPrepActive(overview);
  const prepDone = prep?.attempted && prep?.complete && !placed;
  return (
    <section className="public-card public-card--dark relative mb-8 overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="teal" size="sm" className="mb-3 w-fit">
            <ClipboardCheck className="h-3 w-3" />
            Placement
          </Badge>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            {placed ? 'Your placement level is set' : inPrep ? 'Build momentum, then try placement again' : prepDone ? 'Prep complete — ready for retake' : 'Find your starting level'}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            {placed
              ? 'Your best passed score sets the level companies see first. You can retake after 24 hours if you want to try for a higher band.'
              : inPrep
                ? 'You did not pass placement yet — that is normal. Earn milestone 1 on every skill in the Learning lab, then come back here to retake.'
                : prepDone
                  ? 'All first milestones are passed. Retake placement after the cooldown to unlock your level and the full learning path.'
                  : 'One timed exam for your career path. Pass with 70% or more to unlock the full Learning lab. Miss it and we guide you through four short milestone wins first.'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center sm:px-4">
            <p className="text-[10px] uppercase tracking-wide text-white/50">Level</p>
            <p className="mt-1 text-lg font-semibold text-white">{overview.level ? `L${overview.level}` : inPrep ? 'Prep' : '—'}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center sm:px-4">
            <p className="text-[10px] uppercase tracking-wide text-white/50">Best pass</p>
            <p className="mt-1 text-lg font-semibold text-white">{overview.bestScore !== null ? `${overview.bestScore}%` : '—'}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center sm:px-4">
            <p className="text-[10px] uppercase tracking-wide text-white/50">Path</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{overview.careerPath || '—'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlacementLevelBands({ activeLevel }) {
  return (
    <div className="mt-6">
      <p className="text-caption mb-2">Score bands (best passed attempt counts)</p>
      <div className="grid grid-cols-3 gap-2">
        {PLACEMENT_LEVELS.map(({ level, range, label }) => (
          <div
            key={level}
            className={`rounded-xl border px-3 py-2.5 text-center ${activeLevel === level ? 'border-primary bg-blue-50' : 'border-border bg-white'}`}
          >
            <p className="text-xs font-semibold text-navy">{label}</p>
            <p className="text-caption mt-0.5">{range}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const INTEGRITY_RULES = [
  { icon: Monitor, title: 'Stay on this tab', body: 'Leaving the window can record a warning. Three warnings pause the exam for review.' },
  { icon: Clock3, title: 'Timer keeps running', body: 'Answers autosave. When time ends, your last saved answers are submitted.' },
  { icon: Shield, title: 'Do your own work', body: 'Copying, printing, or capture shortcuts can record warnings. MCQ answers are scored automatically.' },
];

export function PlacementIntegrityRules() {
  return (
    <section className="mt-8" aria-labelledby="placement-integrity-heading">
      <h2 id="placement-integrity-heading" className="text-h3 mb-3">
        Before you start
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {INTEGRITY_RULES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-border bg-surface/40 p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold text-navy">{title}</p>
            <p className="mt-1 text-caption leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PlacementExamCard({ item, previous, statusLabels, children, footerLink }) {
  return (
    <article className="public-card public-card--featured relative overflow-hidden p-6 sm:p-8">
      <p className="text-caption font-medium text-primary">Your placement exam</p>
      <h3 className="mt-1 text-h3">{item.title}</h3>
      <p className="mt-2 text-sm text-muted">{item.description}</p>
      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl border border-border bg-white px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wide text-muted">Time</p>
          <p className="mt-1 text-sm font-semibold">{item.duration_minutes} min</p>
        </div>
        <div className="rounded-xl border border-border bg-white px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wide text-muted">Questions</p>
          <p className="mt-1 text-sm font-semibold">{item.questionCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-white px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wide text-muted">Pass</p>
          <p className="mt-1 text-sm font-semibold">{item.pass_score}%+</p>
        </div>
      </div>
      {previous && (
        <p className="mt-4 text-sm text-muted">
          Latest attempt: <span className="font-medium text-navy">{statusLabels[previous.status]}</span>
          {previous.score !== null ? ` · ${previous.score}%` : ''}
        </p>
      )}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>
      {footerLink}
    </article>
  );
}

export function PlacementHistoryList({ items, statusLabels, hrefFor }) {
  if (!items.length) return null;
  return (
    <section className="mt-10" aria-labelledby="placement-history-heading">
      <h2 id="placement-history-heading" className="text-h3 mb-3">
        Attempt history
      </h2>
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
        {items.map(attempt => (
          <li key={attempt.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="font-medium">{attempt.title}</p>
              <p className="text-caption">
                {new Date(attempt.started_at).toLocaleString()} · {statusLabels[attempt.status]}
                {attempt.score !== null ? ` · ${attempt.score}%` : ''}
              </p>
            </div>
            <Link className="text-sm font-medium text-primary underline" href={hrefFor(attempt)}>
              Review attempt
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PlacementUnlockBanner() {
  return (
    <div className="mt-6 rounded-2xl border border-teal/30 bg-teal/5 p-4 sm:p-5">
      <p className="text-sm font-medium text-navy">Learning lab is unlocked</p>
      <p className="mt-1 text-caption">Study W3Schools lessons and pass milestone quizzes to raise your match profile.</p>
      <Button className="mt-3" asChild>
        <Link href="/developer/challenges">
          Open Learning lab <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export function InternalProjectsHero({ overview, catalogCount, completedCount }) {
  return (
    <section className="public-card public-card--dark relative mb-10 overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 top-0 h-52 w-52 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-0 h-44 w-44 rounded-full bg-teal/20 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Badge variant="teal" size="sm" className="mb-3 w-fit">
            <Briefcase className="h-3 w-3" />
            Step 3 · Platform delivery
          </Badge>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Internal projects build your delivery record</h2>
          <p className="mt-3 max-w-xl text-sm text-white/75">
            Ship independent work on WeConnect, submit evidence, and receive administrator review. Completion counts toward verified milestone progress on your dashboard.
          </p>
          <ol className="mt-5 flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:gap-6">
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">1</span>
              Read the brief
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">2</span>
              Submit repo / demo / summary
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">3</span>
              Admin review → completion
            </li>
          </ol>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center sm:px-4">
            <p className="text-[10px] uppercase tracking-wide text-white/50">Available</p>
            <p className="mt-1 text-lg font-semibold text-white">{catalogCount}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center sm:px-4">
            <p className="text-[10px] uppercase tracking-wide text-white/50">Completed</p>
            <p className="mt-1 text-lg font-semibold text-white">{completedCount}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center sm:px-4">
            <p className="text-[10px] uppercase tracking-wide text-white/50">Path</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{overview.careerPath || '—'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InternalProjectsLockedBanner() {
  return (
    <section className="relative mb-10 overflow-hidden rounded-[22px] border border-amber-200/60 bg-gradient-to-br from-[#1a1206] via-[#221a0d] to-[#0f1729] p-6 text-white shadow-xl sm:p-8">
      <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-amber-400/15 blur-3xl" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
            <Lock className="h-4 w-4" />
            Locked until placement passes
          </div>
          <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Pass placement to open internal projects</h2>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            Finish placement (or the Learning lab prep path), then return here to practice real delivery before company projects.
          </p>
        </div>
        <Button size="lg" className="h-12 w-full bg-white text-navy hover:bg-white/90 sm:w-auto" asChild>
          <Link href="/developer/assessment">
            Open placement <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export function InternalProjectCard({ item, previous, statusLabels, href }) {
  const status = previous ? statusLabels[previous.status] : null;
  return (
    <article className="public-card group relative flex h-full flex-col overflow-hidden p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal text-white shadow-lg shadow-primary/15">
          <Briefcase className="h-6 w-6" />
        </span>
        {status && (
          <Badge variant={previous.status === 'passed' ? 'success' : previous.status === 'active' ? 'primary' : 'warning'} size="sm">
            {status}
            {previous.score !== null ? ` · ${previous.score}%` : ''}
          </Badge>
        )}
      </div>
      <h3 className="mt-4 text-h3 break-words">{item.title}</h3>
      <p className="mt-2 text-sm text-muted line-clamp-2">{item.description || 'Independent WeConnect project'}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm text-navy/80 line-clamp-3">{item.requirements}</p>
      <p className="mt-4 text-caption">Pass score {item.pass_score}% · Reviewed submission</p>
      <div className="mt-auto pt-5">
        <Button className="w-full sm:w-auto" asChild>
          <Link href={href}>
            {previous?.status === 'active' ? 'Open workspace' : 'View project'} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function InternalProjectBrief({ title, description, requirements, passScore, children }) {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[22px] border border-primary/15 bg-gradient-to-br from-[#0d1b3d] via-[#102347] to-[#0a1732] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-teal/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal">
            <FileText className="h-4 w-4" />
            Project brief
          </div>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>
          {description && <p className="mt-3 max-w-2xl text-sm text-white/75">{description}</p>}
          <p className="mt-4 text-caption text-white/60">Pass score {passScore}% · Administrator review required</p>
        </div>
      </section>
      <article className="public-card p-5 sm:p-6">
        <h3 className="text-h3 mb-3">Requirements</h3>
        <p className="whitespace-pre-wrap text-sm text-navy/90">{requirements}</p>
      </article>
      {children}
    </div>
  );
}

export function InternalProjectSubmitFooter({ active, busy, onSave, onSubmit }) {
  if (!active) return null;
  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface/50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Upload className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-navy">Ready to submit?</p>
          <p className="mt-1 text-caption">Progress autosaves. Submit when your summary, links, and evidence files are complete. Submission locks until review.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" loading={busy} onClick={onSave}>
              Save progress
            </Button>
            <Button loading={busy} onClick={onSubmit}>
              Submit project <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}