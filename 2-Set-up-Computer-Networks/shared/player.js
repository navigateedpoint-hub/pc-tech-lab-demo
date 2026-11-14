/* PC Tech Lab — Guided Demo player.
   A station supplies tracks of chapters and beats. Each beat shows one thing to learn and, usually,
   one spot to click. The player keeps the learner on that single path: nothing else on the stage reacts. */
window.Demo=(function(){
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function el(tag,attrs={},...kids){ const e=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs||{})){ if(v==null||v===false) continue;
    if(k==='class') e.className=v; else if(k==='html') e.innerHTML=v; else if(k.startsWith('on')) e.addEventListener(k.slice(2),v); else e.setAttribute(k,v===true?'':v); }
  kids.flat().forEach(k=>{ if(k==null||k===false) return; e.append(k.nodeType?k:document.createTextNode(k)); }); return e; }
const store={ get(k,d){ try{ const v=sessionStorage.getItem('pctl-demo:'+k); return v==null?d:JSON.parse(v); }catch(e){ return d; } },
  set(k,v){ try{ sessionStorage.setItem('pctl-demo:'+k,JSON.stringify(v)); }catch(e){} } };

let cfg, trackId, T, beats=[], idx=0, S=null, done=false, mode=store.get('mode','hands');
let lastKey=null, lastVB=null, busy=false;
const ui={};

/* ---------- build the flat list of beats for a track ---------- */
function expand(track){
  const list=[];
  track.chapters.forEach((ch,ci)=>{
    const bs=track.beats.filter(b=>b.ch===ch.id);
    bs.forEach((b,bi)=>list.push(Object.assign({kind:'step',ci,bi,bn:bs.length},b)));
    list.push({kind:'end',ch:ch.id,ci,bn:bs.length,t:'Chapter complete: '+ch.title,covered:bs.filter(b=>!b.noRecap&&!/^(Next|OK|Confirm|Save)$/.test(b.t)).map(b=>b.t)});
  });
  list.push({kind:'finish',ci:track.chapters.length-1});
  return list;
}
function stateAt(i){ const s=T.init(); for(let j=0;j<i;j++){ const b=beats[j]; if(b.act) b.act(s); } return s; }
/* the beat whose scene is on screen (chapter-end cards keep the last picture) */
function sceneBeat(i){ for(let j=i;j>=0;j--) if(beats[j].kind==='step') return beats[j]; return beats[0]; }

