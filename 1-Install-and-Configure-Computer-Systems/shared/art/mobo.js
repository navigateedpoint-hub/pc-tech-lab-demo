/* Motherboard drawing (Micro-ATX B760, 244 × 244 mm, MSI-style header names).
   Shared by Station 1, the hub and the gallery. The board state object is the Station 1 state. */
(function(){
const A=window.Art, P=A.P, part=P.part;
const T=(x,y,t,o={})=>P.text(x,y,t,Object.assign({s:3,f:'#DDE3E7'},o));
const R=(x,y,w,h,f,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o.rx!=null?` rx="${o.rx}"`:''}${o.s?` stroke="${o.s}" stroke-width="${o.sw||.4}"`:''}${o.op!=null?` opacity="${o.op}"`:''}/>`;
const HOLES=[[8,10],[160,10],[236,44],[8,165],[160,165],[236,165],[8,236],[236,236]];
A.BOARD_HOLES=HOLES;
/* header block of square gold pins in a black base */
function header(x,y,cols,rows,pitch,o={}){
  const w=cols*pitch+1.2, h=rows*pitch+1.2;
  let s=R(x,y,w,h,o.base||'#15191C',{rx:.5,s:o.shroud?'#3A424A':null,sw:.5});
  let k=0; for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){ k++; if((o.skip||[]).includes(k)) continue; s+=R(x+.6+c*pitch+pitch*.3,y+.6+r*pitch+pitch*.3,pitch*.4,pitch*.4,'url(#m-gold)'); }
  return s;
}
function fanHeader(x,y){ return R(x,y,11,5,'url(#m-white)',{rx:.5,s:'#AEB6BC',sw:.3})+R(x,y-0.6,11,1.2,'#DDE3E7')+[0,1,2,3].map(i=>R(x+1.2+i*2.6,y+1.6,1.4,1.4,'url(#m-gold)')).join(''); }
function fanPlug(x,y,col){ return R(x-.5,y-.5,12,6,'#EEF1F3',{rx:.6,s:'#9AA3AA'})+[0,1,2,3].map(i=>`<path d="M${x+1.9+i*2.6} ${y-.5} v-6" stroke="${['#15191C','#F4C21A','#2E9E4F','#2E6FD8'][i]}" stroke-width=".9"/>`).join(''); }
function heatsink(x,y,w,h,dir){
  let s=R(x,y,w,h,'url(#m-gunmetal)',{rx:1.4,s:'#2A3036',sw:.5})+R(x+.8,y+.6,w-1.6,Math.min(3,h*.2),'#fff',{rx:1,op:.12});
  const n=dir==='v'?Math.floor(w/3.2):Math.floor(h/3.2);
  for(let i=1;i<n;i++) s+= dir==='v'? R(x+i*w/n-.35,y+1.4,.7,h-2.8,'#20262B') : R(x+1.4,y+i*h/n-.35,w-2.8,.7,'#20262B');
  return s+P.screw(x+(dir==='v'?w-3:w/2),y+(dir==='v'?h/2:h-3),1.3);
}
function cap(x,y,r=1.6){ return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#m-black)" stroke="#0B0D0F" stroke-width=".25"/><circle cx="${x}" cy="${y}" r="${r*.62}" fill="url(#m-screw)"/><path d="M${x-r*.45} ${y}h${r*.9}M${x} ${y-r*.45}v${r*.9}" stroke="#7A838A" stroke-width=".2"/>`; }
function choke(x,y){ return R(x,y,4.4,4.4,'url(#m-grey)',{rx:.5,s:'#2A3036',sw:.3})+R(x+.8,y+.8,2.8,1,'#fff',{op:.15}); }

/* the board itself: st = Station 1 state (or a demo state), opt.leds, opt.gpuLabel */
function drawBoard(st, opt={}){
  const Pb=opt.build||{}; let s='';
  const cab=st.cables||{};
  /* PCB with ground plane texture */
  s+=part('pcb',R(0,0,244,244,'url(#m-pcb-dark)',{rx:2,s:'#07090A',sw:.8})+
    Array.from({length:12},(_,i)=>`<path d="M${14+i*19} 244 L${24+i*19} 206 L${24+i*19} 176" stroke="#262D33" stroke-width=".9" fill="none"/>`).join('')+
    `<path d="M4 140 H40 L52 128" stroke="#262D33" stroke-width=".9" fill="none"/><path d="M130 110 H140 L146 104" stroke="#262D33" stroke-width=".9" fill="none"/>`);
  s+=HOLES.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.3" fill="url(#m-gold)"/><circle cx="${x}" cy="${y}" r="1.7" fill="#0B0D0F"/>`).join('');
  /* rear I/O stack and its shroud */
  s+=part('rear-io',[[-3,12,9],[-3,26,9],[-3,40,13],[-3,58,9],[-3,72,14],[-3,90,18]].map(([x,y,h])=>R(x,y,6,h,'url(#m-metal-h)',{rx:.5,s:'#6F787F',sw:.3})).join('')+
    R(1,8,25,104,'url(#m-gunmetal)',{rx:1.8,s:'#20262B',sw:.5})+Array.from({length:7},(_,i)=>`<path d="M3 ${16+i*13} L24 ${10+i*13}" stroke="#737D85" stroke-width=".7"/>`).join('')+T(13.5,106,'I/O',{a:'middle',s:3,f:'#AEB8BF',w:700}));
  /* VRM: chokes, caps, heatsinks */
  s+=part('vrm',Array.from({length:9},(_,i)=>choke(46+i*7.8,31.2)).join('')+Array.from({length:9},(_,i)=>choke(45.2-4.6,36+i*7.6)).join('')+
    heatsink(28,24,16,84,'h')+heatsink(46,14,72,15,'v')+[0,1,2,3,4,5].map(i=>cap(124,46+i*6.4,1.5)).join(''));
  /* CPU_PWR1 */
  s+=part('CPU_PWR1',header(29.5,2.5,4,2,4.3,{shroud:true})+T(39,15.8,'CPU_PWR1',{a:'middle',s:2.6}));
  if(cab.CPU_PWR1) s+=R(28.8,1.8,19.4,10,'url(#m-black)',{rx:1})+[0,1,2,3].map(i=>`<path d="M${31.5+i*4.3} 1.8 C ${31.5+i*4.3} -6 ${40+i*6} -9 ${52+i*6} -12" stroke="#F4C21A" stroke-width="1.5" fill="none"/>`).join('')+T(38.5,8,'CPU',{a:'middle',s:3,f:'#FFD54A',w:700});
  /* CPU_FAN1 */
  s+=part('CPU_FAN1',fanHeader(128.5,4)+T(134,13.6,'CPU_FAN1',{a:'middle',s:2.6}));
  if(cab.CPU_FAN1===true) s+=fanPlug(128.5,4)+`<path d="M134 3.5 C 128 -2 112 10 104 26" stroke="#15191C" stroke-width="1.8" fill="none"/>`;
  /* socket */
  s+=part('SOCKET',socket(st));
  /* cooler */
  if(st.cooler) s+=part('cooler',cooler(st,Pb));
  /* DIMM slots */
  ['DIMMA1','DIMMA2','DIMMB1','DIMMB2'].forEach((id,i)=>{ const x=147+i*11, d=(st.dimm||{})[id]||{};
    let g=R(x-.6,18,6.2,134,i%2?'#2E353B':'#1A1F23',{rx:.8,s:'#0B0D0F',sw:.4})+R(x+1.3,21,2.4,128,'#07090A',{rx:.6});
    const latch=o=>R(x-1.2,o?152.5:146.5,7.4,6,'url(#m-grey)',{rx:1})+R(x-1.2,o?15:16,7.4,4,'url(#m-grey)',{rx:1});
    g+=latch(!!d.open);
    if(d.stick){ const lift=d.seated?0:-4; const d5=String(d.stick).includes('ddr5');
      g+=`<g transform="translate(0 ${lift})">`+R(x-1.4,19,8,130,d5?'url(#m-gunmetal)':'url(#m-black-h)',{rx:1,s:d.seated?'#0B0D0F':'#FFB020',sw:d.seated?.3:1})+
        R(x+.2,24,4.8,120,'#fff',{op:.06})+R(x+.4,62,4.4,30,'#EDEDE6',{rx:.4})+T(x+2.6,70,d5?'D5':'D4',{a:'middle',s:2.6,f:'#2E2E28',w:700})+T(x+2.6,76,d5?'16':'8',{a:'middle',s:2.6,f:'#2E2E28',w:700})+T(x+2.6,80,'GB',{a:'middle',s:2,f:'#2E2E28'})+`</g>`; }
    g+=T(x+2.5,162.6,id.replace('DIMM',''),{a:'middle',s:2.6});
    s+=part(id,g); });
  /* ATX 24-pin */
  s+=part('ATX_PWR1',header(226.4,39.4,2,12,4.5,{shroud:true})+T(233,102.6,'ATX_PWR1',{a:'middle',s:2.6}));
  if(cab.ATX_PWR1) s+=R(225,39,16,58,'url(#m-black)',{rx:1})+R(223.4,62,3,10,'#15191C',{rx:.6})+Array.from({length:12},(_,i)=>`<path d="M241 ${42+i*4.5} C 248 ${42+i*4.5} 250 ${60+i*1.5} 256 ${60+i*1.5}" stroke="${['#F08A24','#F08A24','#15191C','#D8332A','#15191C','#D8332A','#15191C','#8A949B','#8E5AC8','#F4C21A','#F4C21A','#F08A24'][i]}" stroke-width="1.3" fill="none"/>`).join('');
  /* EZ debug LEDs */
  const L=opt.leds||{};
  s+=part('debug-leds',['CPU','DRAM','VGA','BOOT'].map((k,i)=>R(212.6,104.4+i*5.5,3,2.2,'#15191C',{rx:.4})+P.led(214.1,105.5+i*5.5,{r:1.25,lit:!!L[k],color:'a'})+T(210,106.6+i*5.5,k,{a:'end',s:2.4})).join(''));
  /* JUSB3 */
  s+=part('JUSB3',R(227.4,126.4,12.2,21.2,'url(#m-port-blue)',{rx:.8,s:'#0E2A50',sw:.4})+header(229,128,2,10,2.02,{skip:[20],base:'#0E2A50'})+T(233.5,154.5,'JUSB3',{a:'middle',s:2.6}));
  if(cab.JUSB3) s+=R(226,125.6,15,22.8,'url(#m-port-blue)',{rx:1.2,s:'#07182E',sw:.5})+`<path d="M241 137 C 250 137 252 150 258 152" stroke="#1E4E8C" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  /* SYS_FAN1 */
  s+=part('SYS_FAN1',fanHeader(6.5,118)+T(12,130.5,'SYS_FAN1',{a:'middle',s:2.4}));
  if(cab.SYS_FAN1===true) s+=fanPlug(6.5,118)+`<path d="M12 117.5 C 12 108 4 104 -4 100" stroke="#15191C" stroke-width="1.6" fill="none"/>`;
  if(cab.SYS_FAN1==='cooler') s+=fanPlug(6.5,118);
  /* M.2 slot, standoff, SSD */
  s+=part('M2_1',R(35,114.4,7,11.2,'#15191C',{rx:.6})+[0,1,2,3,4,5,6].map(i=>R(35.8,115.4+i*1.4,1.2,.6,'url(#m-gold)')).join('')+
    `<circle cx="124" cy="120" r="2.8" fill="url(#m-gold)"/><circle cx="124" cy="120" r="1.1" fill="#0B0D0F"/>`+T(80,136,'M2_1 (CPU · PCIe 4.0 x4)',{a:'middle',s:2.6}));
  if(st.m2Screw) s+=P.screw(124,120,1.9);
  if(st.m2){ const tilt=st.m2Secured?0:-9; s+=`<g transform="rotate(${tilt} 38 120)"><g transform="translate(38 109) scale(1.05)">`+A.inner('nvme','top',{})+`</g></g>`+(st.m2Secured?P.screw(124,120,1.9):'')+(!st.m2Secured?`<rect x="36" y="104" width="92" height="30" rx="2" fill="none" stroke="#FFB020" stroke-width=".8" stroke-dasharray="2 1.5"/>`:''); }
  /* PCIe x16 (armoured), x1, M2_2 */
  s+=part('PCI_E1',R(13,148,91,9,'url(#m-metal)',{rx:.8,s:'#6F787F',sw:.5})+R(15,149.8,87,5.4,'#0B0D0F',{rx:.4})+R(99,146,7,13,'url(#m-grey)',{rx:1})+T(58,164.6,'PCI_E1 (x16)',{a:'middle',s:2.8}));
  s+=part('PCI_E2',R(14,174,26,6,'#15191C',{rx:.5})+R(15.5,175.4,23,3.2,'#07090A',{rx:.3})+T(27,186,'PCI_E2 (x1)',{a:'middle',s:2.4}));
  s+=part('M2_2',R(40,196,80,7,'#15191C',{rx:.5})+`<circle cx="118" cy="199.5" r="2.2" fill="url(#m-gold)"/>`+T(80,209,'M2_2',{a:'middle',s:2.4}));
  /* battery, chipset, audio */
  s+=part('BAT1',`<circle cx="136" cy="176" r="10.4" fill="url(#m-metal)" stroke="#7E858B" stroke-width=".6"/><circle cx="136" cy="176" r="8.6" fill="url(#m-screw)"/>`+T(136,175.6,'CR2032',{a:'middle',s:2.6,f:'#3A4248',w:700})+T(136,179.4,'+ 3V',{a:'middle',s:2.2,f:'#3A4248'}));
  s+=part('chipset',heatsink(152,172,42,40,'v')+T(173,219,'CHIPSET · B760',{a:'middle',s:2.4}));
  s+=part('audio',`<path d="M2 180 H46 V222 H2" fill="none" stroke="#3E474E" stroke-width=".6" stroke-dasharray="1.6 1.2"/>`+R(8,188,11,8,'#15191C',{rx:.6})+[0,1,2,3,4,5].map(i=>`<circle cx="${24+(i%3)*6}" cy="${190+Math.floor(i/3)*7}" r="2" fill="url(#m-gold)"/><circle cx="${24+(i%3)*6}" cy="${190+Math.floor(i/3)*7}" r="1" fill="#C9A441"/>`).join('')+T(24,216,'AUDIO',{a:'middle',s:2.2,f:'#8C969E'}));
  /* SATA (right-angle ports) */
  s+=part('SATA',[0,1,2,3].map(i=>R(229,164.6+i*10.5,12,8.4,'#15191C',{rx:.6,s:'#3A424A',sw:.3})+R(230.4,166.4+i*10.5,9,3,'#050607',{rx:.3})+T(227,170.8+i*10.5,'SATA'+(i+1),{a:'end',s:2.4})).join(''));
  if(st.sataData&&st.sataData.BAY35) s+=R(228,164,14,9.6,'url(#m-red)',{rx:.8})+`<path d="M242 168 H258" stroke="#C62828" stroke-width="3.4"/>`;
  if(st.sataData&&st.sataData.BAY25) s+=R(228,174.5,14,9.6,'url(#m-red)',{rx:.8})+`<path d="M242 179 H258" stroke="#C62828" stroke-width="3.4"/>`;
  /* bottom headers */
  s+=part('JAUD1',header(6,229,5,2,3.4,{skip:[9]})+T(15,226.4,'JAUD1',{a:'middle',s:2.4}));
  if(cab.JAUD1) s+=R(5,228,19,9,'url(#m-black)',{rx:.8})+T(14.5,234,'HD AUDIO',{a:'middle',s:2,f:'#AEB8BF',w:700})+`<path d="M14 237 C 14 244 10 246 4 250" stroke="#15191C" stroke-width="2" fill="none"/>`;
  s+=part('JUSB',header(60,229,5,2,3.2,{skip:[10]})+header(84,229,5,2,3.2,{skip:[10]})+T(68,226.4,'JUSB1',{a:'middle',s:2.2})+T(92,226.4,'JUSB2',{a:'middle',s:2.2}));
  s+=part('SYS_FAN2',fanHeader(148.5,230)+T(154,227,'SYS_FAN2',{a:'middle',s:2.2}));
  if(cab.SYS_FAN2) s+=fanPlug(148.5,230)+`<path d="M154 236 C 154 244 160 246 170 250" stroke="#15191C" stroke-width="1.6" fill="none"/>`;
  s+=part('JFP1',header(194,229.4,5,2,4.3,{skip:[10]})+T(205,226.4,'JFP1',{a:'middle',s:2.6}));
  const jf=st.jfp||{}; const plugged=Object.values(jf).filter(Boolean);
  if(plugged.length){ const colors={PWR:'#E53935',RST:'#1E88E5',PLED:'#43A047',HDD:'#FDD835'};
    Object.entries(jf).forEach(([k,v])=>{ if(!v) return; const col=(n)=>((n-1)>>1), row=(n)=>n%2?1:0;
      const x=194.6+col(v.a)*4.3, y=230+row(v.a)*4.3; s+=R(x-.3,y-.3,8.9,4.2,'#15191C',{rx:.4,s:colors[k],sw:.6})+`<path d="M${x+2} ${y+(row(v.a)?4:0)} v${row(v.a)?6:-6}" stroke="${colors[k]}" stroke-width=".8"/>`; }); }
  /* graphics card, seen edge-on through the side panel */
  if(st.gpu){
    s+=part('gpu',`<g filter="url(#f-shadow)">`+R(8,136,214,38,'url(#m-black)',{rx:3,s:'#0B0D0F',sw:.5})+`</g>`+
      R(10,138,210,8,'url(#m-gunmetal)',{rx:2})+Array.from({length:30},(_,i)=>R(16+i*6.6,148,3.4,20,'#0E1215',{rx:.6})).join('')+
      R(12,169,206,3,'url(#m-metal-h)',{rx:1})+P.text(96,143.6,'GEFORCE RTX 5060',{a:'middle',s:4.2,f:'#76B900',w:700,ls:.4})+
      R(195,137,18,8.4,'#07090A',{rx:.6})+[0,1,2,3].map(i=>R(196.4+i*4,138.2,3,2.6,'#2E353B',{rx:.4})+R(196.4+i*4,141.6,3,2.6,'#2E353B',{rx:.4})).join(''));
    if(cab.GPU) s+=R(194,135,20,10.4,'url(#m-black)',{rx:1})+T(204,141.6,'PCIe',{a:'middle',s:2.8,f:'#FFD54A',w:700})+[0,1,2,3].map(i=>`<path d="M${197+i*4} 135 C ${197+i*4} 129 ${222+i*2} 131 ${246} ${128.6+i*1.5}" stroke="#F4C21A" stroke-width="1.3" fill="none"/>`).join('');
  }
  return s;
}
function socket(st){
  let s=R(55,39,64,66,'url(#m-metal)',{rx:2.4,s:'#5C646B',sw:.6});           /* ILM frame */
  s+=R(61,45,52,54,'#23292E',{rx:1});                                         /* socket body */
  const cpu=st.cpu;
  if(!cpu&&!st.cover){ let d=''; for(let r=0;r<20;r++) for(let c=0;c<18;c++){ const x=63.4+c*2.73, y=47.4+r*2.6; if(x>78&&x<96&&y>62&&y<82) continue; d+=`<rect x="${x}" y="${y}" width=".9" height=".9" fill="#C9A441"/>`; } s+=d; }
  if(st.cover&&!cpu) s+=R(63,47,48,50,'url(#m-black)',{rx:1.6})+R(65,49,44,6,'#fff',{rx:1,op:.08})+P.text(87,73,'PnP CAP',{a:'middle',s:3.4,f:'#6F7A82',w:700})+P.text(87,78,'do not remove by hand',{a:'middle',s:2.2,f:'#6F7A82'});
  if(cpu){ const rot=(st.cpuRot||0)+90; s+=`<g transform="translate(87 72) rotate(${rot}) translate(-22.5 -18.75)">`+A.inner(cpu,'top',{})+`</g>`; }
  /* load plate: open (lifted, seen foreshortened) or closed (frame with window) */
  if(st.plate==='up') s+=R(55,24,64,14,'url(#m-metal-h)',{rx:1.5,s:'#6F787F',sw:.4})+R(66,27,42,8,'#23292E',{rx:1,op:.6});
  else s+=`<path d="M57 41 H117 V103 H57Z M64 48 V96 H110 V48Z" fill="url(#m-metal-h)" fill-rule="evenodd" stroke="#6F787F" stroke-width=".4"/>`+P.screw(87,42.2,1.4)+P.screw(87,101.8,1.4);
  /* lever */
  s+= st.lever==='up' ? `<path d="M121 102 V42 L131 30" stroke="url(#m-metal)" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="131" cy="30" r="2" fill="url(#m-screw)"/>`
                      : `<path d="M121 104 V44" stroke="url(#m-metal)" stroke-width="2.6" stroke-linecap="round"/><path d="M118 44 H124" stroke="#5C646B" stroke-width="1.6"/><circle cx="121" cy="104" r="2" fill="url(#m-screw)"/>`;
  s+=`<path d="M58.5 101.5 l4.2 0 l-4.2 -4.2z" fill="#fff"/>`;
  return s;
}
function cooler(st,Pb){
  if(st.cooler==='cl-tower'){
    let s=`<g filter="url(#f-shadow)">`+R(44,26,86,78,'url(#m-alu)',{rx:2.6,s:'#6B737A',sw:.5})+`</g>`;
    s+=Array.from({length:26},(_,i)=>R(46,28+i*2.9,34,.6,'#8F989F')+R(94,28+i*2.9,34,.6,'#8F989F')).join('');
    s+=R(80,26,14,78,'url(#m-black-h)',{rx:2})+R(38,30,8,70,'url(#m-black-h)',{rx:2});
    s+=[54,62,70,102,110,118].map(x=>`<circle cx="${x}" cy="30" r="1.8" fill="url(#m-copper)"/><circle cx="${x}" cy="100" r="1.8" fill="url(#m-copper)"/>`).join('');
    if(st.filmOff===false) s+=R(52,96,70,6,'#E53935',{rx:1,op:.9})+P.text(87,100.4,'FILM LEFT ON BASE',{a:'middle',s:3,f:'#fff',w:700});
    return s;
  }
  let s=`<g filter="url(#f-shadow)" transform="translate(42 27) scale(.9)">`+A.inner('cooler-intel','top',{on:!!st.poweredOn,locked:st.coolerLocked!==false})+`</g>`;
  return s;
}
A.drawBoard=drawBoard;

/* register the board for thumbnails and the gallery */
const demo={cables:{},dimm:{DIMMA1:{},DIMMA2:{stick:'ram-ddr4',seated:true},DIMMB1:{},DIMMB2:{stick:'ram-ddr4',seated:true}},cpu:null,cover:true,plate:'down',lever:'down',jfp:{}};
A.register('motherboard',{
  name:'Micro-ATX B760 motherboard', cat:'computer',
  views:{top:{w:244,h:244,pad:6,draw:(s)=>drawBoard(Object.assign({},demo,s.full?{cpu:'cpu-i5-12400',cover:false,cooler:'cl-intel',coolerLocked:true,m2:true,m2Secured:true,m2Screw:true}:{}),{leds:s.on?{}:{}})}},
  defaultView:'top', power:false, state:{},
  actions:[{label:'Fitted parts',key:'full',toggle:true}],
  viewNotes:{top:'Header names are printed on the board and explained in the manual. Match every cable to its printed name.'},
  parts:{
    pcb:{name:'Circuit board',info:'Micro-ATX, 244 × 244 mm. Hold it by the edges.'},'rear-io':{name:'Rear I/O',info:'Ports that show through the I/O shield at the back of the case.'},
    vrm:{name:'Power delivery (VRM)',info:'Chokes and capacitors that feed the CPU, cooled by the heatsinks.'},
    CPU_PWR1:{name:'CPU_PWR1',info:'8-pin CPU power header.'},CPU_FAN1:{name:'CPU_FAN1',info:'Header for the CPU cooler fan.'},
    SOCKET:{name:'LGA1700 CPU socket',info:'Metal frame, load plate and lever. The plastic cap pops off when the lever closes on a CPU.'},cooler:{name:'CPU cooler',info:'Mounted over the CPU.'},
    DIMMA1:{name:'DIMMA1',info:'Memory slot. Leave empty with two sticks.'},DIMMA2:{name:'DIMMA2',info:'First slot to fill.'},DIMMB1:{name:'DIMMB1',info:'Memory slot.'},DIMMB2:{name:'DIMMB2',info:'Second slot to fill.'},
    ATX_PWR1:{name:'ATX_PWR1',info:'24-pin main power.'},'debug-leds':{name:'EZ Debug LEDs',info:'CPU, DRAM, VGA, BOOT: the one that stays lit points to the fault.'},
    JUSB3:{name:'JUSB3',info:'Front USB 3.0 header (19 pins, one blocked).'},SYS_FAN1:{name:'SYS_FAN1',info:'Case fan header.'},SYS_FAN2:{name:'SYS_FAN2',info:'Case fan header.'},
    M2_1:{name:'M2_1 slot',info:'PCIe 4.0 x4 from the CPU. Best slot for the system drive.'},PCI_E1:{name:'PCI_E1',info:'Steel-armoured PCIe x16 slot for the graphics card.'},
    PCI_E2:{name:'PCI_E2',info:'PCIe x1 slot for small cards such as Wi-Fi.'},M2_2:{name:'M2_2 slot',info:'Second M.2 slot, from the chipset.'},
    BAT1:{name:'CMOS battery (CR2032)',info:'Keeps the clock running. Removing it resets UEFI settings.'},chipset:{name:'Chipset heatsink',info:'Intel B760 chipset: SATA, extra USB and M2_2.'},
    audio:{name:'Audio section',info:'Separated from noisy power parts; the gold parts are audio capacitors.'},SATA:{name:'SATA ports',info:'SATA1 to SATA4, right-angled so cables run along the board.'},
    JAUD1:{name:'JAUD1',info:'Front HD audio header.'},JUSB:{name:'JUSB1 and JUSB2',info:'USB 2.0 front-panel headers.'},JFP1:{name:'JFP1',info:'Front panel: power switch, reset, power LED and HDD LED.'},
    gpu:{name:'Graphics card',info:'Seen edge-on. The 8-pin socket faces you.'},
  }
});
})();
