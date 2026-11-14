/* Station 3 drawings: cable on the bench, plug close-up, tester (shaded style, uses the shared art materials) */
window.CbDraw=(function(){
const D=window.CBD, A=window.Art, P=A&&A.P;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const T=(x,y,t,o={})=>`<text x="${x}" y="${y}" font-size="${o.s||10}" fill="${o.f||'#15222A'}" ${o.a?`text-anchor="${o.a}"`:''} font-family="Arial, sans-serif" ${o.w?'font-weight="700"':''}${o.op?` opacity="${o.op}"`:''}>${esc(t)}</text>`;
const R=(x,y,w,h,f,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${o.rx?`rx="${o.rx}"`:''} ${o.s?`stroke="${o.s}" stroke-width="${o.sw||1}"`:''}${o.op!=null?` opacity="${o.op}"`:''}/>`;
const JACKET={cat6:['#2F6FC0','#1D4F92','CAT6 U/UTP 23AWG 4PR · 1000 FT'],cat5e:['#8E989F','#646E75','CAT5E U/UTP 24AWG 4PR'],cca:['#2F6FC0','#1D4F92','CAT6 CCA 4PR'],flat:['#EDEFF1','#B9C0C6','FLAT PATCH']};
/* gradients and stripe patterns, defined once per drawing */
function defs(S){
  const j=JACKET[S.cable]||JACKET.cat6;
  let d=`<defs><linearGradient id="cb-mat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E6E5B"/><stop offset="1" stop-color="#2C5646"/></linearGradient>`+
    `<pattern id="cb-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#ffffff" stroke-opacity=".07" stroke-width="1"/></pattern>`+
    `<linearGradient id="cb-jacket" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${j[1]}"/><stop offset=".3" stop-color="${j[0]}"/><stop offset=".65" stop-color="${j[0]}"/><stop offset="1" stop-color="${j[1]}"/></linearGradient>`+
    `<linearGradient id="cb-jhl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".35"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>`+
    `<linearGradient id="cb-wire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>`+
    `<linearGradient id="cb-clear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF6FB" stop-opacity=".75"/><stop offset=".5" stop-color="#C9E1EC" stop-opacity=".45"/><stop offset="1" stop-color="#A9C6D4" stop-opacity=".6"/></linearGradient>`+
    `<linearGradient id="cb-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A6A1A"/><stop offset=".45" stop-color="#F5D77A"/><stop offset="1" stop-color="#B08A2A"/></linearGradient>`;
  Object.entries(D.colors).forEach(([k,c])=>{ const solid=c[2];
    if(c[1].startsWith('repeating')) d+=`<pattern id="cb-w-${k}" width="12" height="8" patternUnits="userSpaceOnUse"><rect width="12" height="8" fill="#F4F4F2"/><rect x="0" width="5" height="8" fill="${solid}"/></pattern>`; });
  return d+'</defs>';
}
const wireFill=c=>{ const col=D.colors[c]; return col[1].startsWith('repeating')?`url(#cb-w-${c})`:col[2]; };
function wireColor(c,x,y,w,h){ return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="${wireFill(c)}" stroke="#20282D" stroke-width=".5"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="url(#cb-wire)"/>`; }
function jacket(x1,x2,y,h,S){ const j=JACKET[S.cable]||JACKET.cat6;
  let s=`<rect x="${x1}" y="${y}" width="${x2-x1}" height="${h}" rx="${h/2}" fill="url(#cb-jacket)" stroke="#132A44" stroke-opacity=".5"/>`+
    `<rect x="${x1+4}" y="${y+2}" width="${x2-x1-8}" height="${h*.45}" rx="${h*.22}" fill="url(#cb-jhl)"/>`;
  if(x2-x1>160) s+=T(x1+16,y+h*.62,j[2],{s:9,f:S.cable==='flat'?'#56616A':'#E6F0FA',op:.85});
  return s;
}
/* bench: full cable with the selected end */
function bench(S,end,opt={}){
  const e=S.ends[end]; const W=680,H=250;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cable end ${end} on the bench">`+defs(S);
  s+=R(0,0,W,H,'url(#cb-mat)',{rx:8})+R(0,0,W,H,'url(#cb-grid)',{rx:8})+(opt.noHead?'':R(0,H-28,W,28,'#244a3c',{op:.85}));
  if(!opt.noHead) s+=T(12,H-10,(S.cable?D.cables[S.cable].name:'No cable chosen yet')+(S.length?` · cut to ${S.length} m`:''),{s:12,f:'#EAF3EE'});
  if(!S.cable){ s+=T(W/2,120,'Choose a cable from the bench list',{a:'middle',s:16,f:'#DCEBE3',w:1}); return s+'</svg>'; }
  if(!S.cut){
    s+=`<circle cx="130" cy="112" r="78" fill="#2E6FC0" stroke="#173F6E" stroke-width="3"/><circle cx="130" cy="112" r="78" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="30" stroke-dasharray="4 7"/><circle cx="130" cy="112" r="26" fill="#EDE3CF" stroke="#B8A888" stroke-width="2"/><circle cx="130" cy="112" r="10" fill="#2C5646"/>`;
    s+=`<path d="M200 140 C260 150 300 124 360 124 H600" fill="none" stroke="#173F6E" stroke-width="22" stroke-linecap="round"/><path d="M200 140 C260 150 300 124 360 124 H600" fill="none" stroke="${(JACKET[S.cable]||JACKET.cat6)[0]}" stroke-width="18" stroke-linecap="round"/><path d="M200 136 C260 146 300 120 360 120 H600" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="4" stroke-linecap="round"/>`;
    s+=T(430,100,'Measure and cut: cable still on the box reel',{a:'middle',s:13,f:'#fff',w:1});
    return s+'</svg>'; }
  const jacketEnd = e.stripped? 250 : 470;
  s+=`<ellipse cx="${(20+jacketEnd)/2}" cy="142" rx="${(jacketEnd-20)/2}" ry="5" fill="#000" opacity=".22"/>`;
  s+=jacket(20,jacketEnd,95,42,S);
  if(e.stripped){
    s+=`<rect x="${jacketEnd-6}" y="95" width="10" height="42" rx="3" fill="#0D2A4A" opacity=".55"/>`;
    const untw = e.untwisted;
    for(let i=0;i<8;i++){
      const c=e.order.length===8?e.order[i]:D.T568B[i];
      const y=100+i*5.2;
      if(!untw){ const pair=Math.floor(i/2); const yy=102+pair*11;
        const path=i%2===0?`M${jacketEnd} ${yy} q 20 -8 40 0 q 20 8 40 0 q 20 -8 40 0`:`M${jacketEnd} ${yy} q 20 8 40 0 q 20 -8 40 0 q 20 8 40 0`;
        s+=`<path d="${path}" stroke="#20282D" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="${path}" stroke="${D.colors[c][2]}" stroke-width="4.4" fill="none" stroke-linecap="round"/>`;
        if(i%2===1) s+=`<path d="${path}" stroke="#F4F4F2" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-dasharray="6 5"/>`;
        s+=`<path d="${path}" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" fill="none" transform="translate(0 -1)"/>`;
      } else {
        const len = e.trim? (e.trim*3.2) : 90;
        s+=wireColor(c, jacketEnd, y, len, 4.4);
        if(e.nicked&&i===2) s+=`<rect x="${jacketEnd+14}" y="${y-1}" width="4" height="6.4" fill="#C0392B"/>`;
      }
    }
    if(!untw) s+=T(jacketEnd+60,160,'pairs still twisted',{s:11,f:'#EAF3EE'});
    else if(!(e.inserted||e.crimped)) s+=T(jacketEnd+10,168,`untwisted and trimmed${e.trim?` to ${e.trim} mm`:''}`,{s:11,f:'#EAF3EE'});
  }
  if(e.inserted||e.crimped){ const px=e.trim? 250+e.trim*3.2-40 : 330; s+=plugSVG(px,70,e,S,end); }
  if(!opt.noHead) s+=`<rect x="6" y="6" width="${Math.min(420,120+((e.crimped?' — crimped':e.inserted?' — plug fitted, not crimped':e.stripped?' — stripped':' — untouched').length*6.4))}" height="26" rx="6" fill="#0F2A20" opacity=".55"/>`;
  if(!opt.noHead) s+=T(14,24,`End ${end}${e.crimped?' — crimped':e.inserted?' — plug fitted, not crimped':e.stripped?' — stripped':' — untouched'}`,{s:14,w:1,f:'#fff'});
  if(S.task&&!opt.noHead) s+=T(W-12,24,`Target order: T568${D.tasks[S.task].ends[end]}`,{s:12,a:'end',f:'#FFE08A',w:1});
  return s+'</svg>';
}
/* plug close-up, seen from above with the clip underneath; pin 1 at the top */
function plugSVG(x,y,e,S,end){
  const crimp=!!e.crimped; let s='';
  s+=`<rect x="${x+4}" y="${y+96}" width="150" height="6" rx="3" fill="#000" opacity=".2"/>`;
  /* the wires inside the clear body */
  for(let i=0;i<8;i++){ const c=e.order.length===8?e.order[i]:D.T568B[i]; const wy=y+8+i*10;
    const reach = !(e.trim&&e.trim<=8);
    s+=wireColor(c, x+6, wy, reach?118:70, 6); }
  /* clear body with bevelled nose and highlights */
  s+=`<path d="M${x} ${y+4} Q${x} ${y} ${x+4} ${y} H${x+144} Q${x+150} ${y} ${x+150} ${y+6} V${y+86} Q${x+150} ${y+92} ${x+144} ${y+92} H${x+4} Q${x} ${y+92} ${x} ${y+88}Z" fill="url(#cb-clear)" stroke="#7D94A3" stroke-width="2"/>`;
  s+=`<rect x="${x+6}" y="${y+3}" width="138" height="8" rx="4" fill="#fff" opacity=".45"/>`;
  s+=`<path d="M${x+55} ${y} v-14 q0 -3 3 -3 h34 q3 0 3 3 v14" fill="url(#cb-clear)" stroke="#7D94A3" stroke-width="2"/>`+T(x+75,y-4,'clip under',{a:'middle',s:7.5,f:'#46606E'});
  /* strain relief bar */
  s+=`<rect x="${x+20}" y="${y+(crimp?26:14)}" width="14" height="${crimp?40:64}" rx="3" fill="url(#cb-clear)" stroke="#7D94A3" stroke-width="1.6"/>`;
  /* gold contacts: pushed down into the wires when crimped */
  for(let i=0;i<8;i++){ const wy=y+8+i*10;
    s+=`<rect x="${x+124}" y="${wy-2}" width="8" height="10" rx="1" fill="url(#cb-gold)" stroke="#7A5C12" stroke-width=".5"/>`;
    s+=`<path d="M${x+(crimp?118:126)} ${wy+1} h${crimp?14:6}" stroke="#7A5C12" stroke-width="${crimp?1.4:.8}"/>`;
    s+=T(x+140,wy+6,String(i+1),{s:9,f:'#15222A',w:i===0||i===7?1:0}); }
  s+= e.jacketIn ? `<rect x="${x-14}" y="${y+18}" width="40" height="56" rx="8" fill="url(#cb-jacket)" stroke="#132A44" stroke-opacity=".5"/><rect x="${x-12}" y="${y+21}" width="36" height="16" rx="6" fill="url(#cb-jhl)"/>`
                 : T(x-70,y+50,'jacket outside',{s:10,f:'#FFB4A8',w:1});
  s+=`<rect x="${x+30}" y="${y+97}" width="90" height="16" rx="8" fill="${crimp?'#1C7F52':'#9A6408'}"/>`+T(x+75,y+109,crimp?'crimped':'not crimped yet',{a:'middle',s:10,f:'#fff',w:1});
  return s;
}
const CROSS=[2,5,0,3,4,1,6,7];
/* tester result summary (text grid, accessible) */
function tester(res,task){
  if(!res) return ''; const want=task==='crossover'?CROSS:[0,1,2,3,4,5,6,7];
  let html='<div class="tester" aria-label="Tester end A">';
  for(let i=0;i<8;i++){ const open=res.opens.includes(i+1); const shorted=res.shorts.some(p=>p.includes(i+1));
    html+=`<div class="${shorted?'short':open?'off':'on'}">A${i+1}</div>`; }
  html+='</div><div class="tester" aria-label="Tester end B">';
  for(let i=0;i<8;i++){ const j=res.map[i]; const open=res.opens.includes(i+1); const shorted=res.shorts.some(p=>p.includes(i+1));
    html+=`<div class="${shorted?'short':open?'off':(j===want[i]?'on':'x')}">${j==null?'—':'B'+(j+1)}</div>`; }
  html+='</div>';
  return html;
}
/* the tester itself, lights following one step of the chase (step 0..7, or 'all') */
function testerArt(res,step,task){
  if(!A) return '';
  const want=task==='crossover'?CROSS:[0,1,2,3,4,5,6,7];
  const unit=(x,lbl,remote)=>{ let u=`<rect x="${x}" y="6" width="96" height="92" rx="8" fill="url(#m-black)"/><rect x="${x+2}" y="8" width="92" height="14" rx="6" fill="url(#m-gloss)"/>`+
      `<rect x="${x+6}" y="14" width="84" height="26" rx="3" fill="#101417"/>`;
    for(let i=0;i<8;i++){ const px=x+13+i*10; let lit=false, col='g';
      const k=step;
      if(k!=null&&k!=='all'){
        if(!remote) lit=true&&i===k;
        else { const sh=res.shorts.find(p=>p.includes(k+1));
          if(sh){ lit=sh.includes(i+1); col='r'; }
          else if(!res.opens.includes(k+1)){ lit=res.map[k]===i; col=res.map[k]===want[k]?'g':'a'; } }
      }
      u+=P.led(px,25,{r:3,lit,color:col})+T(px,36.5,String(i+1),{a:'middle',s:5,f:'#AEB8BF'}); }
    u+=P.led(x+83,50,{r:2.4,lit:k_on(step),color:'g'})+T(x+83,59,'G',{a:'middle',s:4.4,f:'#AEB8BF'});
    u+=P.rj45(x+22,54,{w:22,h:19,plug:true})+T(x+48,92,lbl,{a:'middle',s:6,f:'#DDE4E8',w:1});
    if(!remote) u+=`<rect x="${x+56}" y="60" width="18" height="10" rx="3" fill="url(#m-red)"/>`+T(x+65,78,'ON · AUTO',{a:'middle',s:4.2,f:'#AEB8BF'});
    return u; };
  const cable=`<path d="M33 79 C33 120, 173 120, 173 79" fill="none" stroke="#173F6E" stroke-width="7"/><path d="M33 79 C33 120, 173 120, 173 79" fill="none" stroke="#2F6FC0" stroke-width="5"/><path d="M33 78 C33 117, 173 117, 173 78" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.4"/>`;
  return `<svg class="art" viewBox="-4 0 244 124" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cable tester, ${step==='all'||step==null?'idle':'testing pin '+(step+1)}">`+
    P.shadow(118,100,110,3)+cable+unit(0,'MASTER (end A)',false)+unit(140,'REMOTE (end B)',true)+'</svg>';
}
const k_on=step=>step!=null;
return {bench,tester,testerArt,wireColor};
})();
