import { useEffect, useRef, useState } from 'react';
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
  return <Card><h2 className="text-h3 mb-4">Your learning progress</h2><GrowthGate data={data}/><div className="grid sm:grid-cols-3 gap-4 mb-5">
    <div><p className="text-caption">Career path</p><p className="font-medium">{data.careerPath||'Not selected'}</p></div>
    <div><p className="text-caption">Assessment level</p><p className="font-medium">{data.level?`Level ${data.level}`:'Not assessed'}</p></div>
    <div><p className="text-caption">Challenges completed</p><p className="font-medium">{data.completions.find(c=>c.kind==='challenge')?.count||0}</p></div>
  </div><div className="flex flex-wrap gap-3"><Button asChild><Link href="/developer/assessment">Open assessment <ArrowRight className="h-4 w-4"/></Link></Button><Button variant="secondary" asChild><Link href="/developer/skills">Skill progress</Link></Button><Button variant="secondary" asChild><Link href="/developer/internal-projects">Internal projects</Link></Button></div></Card>;
}
function attemptHref(attempt) {
  if(attempt.kind==='assessment')return `/developer/assessment?attempt=${attempt.id}`;
  if(attempt.kind==='project')return `/developer/internal-projects/${attempt.activity_id}?attempt=${attempt.id}`;
  return `/developer/challenges/${attempt.skill_slug||'javascript'}?attempt=${attempt.id}`;
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
        <div className="flex flex-wrap gap-3">{kind==='project'?<Button asChild><Link href={`/developer/internal-projects/${item.id}`}>View project <ArrowRight className="h-4 w-4"/></Link></Button>:<Button disabled={!ready} loading={busy===item.id} onClick={()=>start(item)}>{previous?.status==='active'?'Resume assessment':previous?.status==='pending-review'?'View submitted work':'Start assessment'}</Button>}
          {previous&&<Button variant="secondary" asChild><Link href={attemptHref(previous)}>View latest attempt</Link></Button>}</div>
      </Card>;
    })}</div>
    {kind==='assessment'&&<History items={overview.data.history.filter(a=>a.kind==='assessment')}/>}
  </div>;
}
export function AssessmentPage(){const search=useSearchParams();const id=search.get('attempt');return id?<AttemptWorkspace key={id} id={id}/>:<ActivityCatalog kind="assessment" title="Platform Assessment"/>;}
export function AssessmentResultPage(){const search=useSearchParams();const id=search.get('attempt');return id?<AttemptWorkspace key={id} id={id}/>:<GrowthProgressPage/>;}
export function AssessmentFollowupPage(){return <div className="max-w-2xl mx-auto"><PageHeader title="Assessment follow-up"/><Card><p className="mb-5">AI follow-ups are not enabled for this delivery. Multiple-choice answers are scored automatically; an administrator reviews coding and written answers.</p><Button asChild><Link href="/developer/level">View assessment history</Link></Button></Card></div>;}
export function SkillsPage(){
  const skills=useResource('/growth/skills'),overview=useResource('/growth/overview');
  if(!skills.data||!overview.data)return <LoadingProfile error={skills.error||overview.error}/>;
  return <div><PageHeader title="Skills & Challenges" description="Complete each skill path in order. Progress is awarded once per passed challenge." action={<Button variant="secondary" asChild><Link href="/developer/level">Assessment history</Link></Button>}/><GrowthGate data={overview.data}/>
    {!overview.data.assessmentPassed&&overview.data.careerPath&&<Card className="mb-6"><p className="mb-4">Pass the assessment to unlock your skill paths.</p><Button asChild><Link href="/developer/assessment">Open assessment</Link></Button></Card>}
    <div className="grid sm:grid-cols-2 gap-5">{skills.data.items.map(s=><Card key={s.id}><div className="flex justify-between gap-3 mb-3"><h2 className="text-h3">{s.name}</h2><span className="text-sm font-medium text-primary">{s.level}</span></div><p className="text-sm text-muted mb-4">{s.description}</p><ProgressBar value={s.completed} max={Math.max(s.total,1)} showLabel/><p className="text-caption my-3">{s.completed}/{s.total} completed · Level 2 at {s.level2_threshold} · Master at {s.master_threshold}</p><Button asChild><Link href={`/developer/challenges/${s.slug}`}>Open skill path <ArrowRight className="h-4 w-4"/></Link></Button></Card>)}</div>
    {!skills.data.items.length&&<Card>No published skills are available for your current career path.</Card>}
  </div>;
}
export function SkillPathPage({slug}){
  const search=useSearchParams();const id=search.get('attempt');
  return id?<AttemptWorkspace key={id} id={id}/>:<SkillPath slug={slug}/>;
}
function SkillPath({slug}){
  const catalog=useResource('/growth/catalog?kind=challenge'),overview=useResource('/growth/overview'),skills=useResource('/growth/skills');
  const router=useRouter();const [busy,setBusy]=useState('');const [error,setError]=useState('');
  if(!catalog.data||!overview.data||!skills.data)return <LoadingProfile error={catalog.error||overview.error||skills.error}/>;
  const skill=skills.data.items.find(s=>s.slug===slug);if(!skill)return <Card>This skill is unavailable for your selected career path. <Link href="/developer/challenges" className="text-primary underline">Browse skills</Link></Card>;
  const items=catalog.data.items.filter(a=>a.skill_id===skill.id).sort((a,b)=>a.position-b.position);
  const passed=new Set(overview.data.history.filter(a=>a.kind==='challenge'&&a.status==='passed').map(a=>a.activity_id));
  async function start(item){setBusy(item.id);setError('');try{const {attempt}=await api(`/growth/activities/${item.id}/start`,{method:'POST',body:{}});router.push(`/developer/challenges/${slug}?attempt=${attempt.id}`);}catch(e){setError(e.message);}finally{setBusy('');}}
  return <div><PageHeader breadcrumb={<Link href="/developer/challenges" className="inline-flex items-center gap-2 text-primary"><ArrowLeft className="h-4 w-4"/> All skill paths</Link>} title={`${skill.name} Skill Path`} description={`${skill.completed} of ${skill.total} completed · ${skill.level}`}/><AuthError message={error}/><GrowthGate data={overview.data}/>
    <div className="space-y-4">{items.map((item,index)=>{
      const previous=overview.data.history.find(a=>a.activity_id===item.id);const complete=passed.has(item.id);
      const unlocked=overview.data.approved&&overview.data.assessmentPassed&&items.slice(0,index).every(p=>passed.has(p.id));
      return <Card key={item.id}><div className="flex flex-col sm:flex-row gap-4 sm:items-center"><div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex shrink-0 items-center justify-center">{complete?<CheckCircle2 className="h-5 w-5"/>:unlocked?item.position:<LockKeyhole className="h-4 w-4"/>}</div><div className="flex-1 min-w-0"><h2 className="font-semibold break-words">{item.title}</h2><p className="text-caption">{item.duration_minutes} minutes · {previous?labels[previous.status]:unlocked?'Ready to start':'Complete the preceding challenges'}</p></div><div className="flex flex-wrap gap-2">{previous&&<Button size="sm" variant="secondary" asChild><Link href={`/developer/challenges/${slug}?attempt=${previous.id}`}>View attempt</Link></Button>}{!complete&&<Button size="sm" disabled={!unlocked} loading={busy===item.id} onClick={()=>start(item)}>{previous?.status==='active'?'Resume':previous?.status==='pending-review'?'View result':previous?'Try again':'Start challenge'}</Button>}</div></div></Card>;
    })}</div>
  </div>;
}
export function InternalProjectPage({id}){
  const search=useSearchParams(),attempt=search.get('attempt');return attempt?<AttemptWorkspace key={attempt} id={attempt}/>:<ProjectIntro id={id}/>;
}
function ProjectIntro({id}){
  const item=useResource(`/growth/activities/${id}`),overview=useResource('/growth/overview');const router=useRouter();const [error,setError]=useState('');const [busy,setBusy]=useState(false);
  if(!item.data||!overview.data)return <LoadingProfile error={item.error||overview.error}/>;
  const p=item.data.item;const previous=overview.data.history.find(a=>a.activity_id===p.id);
  async function join(){setBusy(true);try{const {attempt}=await api(`/growth/activities/${id}/start`,{method:'POST',body:{}});router.push(`/developer/internal-projects/${p.id}?attempt=${attempt.id}`);}catch(e){setError(e.message);}finally{setBusy(false);}}
  return <div className="max-w-4xl mx-auto"><PageHeader title={p.title} breadcrumb={<Link href="/developer/internal-projects" className="inline-flex gap-2 items-center text-primary"><ArrowLeft className="h-4 w-4"/> Internal projects</Link>}/><AuthError message={error}/><GrowthGate data={overview.data}/><Card><h2 className="text-h3 mb-4">Project brief</h2><p className="text-muted mb-5">{p.description}</p><p className="whitespace-pre-wrap mb-6">{p.requirements}</p><p className="text-caption mb-5">Pass score {p.pass_score}% · Submit a summary and a repository, demo link or evidence file. No submission is marked completed until reviewed.</p><div className="flex flex-wrap gap-3"><Button disabled={!overview.data.approved||!overview.data.assessmentPassed} loading={busy} onClick={join}>{previous?.status==='active'?'Open workspace':previous?.status==='pending-review'?'View submission':'Join project'}</Button>{previous&&<Button asChild variant="secondary"><Link href={`/developer/internal-projects/${p.id}?attempt=${previous.id}`}>View latest result</Link></Button>}</div></Card></div>;
}

