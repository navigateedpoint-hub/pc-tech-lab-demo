/* Computer parts, shaded style. Units roughly millimetres. */
(function(){
const A=window.Art, P=A.P, T=P.text, part=P.part;
const on=s=>!!s.on;

/* ===================== CPU: Intel LGA1700 ===================== */
function intelCpu(model, igpu){
  return {
    name:'Intel Core '+model, cat:'computer',
    views:{
      top:{w:45,h:37.5,pad:4,draw:s=>{
        let g=P.shadow(22.5,38.5,21,1.6);
        g+=part('substrate',`<path d="M0 1.5 Q0 0 1.5 0 H43.5 Q45 0 45 1.5 V36 Q45 37.5 43.5 37.5 H1.5 Q0 37.5 0 36Z" fill="url(#m-pcb)"/>`+
          `<rect x="-0.01" y="8.5" width="1.6" height="4" fill="#E7ECEF"/><rect x="43.41" y="8.5" width="1.6" height="4" fill="#E7ECEF"/>`+
          `<rect x="-0.01" y="25" width="1.6" height="4" fill="#E7ECEF"/><rect x="43.41" y="25" width="1.6" height="4" fill="#E7ECEF"/>`);
        g+=part('ihs',`<path d="M5 4 H40 V9 H42 V28.5 H40 V33.5 H5 V28.5 H3 V9 H5Z" fill="url(#m-metal)" stroke="#8C959C" stroke-width=".25"/>`+
          `<path d="M5 4 H40 V9 H42 V14 H3 V9 H5Z" fill="#fff" opacity=".35"/>`+
          T(22.5,15,'INTEL CORE',{a:'middle',s:2.6,f:'#4A535A',w:700})+T(22.5,19.4,model,{a:'middle',s:2.8,f:'#3A4248',w:700})+
          T(22.5,23.4,'SRL5Y 2.50GHZ',{a:'middle',s:1.9,f:'#5E676E'})+T(22.5,26.8,'X2280Q43 · LGA1700',{a:'middle',s:1.7,f:'#6B747B'}));
        g+=part('triangle',`<path d="M1.4 36.1 L4.8 36.1 L1.4 32.7Z" fill="url(#m-gold)"/>`);
        return g; }},
      bottom:{w:45,h:37.5,pad:4,draw:s=>{
        let g=`<rect width="45" height="37.5" rx="1.5" fill="url(#m-pcb)"/>`;
        let pads=''; for(let r=0;r<26;r++) for(let c=0;c<34;c++){ const x=2.2+c*1.19, y=2.2+r*1.28; if(x>15&&x<30&&y>11&&y<26) continue; pads+=`<rect x="${x}" y="${y}" width=".62" height=".62" fill="#E0B849"/>`; }
        g+=part('pads',pads);
        g+=part('caps',[0,1,2,3,4,5].map(i=>`<rect x="${17+i*2}" y="${13+ (i%2)*2}" width="1.2" height="2.4" fill="#8C6A3C"/><rect x="${17+i*2}" y="${20}" width="1.2" height="2.4" fill="#8C6A3C"/>`).join(''));
        g+=part('triangle',`<path d="M1 36.5 L4.4 36.5 L1 33.1Z" fill="#fff"/>`);
        return g; }},
    },
    defaultView:'top', power:false,
    viewNames:{top:'Top',bottom:'Underside'},
    viewNotes:{top:'Line up the gold triangle with the triangle on the socket.',bottom:'1,700 flat gold pads touch spring contacts in the socket. Never touch them.'},
    parts:{
      ihs:{name:'Heat spreader (IHS)',info:'Metal lid that carries heat to the cooler. Thermal paste goes on top of it.'},
      substrate:{name:'Substrate and notches',info:'The notches on the long edges match keys in the socket, so it only fits one way.'},
      triangle:{name:'Pin 1 triangle',info:'Must line up with the triangle marked on the socket.'},
      pads:{name:'Contact pads',info:'LGA means the pins are in the socket and the CPU has flat pads.'},
      caps:{name:'Capacitors',info:'Tiny parts that smooth the power. Do not scrape them.'},
    }
  };
}
A.register('cpu-i5-12400', intelCpu('i5-12400', true));
A.register('cpu-i5-12400f', intelCpu('i5-12400F', false));
A.REG['cpu-i5-12400f'].name='Intel Core i5-12400F (no graphics)';

/* ===================== CPU: AMD AM5 ===================== */
A.register('cpu-r5-7600',{
  name:'AMD Ryzen 5 7600', cat:'computer',
  views:{
    top:{w:40,h:40,pad:4,draw:s=>{
      let g=P.shadow(20,41,19,1.5);
      g+=part('substrate',`<rect width="40" height="40" rx="1.4" fill="url(#m-pcb)"/>`+
        [[4,2],[16,2],[28,2],[4,36],[16,36],[28,36]].map(([x,y])=>`<rect x="${x}" y="${y}" width="8" height="2" fill="#8C6A3C" opacity=".8"/>`).join(''));
      g+=part('ihs',`<path d="M5 4 H35 V7 H38 V16 H35 V24 H38 V33 H35 V36 H5 V33 H2 V24 H5 V16 H2 V7 H5Z" fill="url(#m-metal)" stroke="#8C959C" stroke-width=".25"/>`+
        `<path d="M5 4 H35 V7 H38 V14 H2 V7 H5Z" fill="#fff" opacity=".3"/>`+
        T(20,17,'AMD RYZEN 5',{a:'middle',s:2.8,f:'#3A4248',w:700})+T(20,21.5,'7600',{a:'middle',s:3,f:'#3A4248',w:700})+T(20,26,'AM5 · 100-000001015',{a:'middle',s:1.8,f:'#5E676E'}));
      g+=part('triangle',`<path d="M.8 39.2 L4.2 39.2 L.8 35.8Z" fill="url(#m-gold)"/>`);
      return g; }},
  },
  defaultView:'top', power:false,
  viewNotes:{top:'AM5 CPUs fit only AM5 boards and use DDR5 memory.'},
  parts:{ ihs:{name:'Heat spreader',info:'The cut-outs show small capacitors underneath. Do not flood them with thermal paste.'},
    substrate:{name:'Substrate',info:'AM5 is also LGA: the pins are in the socket.'},triangle:{name:'Pin 1 triangle',info:'Line it up with the socket triangle.'} }
});

/* ===================== RAM ===================== */
function ramDef(type){
  const d5=type==='DDR5';
  const notch=d5?64.5:71.3;  /* notch distance from the left, mm */
  return {
    name:(d5?'16 GB DDR5-6000':'8 GB DDR4-3200')+' memory', cat:'computer',
    views:{
      front:{w:133.35,h:34,pad:4,draw:s=>{
        let g=P.shadow(66,35,64,1.6);
        g+=part('pcb',`<path d="M0 2 Q0 0 2 0 H131.35 Q133.35 0 133.35 2 V31.2 H${notch+1} V28.8 H${notch-1} V31.2 H0Z" fill="url(#m-pcb)"/>`+
          `<path d="M0 12 h1.4 v3 h-1.4Z M133.35 12 h-1.4 v3 h1.4Z" fill="#E7ECEF"/>`);
        g+=part('contacts',Array.from({length:144},(_,i)=>{ const x=2+i*0.905; if(Math.abs(x+.3-notch)<1.4) return ''; return `<rect x="${x}" y="27" width=".55" height="4" fill="url(#m-gold)"/>`; }).join(''));
        g+=part('heatspreader',`<path d="M1.5 1 H131.85 V24 H1.5Z" fill="url(#${d5?'m-gunmetal':'m-black'})"/>`+
          `<path d="M1.5 1 H131.85 V4 L118 8 H16 L1.5 4Z" fill="#fff" opacity=".12"/>`+
          `<path d="M20 10 L34 20 H100 L114 10" fill="none" stroke="${d5?'#9AA3AA':'#4F5961'}" stroke-width="1"/>`);
        g+=part('label',P.label(40,11,54,10,'',{bg:'#EDEDE6'})+T(67,15.5,(d5?'DDR5 · 16GB · 6000MT/s':'DDR4 · 8GB · 3200MT/s'),{a:'middle',s:2.4,f:'#2E2E28',w:700})+
          T(67,19.4,d5?'CL36 · 1.1V · XMP/EXPO':'CL16 · 1.2V · XMP 1.35V',{a:'middle',s:2,f:'#4A4A40'}));
        if(d5) g+=part('pmic',`<rect x="60" y="24.2" width="6" height="2.6" rx=".3" fill="#1A1D20"/>`);
        return g; }},
    },
    defaultView:'front', power:false,
    viewNotes:{front:d5?'The notch sits nearer the middle than on DDR4, so it cannot go in a DDR4 slot.':'The notch is off-centre. It must line up with the key in the slot.'},
    parts:{
      pcb:{name:'Circuit board and notch',info:(d5?'DDR5 notch is near the centre.':'DDR4 notch is off-centre.')+' The side cut-outs are where the slot latches grip.'},
      contacts:{name:'Gold contacts (288 pins)',info:'Must sink fully into the slot until the latches click. Do not touch them.'},
      heatspreader:{name:'Heat spreader',info:'Aluminium cover that spreads heat from the memory chips.'},
      label:{name:'Label',info:'Type, capacity, speed and voltage. Speed above the standard needs XMP/EXPO turned on in UEFI.'},
      pmic:{name:'Power chip (PMIC)',info:'DDR5 regulates its own power on the stick.'},
    }
  };
}
A.register('ram-ddr4', ramDef('DDR4'));
A.register('ram-ddr5', ramDef('DDR5'));

/* ===================== NVMe SSD (M.2 2280) ===================== */
A.register('nvme',{
  name:'1 TB NVMe SSD (M.2 2280)', cat:'computer',
  views:{
    top:{w:80,h:22,pad:4,draw:s=>{
      let g=P.shadow(40,23,38,1.2);
      g+=part('pcb',`<path d="M0 0 H77.2 A2 2 0 0 1 77.2 4 V0 H80 V22 H77.2 V18 A2 2 0 0 1 77.2 22 H0 V13.6 H1.2 V11.9 H0Z" fill="url(#m-pcb-dark)"/>`+
        `<path d="M78 9.2 a1.8 1.8 0 0 0 0 3.6" fill="#E7ECEF"/><circle cx="78.2" cy="11" r="1.8" fill="#E7ECEF"/>`);
      g+=part('keyM',`<rect x="0" y="12" width="3.6" height="1.6" fill="#E7ECEF"/>`+Array.from({length:30},(_,i)=>{ const y=1+i*.68; if(y>11.4&&y<14.2) return ''; return `<rect x="0" y="${y}" width="3.4" height=".42" fill="url(#m-gold)"/>`; }).join(''));
      g+=part('label',`<rect x="6" y="1.5" width="68" height="19" rx=".8" fill="url(#m-black)"/>`+T(40,8,'NVMe  M.2',{a:'middle',s:2.8,f:'#E3E8EB',w:700})+T(40,12.4,'1TB · PCIe 4.0 x4',{a:'middle',s:2.1,f:'#AEB8BF'})+T(40,16.3,'SSD · 2280',{a:'middle',s:1.9,f:'#8C969E'}));
      return g; }},
  },
  defaultView:'top', power:false,
  viewNotes:{top:'The M-key notch lines up with the key in the M.2 slot. The half-moon at the other end takes the screw.'},
  parts:{pcb:{name:'Circuit board',info:'22 mm wide and 80 mm long: that is what “2280” means. The half-moon end is held by the M.2 screw.'},
    keyM:{name:'M-key connector',info:'The gap in the gold contacts is the M key, used by NVMe drives.'},
    label:{name:'Label',info:'Covers the controller and flash chips. Removing it can void the warranty.'}}
});

/* ===================== 3.5-inch hard drive ===================== */
function sataEnd(x,y,s){ /* data (7-pin) + power (15-pin) L-shaped connectors */
  return part('sata-data',`<path d="M${x} ${y} h13 v5 h-11 v1.6 h-2Z" fill="#15191C"/><rect x="${x+1.2}" y="${y+1.4}" width="10.6" height="1" fill="url(#m-gold)"/>`)+
    part('sata-power',`<path d="M${x+16} ${y} h24 v5 h-22 v1.6 h-2Z" fill="#15191C"/><rect x="${x+17.2}" y="${y+1.4}" width="21.6" height="1" fill="url(#m-gold)"/>`);
}
A.register('hdd',{
  name:'2 TB 3.5-inch hard drive', cat:'computer',
  views:{
    top:{w:101.6,h:147,pad:5,draw:s=>{
      let g=P.shadow(51,148,48,2.5);
      g+=part('cover',`<rect width="101.6" height="147" rx="3" fill="url(#m-alu)"/><rect x="4" y="4" width="93.6" height="139" rx="2" fill="url(#m-metal)"/>`+
        `<circle cx="50.8" cy="58" r="40" fill="none" stroke="#9AA3AA" stroke-width=".6"/><circle cx="50.8" cy="58" r="12" fill="url(#m-screw)"/>`+
        [[8,8],[93.6,8],[8,139],[93.6,139],[50.8,58]].map(([x,y])=>P.screw(x,y,1.6)).join(''));
      g+=part('label',`<rect x="12" y="96" width="78" height="40" rx="1.5" fill="#F2F4F5" stroke="#C9D0D5" stroke-width=".4"/>`+
        T(51,106,'3.5" HDD · 2TB',{a:'middle',s:5,f:'#1B2A33',w:700})+T(51,113,'SATA 6Gb/s · 7200 RPM',{a:'middle',s:3.4,f:'#3A4A55'})+
        T(51,119,'256MB cache · 5V 0.55A · 12V 0.45A',{a:'middle',s:2.7,f:'#56656E'})+`<rect x="22" y="123" width="58" height="7" fill="url(#p-mesh)" opacity=".7"/>`);
      return g; }},
    end:{w:101.6,h:26.1,pad:5,draw:s=>{
      let g=P.shadow(51,27,48,1.4);
      g+=`<rect width="101.6" height="26.1" rx="1.5" fill="url(#m-alu)"/><rect x="0" y="17" width="101.6" height="9.1" fill="url(#m-pcb-dark)"/>`;
      g+=sataEnd(46,18.5,s);
      if(s.dataIn) g+=`<rect x="45.5" y="12" width="14" height="7" rx="1" fill="url(#m-red)"/>`;
      if(s.powerIn) g+=`<rect x="61.5" y="12" width="25" height="7" rx="1" fill="#15191C"/><path d="M66 12 v-8 M71 12 v-8 M76 12 v-8 M81 12 v-8" stroke="#F4C21A" stroke-width="1.2"/>`;
      return g; }},
  },
  defaultView:'top', power:false,
  viewNames:{top:'Top',end:'Connector end'},
  viewNotes:{top:'Spinning platters inside: avoid bumps while it runs.',end:'Narrow connector: SATA data. Wide connector: SATA power. Both are L-shaped so they fit one way.'},
  parts:{cover:{name:'Top cover',info:'Sealed. Never open a hard drive; dust destroys it.'},label:{name:'Label',info:'Capacity, interface and power draw.'},
    'sata-data':{name:'SATA data (7 pins)',info:'Cable to a SATA port on the motherboard.'},'sata-power':{name:'SATA power (15 pins)',info:'Cable from the power supply.'}}
});

/* ===================== 2.5-inch SATA SSD ===================== */
A.register('ssd25',{
  name:'500 GB 2.5-inch SATA SSD', cat:'computer',
  views:{
    top:{w:69.85,h:100,pad:5,draw:s=>{
      let g=P.shadow(35,101,33,2);
      g+=part('case',`<rect width="69.85" height="100" rx="3" fill="url(#m-black)"/><rect x="3" y="3" width="63.85" height="94" rx="2" fill="url(#m-gunmetal)"/>`);
      g+=part('label',T(35,40,'SSD',{a:'middle',s:9,f:'#E3E8EB',w:700})+T(35,50,'500GB · SATA III',{a:'middle',s:4.2,f:'#C9D2D8'})+T(35,57,'2.5" · 7mm',{a:'middle',s:3.4,f:'#AEB8BF'}));
      return g; }},
    end:{w:69.85,h:7,pad:5,draw:s=>{
      let g=`<rect width="69.85" height="7" rx="1" fill="url(#m-black)"/>`;
      g+=part('sata-data',`<path d="M16 1 h13 v5 h-11 v-1.6 h-2Z" fill="#0B0D0F"/><rect x="17.2" y="2.4" width="10.6" height="1" fill="url(#m-gold)"/>`)+
         part('sata-power',`<path d="M32 1 h24 v5 h-22 v-1.6 h-2Z" fill="#0B0D0F"/><rect x="33.2" y="2.4" width="21.6" height="1" fill="url(#m-gold)"/>`);
      return g; }},
  },
  defaultView:'top', power:false, viewNames:{top:'Top',end:'Connector end'},
  viewNotes:{top:'No moving parts. SATA limits it to about 550 MB/s.',end:'Same SATA data and power connectors as a hard drive.'},
  parts:{case:{name:'Case',info:'7 mm thick 2.5-inch format, the same size as a laptop drive.'},label:{name:'Label',info:'Capacity and interface.'},
    'sata-data':{name:'SATA data',info:'To the motherboard.'},'sata-power':{name:'SATA power',info:'From the PSU.'}}
});

/* ===================== Graphics card (dual fan) ===================== */
A.register('gpu',{
  name:'GeForce RTX 5060 graphics card', cat:'computer',
  views:{
    face:{w:230,h:122,pad:6,draw:s=>{
      let g=P.shadow(118,124,112,3);
      g+=part('bracket',`<rect x="0" y="0" width="6" height="104" fill="url(#m-metal-h)" stroke="#6F787F" stroke-width=".4"/><path d="M0 104 h6 v10 h-3Z" fill="url(#m-metal)"/>`);
      g+=part('fingers',`<rect x="22" y="104" width="89" height="9" fill="url(#m-pcb)"/>`+Array.from({length:82},(_,i)=>{ const x=23+i*1.05; if(x>32&&x<34.4) return ''; return `<rect x="${x}" y="106" width=".6" height="6.6" fill="url(#m-gold)"/>`; }).join('')+`<rect x="32.2" y="104" width="2" height="9" fill="#E7ECEF"/>`);
      g+=part('shroud',`<path d="M8 6 H222 Q228 6 228 12 V98 Q228 104 222 104 H8Z" fill="url(#m-black)"/>`+
        `<path d="M12 10 H220 L214 18 H18Z" fill="#fff" opacity=".08"/><path d="M110 12 L122 12 L122 98 L110 98Z" fill="#15191C"/>`);
      g+=part('fans',P.fan(62,55,38,{spin:on(s),frame:false,blades:11,blade:'m-grey',hub:'m-gunmetal'})+P.fan(170,55,38,{spin:on(s),frame:false,blades:11,blade:'m-grey',hub:'m-gunmetal'}));
      g+=part('power',`<rect x="186" y="-2" width="22" height="9" rx="1" fill="#0B0D0F"/>`+[0,1,2,3].map(i=>`<rect x="${188+i*5}" y="0" width="3.4" height="2.6" rx=".5" fill="#2E353B"/><rect x="${188+i*5}" y="3.4" width="3.4" height="2.6" rx=".5" fill="#2E353B"/>`).join('')+
        (s.powered?`<rect x="185" y="-14" width="24" height="12" rx="1.5" fill="#15191C"/>`+[0,1,2,3,4,5].map(i=>`<path d="M${188+i*3.6} -14 v-10" stroke="${i<3?'#F4C21A':'#111'}" stroke-width="1.4"/>`).join(''):''));
      g+=T(117,94,'GEFORCE RTX 5060',{a:'middle',s:5,f:'#76B900',w:700,ls:.6});
      return g; }},
    io:{w:40,h:120,pad:6,draw:s=>{
      let g=`<rect x="0" y="0" width="40" height="120" rx="1" fill="url(#m-metal)" stroke="#6F787F" stroke-width=".5"/><path d="M4 120 h10 v12 h-5Z" fill="url(#m-metal)"/>`;
      g+=part('hdmi',P.hdmi(12,14,{w:16,h:6}));
      g+=part('dp',P.dp(12,30,{w:15,h:6})+P.dp(12,44,{w:15,h:6})+P.dp(12,58,{w:15,h:6}));
      g+=part('vent',P.hvents(8,76,24,36,{n:7,slot:2.6}));
      g+=`<rect x="16" y="2" width="8" height="4" rx="1" fill="#0B0D0F"/>`;
      return g; }},
  },
  defaultView:'face', thumbView:'face', state:{on:false,powered:false},
  viewNames:{face:'Fans',io:'Bracket (outputs)'},
  viewNotes:{face:'It takes two expansion slots. The 8-pin socket on top needs the PCIe cable.',io:'With a graphics card, the monitor plugs in here, not into the motherboard.'},
  actions:[{label:'PCIe power cable',key:'powered',toggle:true}],
  parts:{bracket:{name:'Mounting bracket',info:'Screws to the case so the card cannot sag or come loose.'},
    fingers:{name:'PCIe x16 contacts',info:'Plug into PCI_E1, the top long slot, until the slot latch clicks.'},
    shroud:{name:'Cooler shroud',info:'Directs air from the fans over the heatsink.'},fans:{name:'Fans',info:'Many cards stop their fans when cool; that is normal.'},
    power:{name:'8-pin PCIe power socket',info:'Needs a PCIe (VGA) cable from the PSU. Without it: no picture and the VGA debug LED stays on.'},
    hdmi:{name:'HDMI output',info:'Monitor or TV.'},dp:{name:'DisplayPort outputs',info:'Monitors; supports high refresh rates.'},vent:{name:'Exhaust vent',info:'Some warm air leaves through the bracket.'}}
});

/* ===================== Power supply ===================== */
function psuDef(watts, modular){
  return {
    name:`${watts} W power supply${modular?' (modular)':''}`, cat:'computer',
    views:{
      fan:{w:150,h:140,pad:5,draw:s=>{
        let g=P.shadow(75,141,70,3);
        g+=P.body(0,0,150,140,{rx:3});
        g+=part('fan',P.fan(75,62,50,{spin:on(s),frame:false,grille:true,blades:7}));
        g+=part('label',P.label(20,118,110,16,'',{bg:'#ECEFF1'})+T(75,125,`${watts}W · 80 PLUS ${modular?'GOLD':'BRONZE'}`,{a:'middle',s:5,f:'#1B2A33',w:700})+T(75,131,'AC 100-240V ~ 50/60Hz',{a:'middle',s:3.4,f:'#56656E'}));
        return g; }},
      rear:{w:150,h:86,pad:5,draw:s=>{
        let g=P.shadow(75,87,70,2);
        g+=P.body(0,0,150,86,{rx:3});
        g+=part('grille',`<rect x="8" y="8" width="84" height="70" rx="2" fill="#0B0D0F"/><rect x="8" y="8" width="84" height="70" rx="2" fill="url(#p-hex)" opacity=".9"/>`);
        g+=part('switch',`<rect x="102" y="28" width="12" height="20" rx="2" fill="#0B0D0F"/><rect x="104" y="${s.on||s.switchOn?30:38}" width="8" height="8" rx="1.3" fill="#2D3338"/>`+T(108,56,'I   O',{a:'middle',s:4,f:'#AEB8BF'}));
        g+=part('iec',P.iec(120,30,{w:22,h:16}));
        return g; }},
      cables:{w:150,h:86,pad:5,draw:s=>{
        let g=P.shadow(75,87,70,2);
        g+=P.body(0,0,150,86,{rx:3});
        if(modular){
          const sock=(x,y,w,h,lbl,id)=>part(id,`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="#0B0D0F"/>`+
            Array.from({length:Math.round(w/4.2)*2},(_,i)=>{ const cols=Math.round(w/4.2); const c=i%cols, r=Math.floor(i/cols); return `<rect x="${x+1.1+c*4.2}" y="${y+1.1+r*(h/2)}" width="3" height="${h/2-2}" rx=".4" fill="#2E353B"/>`; }).join('')+T(x+w/2,y+h+5,lbl,{a:'middle',s:3.6,f:'#AEB8BF'}));
          g+=sock(10,12,50,12,'MB (24-pin)','mb')+sock(70,12,17,8,'CPU/PCIe','cpu1')+sock(92,12,17,8,'CPU/PCIe','cpu2')+sock(114,12,17,8,'PCIe','pcie1')+
             sock(10,44,17,8,'SATA/PERIF','sata1')+sock(32,44,17,8,'SATA/PERIF','sata2')+sock(54,44,17,8,'SATA/PERIF','sata3')+sock(92,44,17,8,'12V-2x6','hpwr');
          g+=T(75,78,'Use only the modular cables made for this PSU',{a:'middle',s:3.4,f:'#E3A33A'});
        } else {
          g+=`<rect x="40" y="30" width="70" height="26" rx="5" fill="#15191C"/>`;
          g+=part('bundle',[0,1,2,3,4,5,6].map(i=>P.cableRun(`M${50+i*8} 50 C ${50+i*8} 80 ${40+i*10} 95 ${36+i*12} 110`,{w:4.2})).join(''));
          g+=T(75,24,'Fixed cables (non-modular)',{a:'middle',s:4,f:'#AEB8BF'});
        }
        return g; }},
    },
    defaultView:'rear', thumbView:'fan', state:{on:false},
    viewNames:{fan:'Fan side',rear:'Back (outside)',cables:modular?'Cable sockets':'Cable side'},
    viewNotes:{fan:'Inside a case with a bottom vent, mount the fan facing down.',rear:'This side faces out of the case. Switch at O while you work.',cables:modular?'Plug in only the cables you need. Never mix modular cables from other brands.':'All cables are attached permanently; tuck unused ones out of the airflow.'},
    parts:{fan:{name:'Cooling fan',info:'Pulls air through the PSU. Many PSUs stop the fan at low load.'},label:{name:'Rating label',info:`${watts} W total. 80 PLUS ${modular?'Gold':'Bronze'} tells you the efficiency.`},
      grille:{name:'Exhaust grille',info:'Warm air leaves here. Keep it clear.'},switch:{name:'Power switch (I/O)',info:'O: off. Set it to O whenever you work inside the PC.'},
      iec:{name:'Power socket',info:'Takes the mains cord. Auto-ranging 100–240 V, so no voltage switch.'},
      mb:{name:'Motherboard socket',info:'24-pin main power cable.'},cpu1:{name:'CPU/PCIe socket',info:'8-pin CPU or PCIe cable, depending on the cable used.'},cpu2:{name:'CPU/PCIe socket',info:'Second 8-pin socket.'},
      pcie1:{name:'PCIe socket',info:'Graphics card power.'},sata1:{name:'SATA/peripheral socket',info:'SATA power chains.'},sata2:{name:'SATA/peripheral socket',info:'SATA power chains.'},sata3:{name:'SATA/peripheral socket',info:'SATA power chains.'},
      hpwr:{name:'12V-2x6 socket',info:'Single high-power connector for newer graphics cards.'},bundle:{name:'Fixed cable bundle',info:'24-pin, CPU, PCIe and SATA cables all come out here.'}}
  };
}
A.register('psu-550', psuDef(550,false));
A.register('psu-650', psuDef(650,true));

/* ===================== Intel stock cooler ===================== */
A.register('cooler-intel',{
  name:'Intel stock cooler', cat:'computer',
  views:{
    top:{w:100,h:100,pad:6,draw:s=>{
      let g=P.shadow(50,101,46,2);
      g+=part('pins',[[8,8],[92,8],[8,92],[92,92]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5.5" fill="url(#m-black)" stroke="#0B0D0F"/><circle cx="${x}" cy="${y}" r="2.6" fill="${s.locked===false?'#E39A2B':'#EEF1F3'}"/>`).join(''));
      g+=part('shroud',`<circle cx="50" cy="50" r="46" fill="url(#m-black)"/><circle cx="50" cy="50" r="42" fill="#0C0F11"/>`);
      g+=part('fan',P.fan(50,50,41,{spin:on(s),frame:false,blades:9,blade:'m-gunmetal',hub:'m-black',hubLabel:'#1F5DA8'}));
      g+=part('cable',P.cableRun('M92 50 C 110 50 112 30 104 18',{w:2.2}));
      return g; }},
    base:{w:100,h:100,pad:6,draw:s=>{
      let g=`<circle cx="50" cy="50" r="46" fill="url(#m-alu)"/>`;
      g+=part('fins',Array.from({length:36},(_,i)=>`<path d="M50 50 L${50+44*Math.cos(i*Math.PI/18)} ${50+44*Math.sin(i*Math.PI/18)}" stroke="#8F989F" stroke-width="1"/>`).join(''));
      g+=part('core',`<circle cx="50" cy="50" r="18" fill="url(#m-copper)"/>`);
      if(s.paste!=='none') g+=part('paste',[-7,0,7].map(dx=>`<rect x="${43+dx}" y="36" width="4" height="28" rx="2" fill="#9CA3A8"/>`).join('')+(s.paste==='extra'?`<ellipse cx="50" cy="50" rx="10" ry="8" fill="#B7BEC3"/>`:''));
      g+=[[8,8],[92,8],[8,92],[92,92]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4.5" fill="#2A3035"/>`).join('');
      return g; }},
  },
  defaultView:'top', state:{on:false,paste:'pre'},
  viewNames:{top:'Top',base:'Underside'},
  viewNotes:{top:'Four push pins lock it to the motherboard. Press them diagonally until each clicks.',base:'The grey stripes are pre-applied thermal paste. Do not add more.'},
  parts:{pins:{name:'Push pins',info:'Press in a diagonal order until each clicks. Turn the caps to release them.'},shroud:{name:'Fan shroud',info:'Directs air down through the aluminium fins.'},
    fan:{name:'Fan',info:'Its 4-pin cable goes to CPU_FAN1.'},cable:{name:'Fan cable',info:'4-pin PWM to CPU_FAN1.'},
    fins:{name:'Aluminium fins',info:'Spread heat into the air.'},core:{name:'Copper core',info:'Touches the CPU and pulls heat away quickly.'},
    paste:{name:'Pre-applied thermal paste',info:'Fills the tiny gaps between cooler and CPU. Already the right amount.'}}
});

/* ===================== Tower air cooler ===================== */
A.register('cooler-tower',{
  name:'Tower air cooler (dual tower)', cat:'computer',
  views:{
    side:{w:130,h:160,pad:6,draw:s=>{
      let g=P.shadow(65,158,60,3);
      g+=part('heatpipes',[16,24,32,98,106,114].map(x=>`<rect x="${x}" y="0" width="5" height="10" rx="2.5" fill="url(#m-copper)"/>`).join('')+
        `<path d="M26 132 Q26 148 42 148 H88 Q104 148 104 132" fill="none" stroke="url(#m-copper)" stroke-width="5"/><path d="M34 132 Q34 142 46 142 H84 Q96 142 96 132" fill="none" stroke="url(#m-copper)" stroke-width="4"/>`);
      g+=part('fins',`<rect x="10" y="6" width="44" height="126" rx="2" fill="url(#m-alu)"/><rect x="76" y="6" width="44" height="126" rx="2" fill="url(#m-alu)"/>`+
        Array.from({length:40},(_,i)=>`<path d="M10 ${9+i*3.1} h44 M76 ${9+i*3.1} h44" stroke="#8F989F" stroke-width=".6"/>`).join(''));
      /* fans seen edge-on: one clipped to the front tower, one between the towers */
      g+=part('fans',`<rect x="0" y="14" width="10" height="112" rx="2.5" fill="url(#m-black-h)"/><rect x="56" y="14" width="18" height="112" rx="2.5" fill="url(#m-black-h)"/>`+
        `<path d="M-6 70 h4 m-2 -3 l3 3 l-3 3" stroke="#6FB2FF" stroke-width="1.2" fill="none"/><path d="M124 70 h6 m-2 -3 l3 3 l-3 3" stroke="#FF8A65" stroke-width="1.2" fill="none"/>`+
        (on(s)?`<rect x="57" y="16" width="16" height="108" rx="2" fill="#6FB2FF" fill-opacity=".14" class="pulse"/>`:''));
      g+=part('base',`<rect x="40" y="140" width="50" height="14" rx="1.5" fill="url(#m-metal)"/>`+(s.film!==false?`<rect x="42" y="152" width="46" height="4" rx="1" fill="#E53935" opacity=".9"/>`:''));
      return g; }},
    fan:{w:130,h:130,pad:6,draw:s=>{
      let g=P.shadow(65,131,60,3);
      g+=`<rect x="2" y="2" width="126" height="126" rx="3" fill="url(#m-alu)"/>`+Array.from({length:40},(_,i)=>`<path d="M2 ${5+i*3.1} h126" stroke="#8F989F" stroke-width=".6"/>`).join('');
      g+=part('fans',P.fan(65,65,58,{spin:on(s),blades:9}));
      return g; }},
    base:{w:60,h:60,pad:6,draw:s=>{
      let g=`<rect x="0" y="0" width="60" height="60" rx="3" fill="url(#m-metal)"/>`;
      g+=part('contact',`<rect x="10" y="10" width="40" height="40" rx="2" fill="url(#m-metal-h)"/>`+[14,22,30,38].map(x=>`<rect x="${x}" y="10" width="6" height="40" rx="3" fill="url(#m-copper)" opacity=".85"/>`).join(''));
      if(s.film!==false) g+=part('film',`<rect x="6" y="6" width="48" height="48" rx="2" fill="#E8F0F6" opacity=".92" stroke="#C0CCD5"/>`+T(30,27,'REMOVE',{a:'middle',s:5,f:'#C62828',w:700})+T(30,34,'BEFORE',{a:'middle',s:5,f:'#C62828',w:700})+T(30,41,'INSTALLING',{a:'middle',s:4.4,f:'#C62828',w:700}));
      return g; }},
  },
  defaultView:'side', state:{on:false,film:true},
  viewNames:{side:'Side',fan:'Fan face',base:'Base'},
  viewNotes:{side:'Air flows front (blue) to back (orange). Heavy: it needs a backplate behind the motherboard.',fan:'The front fan clips onto the first fin tower.',base:'The plastic film must come off before mounting, or the CPU overheats.'},
  actions:[{label:'Protective film',key:'film',toggle:true}],
  parts:{heatpipes:{name:'Copper heat pipes',info:'Carry heat from the base up into the fin stacks.'},fins:{name:'Fin stacks',info:'Two towers of aluminium fins release the heat into the air.'},
    fans:{name:'Fans',info:'Blow front to back, towards the rear exhaust fan.'},base:{name:'Base plate',info:'Sits on the CPU with thermal paste in between.'},
    contact:{name:'Contact surface',info:'Must be clean. Apply a pea-size drop of paste to the CPU.'},film:{name:'Protective film',info:'Peel it off before installing. Left on, it blocks the heat completely.'}}
});

/* ===================== 120 mm case fan ===================== */
A.register('fan120',{
  name:'120 mm case fan', cat:'computer',
  views:{
    front:{w:120,h:120,pad:5,draw:s=>{ let g=P.shadow(60,121,56,2); g+=part('fan',P.fan(60,60,56,{spin:on(s),blades:7}));
      g+=part('label',`<circle cx="60" cy="60" r="16" fill="#2A3035"/>`+T(60,62,'12V 0.2A',{a:'middle',s:4.2,f:'#AEB8BF'})); return g; }},
    side:{w:120,h:25,pad:5,draw:s=>{ let g=`<rect width="120" height="25" rx="3" fill="url(#m-black)"/>`;
      g+=part('arrows',`<path d="M50 6 H70 L66 3 M70 6 L66 9" stroke="#E3E8EB" stroke-width="1.2" fill="none"/>`+T(60,15,'AIRFLOW →  ·  ROTATION ↻',{a:'middle',s:3.8,f:'#AEB8BF'}));
      return g; }},
  },
  defaultView:'front', state:{on:false},
  viewNames:{front:'Front',side:'Side'},
  viewNotes:{front:'Air enters on the open side (the label side is the exit).',side:'The arrows moulded on the frame show airflow and spin direction.'},
  parts:{fan:{name:'Fan',info:'4-pin PWM fans let the board control the speed.'},label:{name:'Hub label',info:'Air blows out of the label side.'},arrows:{name:'Direction arrows',info:'Check these before mounting: intake at the front, exhaust at the rear.'}}
});

/* ===================== Monitor ===================== */
A.register('monitor',{
  name:'Monitor', cat:'computer',
  views:{
    front:{w:320,h:240,pad:6,draw:s=>{
      let g=P.shadow(160,238,90,4);
      g+=part('stand',`<path d="M140 180 H180 L186 222 H134Z" fill="url(#m-grey)"/><rect x="104" y="220" width="112" height="10" rx="5" fill="url(#m-black)"/>`);
      g+=part('bezel',`<rect x="0" y="0" width="320" height="190" rx="6" fill="url(#m-black)"/>`);
      g+=part('screen',`<rect x="6" y="6" width="308" height="170" rx="1.5" fill="${on(s)?(s.screen||'url(#m-glass-on)'):'url(#m-glass)'}"/>`+`<path d="M6 6 L150 6 L70 176 L6 176Z" fill="#fff" opacity=".05"/>`);
      g+=part('pwr',P.led(300,183,{r:1.6,lit:on(s),color:'w'})+`<rect x="286" y="181" width="6" height="4" rx="1" fill="#2E353B"/>`);
      return g; }},
    back:{w:320,h:240,pad:6,draw:s=>{
      let g=P.shadow(160,238,90,4);
      g+=`<rect x="0" y="0" width="320" height="190" rx="6" fill="url(#m-black)"/><path d="M60 40 H260 Q280 40 280 60 V160 H40 V60 Q40 40 60 40Z" fill="url(#m-gunmetal)" opacity=".7"/>`;
      g+=part('vesa',[[140,80],[180,80],[140,120],[180,120]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#0B0D0F"/>`).join(''));
      g+=part('stand',`<path d="M140 100 H180 L186 222 H134Z" fill="url(#m-grey)"/><rect x="104" y="220" width="112" height="10" rx="5" fill="url(#m-black)"/>`);
      g+=`<rect x="200" y="148" width="92" height="22" rx="3" fill="#0B0D0F"/>`;
      g+=part('hdmi',P.hdmi(206,155))+part('dp',P.dp(226,155))+part('dcin',P.dc(260,160,{r:4}))+part('audio',P.audio(278,160,{r:2.6,color:'#6ABF4B'}));
      return g; }},
  },
  defaultView:'front', state:{on:false},
  viewNames:{front:'Front',back:'Back'},
  viewNotes:{front:'“No signal” means the monitor is on but gets no picture from the selected input.',back:'Match the cable to the PC output: HDMI to HDMI, DisplayPort to DisplayPort.'},
  parts:{bezel:{name:'Bezel',info:'Frame around the panel.'},screen:{name:'Panel',info:'Shows “No signal” when the input has no picture.'},pwr:{name:'Power button and light',info:'White: on. Blinking or amber: standby, no signal.'},
    stand:{name:'Stand',info:'Adjusts the tilt. Removable for a wall or arm mount.'},vesa:{name:'VESA mount holes',info:'100 × 100 mm pattern for monitor arms.'},
    hdmi:{name:'HDMI input',info:'Cable from the PC or graphics card.'},dp:{name:'DisplayPort input',info:'Alternative video input.'},dcin:{name:'Power input',info:'Adapter or internal supply.'},audio:{name:'Audio out',info:'Speakers or headphones through the monitor.'}}
});

/* ===================== USB flash drive ===================== */
A.register('usbdrive',{
  name:'USB flash drive', cat:'computer',
  views:{
    top:{w:60,h:20,pad:5,draw:s=>{
      let g=P.shadow(30,21,27,1.2);
      g+=part('plug',`<rect x="0" y="4" width="14" height="12" rx=".8" fill="url(#m-metal)" stroke="#6F787F" stroke-width=".3"/><rect x="2.2" y="7" width="3" height="2" fill="#15191C"/><rect x="2.2" y="11" width="3" height="2" fill="#15191C"/>`);
      g+=part('body',`<rect x="13" y="1" width="46" height="18" rx="4" fill="url(#m-blue)"/><rect x="15" y="2.5" width="42" height="5" rx="2.5" fill="#fff" opacity=".25"/>`+
        T(38,12.4,s.label||(s.content==='win'?'WIN 11':s.content==='ubuntu'?'UBUNTU':'32GB'),{a:'middle',s:4.2,f:'#EAF4FF',w:700})+`<circle cx="54" cy="10" r="2.2" fill="#1A3D66"/>`);
      g+=part('led',P.led(20,15.5,{r:1,lit:on(s),blink:on(s)&&s.busy,color:'b',fast:true}));
      return g; }},
  },
  defaultView:'top', state:{on:false,busy:true},
  viewNotes:{top:'At least 8 GB for a Windows 11 installer. Writing an image erases everything on it.'},
  parts:{plug:{name:'USB-A plug',info:'USB 3.0 plugs have blue inserts; they are faster in blue ports.'},body:{name:'Body',info:'Label your installer drives.'},led:{name:'Activity light',info:'Flashes while data is read or written. Do not unplug while it flashes.'}}
});
})();
