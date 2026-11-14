/* Art engine: shaded vector drawings of every device and part, plus the interaction runtime.
   Drawings are SVG strings built from shared materials (gradients in one hidden <defs>) and primitives.
   Interaction: hover explanations, x-ray labels, zoom to a part, flip between views, live states. */
(function(){
const A = window.Art = {};
const REG = {};
A.REG = REG;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
A.esc = esc;
let uid = 0; A.uid = p => (p||'u') + (++uid);

/* ---------- materials: gradients and filters, injected once ---------- */
const LG = (id, stops, x2='0', y2='1', x1='0', y1='0') =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">` +
  stops.map(([o,c,op]) => `<stop offset="${o}" stop-color="${c}"${op!=null?` stop-opacity="${op}"`:''}/>`).join('') + `</linearGradient>`;
const RG = (id, stops, cx='.5', cy='.5', r='.5', fx, fy) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"${fx?` fx="${fx}" fy="${fy}"`:''}>` +
  stops.map(([o,c,op]) => `<stop offset="${o}" stop-color="${c}"${op!=null?` stop-opacity="${op}"`:''}/>`).join('') + `</radialGradient>`;
const DEFS = [
  LG('m-black',   [[0,'#4B545D'],[.08,'#353C43'],[.85,'#22282D'],[1,'#14181B']]),
  LG('m-black-h', [[0,'#22282D'],[.5,'#3A424A'],[1,'#22282D']], '1','0'),
  LG('m-grey',    [[0,'#8E989F'],[.1,'#6E777E'],[.9,'#50585E'],[1,'#3C4348']]),
  LG('m-white',   [[0,'#FFFFFF'],[.1,'#F4F6F7'],[.85,'#DCE1E5'],[1,'#BFC7CD']]),
  LG('m-white-h', [[0,'#D5DBDF'],[.5,'#FAFBFC'],[1,'#D5DBDF']], '1','0'),
  LG('m-metal',   [[0,'#EEF1F3'],[.25,'#C7CDD2'],[.5,'#E3E7EA'],[.75,'#AEB6BC'],[1,'#CBD1D6']]),
  LG('m-metal-h', [[0,'#A9B1B7'],[.3,'#E6EAED'],[.6,'#B9C0C6'],[1,'#8F989F']], '1','0'),
  LG('m-alu',     [[0,'#D8DDE1'],[.5,'#B8C0C6'],[1,'#9AA3AA']]),
  LG('m-gunmetal',[[0,'#6A737B'],[.5,'#4A525A'],[1,'#30363C']]),
  LG('m-pcb',     [[0,'#2B7350'],[1,'#164A31']]),
  LG('m-pcb-dark',[[0,'#2E353B'],[1,'#191D21']]),
  LG('m-gold',    [[0,'#FBE7A0'],[.5,'#E0B849'],[1,'#B8902A']]),
  LG('m-gold-h',  [[0,'#B8902A'],[.5,'#F7DE8B'],[1,'#B8902A']], '1','0'),
  LG('m-copper',  [[0,'#F2B48A'],[.5,'#C9784A'],[1,'#9A5530']]),
  LG('m-port-blue',  [[0,'#5AA0EA'],[1,'#1A4F8F']]),
  LG('m-port-yellow',[[0,'#FFE58A'],[1,'#C99A12']]),
  LG('m-port-green', [[0,'#5FD39A'],[1,'#1C7F52']]),
  LG('m-port-purple',[[0,'#B39AF0'],[1,'#5B3FB0']]),
  LG('m-rubber',  [[0,'#3A3F44'],[1,'#1B1E21']]),
  LG('m-glass',   [[0,'#2A3A48'],[.55,'#101820'],[1,'#0B1117']], '1','1'),
  LG('m-glass-on',[[0,'#2F6FB8'],[.6,'#1C4A86'],[1,'#12325E']], '1','1'),
  LG('m-gloss',   [[0,'#FFFFFF',.32],[.45,'#FFFFFF',.06],[1,'#FFFFFF',0]]),
  LG('m-shade',   [[0,'#000000',0],[1,'#000000',.28]]),
  LG('m-orange',  [[0,'#FFB36B'],[1,'#D9661A']]),
  LG('m-red',     [[0,'#F2685B'],[1,'#B02A20']]),
  LG('m-blue',    [[0,'#5B9BE0'],[1,'#1F5A9E']]),
  LG('m-cable',   [[0,'#5E6A74'],[.5,'#2C343B'],[1,'#1A1F24']]),
  LG('m-cable-blue',[[0,'#6FA8E8'],[.5,'#2C68B0'],[1,'#1C4A80']]),
  LG('m-clear',   [[0,'#FFFFFF',.55],[.5,'#E8F1F6',.35],[1,'#C9DAE4',.5]]),
  RG('m-shadow',  [[0,'#000000',.38],[1,'#000000',0]]),
  RG('m-led-g',   [[0,'#E9FFF3'],[.35,'#4CF29A'],[1,'#10A35A']], '.5','.5','.5','.35','.35'),
  RG('m-led-a',   [[0,'#FFF5DA'],[.35,'#FFC24A'],[1,'#D98300']], '.5','.5','.5','.35','.35'),
  RG('m-led-b',   [[0,'#EAF4FF'],[.35,'#5FB2FF'],[1,'#1869C9']], '.5','.5','.5','.35','.35'),
  RG('m-led-r',   [[0,'#FFE7E3'],[.35,'#FF6B5A'],[1,'#C4271A']], '.5','.5','.5','.35','.35'),
  RG('m-led-w',   [[0,'#FFFFFF'],[.5,'#EAF2FF'],[1,'#AFC6E6']], '.5','.5','.5','.35','.35'),
  RG('m-led-off', [[0,'#6A737B'],[1,'#2A3036']], '.5','.5','.5','.35','.35'),
  RG('m-screw',   [[0,'#F4F6F8'],[.6,'#AEB6BC'],[1,'#6F787F']], '.5','.5','.5','.35','.3'),
  RG('m-dome',    [[0,'#FFFFFF'],[.6,'#E4E9ED'],[1,'#B7C0C7']], '.5','.5','.5','.35','.3'),
  RG('m-lens',    [[0,'#6F8CA8'],[.3,'#1F2E3C'],[1,'#05080B']], '.5','.5','.5','.35','.35'),
].join('') +
  `<filter id="f-shadow" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000" flood-opacity=".32"/></filter>` +
  `<filter id="f-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
  `<pattern id="p-mesh" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.05" fill="#0B0E10"/></pattern>` +
  `<pattern id="p-mesh-light" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.05" fill="#8C969E"/></pattern>` +
  `<pattern id="p-hex" width="6" height="5.2" patternUnits="userSpaceOnUse"><rect width="6" height="5.2" fill="#3E474E"/><path d="M3 0 L6 1.3 L6 3.9 L3 5.2 L0 3.9 L0 1.3Z" fill="#07090A" transform="translate(.6 .52) scale(.8)"/></pattern>`;

const STYLE = `
.art{display:block;width:100%;height:auto;overflow:visible;font-family:Arial,Helvetica,sans-serif}
.art text{pointer-events:none;user-select:none}
.art [data-part]{transition:filter .15s}
.art.explore [data-part]{cursor:help}
.art.explore [data-part]:hover{filter:brightness(1.18) saturate(1.1)}
.art .spin{animation:art-spin .55s linear infinite;transform-box:fill-box;transform-origin:center}
.art .spin.slow{animation-duration:1.4s}
.art .blink{animation:art-blink 1s steps(2,start) infinite}
.art .blink.fast{animation-duration:.35s}
.art .pulse{animation:art-pulse 1.6s ease-in-out infinite}
.art .move{transition:transform .35s cubic-bezier(.3,.7,.2,1)}
.art .xray-box{fill:rgba(255,213,74,.10);stroke:#FFD54A;stroke-width:1.2;stroke-dasharray:4 3;vector-effect:non-scaling-stroke;pointer-events:none}
.art .xray-dot{fill:#FFD54A;stroke:#2A2100;stroke-width:1;vector-effect:non-scaling-stroke}
.art .xray-num{fill:#2A2100;font-weight:700;text-anchor:middle;dominant-baseline:central}
@keyframes art-spin{to{transform:rotate(360deg)}}
@keyframes art-blink{0%{opacity:1}50%{opacity:.18}}
@keyframes art-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@media (prefers-reduced-motion:reduce){.art .spin,.art .blink,.art .pulse{animation:none}.art .move{transition:none}}
#art-tip{position:fixed;z-index:400;max-width:280px;pointer-events:none;background:#0F171C;color:#EAF1F4;border:1px solid #3A4B55;border-radius:8px;padding:.45rem .6rem;font:13px/1.4 "Atkinson Hyperlegible",system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.35);opacity:0;transform:translateY(4px);transition:opacity .12s,transform .12s}
#art-tip.show{opacity:1;transform:none}
#art-tip b{display:block;font-size:13.5px;margin-bottom:2px;color:#FFD54A}
.art-viewer{display:grid;gap:.5rem}
.art-viewer .av-stage{perspective:900px;background:radial-gradient(ellipse at 50% 35%,#FFFFFF 0%,#E7ECEF 70%);border:1px solid var(--line,#C3CFCB);border-radius:10px;padding:12px;min-height:180px;display:grid;place-items:center;overflow:hidden}
:root[data-theme="dark"] .art-viewer .av-stage{background:radial-gradient(ellipse at 50% 35%,#2A3740 0%,#141D22 75%)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .art-viewer .av-stage{background:radial-gradient(ellipse at 50% 35%,#2A3740 0%,#141D22 75%)}}
.art-viewer .av-card{width:100%;display:grid;place-items:center;transition:transform .18s ease-in;transform-style:preserve-3d}
.art-viewer .av-card svg{max-height:300px;width:100%}
.art-viewer .av-card.out{transform:rotateY(90deg)}
.art-viewer .av-bar{display:flex;flex-wrap:wrap;gap:.35rem;align-items:center;min-width:0}
.art-viewer .av-bar select{max-width:100%;min-width:0;text-overflow:ellipsis}
.art-viewer .av-bar .btn[aria-pressed="true"]{background:var(--ink,#15222A);color:var(--panel,#fff);border-color:var(--ink,#15222A)}
.art-viewer .av-legend{margin:0;padding-left:1.4rem;columns:2;column-gap:1.2rem;font-size:.86rem}
.art-viewer .av-legend li{break-inside:avoid;margin:.1rem 0}
@media (max-width:560px){.art-viewer .av-legend{columns:1}}
.art-thumb{display:grid;place-items:center;background:radial-gradient(ellipse at 50% 40%,#FFFFFF 0%,#E3E9EC 80%);border-radius:6px;overflow:hidden}
.art-thumb svg{width:92%;height:92%}
:root[data-theme="dark"] .art-thumb{background:radial-gradient(ellipse at 50% 40%,#2A3740 0%,#141D22 85%)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .art-thumb{background:radial-gradient(ellipse at 50% 40%,#2A3740 0%,#141D22 85%)}}
@media (prefers-reduced-motion:reduce){.art-viewer .av-card{transition:none}}
`;
const EXTRA_DEFS=[];
/* extra gradients/patterns from other art files; works before or after the defs are injected */
A.addDefs=str=>{ const d=document.querySelector('#art-defs defs'); if(!d){ EXTRA_DEFS.push(str); return; }
  const tmp=document.createElementNS('http://www.w3.org/2000/svg','svg'); tmp.innerHTML='<defs>'+str+'</defs>'; [...tmp.firstChild.childNodes].forEach(n=>d.append(n)); };
function ensureDefs(){
  if(document.getElementById('art-defs')) return;
  const st=document.createElement('style'); st.id='art-css'; st.textContent=STYLE; document.head.append(st);
  const holder=document.createElementNS('http://www.w3.org/2000/svg','svg');
  holder.setAttribute('id','art-defs'); holder.setAttribute('width','0'); holder.setAttribute('height','0');
  holder.setAttribute('aria-hidden','true'); holder.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
  holder.innerHTML='<defs>'+DEFS+EXTRA_DEFS.join('')+'</defs>';
  (document.body||document.documentElement).prepend(holder);
}
A.ensureDefs=ensureDefs;
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ensureDefs); else ensureDefs();

/* ---------- primitives (all return SVG strings) ---------- */
const P = A.P = {};
P.part = (id, inner, extra='') => `<g data-part="${esc(id)}"${extra?' '+extra:''}>${inner}</g>`;
P.shadow = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#m-shadow)"/>`;
/* a body with a top gloss and a bottom shade */
P.body = (x,y,w,h,o={}) => {
  const rx=o.rx==null?6:o.rx, mat=o.mat||'m-black';
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#${mat})"${o.stroke?` stroke="${o.stroke}" stroke-width="${o.sw||1}"`:''}/>`;
  if(o.gloss!==false) s+=`<rect x="${x+2}" y="${y+1.5}" width="${w-4}" height="${Math.min(h*.35,o.glossH||h*.35)}" rx="${Math.max(0,rx-1.5)}" fill="url(#m-gloss)"/>`;
  if(o.edge!==false) s+=`<rect x="${x+rx*.6}" y="${y+h-1.6}" width="${w-rx*1.2}" height="1.2" rx=".6" fill="#000" opacity=".25"/>`;
  return s;
};
P.text = (x,y,t,o={}) => `<text x="${x}" y="${y}" font-size="${o.s||6}" fill="${o.f||'#C9D2D8'}"${o.a?` text-anchor="${o.a}"`:''}${o.w?` font-weight="${o.w}"`:''}${o.ls?` letter-spacing="${o.ls}"`:''}${o.op?` opacity="${o.op}"`:''}${o.r?` transform="rotate(${o.r} ${x} ${y})"`:''}>${esc(t)}</text>`;
P.led = (x,y,o={}) => {
  const r=o.r||2.2, c=o.color||'g';
  const lit=o.lit, fill=lit?`url(#m-led-${c})`:'url(#m-led-off)';
  return `<circle class="led${lit&&o.blink?' blink'+(o.fast?' fast':''):''}" cx="${x}" cy="${y}" r="${r}" fill="${fill}"${lit?' filter="url(#f-glow)"':''}/>` +
    `<circle cx="${x-r*.35}" cy="${y-r*.4}" r="${r*.32}" fill="#fff" opacity="${lit?.85:.35}"/>`;
};
P.screw = (x,y,r=2.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#m-screw)" stroke="#5A636A" stroke-width=".4"/>` +
  `<path d="M${x-r*.55} ${y}h${r*1.1}M${x} ${y-r*.55}v${r*1.1}" stroke="#4A535A" stroke-width="${r*.28}" stroke-linecap="round"/>`;
P.vents = (x,y,w,h,o={}) => {
  const n=o.n||Math.max(3,Math.floor(w/(o.gap||5))), gw=o.slot||2.2, col=o.col||'#0C0F11';
  let s=''; const step=w/n;
  for(let i=0;i<n;i++){ const vx=x+i*step+(step-gw)/2; s+=`<rect x="${vx}" y="${y}" width="${gw}" height="${h}" rx="${gw/2}" fill="${col}"/>`; }
  return s;
};
P.hvents = (x,y,w,h,o={}) => {
  const n=o.n||Math.max(3,Math.floor(h/(o.gap||5))), gh=o.slot||2, col=o.col||'#0C0F11';
  let s=''; const step=h/n;
  for(let i=0;i<n;i++){ const vy=y+i*step+(step-gh)/2; s+=`<rect x="${x}" y="${vy}" width="${w}" height="${gh}" rx="${gh/2}" fill="${col}"/>`; }
  return s;
};
/* RJ45 socket seen from the front. w≈16, h≈14 */
P.rj45 = (x,y,o={}) => {
  const w=o.w||16, h=o.h||14, insert=o.color?`url(#m-port-${o.color})`:'url(#m-metal)';
  let s='';
  s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.2" fill="${insert}" stroke="#2A3035" stroke-width=".5"/>`;
  s+=`<rect x="${x+1.6}" y="${y+1.6}" width="${w-3.2}" height="${h*.62}" rx=".8" fill="#0B0D0F"/>`;
  s+=`<rect x="${x+w*.3}" y="${y+1.6+h*.62-.2}" width="${w*.4}" height="${h*.26}" rx=".5" fill="#0B0D0F"/>`;
  for(let i=0;i<8;i++) s+=`<rect x="${x+2.6+i*(w-5.2)/8+.3}" y="${y+2.2}" width="${(w-5.2)/8-.7}" height="${h*.2}" fill="url(#m-gold)"/>`;
  if(o.plug) s+=`<rect x="${x+1.8}" y="${y+1.8}" width="${w-3.6}" height="${h*.62-.4}" rx=".8" fill="url(#m-clear)" stroke="#9DB3C0" stroke-width=".4"/>`+
    `<rect x="${x+w*.32}" y="${y+h}" width="${w*.36}" height="6" fill="url(#m-cable${o.plug==='blue'?'-blue':''})"/>`;
  if(o.leds){ s+=P.led(x+2.5,y-2.6,{r:1.4,lit:o.link,color:'g'})+P.led(x+w-2.5,y-2.6,{r:1.4,lit:o.act,blink:o.act,color:'a',fast:true}); }
  return s;
};
P.usbA = (x,y,o={}) => {
  const w=o.w||12.5, h=o.h||5.4, tongue=o.color==='blue'?'#1E6FD9':o.color==='red'?'#C8322A':o.color==='white'?'#E9EDF0':'#15191C';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".6" fill="url(#m-metal)" stroke="#5B646A" stroke-width=".4"/>`+
    `<rect x="${x+.9}" y="${y+.9}" width="${w-1.8}" height="${h-1.8}" rx=".4" fill="#0B0D0F"/>`+
    `<rect x="${x+1.3}" y="${y+1.2}" width="${w-2.6}" height="${(h-1.8)*.46}" rx=".3" fill="${tongue}"/>`;
};
P.usbC = (x,y,o={}) => { const w=o.w||9, h=o.h||3.4;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="url(#m-metal)" stroke="#5B646A" stroke-width=".4"/>`+
    `<rect x="${x+.8}" y="${y+.8}" width="${w-1.6}" height="${h-1.6}" rx="${(h-1.6)/2}" fill="#0B0D0F"/>`+
    `<rect x="${x+2}" y="${y+h/2-.45}" width="${w-4}" height=".9" rx=".45" fill="#3B4248"/>`; };
P.hdmi = (x,y,o={}) => { const w=o.w||14, h=o.h||5;
  return `<path d="M${x} ${y}h${w}v${h*.55}l-${w*.12} ${h*.45}h-${w*.76}l-${w*.12} -${h*.45}Z" fill="url(#m-metal)" stroke="#5B646A" stroke-width=".4"/>`+
    `<path d="M${x+1} ${y+1}h${w-2}v${h*.45}l-${w*.1} ${h*.35}h-${w*.8+(-2)}l-${w*.1} -${h*.35}Z" fill="#0B0D0F"/>`+
    `<rect x="${x+2.2}" y="${y+1.6}" width="${w-4.4}" height="${h*.3}" fill="#23282C"/>`; };
P.dp = (x,y,o={}) => { const w=o.w||13, h=o.h||5;
  return `<path d="M${x} ${y}h${w}v${h}h-${w-2}l-2 -2Z" fill="url(#m-metal)" stroke="#5B646A" stroke-width=".4"/>`+
    `<path d="M${x+1} ${y+1}h${w-2}v${h-2}h-${w-4}l-1 -1Z" fill="#0B0D0F"/>`+
    `<rect x="${x+2.4}" y="${y+1.8}" width="${w-4.8}" height="${h*.28}" fill="#23282C"/>`; };
P.dc = (x,y,o={}) => { const r=o.r||4.5;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#0B0D0F" stroke="url(#m-metal)" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="${r*.3}" fill="url(#m-metal)"/>`; };
P.audio = (x,y,o={}) => { const r=o.r||3, c=o.color||'#6ABF4B';
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#1B1F22" stroke-width=".6"/><circle cx="${x}" cy="${y}" r="${r*.48}" fill="#0B0D0F"/>`; };
P.iec = (x,y,o={}) => { const w=o.w||16, h=o.h||12;
  return `<path d="M${x} ${y}h${w}v${h*.7}l-${w*.18} ${h*.3}h-${w*.64}l-${w*.18} -${h*.3}Z" fill="#15191C" stroke="#3E464D" stroke-width=".8"/>`+
    [0,1,2].map(i=>`<rect x="${x+w*(.27+i*.23)-1}" y="${y+(i===1?h*.18:h*.38)}" width="2" height="${h*.3}" rx=".3" fill="url(#m-metal)"/>`).join(''); };
P.sfp = (x,y,o={}) => { const w=o.w||14, h=o.h||11;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".6" fill="url(#m-metal)" stroke="#5B646A" stroke-width=".4"/><rect x="${x+1.2}" y="${y+1.2}" width="${w-2.4}" height="${h-2.4}" fill="#0B0D0F"/>`; };
P.pinhole = (x,y) => `<circle cx="${x}" cy="${y}" r="1.7" fill="#050607" stroke="#5A636A" stroke-width=".5"/>`;
P.button = (x,y,r=4,o={}) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${o.mat||'m-black'})" stroke="${o.ring||'#6E787F'}" stroke-width="${o.sw||.8}"/>`+
  (o.icon==='power'?`<path d="M${x-r*.45} ${y-r*.28}a${r*.52} ${r*.52} 0 1 0 ${r*.9} 0" fill="none" stroke="${o.ic||'#C9D2D8'}" stroke-width="${r*.14}" stroke-linecap="round"/><path d="M${x} ${y-r*.6}v${r*.55}" stroke="${o.ic||'#C9D2D8'}" stroke-width="${r*.14}" stroke-linecap="round"/>`:'');
P.fan = (cx,cy,r,o={}) => {
  const n=o.blades||9, frame=o.frame!==false;
  let s='';
  if(frame) s+=`<rect x="${cx-r-2}" y="${cy-r-2}" width="${2*r+4}" height="${2*r+4}" rx="${r*.18}" fill="url(#${o.mat||'m-black'})"/>`+
    [[-1,-1],[1,-1],[-1,1],[1,1]].map(([dx,dy])=>`<circle cx="${cx+dx*(r-r*.05)}" cy="${cy+dy*(r-r*.05)}" r="${r*.06}" fill="#0B0D0F"/>`).join('');
  s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#0C0F11"/>`;
  let blades='';
  for(let i=0;i<n;i++){ const a=i*360/n;
    blades+=`<path d="M0 ${-r*.28} C ${r*.35} ${-r*.45} ${r*.55} ${-r*.7} ${r*.28} ${-r*.95} C ${r*.05} ${-r*.8} ${-r*.08} ${-r*.55} 0 ${-r*.28}Z" fill="url(#${o.blade||'m-grey'})" transform="rotate(${a})"/>`; }
  s+=`<g transform="translate(${cx} ${cy})"><g class="${o.spin?'spin'+(o.slow?' slow':''):''}">${blades}</g></g>`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${r*.3}" fill="url(#${o.hub||'m-black'})" stroke="#0B0D0F" stroke-width=".6"/>`;
  if(o.hubLabel) s+=`<circle cx="${cx}" cy="${cy}" r="${r*.22}" fill="${o.hubLabel}"/>`;
  if(o.grille) for(let k=1;k<=4;k++) s+=`<circle cx="${cx}" cy="${cy}" r="${r*k/4.2}" fill="none" stroke="#9AA3AA" stroke-width="${r*.025}" opacity=".85"/>`;
  return s;
};
P.antenna = (x,y,len,o={}) => {
  const w=o.w||7;
  return `<rect x="${x-w/2}" y="${y-len}" width="${w}" height="${len}" rx="${w/2}" fill="url(#${o.white?'m-white-h':'m-black-h'})"/>`+
    `<rect x="${x-w/2-1.2}" y="${y-5}" width="${w+2.4}" height="7" rx="1.6" fill="url(#${o.white?'m-white':'m-black'})"/>`;
};
P.chip = (x,y,w,h,label,o={}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx||.8}" fill="url(#m-pcb-dark)" stroke="#0B0D0F" stroke-width=".4"/>`+
  (label?P.text(x+w/2,y+h/2+1.6,label,{a:'middle',s:o.s||3.6,f:'#9AA6AE'}):'');
P.cableRun = (d, o={}) => `<path d="${d}" fill="none" stroke="${o.dark||'#0F1316'}" stroke-width="${(o.w||4)+1.2}" stroke-linecap="round" stroke-linejoin="round"/>`+
  `<path d="${d}" fill="none" stroke="${o.color||'#3C454D'}" stroke-width="${o.w||4}" stroke-linecap="round" stroke-linejoin="round"/>`+
  `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-opacity=".22" stroke-width="${(o.w||4)*.3}" stroke-linecap="round" transform="translate(0 -${(o.w||4)*.22})"/>`;
P.label = (x,y,w,h,t,o={}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx||1}" fill="${o.bg||'#F4F1E8'}" stroke="#C9C2AE" stroke-width=".3"/>`+
  (t?P.text(x+w/2,y+h/2+(o.s||3)*.36,t,{a:'middle',s:o.s||3,f:o.f||'#3B3A33',w:o.w}):'');

/* ---------- registry ---------- */
/* def: {name, cat, views:{front:{w,h,pad,draw(st)}, back:{...}}, defaultView, parts:{id:{name,info}}, state:{...}} */
A.register = (type, def) => { REG[type]=def; def.type=type; def.defaultView=def.defaultView||Object.keys(def.views)[0]; };
A.has = t => !!REG[t];
A.def = t => REG[t];
A.svg = (type, o={}) => {
  const d=REG[type]; if(!d) return '';
  const vname=o.view&&d.views[o.view]?o.view:d.defaultView, v=d.views[vname];
  const st=Object.assign({}, d.state||{}, o.state||{});
  const pad=v.pad==null?6:v.pad;
  const label=o.label||`${d.name}, ${vname} view`;
  const box=o.box?o.box.join(' '):v.box?v.box.join(' '):`${-pad} ${-pad} ${v.w+2*pad} ${v.h+2*pad}`;
  return `<svg class="art${o.explore?' explore':''}${o.cls?' '+o.cls:''}" data-art="${type}" data-view="${vname}" viewBox="${box}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">`+
    v.draw(st, o) + `</svg>`;
};
/* raw markup of one view, for embedding a drawing inside another drawing */
A.inner = (type, view, state={}) => { const d=REG[type]; if(!d) return ''; const v=d.views[view]||d.views[d.defaultView]; return v.draw(Object.assign({},d.state||{},state),{}); };
A.thumb = (type, o={}) => A.svg(type, Object.assign({view:(REG[type]&&REG[type].thumbView)||undefined, state:Object.assign({on:true},(REG[type]&&REG[type].thumbState)||{}), label:(REG[type]||{}).name},o));

/* ---------- hover explanations ---------- */
let tip=null, tipTimer=null;
function tipEl(){ if(!tip){ tip=document.createElement('div'); tip.id='art-tip'; tip.setAttribute('role','tooltip'); document.body.append(tip); } return tip; }
function partInfo(svg, el){
  const type=svg.getAttribute('data-art'); const d=REG[type]; const id=el.getAttribute('data-part');
  const p=(d&&d.parts&&d.parts[id])||{name:el.getAttribute('data-name')||id, info:el.getAttribute('data-info')||''};
  return p;
}
function showTip(svg, el, x, y){
  const p=partInfo(svg,el); if(!p||!p.name) return;
  const t=tipEl(); t.innerHTML=`<b>${esc(p.name)}</b>${esc(p.info||'')}`;
  const vw=window.innerWidth, vh=window.innerHeight;
  t.style.left=Math.min(vw-290, x+14)+'px'; t.style.top=Math.min(vh-120, y+14)+'px'; t.classList.add('show');
}
function hideTip(){ if(tip) tip.classList.remove('show'); }
A.hideTip=hideTip;
document.addEventListener('pointermove', e=>{
  const el=e.target.closest && e.target.closest('svg.art [data-part]');
  if(!el){ if(tip&&tip.classList.contains('show')&&e.pointerType==='mouse') hideTip(); return; }
  const svg=el.closest('svg.art'); if(svg.classList.contains('notip')) return;
  if(e.pointerType==='mouse') showTip(svg, el, e.clientX, e.clientY);
}, {passive:true});
document.addEventListener('pointerdown', e=>{
  const el=e.target.closest && e.target.closest('svg.art.explore [data-part]');
  if(!el){ hideTip(); return; }
  if(e.pointerType!=='mouse'){ showTip(el.closest('svg.art'), el, e.clientX, e.clientY); clearTimeout(tipTimer); tipTimer=setTimeout(hideTip, 3500); }
}, {passive:true});
document.addEventListener('scroll', hideTip, {passive:true, capture:true});

/* ---------- geometry helpers ---------- */
function partBox(svg, el){
  const b=el.getBBox(); const m=svg.getScreenCTM().inverse().multiply(el.getScreenCTM());
  const pts=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>{ const p=svg.createSVGPoint(); p.x=x; p.y=y; return p.matrixTransform(m); });
  const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
  return {x:Math.min(...xs), y:Math.min(...ys), w:Math.max(...xs)-Math.min(...xs), h:Math.max(...ys)-Math.min(...ys)};
}
A.partBox=partBox;
/* x-ray: dashed box + numbered badge on each named part; returns the ordered legend */
A.xray = (svg, on) => {
  svg.querySelectorAll('.xray').forEach(n=>n.remove());
  if(!on) return [];
  const vb=svg.viewBox.baseVal; const scale=Math.max(vb.width,vb.height)/100;
  const seen=new Set(), legend=[];
  let layer='';
  svg.querySelectorAll('[data-part]').forEach(el=>{
    const id=el.getAttribute('data-part'); if(seen.has(id)) return; seen.add(id);
    const p=partInfo(svg,el); if(!p||!p.name) return;
    const b=partBox(svg,el); const n=legend.length+1; legend.push({n,id,name:p.name,info:p.info});
    const r=Math.max(2.6, scale*2.1);
    const cx=Math.min(vb.x+vb.width-r, Math.max(vb.x+r, b.x+b.w)), cy=Math.min(vb.y+vb.height-r, Math.max(vb.y+r, b.y));
    layer+=`<rect class="xray-box" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${r*.3}"/>`+
      `<circle class="xray-dot" cx="${cx}" cy="${cy}" r="${r}"/><text class="xray-num" x="${cx}" y="${cy}" font-size="${r*1.25}">${n}</text>`;
  });
  const g=document.createElementNS('http://www.w3.org/2000/svg','g'); g.setAttribute('class','xray'); g.innerHTML=layer; svg.append(g);
  return legend;
};
/* zoom: animate the viewBox to a part (or back to the original) */
A.zoom = (svg, partId) => {
  const vb=svg.viewBox.baseVal;
  if(!svg._vb0) svg._vb0={x:vb.x,y:vb.y,w:vb.width,h:vb.height};
  const o=svg._vb0; let t=o;
  if(partId){ const el=svg.querySelector(`[data-part="${CSS.escape(partId)}"]`); if(el){
    const b=partBox(svg,el); const pad=Math.max(b.w,b.h)*.35+4; const ar=o.w/o.h;
    let w=b.w+2*pad, h=b.h+2*pad; if(w/h>ar) h=w/ar; else w=h*ar;
    w=Math.min(w,o.w); h=Math.min(h,o.h);
    t={x:Math.max(o.x,Math.min(o.x+o.w-w,b.x+b.w/2-w/2)), y:Math.max(o.y,Math.min(o.y+o.h-h,b.y+b.h/2-h/2)), w, h}; } }
  const f={x:vb.x,y:vb.y,w:vb.width,h:vb.height}; const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start=performance.now(), dur=reduce?0:380;
  const step=now=>{ const k=dur?Math.min(1,(now-start)/dur):1; const e=1-Math.pow(1-k,3);
    svg.setAttribute('viewBox',[f.x+(t.x-f.x)*e,f.y+(t.y-f.y)*e,f.w+(t.w-f.w)*e,f.h+(t.h-f.h)*e].join(' '));
    if(k<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
  return t!==o;
};

/* ---------- viewer: stage + toolbar (flip, x-ray, zoom, power) ---------- */
A.viewer = (type, o={}) => {
  const d=REG[type]; if(!d) return document.createTextNode('');
  const mk=(tag,attrs={},...kids)=>{ const e=document.createElement(tag); for(const [k,v] of Object.entries(attrs)){ if(v==null||v===false) continue; if(k==='class') e.className=v; else if(k.startsWith('on')) e.addEventListener(k.slice(2),v); else e.setAttribute(k,v===true?'':v); } kids.flat().forEach(k=>k!=null&&e.append(k.nodeType?k:document.createTextNode(k))); return e; };
  let view=o.view&&d.views[o.view]?o.view:d.defaultView, state=Object.assign({},d.state||{},o.state||{}), xr=false, zoomed=false;
  const root=mk('div',{class:'art-viewer'});
  const card=mk('div',{class:'av-card'}); const stage=mk('div',{class:'av-stage'},card);
  const bar=mk('div',{class:'av-bar',role:'toolbar','aria-label':d.name+' controls'});
  const legend=mk('ol',{class:'av-legend','aria-label':'Parts'});
  const note=mk('p',{class:'small muted',style:'margin:0'});
  const draw=()=>{ card.innerHTML=A.svg(type,{view,state,explore:true}); const svg=card.firstChild; legend.innerHTML='';
    if(xr){ A.xray(svg,true).forEach(it=>{ const li=mk('li',{},mk('b',{},it.name),it.info?' — '+it.info:''); legend.append(li); }); }
    zoomed=false; syncBar(); };
  const btns={};
  const views=Object.keys(d.views);
  if(views.length>1){
    views.forEach(v=>{ btns['v-'+v]=mk('button',{class:'btn small',type:'button','aria-pressed':String(v===view),onclick:()=>turn(v)},(d.viewNames&&d.viewNames[v])||v[0].toUpperCase()+v.slice(1)); bar.append(btns['v-'+v]); });
    btns.flip=mk('button',{class:'btn small',type:'button',onclick:()=>turn(views[(views.indexOf(view)+1)%views.length])},'Flip ⟲'); bar.append(btns.flip);
  }
  btns.xray=mk('button',{class:'btn small',type:'button','aria-pressed':'false',onclick:()=>{ xr=!xr; draw(); }},'X-ray labels'); bar.append(btns.xray);
  if(d.power!==false&&('on' in state)){ btns.power=mk('button',{class:'btn small',type:'button','aria-pressed':String(!!state.on),onclick:()=>{ state.on=!state.on; draw(); }},'Power'); bar.append(btns.power); }
  (d.actions||[]).forEach(a=>{ const b=mk('button',{class:'btn small',type:'button','aria-pressed':a.toggle?String(!!state[a.key]):null,onclick:()=>{ if(a.toggle) state[a.key]=!state[a.key]; else a.run(state); draw(); }},a.label); btns['a-'+a.label]=b; bar.append(b); });
  const zsel=mk('select',{'aria-label':'Zoom to a part',style:'width:auto;min-height:34px'});
  zsel.onchange=()=>{ const svg=card.firstChild; zoomed=A.zoom(svg,zsel.value||null); if(xr) setTimeout(()=>A.xray(svg,true),430); };
  bar.append(zsel);
  function syncBar(){
    views.forEach(v=>btns['v-'+v]&&btns['v-'+v].setAttribute('aria-pressed',String(v===view)));
    btns.xray.setAttribute('aria-pressed',String(xr)); if(btns.power) btns.power.setAttribute('aria-pressed',String(!!state.on));
    (d.actions||[]).forEach(a=>{ if(a.toggle) btns['a-'+a.label].setAttribute('aria-pressed',String(!!state[a.key])); });
    const svg=card.firstChild; const ids=[...new Set([...svg.querySelectorAll('[data-part]')].map(e=>e.getAttribute('data-part')))];
    zsel.innerHTML=''; zsel.append(mk('option',{value:''},'Zoom: whole device'));
    ids.forEach(id=>{ const p=(d.parts||{})[id]; if(p) zsel.append(mk('option',{value:id},'Zoom: '+p.name)); });
    note.textContent=(d.viewNotes&&d.viewNotes[view])||'';
  }
  function turn(v){ if(v===view) return; const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce){ view=v; return draw(); }
    card.classList.add('out'); setTimeout(()=>{ view=v; draw(); card.classList.remove('out'); },180); }
  const purl=A.photoUrl&&A.photoUrl(type);
  if(purl) bar.append(mk('a',{class:'btn small',href:purl,target:'_blank',rel:'noopener','aria-label':'See the actual image of '+d.name+' (opens an image search in a new tab)'},'See the actual image ↗'));
  root.append(stage,bar,note,legend); draw();
  root.api={draw,turn,get state(){return state;},set:(k,v)=>{ state[k]=v; draw(); }};
  return root;
};
})();
