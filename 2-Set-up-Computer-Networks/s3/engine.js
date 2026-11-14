/* Station 3 engine: cable state, step rules, tester evaluation */
window.CbEngine=(function(){
const D=window.CBD;
const END=()=>({stripped:false,stripLen:null,nicked:false,cleaned:false,untwisted:false,order:[],trim:null,jacketIn:false,inserted:false,checked:false,crimped:false,short:null});
function fresh(task){ return {task, cable:null, length:null, cut:false, ends:{A:END(),B:END()}, tested:false, result:null, labeled:false, diagnosed:false, fixed:false, ticket:null}; }
const std=(s,end)=>D.tasks[s.task].ends[end]==='A'?D.T568A:D.T568B;
const APPLY={
 'choose-cable':s=>{s.cable='cat6';},
 'measure':s=>{s.length=10;},
 'cut':s=>{s.cut=true;},
 'strip-jacket':s=>{s.ends.A.stripped=true; s.ends.A.stripLen=28; s.ends.A.nicked=false;},
 'inspect-pairs':s=>{s.ends.A.cleaned=true;},
 'untwist':s=>{s.ends.A.untwisted=true;},
 'order-a':s=>{s.ends.A.order=[...std(s,'A')];},
 'trim-a':s=>{s.ends.A.trim=13;},
 'insert-a':s=>{s.ends.A.inserted=true; s.ends.A.jacketIn=true;},
 'check-a':s=>{s.ends.A.checked=true;},
 'crimp-a':s=>{s.ends.A.crimped=true;},
 'strip-b':s=>{s.ends.B.stripped=true; s.ends.B.stripLen=28; s.ends.B.cleaned=true; s.ends.B.untwisted=true;},
 'order-b':s=>{s.ends.B.order=[...std(s,'B')];},
 'trim-insert-b':s=>{s.ends.B.trim=13; s.ends.B.inserted=true; s.ends.B.jacketIn=true; s.ends.B.checked=true;},
 'crimp-b':s=>{s.ends.B.crimped=true;},
 'test-cable':s=>{s.tested=true; s.result=test(s);},
 'label':s=>{s.labeled=true;},
};
const CHECK={
 'choose-cable':s=>!!s.cable && D.cables[s.cable].ok,
 'measure':s=>s.length>=9.5&&s.length<=12,
 'cut':s=>s.cut,
 'strip-jacket':s=>s.ends.A.stripped&&!s.ends.A.nicked,
 'inspect-pairs':s=>s.ends.A.cleaned,
 'untwist':s=>s.ends.A.untwisted,
 'order-a':s=>orderOK(s,'A'),
 'trim-a':s=>s.ends.A.trim===13,
 'insert-a':s=>s.ends.A.inserted&&s.ends.A.jacketIn,
 'check-a':s=>s.ends.A.checked,
 'crimp-a':s=>s.ends.A.crimped,
 'strip-b':s=>s.ends.B.stripped&&!s.ends.B.nicked,
 'order-b':s=>orderOK(s,'B'),
 'trim-insert-b':s=>s.ends.B.trim===13&&s.ends.B.inserted&&s.ends.B.jacketIn,
 'crimp-b':s=>s.ends.B.crimped,
 'test-cable':s=>s.tested&&s.result&&s.result.pass,
 'label':s=>s.labeled,
};
function orderOK(s,end){ const o=s.ends[end].order; return o.length===8 && o.join()===std(s,end).join(); }
/* tester: returns {map, opens, shorts, pass, split, kind, lines} */
function test(s){
  const A=s.ends.A, B=s.ends.B;
  const r={opens:[],shorts:[],map:[],split:false,pass:false,notes:[]};
  if(!A.crimped||!B.crimped){ r.notes.push('Both ends must be crimped before the cable can be tested.'); return r; }
  const opens=new Set();
  [['A',A],['B',B]].forEach(([k,e])=>{ if(e.trim&&e.trim<=8) [7,8].forEach(p=>opens.add(p)); if(e.nicked) opens.add(3); });
  r.map=A.order.map((w,i)=>{ const j=B.order.indexOf(w); return j<0?null:j; });
  r.opens=[...opens].sort((a,b)=>a-b);
  if(A.short) r.shorts.push(A.short); if(B.short) r.shorts.push(B.short);
  // split pair: pins that should carry one twisted pair must hold one colour pair
  const groups=[[0,1],[2,5],[3,4],[6,7]];
  const pairOf=c=>D.pairs.findIndex(p=>p.includes(c));
  r.split=groups.some(([i,j])=>pairOf(A.order[i])!==pairOf(A.order[j]));
  const straight=r.map.every((j,i)=>j===i);
  const crossPattern=[2,5,0,3,4,1,6,7];
  const crossed=r.map.every((j,i)=>j===crossPattern[i]);
  const want=s.task==='crossover'?'crossover':'straight';
  r.kind = straight?'straight':crossed?'crossover':'miswired';
  const wiringOK = (want==='straight'&&straight)||(want==='crossover'&&crossed);
  r.pass = wiringOK && !r.opens.length && !r.shorts.length && !r.split && A.jacketIn && B.jacketIn;
  if(r.opens.length) r.notes.push('Open circuit on pin'+(r.opens.length>1?'s ':' ')+r.opens.join(' and ')+': the wire does not reach the contact. Cut that plug off and re-terminate with about 13 mm of wire.');
  if(r.shorts.length) r.shorts.forEach(p=>r.notes.push('Short circuit between pins '+p.join(' and ')+': two conductors are touching, usually from a nicked or crushed wire.'));
  if(r.kind==='miswired'&&!r.opens.length) r.notes.push('Crossed wires: '+r.map.map((j,i)=>j!==i?`pin ${i+1} goes to pin ${j+1}`:null).filter(Boolean).slice(0,3).join(', ')+'. Compare both ends with the standard.');
  if(r.kind==='crossover'&&want==='straight') r.notes.push('This is a crossover cable: pins 1 and 2 go to 3 and 6. Modern ports with Auto-MDIX still link, but the task asked for a straight-through cable.');
  if(r.kind==='straight'&&want==='crossover') r.notes.push('This is a straight-through cable. For a crossover, use T568A at one end and T568B at the other.');
  if(r.split&&!r.opens.length&&!r.shorts.length) r.notes.push('Split pair: continuity is fine, so a simple tester shows 1 to 8, but the wires are not in their twisted pairs. Expect crosstalk, dropped transfers and a failed certification. Re-terminate following T568A or T568B.');
  if(!A.jacketIn||!B.jacketIn) r.notes.push('The jacket is not inside the plug, so the strain relief grips only the thin wires. The plug will pull out or the wires will break.');
  if(r.pass) r.notes.push('Pass: pins 1 to 8 in step, pairs correct, both jackets held by the strain relief.');
  return r;
}
const stepsFor=()=>D.steps, stagesFor=()=>D.stages;
function stateAtStage(task,idx){
  const s=fresh(task); const before=new Set(D.stages.slice(0,idx).map(x=>x.id));
  D.steps.forEach(st=>{ if(before.has(st.stage)) APPLY[st.id](s); });
  return s;
}
function completeState(task){ const s=fresh(task); D.steps.forEach(st=>APPLY[st.id](s)); return s; }
function ticketState(id){ const t=D.tickets[id]; const s=completeState('straight'); s.tested=false; s.result=null; s.labeled=false; t.apply(s); s.ticket=id; s.result=null; return s; }
return {D,fresh,APPLY,CHECK,stepsFor,stagesFor,stateAtStage,completeState,ticketState,test,orderOK,std};
})();
