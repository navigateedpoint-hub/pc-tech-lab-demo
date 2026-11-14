/* Station 1 drawings: workbench, case interior, CPU socket and JFP1 close-ups.
   The motherboard itself comes from shared/art/mobo.js. Drop-zone geometry is unchanged. */
window.Draw = (function(){
const A=window.Art, P=A.P;
const esc = s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const T=(x,y,t,o={})=>P.text(x,y,t,Object.assign({s:3.6,f:'#C9D1D6'},o));
const R=(x,y,w,h,f,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o.rx!=null?` rx="${o.rx}"`:''}${o.s?` stroke="${o.s}" stroke-width="${o.sw||.5}"`:''}${o.op!=null?` opacity="${o.op}"`:''}/>`;
const ZONES={
  CPU_PWR1:[28,1,22,12,'CPU_PWR1 8-pin CPU power header'], CPU_FAN1:[126,2,16,9,'CPU_FAN1 header'],
  SOCKET:[50,36,74,72,'CPU socket LGA1700'],
  DIMMA1:[145,16,9,138,'DIMMA1 memory slot'], DIMMA2:[156,16,9,138,'DIMMA2 memory slot'], DIMMB1:[167,16,9,138,'DIMMB1 memory slot'], DIMMB2:[178,16,9,138,'DIMMB2 memory slot'],
  ATX_PWR1:[224,38,18,60,'ATX_PWR1 24-pin power header'], JUSB3:[224,124,18,26,'JUSB3 front USB 3.0 header'],
  M2_1:[34,112,96,15,'M2_1 M.2 slot'], PCI_E1:[12,146,96,14,'PCI_E1 PCIe x16 slot'],
  SATA:[226,162,18,46,'SATA ports'], JAUD1:[4,226,24,15,'JAUD1 front audio header'], JFP1:[192,226,26,15,'JFP1 front panel header'],
  SYS_FAN1:[4,116,18,11,'SYS_FAN1 header'], SYS_FAN2:[146,227,18,13,'SYS_FAN2 header'],
};
const hitRect=(id,x,y,w,h,label,hl)=>`<rect class="hit${hl&&hl.includes(id)?' hl hl-pulse':''}" data-zone="${id}" x="${x}" y="${y}" width="${w}" height="${h}" tabindex="0" role="button" aria-label="${esc(label)}"/>`;
function hits(hl){ return Object.entries(ZONES).map(([id,z])=>hitRect(id,z[0],z[1],z[2],z[3],z[4],hl)).join(''); }
function board(st,Pb,opt={}){ return A.drawBoard(st,{leds:opt.leds,build:Pb})+(opt.hits===false?'':hits(opt.hl||[])); }

/* ---------- workbench: desk, anti-static mat, motherboard box ---------- */
function bench(st,Pb,opt){
  const hl=opt.hl||[];
  let s=`<svg viewBox="0 0 300 282" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Workbench with motherboard">`;
  s+=`<defs><linearGradient id="b-desk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9C7A52"/><stop offset="1" stop-color="#7A5A38"/></linearGradient></defs>`;
  s+=R(0,0,300,282,'url(#b-desk)')+Array.from({length:10},(_,i)=>`<path d="M0 ${14+i*28} C 80 ${8+i*28} 200 ${20+i*28} 300 ${12+i*28}" stroke="#000" stroke-opacity=".07" stroke-width="2" fill="none"/>`).join('');
  s+=R(8,6,284,270,'#2C5D86',{rx:4})+R(8,6,284,270,'url(#p-mesh-light)',{rx:4,op:.08})+`<circle cx="18" cy="16" r="3" fill="url(#m-screw)"/>`+T(26,17.5,'ESD MAT',{s:4,f:'#9FC3E2',w:700});
  s+=`<g filter="url(#f-shadow)">`+R(14,12,272,262,'#C9A06A',{rx:3})+`</g>`+R(18,16,264,254,'#D4AE7A',{rx:2})+R(18,16,264,6,'#fff',{op:.18,rx:2});
  s+=T(150,272,'MOTHERBOARD BOX',{a:'middle',s:5,f:'#6B4A26',w:700});
  if(st.mbInCase){ s+=T(150,140,'The motherboard is installed in the case.',{a:'middle',s:9,f:'#3D2A14',w:700})+T(150,156,'Open the Case view to keep working.',{a:'middle',s:7,f:'#3D2A14'}); return s+'</svg>'; }
  if(!st.onBox){
    s+=`<g filter="url(#f-shadow)"><path d="M58 58 H242 L238 222 H62Z" fill="#B7B0B5"/><path d="M58 58 H242 L238 222 H62Z" fill="url(#m-gloss)" opacity=".8"/></g>`+
      `<path d="M72 70 L120 210 M150 64 L200 216" stroke="#fff" stroke-opacity=".28" stroke-width="10"/>`+R(72,122,156,40,'#1B2127',{rx:3,op:.35})+
      T(150,138,'Motherboard in anti-static bag',{a:'middle',s:9,f:'#1B2127',w:700})+T(150,152,'tap to take it out',{a:'middle',s:7,f:'#1B2127'});
    s+=hitRect('BOX',60,60,180,160,'Motherboard box',hl);
    return s+'</svg>';
  }
  s+=`<g transform="translate(28 20)"><g filter="url(#f-shadow)">${R(0,0,244,244,'#000',{rx:2,op:.2})}</g>${board(st,Pb,opt)}</g></svg>`;
  return s;
}

/* ---------- case, side view: rear on the left, front on the right. Board at (36,24). ---------- */
const BX=36, BY=24;
function caseView(st,Pb,opt){
  const hl=opt.hl||[]; const vb={case:'0 0 420 480','case-board':'24 8 262 262','case-lower':'0 318 420 162'}[opt.view]||'0 0 420 480';
  let s=`<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Computer case, side view">`;
  /* chassis */
  s+=R(2,2,416,476,'url(#m-black)',{rx:7,s:'#07090A',sw:2});
  s+=R(30,10,356,346,'#262C31',{rx:2})+R(30,10,356,346,'url(#p-mesh)',{rx:2,op:.06});
  /* cable-routing grommets and CPU cut-out */
  s+=[[298,48],[298,138],[298,228]].map(([x,y])=>R(x,y,14,62,'#07090A',{rx:6})+R(x+2,y+3,10,56,'url(#m-rubber)',{rx:5})+`<path d="M${x+7} ${y+6} v50" stroke="#050607" stroke-width="1.4"/>`).join('');
  s+=R(40,12,80,10,'#07090A',{rx:4});
  s+=[[292,40],[292,130],[292,220],[292,310]].map(([x,y])=>`<rect x="${x}" y="${y}" width="4" height="4" rx="1" fill="#6F787F"/>`).join('');
  /* rear wall: I/O opening, slot covers */
  s+=R(6,28,24,300,'url(#m-gunmetal)',{rx:1})+T(18,24,'REAR',{a:'middle',s:6,f:'#9AA6AE',w:700});
  if(st.io){ s+=R(9,34,18,104,'url(#m-metal)',{rx:1,s:'#6F787F',sw:.4})+[40,52,64,76,88,100,112,124].map(y=>R(12,y,12,7,'#15191C',{rx:1})).join(''); }
  else s+=R(9,34,18,104,'#050607',{rx:1,s:'#6F787F',sw:.6});
  for(let i=0;i<4;i++){ const removed=st.slotCovers&&i<2; s+=R(8,166+i*20.3,20,15,removed?'#050607':'url(#m-metal-h)',{rx:1,s:'#555',sw:.5})+(removed?'':P.vents(10,169+i*20.3,16,9,{n:4,slot:1.2,col:'#6F787F'})); }
  /* rear exhaust fan (edge-on) */
  s+=R(30,30,24,100,'url(#m-black-h)',{rx:3})+R(33,34,18,92,'#07090A',{rx:2})+`<path d="M24 80 h-8 m3 -3 l-3 3 l3 3" stroke="#FF8A65" stroke-width="1.4" fill="none"/>`;
  /* standoffs, or the mounted board */
  if(!st.mbInCase){
    s+=A.BOARD_HOLES.map(([x,y])=>`<path d="M${BX+x-3.2} ${BY+y} l1.6 -2.8 h3.2 l1.6 2.8 l-1.6 2.8 h-3.2Z" fill="url(#m-gold)" stroke="#7D6424" stroke-width=".5"/><circle cx="${BX+x}" cy="${BY+y}" r="1.1" fill="#3A2C00"/>`).join('');
    if(st.strayStandoff) s+=`<path d="M${BX+120-3.2} ${BY+205} l1.6 -2.8 h3.2 l1.6 2.8 l-1.6 2.8 h-3.2Z" fill="url(#m-gold)" stroke="#FFB020" stroke-width="1.2"/>`+T(BX+127,BY+207,'?',{s:7,f:'#FFB020',w:700});
    s+=`<rect x="${BX}" y="${BY}" width="244" height="244" fill="none" stroke="#6F7A82" stroke-dasharray="4 3" stroke-width=".8"/>`+T(BX+122,BY+122,'Motherboard tray',{a:'middle',s:9,f:'#8C969E'});
  } else {
    s+=`<g transform="translate(${BX} ${BY})"><g filter="url(#f-shadow)">${R(0,0,244,244,'#000',{rx:2,op:.25})}</g>${board(st,Pb,Object.assign({},opt,{hits:true}))}</g>`;
  }
  if(!st.mbInCase) s+=hitRect('TRAY',BX,BY,244,244,'Motherboard tray and standoffs',hl);
  else s+=hitRect('TRAY',BX+2,BY+180,30,20,'Motherboard screws',hl);
  /* rear I/O HDMI port */
  if(st.mbInCase){ s+=P.hdmi(11,96,{w:14,h:6})+(st.display==='IOHDMI'?`<rect x="9" y="94" width="18" height="10" rx="1" fill="none" stroke="#F4C430" stroke-width=".8"/>`:'')+T(18,110,'HDMI',{a:'middle',s:4,f:'#DDE3E7'});
    s+=hitRect('IOHDMI',6,92,24,16,'Motherboard HDMI port on rear I/O',hl); }
  if(st.display==='IOHDMI') s+=P.cableRun('M10 100 C -10 100 -10 120 -20 130',{w:4});
  s+=hitRect('IOCUT',6,30,24,60,'I/O shield opening',hl)+hitRect('SLOTS',4,162,28,84,'Expansion slot covers',hl);
  if(st.gpu){ s+=R(6,168,22,36,'url(#m-metal)',{rx:1,s:st.display==='GPUOUT'?'#F4C430':'#6F787F',sw:.8})+P.hdmi(9,172,{w:12,h:5})+P.dp(9,181,{w:11,h:5})+P.dp(9,190,{w:11,h:5});
    if(st.display==='GPUOUT') s+=P.cableRun('M8 175 C -10 175 -10 196 -20 210',{w:4});
    s+=hitRect('GPUOUT',4,166,28,40,'Graphics card video ports',hl); }
  /* front: fan mounts and front-panel cable bundle */
  s+=R(386,38,28,264,'url(#m-gunmetal)',{rx:2})+R(390,44,20,252,'url(#p-mesh)',{op:.5})+T(400,34,'FRONT',{a:'middle',s:6,f:'#9AA6AE',w:700});
  if(Pb.gpu){ if(st.frontFan) s+=R(384,60,28,120,'url(#m-black-h)',{rx:3,s:st.frontFan==='in'?'#39D98A':'#FFB020',sw:1})+R(388,64,20,112,'#07090A',{rx:2})+
      (st.frontFan==='in'?`<path d="M420 120 h-12 m3 -3 l-3 3 l3 3" stroke="#6FB2FF" stroke-width="1.6" fill="none"/>`:`<path d="M404 120 h12 m-3 -3 l3 3 l-3 3" stroke="#FFB020" stroke-width="1.6" fill="none"/>`);
    s+=hitRect('FRONTFAN',384,56,30,128,'Front fan mount',hl); }
  s+=P.cableRun('M392 334 C 360 334 350 346 330 346',{w:2.4})+[0,1,2].map(i=>`<path d="M${392} ${330+i*2} C 362 ${330+i*2} 352 ${344+i*2} 330 ${344+i*2}" stroke="${['#E53935','#1E88E5','#43A047'][i]}" stroke-width=".8" fill="none"/>`).join('')+T(362,326,'front panel cables',{a:'middle',s:4.4,f:'#AEB8BF'});
  /* PSU shroud with vents */
  s+=R(30,358,386,116,'url(#m-black)',{rx:2})+R(30,358,386,3,'#4A535B')+P.vents(190,372,90,10,{n:18,slot:2.2});
  s+=R(8,372,160,98,'#0E1215',{rx:3,s:'#3A424A',sw:.6});
  if(st.psu){ s+=`<g filter="url(#f-shadow)">`+R(12,378,152,86,'url(#m-black)',{rx:3})+`</g>`+P.label(40,400,96,24,'',{bg:'#ECEFF1'})+T(88,410,Pb.psu==='psu-650'?'650 W · 80 PLUS GOLD':'550 W · 80 PLUS BRONZE',{a:'middle',s:5.6,f:'#1B2A33',w:700})+T(88,418,'ATX 3.1 · 100-240 V~',{a:'middle',s:4,f:'#56656E'});
    s+=R(20,458,136,5,st.psuFanDown?'#39D98A':'#FFB020',{rx:1.5})+T(88,453,st.psuFanDown?'fan faces down over the filter':'fan faces up into the shroud',{a:'middle',s:4.6,f:'#AEB8BF'});
    s+=R(14,390,14,20,'#07090A',{rx:2})+R(16,st.psuOn?392:400,10,8,'#2D3338',{rx:1.4})+T(21,418,st.psuOn?'I':'O',{a:'middle',s:6,f:st.psuOn?'#39D98A':'#FF6B5A',w:700});
    if(st.cord) s+=P.cableRun('M14 436 C -10 436 -10 470 -30 470',{w:5}); }
  s+=hitRect('PSU',8,372,160,98,'PSU bay',hl);
  if(Pb.gpu){ s+=R(292,372,112,94,'url(#m-gunmetal)',{rx:2,s:'#20262B',sw:.6})+R(296,376,104,86,'#15191C',{rx:1.5})+T(348,368,'3.5" DRIVE CAGE',{a:'middle',s:5,f:'#AEB8BF',w:700});
    if(st.hdd){ const ok=st.sataData.BAY35&&st.sataPwr.BAY35; s+=R(300,382,96,28,'url(#m-alu)',{rx:2,s:ok?'#39D98A':'#FFB020',sw:.9})+[306,390].map(x=>P.screw(x,396,1.8)).join('')+T(348,399,'2 TB HDD',{a:'middle',s:6,f:'#1B2A33',w:700}); }
    s+=hitRect('BAY35',292,372,112,94,'3.5-inch drive cage',hl);
    s+=R(200,344,70,12,'url(#m-gunmetal)',{rx:1,s:'#20262B',sw:.6});
    if(st.ssd25){ const ok=st.sataData.BAY25&&st.sataPwr.BAY25; s+=R(203,338,64,12,'url(#m-black)',{rx:1.5,s:ok?'#39D98A':'#FFB020',sw:.8})+T(235,346.4,'SATA SSD',{a:'middle',s:5,f:'#DDE3E7',w:700}); }
    s+=hitRect('BAY25',196,334,78,24,'2.5-inch SSD mount',hl); }
  /* tempered-glass side panel */
  if(st.panelOn){ s+=`<rect x="2" y="2" width="416" height="476" rx="7" fill="#0E1A22" fill-opacity=".5" stroke="#9FB3C2" stroke-width="3"/>`+
      `<path d="M50 4 L190 476" stroke="#fff" stroke-opacity=".07" stroke-width="40"/><path d="M130 4 L250 476" stroke="#fff" stroke-opacity=".06" stroke-width="10"/>`+
      [[14,16],[406,16],[14,464],[406,464]].map(([x,y])=>P.screw(x,y,3.2)).join('')+(opt.hint===false?'':R(120,222,180,28,'#0E1418',{rx:14,op:.85})+T(210,241,'Glass side panel: tap to remove',{a:'middle',s:10,f:'#fff',w:700}));
    s+=hitRect('PANEL',2,2,416,476,'Side panel',hl); }
  else if(hl.includes('PANEL')) s+=hitRect('PANEL',330,10,50,30,'Put the side panel back',hl)+T(355,30,'PANEL',{a:'middle',s:6,f:'#F4C430'});
  return s+'</svg>';
}

/* ---------- close-up: LGA1700 socket ---------- */
function socketClose(st){
  let s=`<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CPU socket close-up">`+R(0,0,240,200,'url(#m-pcb-dark)');
  s+=Array.from({length:6},(_,i)=>`<circle cx="${22}" cy="${30+i*28}" r="5" fill="url(#m-black)"/><circle cx="22" cy="${30+i*28}" r="3" fill="url(#m-screw)"/>`).join('');
  s+=`<g filter="url(#f-shadow)">`+R(48,28,124,144,'url(#m-metal)',{rx:5,s:'#5C646B'})+`</g>`+R(60,40,100,120,'#23292E',{rx:2});
  if(!st.cpu&&!st.cover){ let d=''; for(let r=0;r<28;r++) for(let c=0;c<24;c++){ const x=64+c*3.9, y=44+r*4.1; if(x>94&&x<126&&y>80&&y<122) continue; d+=`<rect x="${x}" y="${y}" width="1.3" height="1.3" fill="#C9A441"/>`; } s+=d; }
  if(st.cover&&!st.cpu) s+=R(66,48,88,104,'url(#m-black)',{rx:3})+R(70,52,80,12,'#fff',{op:.07,rx:2})+T(110,98,'PROTECTIVE CAP',{a:'middle',s:6,f:'#8C969E',w:700})+T(110,106,'pops off when the lever closes',{a:'middle',s:4.4,f:'#8C969E'});
  s+=`<path d="M36 20 l12 0 l-12 12z" fill="#fff"/>`+T(29,43,'pin 1',{s:5,f:'#DDE3E7'});
  if(st.cpu){ const r=st.cpuRot||0; s+=`<g transform="rotate(${r} 110 100)"><g filter="url(#f-shadow)" transform="translate(110 100) rotate(90) scale(2.1) translate(-22.5 -18.75)">`+A.inner(st.cpu,'top',{})+`</g></g>`; }
  if(st.plate==='up') s+=R(48,2,124,24,'url(#m-metal-h)',{rx:2,s:'#6F787F'})+R(64,6,92,14,'#23292E',{rx:1.5,op:.6})+T(110,17,'load plate (open)',{a:'middle',s:6,f:'#DDE3E7'});
  else s+=`<path d="M52 32 H168 V168 H52Z M64 44 V156 H156 V44Z" fill="url(#m-metal-h)" fill-rule="evenodd" stroke="#6F787F" stroke-width=".8"/>`+P.screw(110,37,3)+P.screw(110,163,3);
  s+= st.lever==='up' ? `<path d="M184 168 V42 L200 22" stroke="url(#m-metal)" stroke-width="6" fill="none" stroke-linecap="round"/>`+T(206,110,'lever up',{s:6,f:'#DDE3E7'})
                      : `<path d="M180 170 V38" stroke="url(#m-metal)" stroke-width="6" stroke-linecap="round"/><path d="M172 38 H190" stroke="#5C646B" stroke-width="3"/>`+T(188,110,'locked',{s:6,f:'#DDE3E7'});
  return s+'</svg>';
}
/* ---------- close-up: JFP1 ---------- */
const JFP={pos:{1:[40,70],3:[70,70],5:[100,70],7:[130,70],9:[160,70],2:[40,40],4:[70,40],6:[100,40],8:[130,40],10:[160,40]},
  label:{1:'HDD LED +',3:'HDD LED −',5:'Reset SW',7:'Reset SW',9:'Reserved',2:'Power LED +',4:'Power LED −',6:'Power SW',8:'Power SW',10:'No pin'}};
function jfpClose(st,sel){
  let s=`<svg viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="JFP1 front panel header pin map">`+R(0,0,200,110,'url(#m-pcb-dark)');
  s+=R(26,26,148,58,'#15191C',{rx:2,s:'#3A424A'});
  s+=T(6,13,'JFP1',{s:7,f:'#DDE3E7',w:700})+`<rect x="30" y="61" width="20" height="18" fill="none" stroke="#DDE3E7" stroke-width=".8"/>`;
  const colors={PWR:'#E53935',RST:'#1E88E5',PLED:'#43A047',HDD:'#FDD835'};
  Object.entries(JFP.pos).forEach(([p,[x,y]])=>{ p=+p;
    if(p===10) s+=`<rect x="${x-3.5}" y="${y-3.5}" width="7" height="7" fill="none" stroke="#5E676E" stroke-dasharray="1.6 1.2"/>`;
    else s+=R(x-3.5,y-3.5,7,7,'url(#m-gold)',{rx:.6})+R(x-2,y-2,4,1.4,'#fff',{op:.35});
    s+=T(x,p%2?y+22:y-19,String(p),{a:'middle',s:6,f:'#fff',w:700}); });
  Object.entries(st.jfp).forEach(([k,v])=>{ if(!v) return; const [x1,y1]=JFP.pos[v.a],[x2,y2]=JFP.pos[v.b];
    const x=Math.min(x1,x2)-10, w=Math.abs(x2-x1)+20;
    s+=`<g filter="url(#f-shadow)">`+R(x,y1-10,w,20,'url(#m-black)',{rx:2.4,s:colors[k],sw:1.2})+`</g>`+
      T((x1+x2)/2,y1+2,{PWR:'POWER SW',RST:'RESET SW',PLED:'POWER LED',HDD:'HDD LED'}[k],{a:'middle',s:4.4,f:'#fff',w:700});
    const up=y1<55; [x1,x2].forEach((wx,i)=>s+=`<path d="M${wx} ${up?y1-10:y1+10} v${up?-5:5}" stroke="${i===0&&(k==='PLED'||k==='HDD')?(v.plus===v.a?colors[k]:'#EEF1F3'):(i===1&&(k==='PLED'||k==='HDD')?(v.plus===v.b?colors[k]:'#EEF1F3'):colors[k])}" stroke-width="2"/>`);
    if(k==='PLED'||k==='HDD'){ const px=JFP.pos[v.plus]; s+=T(px[0]+7,px[1]+(up?-12:17),'+',{a:'middle',s:7,f:colors[k],w:700}); } });
  Object.entries(JFP.pos).forEach(([p,[x,y]])=>{ p=+p; if(p!==10&&p!==9) s+=`<rect class="hit pinhit" data-pin="${p}" x="${x-12}" y="${y-12}" width="24" height="24" tabindex="0" role="button" aria-label="Pin ${p}: ${JFP.label[p]}"/>`; });
  s+=T(100,104,'Pin 1 has the square outline. Odd pins bottom row, even pins top row.',{a:'middle',s:5,f:'#AEB8BF'});
  return s+'</svg>';
}
return {bench, caseView, socketClose, jfpClose, JFP, ZONES};
})();