/* ---------- UI ---------- */
function buildUI(){
  document.title=cfg.station+': '+cfg.title+' – PC Tech Lab Guided Demo';
  const root=el('div',{class:'dm'});
  const top=el('header',{class:'dm-top'});
  top.append(el('a',{class:'home',href:'index.html',title:'All stations'},el('span',{class:'tag'},'PC Tech Lab'),el('span',{class:'lbl'},'Guided demo')),
    el('span',{class:'title'},cfg.station+': '+cfg.title));
  ui.track=el('select',{'aria-label':'Track'}); ui.chapter=el('select',{'aria-label':'Chapter'});
  ui.track.onchange=()=>{ setTrack(ui.track.value,0); };
  ui.chapter.onchange=()=>{ const ci=+ui.chapter.value; const i=beats.findIndex(b=>b.ci===ci); go(i<0?0:i); };
  if(Object.keys(cfg.tracks).length>1){ Object.entries(cfg.tracks).forEach(([k,t])=>ui.track.append(el('option',{value:k},t.name))); top.append(ui.track); }
  top.append(ui.chapter, el('span',{class:'spacer'}));
  ui.mHands=el('button',{type:'button','aria-pressed':'false',onclick:()=>setMode('hands'),title:'The learner clicks the highlighted spot'},'Hands-on');
  ui.mSlides=el('button',{type:'button','aria-pressed':'false',onclick:()=>setMode('slides'),title:'Next (or →) does each step for you'},'Slides');
  top.append(el('span',{class:'seg',role:'group','aria-label':'How steps move forward'},ui.mHands,ui.mSlides),
    el('button',{class:'btn small',type:'button',onclick:toggleFull,title:'Full screen (F)','aria-label':'Full screen'},'⛶'));
  ui.bar=el('i'); top.append(el('div',{class:'dm-progress','aria-hidden':'true'},ui.bar));
  const main=el('main',{class:'dm-main'});
  ui.stage=el('div',{class:'dm-stage'}); ui.scene=el('div',{class:'dm-scene'}); ui.catch=el('div',{class:'dm-catch'});
  ui.spot=el('button',{class:'dm-spot',type:'button',hidden:true}); ui.tag=el('div',{class:'dm-tag',hidden:true,'aria-hidden':'true'});
  ui.where=el('div',{class:'dm-where','aria-live':'polite'}); ui.mini=el('div',{class:'dm-mini','aria-hidden':'true',hidden:true});
  ui.stage.append(ui.scene,ui.catch,ui.spot,ui.tag,ui.where,ui.mini);
  ui.scene.addEventListener('click',e=>{ const m=e.target.closest('[data-mat]'); if(m&&beats[idx].explore) openMaterial(m.dataset.mat); });
  ui.cap=el('section',{class:'dm-cap','aria-live':'polite'});
  main.append(ui.stage,ui.cap); root.append(top,main); document.body.append(root);
  ui.catch.addEventListener('pointerdown',e=>{ if(!ui.spot.hidden){ e.preventDefault(); nudge(); } });
  ui.spot.addEventListener('click',()=>perform());
  window.addEventListener('resize',()=>{ fit(); placeSpot(); });
  if(window.ResizeObserver){ let raf=0; new ResizeObserver(()=>{ cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{ fit(); placeSpot(); }); }).observe(ui.stage); }
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>{ fit(); placeSpot(); });
  document.addEventListener('keydown',onKey);
  syncMode();
}
function setMode(m){ mode=m; store.set('mode',m); syncMode(); caption(); }
function syncMode(){ ui.mHands.setAttribute('aria-pressed',String(mode==='hands')); ui.mSlides.setAttribute('aria-pressed',String(mode==='slides')); }
function toggleFull(){ try{ if(document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); }catch(e){} }
function onKey(e){
  if(e.target.closest&&e.target.closest('input,select,textarea')) return; if(document.querySelector('dialog[open]')) return;
  const k=e.key;
  const mat=e.target.closest&&e.target.closest('[data-mat]'); if(mat&&(k==='Enter'||k===' ')){ e.preventDefault(); if(beats[idx].explore) openMaterial(mat.dataset.mat); return; }
  if(k==='ArrowRight'||k==='PageDown'||k===' '||k==='Enter'){ if(k==='Enter'&&e.target.closest&&e.target.closest('button,a')) return; e.preventDefault(); primary(); }
  else if(k==='ArrowLeft'||k==='PageUp'){ e.preventDefault(); back(); }
  else if(k==='f'||k==='F'){ toggleFull(); }
  else if(k==='s'||k==='S'){ setMode(mode==='hands'?'slides':'hands'); }
}

/* ---------- navigation ---------- */
function setTrack(id,i){ trackId=id; T=cfg.tracks[id]; beats=expand(T);
  ui.track.value=id; ui.chapter.innerHTML='';
  T.chapters.forEach((c,ci)=>ui.chapter.append(el('option',{value:String(ci)},`${ci+1}. ${c.title}`)));
  lastKey=null; lastVB=null; go(i||0); }
function go(i){ idx=Math.max(0,Math.min(beats.length-1,i)); S=stateAt(idx); done=beats[idx].kind!=='step'||!needsAction(beats[idx]);
  const b=beats[idx]; if(b.kind==='step'||b.kind==='end') ui.chapter.value=String(b.ci);
  if(b.kind==='finish') ui.chapter.value=String(T.chapters.length-1);
  store.set('pos:'+cfg.id,{t:trackId,i:idx});
  ui.bar.style.width=(idx/(beats.length-1)*100)+'%';
  render(true); }
function needsAction(b){ return !!(b.target||b.hot); }
function primary(){ if(busy){ skipTween(); return; } const b=beats[idx];
  if(b.kind==='step'&&!done){ if(mode==='slides') perform(); else nudge(); return; }
  if(idx<beats.length-1) go(idx+1); }
