/* Assembly v2 engine: state, step rules, stage presets, POST evaluation. No DOM. */
window.AsmEngine = (function(){
const D = window.ASM;
const DIMMS=['DIMMA1','DIMMA2','DIMMB1','DIMMB2'];
function fresh(b){
  const dimm={}; DIMMS.forEach(k=>dimm[k]={open:false,stick:null,seated:false});
  return {build:b, compat:false, esd:false, onBox:false,
    lever:'down', plate:'down', cover:true, cpu:null, cpuRot:0, socketClosed:false, coverStored:false, bent:false,
    slotsKnown:false, dimm, m2Screw:true, m2:false, m2Secured:false,
    paste:null, bracket:false, cooler:null, coolerLocked:false, filmOff:false,
    cables:{CPU_FAN1:false,SYS_FAN1:false,SYS_FAN2:false,ATX_PWR1:false,CPU_PWR1:false,JUSB3:false,JAUD1:false,GPU:false},
    jfp:{PWR:null,RST:null,PLED:null,HDD:null}, jfpErr:0,
    panelOn:true, panelWasOff:false, standoffs:false, strayStandoff:true, io:false, mbInCase:false, mbScrews:false, short:false,
    psu:false, psuFanDown:false, psuSecured:false, psuOn:true,
    hdd:false, ssd25:false, sataData:{BAY35:false,BAY25:false}, sataPwr:{BAY35:false,BAY25:false},
    slotCovers:false, gpu:false, gpuScrewed:false, frontFan:null,
    display:null, cord:false, poweredOn:false, posted:false, inUefi:false, uefiChecked:false, frontUsbTested:false, tidy:false,
    cpuModel:'cpu-i5-12400'};
}
const JFP_OK={PWR:[6,8],RST:[5,7],PLED:[2,4],HDD:[1,3]};
const JFP_PLUS={PLED:2,HDD:1};
function jfpStatus(s){
  const j=s.jfp; const pairIs=(v,p)=>v&&v.a===p[0]&&v.b===p[1];
  const powerBtn = pairIs(j.PWR,[6,8]) ? 'power' : pairIs(j.RST,[6,8]) ? 'reset' : null;
  const r={pwr:pairIs(j.PWR,[6,8]), rst:pairIs(j.RST,[5,7]), pled:pairIs(j.PLED,[2,4])&&j.PLED.plus===2, hdd:pairIs(j.HDD,[1,3])&&j.HDD.plus===1, powerBtn};
  r.all=r.pwr&&r.rst&&r.pled&&r.hdd; return r;
}
const APPLY={
  sheet:s=>s.compat=true, esd:s=>s.esd=true, box:s=>s.onBox=true,
  'socket-open':s=>{s.lever='up'; s.plate='up';},
  'cpu-place':s=>{s.cpu=s.cpuModel; s.cpuRot=0;},
  'socket-close':s=>{s.plate='down'; s.lever='down'; s.cover=false; s.coverStored=true; s.socketClosed=true;},
  'ram-manual':s=>s.slotsKnown=true,
  'ram-latch':s=>{s.dimm.DIMMA2.open=true; s.dimm.DIMMB2.open=true;},
  'ram-insert':s=>{['DIMMA2','DIMMB2'].forEach(k=>Object.assign(s.dimm[k],{stick:'ram-ddr4-8',seated:true,open:false}));},
  'm2-screw':s=>s.m2Screw=false, 'm2-insert':s=>s.m2=true, 'm2-secure':s=>{s.m2Secured=true; s.m2Screw=true;},
  'paste-check':s=>{s.paste='pre'; s.cooler='cl-intel'; s.filmOff=true;}, 'cooler-mount':s=>{s.coolerLocked=true;},
  bracket:s=>s.bracket=true, 'paste-apply':s=>s.paste='ok', 'tower-mount':s=>{s.cooler='cl-tower'; s.filmOff=true; s.coolerLocked=true;},
  cpufan:s=>s.cables.CPU_FAN1=true,
  'panel-off':s=>{s.panelOn=false; s.panelWasOff=true;}, standoffs:s=>{s.standoffs=true; s.strayStandoff=false;}, 'io-shield':s=>s.io=true,
  'mb-lower':s=>s.mbInCase=true, 'mb-screws':s=>s.mbScrews=true,
  'psu-place':s=>{s.psu=true; s.psuFanDown=true;}, 'psu-secure':s=>{s.psuSecured=true; s.psuOn=false;},
  hdd:s=>s.hdd=true, ssd25:s=>s.ssd25=true, 'sata-data':s=>{s.sataData.BAY35=true; s.sataData.BAY25=true;}, 'sata-power':s=>{s.sataPwr.BAY35=true; s.sataPwr.BAY25=true;},
  'slot-covers':s=>s.slotCovers=true, 'gpu-insert':s=>s.gpu=true, 'gpu-screw':s=>s.gpuScrewed=true,
  atx24:s=>s.cables.ATX_PWR1=true, eps:s=>s.cables.CPU_PWR1=true, pcie:s=>s.cables.GPU=true,
  jfp1:s=>{s.jfp={PWR:{a:6,b:8,plus:6},RST:{a:5,b:7,plus:5},PLED:{a:2,b:4,plus:2},HDD:{a:1,b:3,plus:1}};},
  jusb3:s=>s.cables.JUSB3=true, jaud1:s=>s.cables.JAUD1=true, sysfan:s=>s.cables.SYS_FAN1=true, frontfan:s=>{s.frontFan='in'; s.cables.SYS_FAN2=true;},
  'display-a':s=>s.display='IOHDMI', 'display-b':s=>s.display='GPUOUT',
  powercord:s=>{s.cord=true; s.psuOn=true;}, poweron:s=>{s.poweredOn=true; s.posted=true;}, 'uefi-enter':s=>s.inUefi=true, 'uefi-check':s=>s.uefiChecked=true,
  tidy:s=>s.tidy=true, 'panel-on':s=>s.panelOn=true,
};
const CHECK={
  sheet:s=>s.compat, esd:s=>s.esd, box:s=>s.onBox,
  'socket-open':s=>(s.lever==='up'&&s.plate==='up')||!!s.cpu||s.socketClosed,
  'cpu-place':s=>!!s.cpu && D.parts[s.cpu].socket==='LGA1700' && s.cpuRot===0,
  'socket-close':s=>s.socketClosed&&s.coverStored,
  'ram-manual':s=>s.slotsKnown,
  'ram-latch':s=>['DIMMA2','DIMMB2'].every(k=>s.dimm[k].open||s.dimm[k].stick),
  'ram-insert':s=>['DIMMA2','DIMMB2'].every(k=>s.dimm[k].stick&&s.dimm[k].seated),
  'm2-screw':s=>!s.m2Screw||s.m2, 'm2-insert':s=>s.m2, 'm2-secure':s=>s.m2&&s.m2Secured,
  'paste-check':s=>s.paste==='pre'&&s.cooler==='cl-intel', 'cooler-mount':s=>s.cooler==='cl-intel'&&s.coolerLocked,
  bracket:s=>s.bracket, 'paste-apply':s=>s.paste==='ok', 'tower-mount':s=>s.cooler==='cl-tower'&&s.filmOff&&s.coolerLocked,
  cpufan:s=>s.cables.CPU_FAN1===true,
  'panel-off':s=>s.panelWasOff, standoffs:s=>s.standoffs, 'io-shield':s=>s.io,
  'mb-lower':s=>s.mbInCase, 'mb-screws':s=>s.mbScrews,
  'psu-place':s=>s.psu&&s.psuFanDown, 'psu-secure':s=>s.psuSecured,
  hdd:s=>s.hdd, ssd25:s=>s.ssd25, 'sata-data':s=>s.sataData.BAY35&&s.sataData.BAY25, 'sata-power':s=>s.sataPwr.BAY35&&s.sataPwr.BAY25,
  'slot-covers':s=>s.slotCovers, 'gpu-insert':s=>s.gpu, 'gpu-screw':s=>s.gpuScrewed,
  atx24:s=>s.cables.ATX_PWR1, eps:s=>s.cables.CPU_PWR1, pcie:s=>s.cables.GPU,
  jfp1:s=>jfpStatus(s).all, jusb3:s=>s.cables.JUSB3, jaud1:s=>s.cables.JAUD1, sysfan:s=>s.cables.SYS_FAN1===true, frontfan:s=>s.frontFan==='in'&&s.cables.SYS_FAN2===true,
  'display-a':s=>s.display==='IOHDMI', 'display-b':s=>s.display==='GPUOUT',
  powercord:s=>s.cord&&s.psuOn, poweron:s=>s.posted, 'uefi-enter':s=>s.inUefi, 'uefi-check':s=>s.uefiChecked,
  tidy:s=>s.tidy, 'panel-on':s=>s.panelOn&&s.tidy,
};
const stepsFor=b=>D.steps.filter(x=>!x.build||x.build===b);
const stagesFor=b=>D.stages.filter(x=>!x.build||x.build===b);
function stateAtStage(b, stageIdx){
  const s=fresh(b); const stages=stagesFor(b);
  const before=new Set(stages.slice(0,stageIdx).map(x=>x.id));
  stepsFor(b).forEach(st=>{ if(before.has(st.stage)) APPLY[st.id](s); });
  return s;
}
function completeState(b){ const s=fresh(b); stepsFor(b).forEach(st=>APPLY[st.id](s)); s.poweredOn=false; s.posted=false; s.inUefi=false; s.uefiChecked=false; return s; }

/* POST / power-on evaluation */
function evaluate(s, btn){
  const r={leds:{CPU:false,DRAM:false,VGA:false,BOOT:false}, stage:'off', text:'', notes:[], ok:false};
  const cpu=s.cpu?D.parts[s.cpu]:null; const jf=jfpStatus(s);
  if(!s.psu){ r.text='There is no power supply installed.'; return r; }
  if(!s.cord){ r.text='Nothing happens. The power cord is not plugged in.'; return r; }
  if(!s.psuOn){ r.text='You press the power button. Nothing happens: no fans, no lights.'; return r; }
  const pressed = btn==='reset' ? 'reset' : 'power';
  if(!s.mbInCase || !s.cables.ATX_PWR1){ r.text=`You press the ${pressed} button. Nothing happens: no fans, no lights.`; return r; }
  if(jf.powerBtn!==pressed){ r.text = pressed==='reset' ? 'You press the reset button. Nothing happens.' : 'You press the power button. Nothing happens: no fans, no lights.'; return r; }
  if(s.short){ r.text='The fans twitch for a split second, then everything shuts off. Something is shorting the board.'; return r; }
  r.powered=true;
  if(!cpu || !s.cables.CPU_PWR1 || s.bent){ r.leds.CPU=true; r.stage='nosignal'; r.text='Fans spin and lights come on, but the monitor stays black. The CPU debug LED stays on.'; return r; }
  const sticks=['DIMMA1','DIMMA2','DIMMB1','DIMMB2'].filter(k=>s.dimm[k].stick);
  const ddr5=sticks.some(k=>D.parts[s.dimm[k].stick].type!=='DDR4');
  if(!sticks.length || ddr5 || sticks.some(k=>!s.dimm[k].seated)){ r.leds.DRAM=true; r.stage='nosignal'; r.text='Fans spin, but the monitor stays black. The DRAM debug LED stays on.'; return r; }
  if(!s.cooler){ r.stage='shutdown'; r.text='The logo appears for a moment, then the PC switches itself off. The CPU reached its temperature limit within seconds. Never run a CPU without a cooler.'; return r; }
  if(s.gpu && !s.cables.GPU){ r.leds.VGA=true; r.stage='nosignal'; r.text='Fans spin, but there is no picture. The VGA debug LED stays on.'; return r; }
  if(!s.gpu && !cpu.igpu){ r.leds.VGA=true; r.stage='nosignal'; r.text='Fans spin and the monitor says No signal. The VGA debug LED stays on.'; return r; }
  if(!s.display){ r.stage='nosignal'; r.text='The PC seems to run, but no monitor cable is connected.'; return r; }
  if(s.gpu && s.display==='IOHDMI'){ r.stage='nosignal'; r.text='The PC runs and no debug LED stays on, but the monitor on the motherboard HDMI port says No signal.'; return r; }
  if(!s.gpu && s.display==='GPUOUT'){ r.stage='nosignal'; r.text='There is no graphics card, so nothing is connected to the monitor.'; return r; }
  r.ok=true; r.stage='post';
  const ram=sticks.reduce((a,k)=>a+D.parts[s.dimm[k].stick].gb,0);
  const dual=sticks.length===2&&sticks.includes('DIMMA2')&&sticks.includes('DIMMB2');
  let temp=36;
  if(!s.filmOff) temp=96; else if(!s.coolerLocked) temp=95; else if(s.paste==='none') temp=90; else if(s.paste==='extra') temp=78;
  r.temp=temp; r.ram=ram; r.dual=dual; r.cpuName=cpu.name;
  r.fanErr = s.cables.CPU_FAN1!==true;
  r.drives=[]; if(s.m2 && s.m2Secured) r.drives.push('M2_1: 1 TB NVMe SSD');
  if(s.hdd && s.sataData.BAY35 && s.sataPwr.BAY35) r.drives.push('SATA1: 2 TB hard drive');
  if(s.ssd25 && s.sataData.BAY25 && s.sataPwr.BAY25) r.drives.push('SATA2: 500 GB SATA SSD');
  if(r.fanErr) r.notes.push('A CPU fan error warning appears at every start.');
  if(temp>70) r.notes.push(`The CPU is at ${temp} °C while idle. Normal for this cooler is about 30–45 °C.`);
  if(ram!==16) r.notes.push(`Only ${ram} GB of memory is detected.`);
  else if(!dual) r.notes.push('Memory runs in single-channel mode.');
  if(!(s.m2&&s.m2Secured)) r.notes.push('The NVMe SSD is not listed.');
  if(s.hdd && !(s.sataData.BAY35&&s.sataPwr.BAY35)) r.notes.push('The 2 TB hard drive is not listed.');
  if(s.ssd25 && !(s.sataData.BAY25&&s.sataPwr.BAY25)) r.notes.push('The SATA SSD is not listed.');
  if(!jf.pled) r.notes.push('The case power LED stays off.');
  if(!s.io) r.notes.push('The rear ports have no I/O shield: they wobble and are open to dust.');
  if(!s.psuFanDown && s.psu) r.notes.push('The PSU fan faces up into the shroud and runs hot.');
  if(s.build==='B' && s.frontFan==='out') r.notes.push('The front fan blows air out, fighting the rear exhaust.');
  return r;
}
function healthy(s){ const r=evaluate(s,'power'); return r.ok && r.notes.length===0 && s.cables.JUSB3 && s.cables.JAUD1 && jfpStatus(s).all; }
return {D, DIMMS, fresh, APPLY, CHECK, stepsFor, stagesFor, stateAtStage, completeState, evaluate, healthy, jfpStatus, JFP_OK, JFP_PLUS};
})();
