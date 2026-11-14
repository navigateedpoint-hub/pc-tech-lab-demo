/* Station 1 demo scenes. Board, bench and case come from the lab's drawing module (s1/board.js). */
window.S1Scenes=(function(){
const A=window.Art, P=A.P, G=window.Draw;
const esc=Demo.esc;
const T=(x,y,t,o={})=>P.text(x,y,t,Object.assign({s:6,f:'#DDE3E7'},o));
const R=(x,y,w,h,f,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o.rx!=null?` rx="${o.rx}"`:''}${o.s?` stroke="${o.s}" stroke-width="${o.sw||.6}"`:''}${o.op!=null?` opacity="${o.op}"`:''}/>`;
const PB={A:{psu:'psu-550',cooler:'cl-intel',gpu:false},B:{psu:'psu-650',cooler:'cl-tower',gpu:true}};
const main=svg=>svg.replace('<svg ','<svg data-main ');
const addTo=(svg,extra)=>svg.replace(/<\/svg>\s*$/,extra+'</svg>');

/* ---------- workbench with extras (wrist strap) ---------- */
function bench(s){
  let g=G.bench(s,PB[s.build],{hl:[],leds:{}});
  let x=`<circle cx="18" cy="16" r="4.2" fill="none" stroke="#F4C430" stroke-width=".8" opacity="${s.esd?0:.9}"/>`;
  if(s.esd) x+=`<path d="M18 16 C 12 12 14 6 8 4 S 2 -2 -4 -6" fill="none" stroke="#1B1F22" stroke-width="1.6"/><path d="M14 13 l8 6" stroke="url(#m-metal)" stroke-width="3" stroke-linecap="round"/>`;
  return main(addTo(g,x));
}
function caseV(s,b){ return main(G.caseView(s,PB[s.build],{view:b.view||'case',hl:[],hint:false,leds:s._leds||{}})); }

/* ---------- LGA1700 socket close-up (plate carries the cap) ---------- */
function socket(s){
  let g=`<svg data-main viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CPU socket close-up">`+R(0,0,300,200,'url(#m-pcb-dark)');
  g+=Array.from({length:6},(_,i)=>`<circle cx="22" cy="${30+i*28}" r="5" fill="url(#m-black)"/><circle cx="22" cy="${30+i*28}" r="3" fill="url(#m-screw)"/>`).join('');
  g+=`<g filter="url(#f-shadow)">`+R(48,28,124,144,'url(#m-metal)',{rx:5,s:'#5C646B'})+`</g>`+R(60,40,100,120,'#23292E',{rx:2});
  if(!s.cpu){ let d=''; for(let r=0;r<28;r++) for(let c=0;c<24;c++){ const x=64+c*3.9, y=44+r*4.1; if(x>94&&x<126&&y>80&&y<122) continue; d+=`<rect x="${x}" y="${y}" width="1.3" height="1.3" fill="#C9A441"/>`; } g+=d;
    g+=`<rect x="58" y="70" width="4" height="10" fill="#8C969E"/><rect x="158" y="70" width="4" height="10" fill="#8C969E"/><rect x="58" y="118" width="4" height="10" fill="#8C969E"/><rect x="158" y="118" width="4" height="10" fill="#8C969E"/>`; }
  g+=`<path d="M40 20 l12 0 l-12 12z" fill="#fff"/>`+T(29,43,'pin 1',{s:5});
  if(s.cpu){ g+=`<g filter="url(#f-shadow)" transform="translate(110 100) rotate(90) scale(2.1) translate(-22.5 -18.75)">`+A.inner(s.cpu,'top',{})+`</g>`; }
  if(s.plate==='up'){
    g+=R(48,2,124,24,'url(#m-metal-h)',{rx:2,s:'#6F787F'})+R(64,6,92,14,'#23292E',{rx:1.5,op:.6});
    if(s.cover) g+=R(70,5,80,16,'url(#m-black)',{rx:2})+T(110,15.4,'CAP (stays on the plate)',{a:'middle',s:5,f:'#AEB8BF',w:700});
    else g+=T(110,16,'load plate (open)',{a:'middle',s:6});
    if(s.cover) g+=`<path d="M172 12 H214" stroke="#DDE3E7" stroke-width=".6" stroke-dasharray="1.5 1"/>`+T(216,14,'load plate (open)',{s:6});
  } else {
    g+=`<path d="M52 32 H168 V168 H52Z M64 44 V156 H156 V44Z" fill="url(#m-metal-h)" fill-rule="evenodd" stroke="#6F787F" stroke-width=".8"/>`+P.screw(110,37,3)+P.screw(110,163,3);
    if(s.cover) g+=R(66,48,88,104,'url(#m-black)',{rx:3})+R(70,52,80,12,'#fff',{op:.07,rx:2})+T(110,96,'PROTECTIVE CAP',{a:'middle',s:6,f:'#8C969E',w:700})+T(110,105,'clipped to the load plate',{a:'middle',s:4.4,f:'#8C969E'});
  }
  if(s.lever==='up') g+=`<path d="M184 168 V42 L204 18" stroke="url(#m-metal)" stroke-width="6" fill="none" stroke-linecap="round"/>`+T(218,100,'lever up',{s:6});
  else if(s.lever==='free') g+=`<path d="M188 170 V40" stroke="url(#m-metal)" stroke-width="6" stroke-linecap="round"/><path d="M172 38 H190" stroke="#5C646B" stroke-width="3"/>`+T(218,100,'unhooked',{s:6});
  else g+=`<path d="M180 170 V38" stroke="url(#m-metal)" stroke-width="6" stroke-linecap="round"/><path d="M172 38 H190" stroke="#5C646B" stroke-width="3"/>`+T(218,100,'locked',{s:6});
  if(!s.cover&&!s.coverStored&&s.socketClosed){ g+=`<g filter="url(#f-shadow)">`+R(214,128,70,50,'url(#m-black)',{rx:3})+`</g>`+T(249,150,'cap popped off',{a:'middle',s:5,f:'#AEB8BF',w:700})+T(249,160,'keep it',{a:'middle',s:5,f:'#FFE08A'}); }
  return g+'</svg>';
}
/* ---------- CPU heat spreader and cooler base (Build B paste) ---------- */
function paste(s){
  let g=`<svg data-main viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CPU and cooler base">`;
  g+=`<g transform="translate(20 30) scale(2.4)">${A.inner('cpu-i5-12400','top',{})}</g>`;
  if(s.paste==='ok') g+=`<ellipse cx="74" cy="75" rx="7" ry="6.4" fill="#BFC5C9" stroke="#8C959B" stroke-width=".8"/><ellipse cx="72" cy="73" rx="3" ry="2" fill="#fff" opacity=".6"/>`+T(74,143,'pea-sized dot in the centre',{a:'middle',s:6,f:'#B7791F',w:700});
  g+=`<g transform="translate(176 20) scale(1.9)">${A.inner('cooler-tower','base',{film:!s.filmOff})}</g>`;
  g+=T(74,160,'CPU (in the socket)',{a:'middle',s:6.5,f:'#7C8A94',w:700})+T(230,160,'Cooler base (underside)',{a:'middle',s:6.5,f:'#7C8A94',w:700});
  return g+'</svg>';
}
function jfp(s){ return main(G.jfpClose(s,null)); }

/* ---------- a single part, big ---------- */
function part(s,b){ return main(A.svg(b.art,{view:b.view,cls:'part-view',state:Object.assign({on:false},b.state||{}),label:A.def(b.art).name})); }
/* ---------- choose between two parts ---------- */
function pick(s,b,o){
  const chosen=o.done&&o.beat===b; const cols=b.options.length;
  return `<div class="sc-grid" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">`+b.options.map(op=>{
    const cls=chosen?(op.good?' good':' bad'):'';
    return `<div class="sc-card${cls}" data-t="${esc(op.id)}">${A.svg(op.art,{view:op.view,state:{on:false},label:op.name})}<div class="nm">${esc(op.name)}</div><div class="sb">${esc(op.sub)}</div>`+
      (chosen?`<div class="verdict">${op.good?'✓ ':'✗ '}${esc(op.verdict)}</div>`:'')+`</div>`; }).join('')+`</div>`;
}
/* ---------- the parts on the table ---------- */
/* ---------- motherboard manual page ---------- */
function manual(s,b,o){
  const on=s.slotsKnown;
  return `<div class="sc-doc"><div class="small">Motherboard manual · page 23</div><h3>Memory: recommended installation</h3>
  <table><tr><th>Modules</th><th>Install in</th></tr>
  <tr><td>1</td><td>DIMMA2</td></tr>
  <tr data-t="row2" class="${on?'on':''}"><td>2</td><td>DIMMA2 and DIMMB2 (dual-channel)</td></tr>
  <tr><td>4</td><td>DIMMA1, DIMMA2, DIMMB1, DIMMB2</td></tr></table>
  <p class="small" style="margin-top:.7rem">DIMMA2 is the second slot from the CPU. DIMMB2 is the fourth.</p></div>`;
}
/* ---------- monitor, tower and keyboard on the desk ---------- */
function desk(s,b){
  const on=!!s.poweredOn;
  let mon=A.svg('monitor',{view:'front',state:{on,screen:'#05080A'}});
  let scr='';
  if(on&&!s.inUefi) scr=`<text x="160" y="80" text-anchor="middle" font-size="16" fill="#E7EEF0" font-weight="700">B760M</text>`+
    `<text x="160" y="100" text-anchor="middle" font-size="7.5" fill="#AEB8BF">Press DEL to enter Setup · F11 for Boot Menu</text>`+(s.noBoot?`<text x="160" y="150" text-anchor="middle" font-size="7" fill="#FFB020">Reboot and select proper boot device</text>`:'');
  if(on&&s.inUefi) scr=`<rect x="24" y="36" width="272" height="120" rx="4" fill="#0E151B" stroke="#2A3A46"/>`+`<text x="34" y="52" font-size="8" fill="#E7EEF0" font-weight="700">UEFI Setup · EZ Mode</text>`+
    [0,1,2].map(i=>`<rect x="${34+i*86}" y="62" width="80" height="36" rx="3" fill="#1B2730"/><rect x="${34+i*86}" y="106" width="80" height="36" rx="3" fill="#1B2730"/>`).join('');
  mon=addTo(mon,scr);
  const tower=A.svg('pc',{view:'front',state:{on,disk:on}});
  const keys=[['Esc','esc'],['F2','f2'],['F11','f11'],['Del','key-del']].map(([k,id])=>`<span data-t="${id}" style="display:inline-grid;place-items:center;min-width:54px;height:40px;border-radius:6px;background:linear-gradient(#F4F6F7,#D5DBDF);border:1px solid #9AA3AA;box-shadow:0 3px 0 #8A949B;font-weight:700;color:#1b2328">${k}</span>`).join('');
  return `<div style="display:grid;grid-template-columns:3fr 1.1fr;gap:18px;align-items:end;width:100%;height:100%">
    <div style="display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:end;height:100%"><div style="width:100%">${mon.replace('<svg ','<svg style="width:100%;height:auto;max-height:52vh" ')}</div>
    <div style="display:flex;gap:10px;padding:10px 14px;border-radius:10px;background:#2A3036">${keys}</div></div>
    <div style="height:100%;display:flex;align-items:end">${tower.replace('<svg ','<svg style="width:100%;height:auto;max-height:62vh" ')}</div></div>`;
}
/* ---------- UEFI EZ mode ---------- */
function uefi(s,b){
  const seen=s.seen||{};
  const tile=(id,title,val,sub)=>`<div data-t="${id}" style="background:${seen[id]?'#163A2A':'#1B2530'};border:1px solid ${seen[id]?'#3BAA5C':'#2E3B47'};border-radius:10px;padding:16px 16px;min-height:120px">
    <div style="font-size:.78rem;color:#8FA3B3;text-transform:uppercase;letter-spacing:.06em">${title}${seen[id]?' ✓':''}</div><div style="font-weight:700;font-size:1.05rem">${val}</div><div style="font-size:.82rem;color:#AEBBC6">${sub}</div></div>`;
  const dual=true;
  const mem=s.build==='B'?'16384 MB DDR4-3200':'16384 MB DDR4-3200';
  const stor=['M2_1: 1 TB NVMe SSD'].concat(s.build==='B'?['SATA1: 2 TB HDD','SATA2: 500 GB SATA SSD']:[]);
  return `<div style="width:100%;max-width:1100px;background:#0E151C;color:#E7EEF0;border:12px solid #111;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.35);font-family:Arial,sans-serif;font-size:1.12rem">
   <div style="display:flex;justify-content:space-between;padding:8px 14px;background:#101B24;border-bottom:1px solid #22303B"><b>UEFI Setup · EZ Mode</b><span style="color:#8FA3B3">F7: Advanced Mode · F10: Save &amp; Exit</span></div>
   <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;padding:20px">
    ${tile('cpu','Processor','Intel Core i5-12400','2.50 GHz · 6 cores / 12 threads')}
    ${tile('mem','Memory',mem,dual?'Dual channel · DIMMA2 + DIMMB2':'Single channel')}
    ${tile('stor','Storage',stor.join('<br>'),'All drives detected')}
    ${tile('temp','CPU temperature','36 °C','Idle: 30–45 °C is normal')}
    ${tile('fan','Fans','CPU_FAN1: 1,450 RPM','SYS_FAN1: 1,050 RPM')}
    ${tile('boot','Boot priority','No bootable device','Next: install an operating system')}
   </div></div>`;
}
const FIT=(w,h)=>`<div data-fit="${w}" style="width:100%;max-width:${w}px;display:flex;justify-content:center">${h}</div>`;
function render(s,b,o){
  switch(b.scene){
    case 'bench': return bench(s,b);
    case 'case': return caseV(s,b);
    case 'socket': return socket(s,b);
    case 'paste': return paste(s,b);
    case 'jfp': return jfp(s,b);
    case 'part': return part(s,b);
    case 'pick': return pick(s,b,o);
    case 'intro': return Common.intro(s,b);
    case 'manual': return manual(s,b,o);
    case 'desk': return FIT(1000,desk(s,b));
    case 'uefi': return FIT(1000,uefi(s,b));
  }
  return '<p>Missing scene '+esc(b.scene)+'</p>';
}
return {render, PB};
})();