function back(){ if(busy){ tweenToken++; busy=false; curAfter=null; } if(idx>0) go(idx-1); }
function perform(){ if(busy||done) return; const b=beats[idx]; busy=true;
  const r=spotRect(); if(r) ripple(r);
  setTimeout(()=>{ if(b.act) b.act(S); done=true; busy=false; render(false); },mode==='slides'?260:120); }
function nudge(){ ui.spot.classList.remove('nudge'); void ui.spot.offsetWidth; ui.spot.classList.add('nudge');
  const h=ui.cap.querySelector('.hint'); if(h){ h.style.fontWeight='700'; setTimeout(()=>h.style.fontWeight='',900); } }

/* ---------- drawing the stage ---------- */
function render(arrived){
  const b=beats[idx];
  if(b.kind==='finish'){ hideSpot(); ui.where.hidden=true; ui.mini.hidden=true; lastKey=null; lastVB=null; ui.scene.innerHTML=''; ui.scene.append(finishPanel()); caption(); return; }
  const sb=sceneBeat(idx);
  const key=(sb.scene||'')+'|'+(sb.view||'');
  const html=cfg.render(S,sb,{done:b.kind==='step'?done:true,beat:b});
  const changed=key!==lastKey;
  ui.scene.innerHTML=html;
  if(arrived&&changed){ ui.scene.classList.remove('fade'); void ui.scene.offsetWidth; ui.scene.classList.add('fade'); }
  const svg=ui.scene.querySelector('svg[data-main]')||ui.scene.querySelector(':scope>svg');
  if(svg&&b.kind==='step'&&b.hot){ const [x,y,w,h]=b.hot; const r=document.createElementNS('http://www.w3.org/2000/svg','rect');
    Object.entries({x,y,width:w,height:h,fill:'transparent','data-t':'__hot'}).forEach(([k,v])=>r.setAttribute(k,v)); svg.append(r); }
  fit(); hideSpot();
  ui.catch.style.display=b.explore?'none':'';
  if(b.explore) markSeen();
  showWhere(sb); caption(); /* the text changes at once; the spot appears when the zoom has settled */
  tweenToken++; busy=false;
  const after=()=>{ curAfter=null; if(b.kind==='step'&&!done) showSpot(b); }; curAfter=after;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(svg){ const full=svg.getAttribute('viewBox'); const to=sb.focus?sb.focus.join(' '):full;
    const prev=(!changed&&lastVB)?lastVB:null; lastKey=key; lastVB=to;
    showMini(svg,full,to);
    if(!arrived||reduce){ svg.setAttribute('viewBox',to); after(); }
    else if(prev&&prev!==to&&prev!==full&&to!==full){ svg.setAttribute('viewBox',prev); tween(svg,prev,full,380,()=>tween(svg,full,to,480,after)); } /* out to the whole view, then in: you always see where the next spot is */
    else if(prev&&prev!==to){ svg.setAttribute('viewBox',prev); tween(svg,prev,to,450,after); }
    else if(!prev&&to!==full){ svg.setAttribute('viewBox',full); busy=true; curSvg=svg; const tok=tweenToken; setTimeout(()=>{ if(tok===tweenToken) tween(svg,full,to,520,after); },220); } /* arriving at a close-up: start from the whole view */
    else { svg.setAttribute('viewBox',to); after(); } }
  else { lastKey=key; lastVB=null; showMini(null); after(); }
}
/* where am I: a trail at the top of the stage */
function showWhere(sb){ const parts=(cfg.where&&cfg.where(S,sb))||[]; ui.where.innerHTML='';
  if(!parts.length){ ui.where.hidden=true; return; } ui.where.hidden=false;
  ui.where.append(el('span',{class:'pin','aria-hidden':'true'},'⌖'));
  parts.forEach((p,i)=>{ if(i) ui.where.append(el('span',{class:'sep','aria-hidden':'true'},'›')); ui.where.append(el('span',{class:i===parts.length-1?'here':''},p)); }); }