export function AttemptWorkspace({id}){
  const resource=useResource(`/growth/attempts/${id}`);
  const saveRef=useRef(async()=>{});
  useEffect(()=>{if(resource.data?.attempt.status!=='active')return;const timer=setInterval(()=>resource.reload().catch(()=>{}),10000);return()=>clearInterval(timer);},[id,resource.data?.attempt.status]);
  if(!resource.data)return <LoadingProfile error={resource.error}/>;
  const editor=<AttemptEditor key={`${id}-${resource.data.attempt.status}`} attempt={resource.data.attempt} refresh={resource.reload} saveRef={saveRef}/>;
  return <div data-count-up-ignore>{resource.data.attempt.kind==='project'?editor:<QuestionPrivacy key={id} attempt={resource.data.attempt} beforeReport={()=>saveRef.current()} onStopped={resource.reload}>{editor}</QuestionPrivacy>}</div>;
}
function AttemptEditor({attempt,refresh,saveRef}){
  const [answers,setAnswers]=useState(()=>Object.fromEntries(attempt.questions.map(q=>[q.id,{answer:attempt.answers.find(a=>a.question_id===q.id)?.answer||'',flagged:attempt.answers.find(a=>a.question_id===q.id)?.flagged||false}])));
  const [project,setProject]=useState({repositoryUrl:attempt.project?.repository_url||'',demoUrl:attempt.project?.demo_url||'',summary:attempt.project?.summary||''});
  const [index,setIndex]=useState(0),[error,setError]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[checking,setChecking]=useState(false),[check,setCheck]=useState(null),[now,setNow]=useState(Date.now());
  const latest=useRef({answers,project}),revision=useRef(attempt.answer_revision),change=useRef(0),saved=useRef(0),pending=useRef(null),alive=useRef(true),autoSubmitted=useRef(false);
  const offset=useRef(new Date(attempt.serverNow).getTime()-Date.now());
  const active=attempt.status==='active';
  const remaining=attempt.deadline_at?Math.max(0,Math.ceil((new Date(attempt.deadline_at).getTime()-now-offset.current)/1000)):null;
  function editAnswer(id,patch){setAnswers(current=>{const value={...current,[id]:{...current[id],...patch}};latest.current={...latest.current,answers:value};change.current++;return value;});setMessage('Unsaved changes');setCheck(null);}
  function editProject(patch){setProject(current=>{const value={...current,...patch};latest.current={...latest.current,project:value};change.current++;return value;});setMessage('Unsaved changes');}
  async function save(){
    if(pending.current)return pending.current.then(()=>save());
    if(saved.current===change.current)return;
    const operation=(async()=>{while(saved.current<change.current){const snapshot=latest.current;const version=change.current;
      const result=await api(`/growth/attempts/${attempt.id}/answers`,{method:'PUT',body:{revision:revision.current,answers:Object.entries(snapshot.answers).map(([questionId,a])=>({questionId,...a})),...(attempt.kind==='project'?{project:snapshot.project}:{})}});
      revision.current=result.revision;saved.current=version;if(alive.current){setMessage('All changes saved');setError('');}
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
  useEffect(()=>{if(active&&remaining===0&&!autoSubmitted.current){autoSubmitted.current=true;submit(true);}},[active,remaining]);
  async function testCode(execute){setChecking(true);setError('');try{await save();const q=attempt.questions[index];setCheck(await api(`/growth/attempts/${attempt.id}/check`,{method:'POST',body:{questionId:q.id,source:answers[q.id]?.answer||'',execute}}));}catch(e){setError(e.message);}finally{setChecking(false);}}
  async function upload(event){const file=event.target.files?.[0];if(!file)return;setBusy(true);setError('');try{await save();const body=new FormData();body.append('file',file);await api(`/growth-files/${attempt.id}`,{method:'POST',body});await refresh();setMessage('Evidence uploaded');}catch(e){setError(e.message);}finally{setBusy(false);event.target.value='';}}
  async function removeFile(id){setBusy(true);try{await api(`/growth-files/${id}`,{method:'DELETE',body:{}});await refresh();}catch(e){setError(e.message);}finally{setBusy(false);}}
  const back=attempt.kind==='assessment'?'/developer/assessment':attempt.kind==='project'?'/developer/internal-projects':'/developer/challenges';
  const q=attempt.questions[index];const answered=Object.values(answers).filter(a=>a.answer.trim()).length;
  return <div className="min-w-0"><PageHeader title={attempt.title} description={`Version ${attempt.version} · ${labels[attempt.status]}`} breadcrumb={<Link href={back} className="inline-flex items-center gap-2 text-primary"><ArrowLeft className="h-4 w-4"/> Back to {attempt.kind==='challenge'?'skill paths':attempt.kind==='project'?'internal projects':'assessments'}</Link>} action={remaining!==null&&active?<ExamTimer remaining={remaining}/>:null}/>
    <AuthError message={error}/><Notice message={message}/>
    {active&&remaining!==null&&remaining<=300&&<p role="alert" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{remaining<=60?'Less than one minute remains.':'Five minutes or less remain.'} Your last saved answers will be submitted automatically when time ends.</p>}
    {attempt.security_stopped_at&&<Card className="mb-6 border-red-200 bg-red-50"><h2 className="text-h3 text-red-800">Exam stopped for review</h2><p className="text-sm mt-3">{attempt.security_stop_reason}</p><p className="text-sm mt-2">Your saved answers are locked. An administrator must review the recorded events before a final result is published.</p></Card>}
    {!active&&<Card className="mb-6"><div className="flex flex-wrap items-center gap-4 mb-4"><Trophy className="h-8 w-8 text-teal"/><div><h2 className="text-h3">{labels[attempt.status]}</h2><p>{attempt.score!==null?`${attempt.score}% · Pass score ${attempt.pass_score}%`:'Your saved submission is waiting for administrator review.'}</p>{attempt.level&&<p className="text-sm">Initial assessment level: {attempt.level}</p>}</div></div>{attempt.expired&&<p className="text-sm mb-3">Time expired. Your last saved answers were submitted automatically.</p>}<p className="whitespace-pre-wrap mb-4">{attempt.feedback||'Coding and written answers receive a human review. AI grading is not enabled.'}</p><div className="flex flex-wrap gap-3"><Button variant="secondary" onClick={refresh}>Refresh result</Button><Button asChild><Link href="/developer/challenges">Continue to skill paths <ArrowRight className="h-4 w-4"/></Link></Button><Button variant="secondary" asChild><Link href="/developer/level">View history</Link></Button></div></Card>}
    {attempt.kind==='project'?<div className="grid lg:grid-cols-3 gap-6"><Card className="lg:col-span-2"><h2 className="text-h3 mb-4">Requirements</h2><p className="whitespace-pre-wrap mb-6">{attempt.requirements}</p><FormField label="Repository URL"><Input aria-label="Repository URL" type="url" disabled={!active||busy} value={project.repositoryUrl} onChange={e=>editProject({repositoryUrl:e.target.value})}/></FormField><FormField label="Demo URL"><Input aria-label="Demo URL" type="url" disabled={!active||busy} value={project.demoUrl} onChange={e=>editProject({demoUrl:e.target.value})}/></FormField><FormField label="Submission summary" required><Textarea aria-label="Submission summary" rows={7} disabled={!active||busy} value={project.summary} onChange={e=>editProject({summary:e.target.value})}/></FormField></Card><Card><h2 className="text-h3 mb-3">Project evidence</h2><p className="text-caption mb-4">PDF, PNG or JPEG · Up to 10 MB each · Five files and 25 MB total. Use a repository link for code.</p>{attempt.files.map(f=><div className="flex items-center gap-2 border-b py-3" key={f.id}><a className="flex-1 break-all text-primary underline text-sm" href={`/api/growth-files/${f.id}`}>{f.original_name}</a>{active&&<Button disabled={busy} variant="ghost" size="icon" aria-label={`Remove ${f.original_name}`} onClick={()=>removeFile(f.id)}><Trash2 className="h-4 w-4"/></Button>}</div>)}{active&&<label className="mt-4 flex items-center gap-2 text-sm font-medium text-primary cursor-pointer"><Upload className="h-4 w-4"/> Upload evidence<input aria-label="Upload project evidence" disabled={busy} type="file" accept="application/pdf,image/png,image/jpeg" className="mt-2 block w-full text-xs" onChange={upload}/></label>}</Card></div>:<div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-6"><Card><h2 className="text-sm font-semibold mb-3">Questions</h2><ProgressBar value={answered} max={attempt.questions.length||1}/><p className="text-caption my-3">{answered}/{attempt.questions.length} answered</p><nav aria-label="Assessment questions" className="flex flex-wrap lg:flex-col gap-2">{attempt.questions.map((question,i)=><button type="button" key={question.id} onClick={()=>{setIndex(i);setCheck(null);}} className={`rounded-lg border p-3 text-left text-sm flex gap-2 items-center ${i===index?'border-primary bg-blue-50 text-primary':'border-border'}`}><span>Question {i+1}</span>{answers[question.id]?.flagged&&<Flag className="h-3 w-3"/>}{answers[question.id]?.answer&&<CheckCircle2 className="h-3 w-3 ml-auto"/>}</button>)}</nav></Card>
      {q&&<Card><div className="flex flex-wrap items-center justify-between gap-3 mb-5"><h2 className="text-h3">Question {index+1}</h2><span className="text-caption">{q.type==='mcq'?'Multiple choice':q.type==='code'?'JavaScript coding':'Written response'} · {q.points} points</span></div><p className="whitespace-pre-wrap mb-6">{q.prompt}</p>
        {q.type==='mcq'?<fieldset disabled={!active||busy} className="space-y-3"><legend className="sr-only">Choose your answer</legend>{q.options.map((option,i)=><label className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer ${answers[q.id]?.answer===option?'border-primary bg-blue-50':'border-border'}`} key={i}><input className="mt-1" type="radio" name={q.id} checked={answers[q.id]?.answer===option} onChange={()=>editAnswer(q.id,{answer:option})}/><span className="break-words">{option}</span></label>)}</fieldset>:<><Textarea aria-label={q.type==='code'?'Code answer':'Written answer'} disabled={!active||busy} value={answers[q.id]?.answer||''} rows={q.type==='code'?16:10} maxLength={30000} className={q.type==='code'?'font-mono text-sm':''} placeholder={q.starterCode||'Write your response here…'} onChange={e=>editAnswer(q.id,{answer:e.target.value})}/>{q.type==='code'&&active&&<div className="flex flex-wrap gap-3 mt-4"><Button size="sm" variant="secondary" disabled={checking||!answers[q.id]?.answer} onClick={()=>testCode(false)}>Check syntax</Button><Button size="sm" variant="secondary" disabled={checking||!answers[q.id]?.answer} onClick={()=>testCode(true)}>Run example tests</Button><Button size="sm" variant="ghost" disabled={busy} onClick={()=>editAnswer(q.id,{answer:q.starterCode})}>Use starter code</Button></div>}</>}
        {check&&<div role="status" className="mt-4 border rounded-lg p-4 text-sm"><p>{check.syntax.message}</p>{check.execution&&<><p className="mt-2">{check.execution.message}</p>{check.execution.tests.map((t,i)=><p key={i}>{t.name}: {t.passed?'Passed':t.status}</p>)}</>}</div>}
        {q.tests.length>0&&<div className="mt-5"><h3 className="font-semibold text-sm mb-2">Example cases</h3>{q.tests.map((t,i)=><div className="text-xs rounded bg-surface p-3 my-2 overflow-auto" key={i}><p>{t.name}</p><pre>Input: {t.input}{'\n'}Output: {t.output}</pre></div>)}</div>}
        <div className="flex flex-wrap justify-between gap-3 mt-6"><Button variant="secondary" disabled={!index} onClick={()=>setIndex(index-1)}><ArrowLeft className="h-4 w-4"/> Previous</Button>{active&&<Button variant="ghost" onClick={()=>editAnswer(q.id,{flagged:!answers[q.id]?.flagged})}><Flag className="h-4 w-4"/>{answers[q.id]?.flagged?'Unflag':'Flag for review'}</Button>}<Button variant="secondary" disabled={index>=attempt.questions.length-1} onClick={()=>setIndex(index+1)}>Next <ArrowRight className="h-4 w-4"/></Button></div>
      </Card>}</div>}
    {active&&<Card className="mt-6"><p className="text-sm text-muted mb-4">{attempt.kind==='project'?'Submit your own evidence for administrator review.':'Answers autosave while you work. The server enforces the deadline even if you close this tab.'} Submission locks your answers.</p><div className="flex flex-wrap gap-3"><Button variant="secondary" loading={busy} onClick={()=>save().catch(e=>setError(e.message))}>Save progress</Button><Button loading={busy} onClick={()=>submit()}>Submit {attempt.kind==='project'?'project':attempt.kind==='challenge'?'challenge':'assessment'} <ArrowRight className="h-4 w-4"/></Button></div></Card>}
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
