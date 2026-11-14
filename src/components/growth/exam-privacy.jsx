import { useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

// Browser signals are warnings, never proof that an OS screenshot was taken.
export function QuestionPrivacy({attempt,children,beforeReport,onStopped}){
  const {user}=useAuth();const [hidden,setHidden]=useState(!document.hasFocus()||document.hidden),[notice,setNotice]=useState('');
  const [warnings,setWarnings]=useState(attempt.security_warning_count||0),[offline,setOffline]=useState(false);
  const callbacks=useRef({beforeReport,onStopped,active:attempt.status==='active'});callbacks.current={beforeReport,onStopped,active:attempt.status==='active'};
  const queue=useRef([]),sending=useRef(false),lastFocus=useRef(0),lastShortcut=useRef(0),mounted=useRef(true);
  const limit=attempt.security_warning_limit||3;
  async function drain(){
    if(sending.current)return;sending.current=true;
    try{while(queue.current.length){
      const event=queue.current[0];
      try{await callbacks.current.beforeReport?.();}catch{/* Keep the last successful save if the deadline has already ended. */}
      const result=await api(`/growth/attempts/${attempt.id}/security-event`,{method:'POST',body:event});
      queue.current.shift();if(!mounted.current)return;
      setWarnings(result.warnings);setOffline(false);
      setNotice(result.stopped?'Exam stopped for administrator review.':`Warning ${result.warnings} of ${result.limit}. Reaching the limit stops this exam for review.`);
      if(result.stopped){queue.current=[];await callbacks.current.onStopped?.();break;}
    }}catch{if(mounted.current){setOffline(true);setNotice('Reconnect and retry the integrity check to continue. The exam timer keeps running.');}}
    finally{sending.current=false;}
  }
  function report(kind){
    if(!callbacks.current.active)return;
    if(kind==='capture-shortcut'||kind==='print-shortcut')lastShortcut.current=Date.now();
    if(kind==='focus-left'){if(Date.now()-lastFocus.current<1500||Date.now()-lastShortcut.current<2000)return;lastFocus.current=Date.now();}
    queue.current.push({eventId:crypto.randomUUID(),kind});void drain();
  }
  useEffect(()=>{
    mounted.current=true;let timer,focusTimer;
    const scheduleFocus=()=>{clearTimeout(focusTimer);focusTimer=setTimeout(()=>{if(document.hidden||!document.hasFocus())report('focus-left');},1000);};
    const sync=()=>{const inactive=document.hidden||!document.hasFocus();setHidden(inactive);if(inactive)scheduleFocus();else clearTimeout(focusTimer);};
    const blur=()=>{setHidden(true);scheduleFocus();};
    const key=event=>{
      if(event.repeat)return;const lower=event.key.toLowerCase();
      if(event.key==='PrintScreen'||(event.metaKey&&event.shiftKey&&['s','3','4','5'].includes(lower))){event.preventDefault();setHidden(true);report('capture-shortcut');clearTimeout(timer);timer=setTimeout(()=>setHidden(document.hidden||!document.hasFocus()),2000);}
      if((event.ctrlKey||event.metaKey)&&['p','s'].includes(lower)){event.preventDefault();report('print-shortcut');}
    };
    const reconnect=()=>void drain();
    window.addEventListener('blur',blur);window.addEventListener('focus',sync);document.addEventListener('visibilitychange',sync);window.addEventListener('keydown',key,true);window.addEventListener('online',reconnect);
    return()=>{mounted.current=false;clearTimeout(timer);clearTimeout(focusTimer);window.removeEventListener('blur',blur);window.removeEventListener('focus',sync);document.removeEventListener('visibilitychange',sync);window.removeEventListener('keydown',key,true);window.removeEventListener('online',reconnect);};
  },[attempt.id]);
  function restrict(event){if(event.target.closest('input,textarea,[contenteditable="true"]'))return;event.preventDefault();report(event.type==='contextmenu'?'context-menu':'copy');}
  const identity=`${user.name} · ${user.email} · ${attempt.id.slice(0,8)}`;
  return <><style>{`@media print{[data-private-assessment]{display:none!important}.assessment-print-notice{display:block!important}}[data-private-assessment] input,[data-private-assessment] textarea{user-select:text}`}</style>
    <p className="assessment-print-notice hidden">Assessment questions are private and cannot be printed.</p>
    <section data-private-assessment onCopy={restrict} onCut={restrict} onContextMenu={restrict} onDragStart={restrict} style={{userSelect:'none'}}>
      <div className="mb-5 flex items-start gap-2 rounded-lg border border-primary/10 bg-blue-50/60 p-3 text-xs text-navy"><ShieldCheck className="h-4 w-4 shrink-0"/><div><p className="font-medium">Private assessment · {identity}</p><p className="mt-1">Questions hide when this window is inactive. Three warnings stop the exam for review. Your timer continues.</p><p className="mt-1">Warnings: {warnings}/{limit}</p>{notice&&<p role="status" className="mt-1">{notice}</p>}</div></div>
      <div className="relative min-h-[400px]">
        <div className={hidden||offline?'invisible pointer-events-none':''} aria-hidden={hidden||offline} inert={hidden||offline||undefined}>{children}</div>
        {!hidden&&!offline&&<div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden grid grid-cols-1 sm:grid-cols-2 content-around gap-20 opacity-[0.06] select-none">{Array.from({length:8},(_,i)=><span key={i} className="-rotate-12 break-words text-sm font-semibold p-4">{identity}</span>)}</div>}
        {(hidden||offline)&&<div role="status" className="absolute inset-0 z-10 flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border bg-white p-8 text-center"><ShieldCheck className="h-10 w-10 text-primary mb-4"/><h2 className="text-h3">{offline?'Connection check required':'Questions hidden'}</h2><p className="text-sm text-muted mt-3">{offline?'Reconnect and retry to continue.':'Return to this assessment window to continue.'} Saved answers are preserved and the timer continues.</p>{offline&&<Button className="mt-4" onClick={drain}>Retry connection check</Button>}</div>}
      </div>
    </section></>;
}