/* overview map: the whole picture with a frame around the part you are zoomed into */
function showMini(svg,full,to){
  if(!svg||!full||to===full){ ui.mini.hidden=true; ui.mini.innerHTML=''; return; }
  const c=svg.cloneNode(true); c.removeAttribute('data-main'); c.setAttribute('viewBox',full); c.querySelectorAll('[data-t="__hot"],.hit,style').forEach(n=>n.remove()); c.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id')); c.querySelectorAll('[data-t],[data-zone],[data-part],[data-pin]').forEach(n=>{ n.removeAttribute('data-t'); n.removeAttribute('data-zone'); n.removeAttribute('data-part'); n.removeAttribute('data-pin'); });
  const [x,y,w,h]=to.split(/[\s,]+/).map(Number); const r=document.createElementNS('http://www.w3.org/2000/svg','rect');
  Object.entries({x,y,width:w,height:h,fill:'rgba(244,196,48,.18)',stroke:'#F4C430','stroke-width':3,'vector-effect':'non-scaling-stroke',rx:2}).forEach(([k,v])=>r.setAttribute(k,v)); c.append(r);
  ui.mini.innerHTML=''; ui.mini.append(el('div',{class:'lbl'},'You are here'),c); ui.mini.hidden=false; }
/* materials table: open any item to learn what it is */
const seenMat=new Set();
function markSeen(){ ui.scene.querySelectorAll('[data-mat]').forEach(n=>{ n.classList.toggle('seen',seenMat.has(n.dataset.mat)); }); }
function openMaterial(t){
  seenMat.add(t); markSeen(); caption();
  const d=(window.Art&&Art.def(t))||{name:t}, m=(window.MATERIALS||{})[t]||{};
  const body=el('div',{});
  if(window.Art&&Art.has(t)) body.append(Art.viewer(t,{state:{on:false}}));
  if(m.what) body.append(el('p',{style:'font-size:1.05rem;margin:.6rem 0 .3rem'},m.what));
  if(m.facts) body.append(el('ul',{style:'margin:.2rem 0 0;padding-left:1.2rem'},m.facts.map(f=>el('li',{},f))));
  modal(d.name,body,[{label:'Close',value:'',primary:true}]);
}
/* screens designed for a wide stage are scaled down as a whole on small screens, so their layout never breaks */
function fit(){ const sc=ui.scene, cs=getComputedStyle(sc); const fixedH=cs.position==='absolute';
  const availW=sc.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight), availH=sc.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
  sc.querySelectorAll('[data-fit]').forEach(el=>{ const W=+el.dataset.fit;
    if(!fixedH&&el.hasAttribute('data-reflow')){ el.style.zoom=''; el.style.width='100%'; el.style.maxWidth=W+'px'; return; } /* phones: let this page flow into one column */
    el.style.zoom=''; el.style.width=W+'px'; el.style.maxWidth='none';
    const w0=el.offsetWidth, h0=el.offsetHeight; let z=Math.min(1,availW/w0); if(fixedH&&h0>0) z=Math.min(z,availH/h0);
    if(z<0.999) el.style.zoom=z.toFixed(3); else { el.style.width='100%'; el.style.maxWidth=W+'px'; } });
  /* [data-fith]: keeps its own width, only shrinks when it is taller than the stage */
  if(fixedH) sc.querySelectorAll('[data-fith]').forEach(el=>{ el.style.zoom=''; const h0=el.offsetHeight; const z=Math.min(1,availH/h0); if(z<0.999) el.style.zoom=z.toFixed(3); }); }
let tweenToken=0, curAfter=null, curSvg=null;
/* on a slow computer (several frames over 45 ms) zooms drop the soft shadows while moving; they return when the zoom stops */
let lite=false, slowFrames=0;
const vbNums=v=>v.split(/[\s,]+/).map(Number);
/* zoom by stepping the viewBox (always sharp); on a slow computer the soft shadows pause while it moves */
function tween(svg,from,to,ms,cb){ const f=vbNums(from), t=vbNums(to); const st=performance.now(); busy=true; const tok=tweenToken; curSvg=svg;
  let prevT=null; if(lite) svg.classList.add('tw-lite');
  const step=now=>{ if(tok!==tweenToken){ svg.classList.remove('tw-lite'); return; }
    if(prevT!==null&&now-prevT>45&&++slowFrames>=3&&!lite){ lite=true; svg.classList.add('tw-lite'); } prevT=now;
    const k=Math.max(0,Math.min(1,(now-st)/ms)), e=1-Math.pow(1-k,3);
    svg.setAttribute('viewBox',f.map((v,i)=>+(v+(t[i]-v)*e).toFixed(2)).join(' ')); if(k<1) requestAnimationFrame(step); else { svg.classList.remove('tw-lite'); busy=false; cb(); } };
  requestAnimationFrame(step); }
/* a key press during a zoom finishes the zoom at once instead of being ignored */
function skipTween(){ if(!busy||!curAfter) return false; tweenToken++; busy=false; if(curSvg){ curSvg.classList.remove('tw-lite'); if(lastVB) curSvg.setAttribute('viewBox',lastVB); } const a=curAfter; curAfter=null; a(); return true; }
function targetEl(b){ const tg=b.hot?'__hot':b.target; if(!tg) return null;
  let sel; if(tg.startsWith('zone:')) sel=`[data-zone="${CSS.escape(tg.slice(5))}"]`; else if(tg.startsWith('part:')) sel=`[data-part="${CSS.escape(tg.slice(5))}"]`;
  else if(tg.startsWith('pin:')) sel=`[data-pin="${CSS.escape(tg.slice(4))}"]`; else if(tg.startsWith('css:')) sel=tg.slice(4); else sel=`[data-t="${CSS.escape(tg)}"]`;
  return ui.scene.querySelector(sel); }
function spotRect(){ const b=beats[idx]; const t=targetEl(b); if(!t) return null; const r=t.getBoundingClientRect(), s=ui.stage.getBoundingClientRect();
  const pad=6; let x=r.left-s.left-pad, y=r.top-s.top-pad, w=r.width+2*pad, h=r.height+2*pad;
  if(w<34){ x-=(34-w)/2; w=34; } if(h<34){ y-=(34-h)/2; h=34; }
  return {x,y,w,h}; }
function showSpot(b){ ui.spot.classList.add('nojump'); const r=spotRect();
  if(!r){ console.warn('Demo: target not found',b.target||b.hot,b.t); done=true; caption(); return; }
  placeSpot(); ui.spot.hidden=false; ui.tag.hidden=false; ui.tag.textContent=b.label||'Click here';
  ui.spot.setAttribute('aria-label',(b.label||b.t)+' (do this step)'); placeSpot(); requestAnimationFrame(()=>ui.spot.classList.remove('nojump')); }
function placeSpot(){ if(ui.spot.hidden&&ui.tag.hidden) return; const r=spotRect(); if(!r) return;
  Object.assign(ui.spot.style,{left:r.x+'px',top:r.y+'px',width:r.w+'px',height:r.h+'px'});
  const s=ui.stage.getBoundingClientRect();
  /* the overview map moves to the other corner (or fades) when it would cover the spot */
  if(!ui.mini.hidden){ const over=()=>{ const q=ui.mini.getBoundingClientRect(); return q.left-s.left<r.x+r.w&&q.right-s.left>r.x&&q.top-s.top<r.y+r.h&&q.bottom-s.top>r.y; };
    ui.mini.classList.remove('left','faint'); if(over()){ ui.mini.classList.add('left'); if(over()){ ui.mini.classList.remove('left'); ui.mini.classList.add('faint'); } } } const tw=ui.tag.offsetWidth, th=ui.tag.offsetHeight;
  let tx=r.x+r.w/2-tw/2; tx=Math.max(8,Math.min(s.width-tw-8,tx));
  /* keep the label clear of the location trail and the overview map */
  const box=e=>{ if(!e||e.hidden) return null; const q=e.getBoundingClientRect(); return {l:q.left-s.left,t:q.top-s.top,r:q.right-s.left,b:q.bottom-s.top}; };
  const avoid=[box(ui.where),box(ui.mini)].filter(Boolean);
  const hits=(x,y)=>avoid.some(a=>x<a.r&&x+tw>a.l&&y<a.b&&y+th>a.t);
  let above=r.y-th-14>6; let ty=above?r.y-th-12:Math.min(s.height-th-6,r.y+r.h+12);
  let side='';
  const onSpot=y=>y<r.y+r.h&&y+th>r.y;
  if(hits(tx,ty)){ const alt=above?Math.min(s.height-th-6,r.y+r.h+12):r.y-th-12; if(alt>4&&!hits(tx,alt)&&!onSpot(alt)){ above=!above; ty=alt; }
    else { /* no room above or below: put the label beside the spot */
      const sy=Math.max(8,Math.min(s.height-th-8,r.y+r.h/2-th/2)); const rx=r.x+r.w+14, lx=r.x-tw-14;
      if(rx+tw<s.width-6&&!hits(rx,sy)){ tx=rx; ty=sy; side='right'; } else if(lx>6&&!hits(lx,sy)){ tx=lx; ty=sy; side='left'; } } }
  ui.tag.className='dm-tag '+(side?'side-'+side:above?'above':'below'); ui.tag.style.left=tx+'px'; ui.tag.style.top=ty+'px';
  ui.tag.style.setProperty('--ax',Math.max(12,Math.min(tw-12,r.x+r.w/2-tx))+'px'); }
function hideSpot(){ ui.spot.hidden=true; ui.tag.hidden=true; }
function ripple(r){ const d=Math.max(r.w,r.h); const e=el('div',{class:'dm-ripple',style:`left:${r.x+r.w/2-d/2}px;top:${r.y+r.h/2-d/2}px;width:${d}px;height:${d}px`}); ui.stage.append(e); setTimeout(()=>e.remove(),700); }

/* ---------- callouts and terms ---------- */
function note(kind,label,icon,html){ return el('div',{class:'note '+kind},el('div',{class:'nh'},el('span',{class:'ic','aria-hidden':'true'},icon),el('span',{class:'nl'},label)),markTerms(el('p',{html}))); }
const plain=h=>String(h||'').replace(/<[^>]+>/g,' ');
let TERMRE=null;
function termRe(){ if(TERMRE||!window.GLOSSARY) return TERMRE; const keys=Object.keys(GLOSSARY).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&'));
  TERMRE=new RegExp('(^|[^A-Za-z0-9_])('+keys.join('|')+')(?![A-Za-z0-9_])','g'); return TERMRE; }
function termsIn(text){ const re=termRe(); if(!re) return []; const found=new Map(); let m; re.lastIndex=0; const t=plain(text);
  while((m=re.exec(t))){ const k=m[2]; if(!found.has(k)) found.set(k,GLOSSARY[k]); } return [...found]; }
function markTerms(node){ const re=termRe(); if(!re) return node;
  const walk=n=>{ [...n.childNodes].forEach(ch=>{ if(ch.nodeType===3){ const txt=ch.nodeValue; re.lastIndex=0; if(!re.test(txt)) return; re.lastIndex=0;
      const frag=document.createDocumentFragment(); let last=0, m;
      while((m=re.exec(txt))){ const st=m.index+m[1].length; frag.append(txt.slice(last,st)); const a=el('abbr',{class:'term',title:GLOSSARY[m[2]],tabindex:'0'},m[2]); frag.append(a); last=st+m[2].length; }
      frag.append(txt.slice(last)); ch.replaceWith(frag); } else if(ch.nodeType===1&&ch.tagName!=='ABBR') walk(ch); }); };
  walk(node); return node; }

/* ---------- caption ---------- */
function caption(){
  const b=beats[idx], c=ui.cap; const scrollKeep=ui.capBody&&ui.capIdx===idx?ui.capBody.scrollTop:0; c.innerHTML='';
  const body=el('div',{class:'cap-body'}); c.append(body); ui.capBody=body; ui.capIdx=idx;
  const ch=T.chapters[b.ci];
  body.append(el('div',{class:'where'},el('span',{},`Chapter ${b.ci+1} of ${T.chapters.length} · ${ch.title}`),
    b.kind==='step'?el('span',{},`Step ${b.bi+1} of ${b.bn}`):null));
  if(b.kind==='step'){
    body.append(el('h2',{},b.t));
    if(b.say) body.append(markTerms(el('p',{class:'say',html:b.say})));
    if(b.explore){ const n=ui.scene.querySelectorAll('[data-mat]').length, k=[...ui.scene.querySelectorAll('[data-mat]')].filter(x=>seenMat.has(x.dataset.mat)).length;
      body.append(el('p',{class:'hint'},`Click any item to see what it is and what it looks like. ${k} of ${n} checked.`)); }
    if(b.tip) body.append(note('warn','Watch out','!',b.tip));
    if(done&&b.ok) body.append(note('done','Done','✓',b.ok));
    const tm=termsIn([b.t,b.say,b.tip,done?b.ok:'',b.label].join(' '));
    if(tm.length) body.append(el('div',{class:'terms'},el('div',{class:'hd'},'Terms'),el('dl',{},tm.flatMap(([k,v])=>[el('dt',{},k),el('dd',{},v)]))));
    if(!done) body.append(el('p',{class:'hint'},mode==='hands'?`Click the highlighted spot${b.label?': '+b.label.toLowerCase():''}.`:'Press Next (or →) to do this step.'));
  } else if(b.kind==='end'){
    body.append(el('h2',{},'✓ '+ch.title),el('p',{class:'say'},ch.ends||''),el('p',{class:'hint'},'In this chapter:'),
      el('ol',{class:'list'},b.covered.map(t=>el('li',{},t))));
    const nx=T.chapters[b.ci+1]; if(nx) body.append(el('p',{class:'hint'},'Next chapter: '+nx.title));
  } else {
    body.append(el('h2',{},'Station complete'),el('p',{class:'say'},cfg.finishText||'You have seen every step of this station.'));
  }
  const nav=el('div',{class:'nav'});
  nav.append(el('button',{class:'btn',type:'button',disabled:idx===0,onclick:back,'aria-label':'Back'},'◀ Back'));
  const purl=b.kind==='step'&&b.photo?(b.photo.startsWith('q:')?'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(b.photo.slice(2)):(window.Art&&Art.photoUrl&&Art.photoUrl(b.photo))):null;
  if(purl) nav.append(el('a',{class:'btn small photo',href:purl,target:'_blank',rel:'noopener',title:'Opens an image search in a new tab'},'📷 See the actual image ↗'));
  let nextLabel='Next ▶', nextDisabled=false, pulse=false;
  if(b.kind==='step'&&!done){ if(mode==='slides'){ nextLabel='Do it ▶'; pulse=true; } else { nextDisabled=true; } }
  else { pulse=true; if(b.kind==='end') nextLabel=T.chapters[b.ci+1]?'Next chapter ▶':'Finish ▶'; }
  if(b.kind!=='finish') nav.append(el('button',{class:'btn primary next'+(pulse?' pulse':''),type:'button',disabled:nextDisabled,onclick:primary},nextLabel));
  c.append(nav);
  c.append(el('div',{class:'keys'},el('kbd',{},'→'),' next  ',el('kbd',{},'←'),' back  ',el('kbd',{},'S'),' hands-on / slides  ',el('kbd',{},'F'),' full screen'));
  body.scrollTop=scrollKeep;
}

/* ---------- finish ---------- */
function finishPanel(){
  const p=el('div',{class:'sc-finish'});
  p.append(el('h2',{},'✓ '+cfg.station+': '+cfg.title),el('p',{},T.name?`You finished the guided demo: ${T.name}.`:'You finished the guided demo.'),
    el('ol',{},T.chapters.map(c=>el('li',{},c.title))));
  const row=el('div',{style:'display:flex;gap:.5rem;flex-wrap:wrap'});
  row.append(el('button',{class:'btn primary',type:'button',onclick:certificate},'Save certificate'));
  if(cfg.next) row.append(el('a',{class:'btn',href:cfg.next.href},cfg.next.label+' ▶'));
  row.append(el('button',{class:'btn',type:'button',onclick:()=>go(0)},'Start again'));
  p.append(row); return p; }
function modal(title,body,buttons){ return new Promise(res=>{ const d=el('dialog',{'aria-label':title});
  d.append(el('div',{class:'dh'},el('b',{},title)),el('div',{class:'db'},body),el('div',{class:'df'},buttons.map(b=>el('button',{class:'btn'+(b.primary?' primary':''),type:'button',onclick:()=>{ d.close(b.value); }},b.label))));
  d.addEventListener('close',()=>{ res(d.returnValue); d.remove(); }); document.body.append(d); d.showModal(); }); }
async function certificate(){
  const inp=el('input',{type:'text',value:store.get('name',''),'aria-label':'Your name',placeholder:'Your name'});
  const v=await modal('Name on the certificate',el('div',{},el('p',{},'Type your name as it should appear.'),inp),[{label:'Cancel',value:''},{label:'Make certificate',value:'ok',primary:true}]);
  if(v!=='ok') return; const name=inp.value.trim()||'Student'; store.set('name',name);
  const W=1400,H=990,c=document.createElement('canvas'); c.width=W; c.height=H; const g=c.getContext('2d');
  const font=(w,s)=>`${w} ${s}px "Atkinson Hyperlegible","Segoe UI",Arial,sans-serif`;
  g.fillStyle='#fff'; g.fillRect(0,0,W,H); g.strokeStyle='#1D5B96'; g.lineWidth=14; g.strokeRect(40,40,W-80,H-80); g.strokeStyle='#F4C430'; g.lineWidth=4; g.strokeRect(70,70,W-140,H-140);
  g.fillStyle='#F4C430'; g.fillRect(W/2-110,95,220,46); g.fillStyle='#2A2100'; g.font=font(700,26); g.textAlign='center'; g.fillText('PC Tech Lab',W/2,127);
  g.fillStyle='#15222A'; g.font=font(700,64); g.fillText('Certificate of Completion',W/2,245);
  g.font=font(400,30); g.fillStyle='#4A5A62'; g.fillText('This is to recognize that',W/2,320);
  let sz=84; g.font=font(700,sz); while(g.measureText(name).width>W-260&&sz>40){ sz-=4; g.font=font(700,sz); } g.fillStyle='#15222A'; g.fillText(name,W/2,420);
  g.strokeStyle='#C3CFCB'; g.lineWidth=2; g.beginPath(); g.moveTo(300,450); g.lineTo(W-300,450); g.stroke();
  g.font=font(400,30); g.fillStyle='#4A5A62'; g.fillText('completed the guided demo',W/2,510);
  g.font=font(700,42); g.fillStyle='#1D5B96'; g.fillText(cfg.station+': '+cfg.title,W/2,570);
  g.font=font(400,28); g.fillStyle='#15222A'; if(T.name) g.fillText(T.name,W/2,625);
  g.font=font(400,24); g.fillStyle='#4A5A62'; g.textAlign='left'; g.fillText('Date: '+new Date().toLocaleDateString(),130,H-150);
  g.textAlign='center'; g.font=font(400,20); g.fillText('Classroom practice record, not a formal qualification.',W/2,H-100);
  const url=c.toDataURL('image/png');
  const r=await modal('Certificate',el('img',{src:url,alt:'Certificate for '+name,style:'width:100%;border:1px solid var(--line);border-radius:6px'}),[{label:'Close',value:''},{label:'Save as PNG',value:'save',primary:true}]);
  if(r==='save'){ const a=el('a',{href:url,download:('certificate-'+name+'-'+cfg.title).replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.png'}); document.body.append(a); a.click(); a.remove(); }
}

/* ---------- start ---------- */
function fromHash(){
  const h=decodeURIComponent(location.hash.slice(1)); let tr=Object.keys(cfg.tracks)[0], i=0;
  if(h){ const [a,b]=h.split(':'); if(cfg.tracks[a]){ tr=a; if(b){ const bs=expand(cfg.tracks[a]); const ci=cfg.tracks[a].chapters.findIndex(x=>x.id===b); if(ci>=0) i=bs.findIndex(x=>x.ci===ci); } }
    else { const ci=cfg.tracks[tr].chapters.findIndex(x=>x.id===a); if(ci>=0) i=expand(cfg.tracks[tr]).findIndex(x=>x.ci===ci); } }
  setTrack(tr,Math.max(0,i)); }
function start(c){ cfg=c; buildUI(); fromHash(); window.addEventListener('hashchange',fromHash); }
/* test hooks */
function info(){ return {idx,done,mode,beats,S,track:trackId,busy,lite}; }
return {start, el, esc, go, primary, back, perform, info, setMode, targetEl:()=>targetEl(beats[idx]), setTrack};
})();
