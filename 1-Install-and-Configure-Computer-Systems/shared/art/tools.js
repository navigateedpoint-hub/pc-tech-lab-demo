/* Cables, connectors and tools, shaded style. */
(function(){
const A=window.Art, P=A.P, T=P.text, part=P.part;
const on=s=>!!s.on;
const WIRE={y:'#F4C21A',b:'#15191C',r:'#D8332A',o:'#F08A24',g:'#2E9E4F',bl:'#2E6FD8',w:'#EEF1F3',p:'#8E5AC8',gr:'#8A949B'};
/* a bundle of coloured wires rising from a plug */
function wires(x0,y0,cols,pitch,len,o={}){
  return cols.map((c,i)=>{ const x=x0+i*pitch; const bend=o.bend||0;
    return `<path d="M${x} ${y0} C ${x} ${y0-len*.4} ${x+bend} ${y0-len*.7} ${x+bend} ${y0-len}" stroke="#0B0D0F" stroke-width="${o.w?o.w+.8:2.8}" fill="none" stroke-linecap="round"/>`+
      `<path d="M${x} ${y0} C ${x} ${y0-len*.4} ${x+bend} ${y0-len*.7} ${x+bend} ${y0-len}" stroke="${WIRE[c]||c}" stroke-width="${o.w||2}" fill="none" stroke-linecap="round"/>`; }).join('');
}
/* power plug face: rows × cols of sockets with square/rounded keys */
function plugFace(x,y,cols,rows,o={}){
  const pw=4.2, w=cols*pw+2, h=rows*pw+2;
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="#15191C" stroke="#2E353B" stroke-width=".5"/>`;
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){ const rounded=(c+r)%3===0; s+=`<rect x="${x+1.3+c*pw}" y="${y+1.3+r*pw}" width="3" height="3" rx="${rounded?1.3:.35}" fill="#050607"/>`; }
  if(o.clip) s+=`<rect x="${x+w/2-3}" y="${y-3.2}" width="6" height="3.6" rx=".8" fill="#15191C"/>`;
  if(o.label) s+=T(x+w/2,y+h+5,o.label,{a:'middle',s:3.4,f:'#56616A',w:700});
  return s;
}

/* ===================== power cables ===================== */
A.register('cb-atx24',{ name:'24-pin ATX power cable', cat:'cable',
  views:{plug:{w:70,h:90,pad:5,draw:s=>{ let g=P.shadow(35,86,28,2);
    g+=part('wires',wires(10,50,['o','o','b','r','b','r','b','gr','p','y','y','o'],4.2,48,{w:1.9}));
    g+=part('plug20',`<rect x="6" y="50" width="44" height="30" rx="2" fill="url(#m-black)"/>`+plugFace(8,60,10,2,{clip:true}));
    g+=part('plug4',`<rect x="50" y="50" width="12" height="30" rx="2" fill="url(#m-black)"/>`+plugFace(51.5,60,2,2));
    g+=T(34,56,'20 + 4',{a:'middle',s:3.6,f:'#AEB8BF'});
    return g; }}},
  power:false, viewNotes:{plug:'Clip the 4-pin part to the 20-pin part, then push into ATX_PWR1 until the clip clicks.'},
  parts:{wires:{name:'Wires',info:'Yellow 12 V, red 5 V, orange 3.3 V, black ground.'},plug20:{name:'20-pin section with clip',info:'The clip must hook over the tab on the socket.'},plug4:{name:'4-pin extension',info:'Slides onto the 20-pin section for 24-pin boards.'}}
});
A.register('cb-eps8',{ name:'8-pin CPU power cable (4+4)', cat:'cable',
  views:{plug:{w:50,h:80,pad:5,draw:s=>{ let g=P.shadow(25,76,20,2);
    g+=part('wires',wires(10,42,['y','y','y','y'],4.2,40)+wires(10,56,[],0,0));
    g+=part('plug',`<rect x="6" y="42" width="38" height="24" rx="2" fill="url(#m-black)"/><path d="M25 42 v24" stroke="#050607" stroke-width=".8"/>`+plugFace(7.5,50,4,2,{clip:true})+plugFace(25.5,50,4,2).replace('<rect','<rect opacity="1"'));
    g+=part('label',T(25,47,'CPU',{a:'middle',s:4.2,f:'#FFD54A',w:700}));
    return g; }}},
  power:false, viewNotes:{plug:'Look for the “CPU” print. It splits into 4+4 for boards with a 4-pin socket.'},
  parts:{wires:{name:'Wires',info:'12 V (yellow) and ground (black) only.'},plug:{name:'4+4 plug',info:'Goes into CPU_PWR1 at the top-left of the board.'},label:{name:'CPU marking',info:'Tells it apart from the PCIe cable, which looks similar but is wired differently.'}}
});
A.register('cb-pcie8',{ name:'8-pin PCIe power cable (6+2)', cat:'cable',
  views:{plug:{w:50,h:80,pad:5,draw:s=>{ let g=P.shadow(25,76,20,2);
    g+=part('wires',wires(10,42,['y','y','y','b'],4.2,40));
    g+=part('plug',`<rect x="6" y="42" width="28" height="24" rx="2" fill="url(#m-black)"/><rect x="35" y="42" width="10" height="24" rx="2" fill="url(#m-black)"/>`+plugFace(7.5,50,6,2,{clip:true}).replace(/width="26/,'width="26')+plugFace(36,50,2,2));
    g+=part('label',T(22,47,'PCIe',{a:'middle',s:4.2,f:'#FFD54A',w:700}));
    return g; }}},
  power:false, viewNotes:{plug:'Marked PCIe or VGA. It splits into 6+2 for cards with a 6-pin socket.'},
  parts:{wires:{name:'Wires',info:'12 V and ground.'},plug:{name:'6+2 plug',info:'Goes into the graphics card. Up to 150 W per connector.'},label:{name:'PCIe marking',info:'Never plug it into CPU_PWR1.'}}
});
A.register('cb-sata-power',{ name:'SATA power cable', cat:'cable',
  views:{plug:{w:70,h:60,pad:5,draw:s=>{ let g=P.shadow(35,56,30,2);
    g+=part('wires',wires(16,30,['y','b','r','b','o'],4,28,{bend:6}));
    g+=part('plug',`<path d="M6 30 h56 v14 h-50 v6 h-6Z" fill="url(#m-black)"/><path d="M10 36 h48 v4 h-44 v3 h-4Z" fill="#050607"/>`+T(34,55,'L-shaped key',{a:'middle',s:3.6,f:'#56616A'}));
    return g; }}},
  power:false, viewNotes:{plug:'15 contacts. The L shape means it only fits one way round.'},
  parts:{wires:{name:'Wires',info:'Yellow 12 V, red 5 V, orange 3.3 V, black ground.'},plug:{name:'SATA power plug',info:'Wider than the data plug. Push straight in; it has no latch.'}}
});
A.register('cb-sata-data',{ name:'SATA data cable', cat:'cable',
  views:{plug:{w:80,h:50,pad:5,draw:s=>{ let g=P.shadow(40,46,34,2);
    g+=part('cable',P.cableRun('M8 22 C 30 22 50 30 72 30',{w:5,color:'#C62828',dark:'#7A1510'}));
    g+=part('plug',`<path d="M0 12 h22 v10 h-18 v4 h-4Z" fill="url(#m-red)"/><path d="M3 16 h16 v3 h-13 v2 h-3Z" fill="#050607"/><rect x="4" y="10" width="14" height="2" rx=".5" fill="url(#m-metal)"/>`);
    g+=part('plug2',`<path d="M66 22 h14 v14 h-14Z" fill="url(#m-red)"/>`+T(40,46,'7-pin L connector with metal latch',{a:'middle',s:3.4,f:'#56616A'}));
    return g; }}},
  power:false, viewNotes:{plug:'Narrow 7-pin connector. Press the metal latch to unplug it.'},
  parts:{cable:{name:'Flat data cable',info:'Connects a SATA drive to a SATA port.'},plug:{name:'Drive end with latch',info:'The metal latch stops it working loose.'},plug2:{name:'Motherboard end',info:'Goes into SATA1, SATA2 and so on.'}}
});
A.register('cb-fan-4pin',{ name:'4-pin fan connector', cat:'cable',
  views:{plug:{w:40,h:50,pad:5,draw:s=>{ let g=P.shadow(20,46,14,1.5);
    g+=part('wires',wires(12,26,['b','y','g','bl'],3,24,{w:1.5}));
    g+=part('plug',`<rect x="8" y="26" width="16" height="10" rx="1" fill="#EEF1F3" stroke="#AEB6BC" stroke-width=".4"/><rect x="8" y="24" width="3" height="12" rx=".5" fill="#DDE3E7"/>`+[0,1,2,3].map(i=>`<rect x="${10+i*3.3}" y="30" width="2" height="3" fill="#15191C"/>`).join(''));
    g+=T(20,44,'GND · 12V · TACH · PWM',{a:'middle',s:2.8,f:'#56616A'});
    return g; }}},
  power:false, viewNotes:{plug:'The ridge on one side matches the guide on the header, so it fits one way.'},
  parts:{wires:{name:'Wires',info:'Ground, 12 V, speed signal (tach) and speed control (PWM).'},plug:{name:'Plug with guide ridge',info:'Fits 3-pin headers too, but then speed control is by voltage only.'}}
});
A.register('cb-front-panel',{ name:'Front panel connectors', cat:'cable',
  views:{plug:{w:110,h:60,pad:5,draw:s=>{ let g=P.shadow(55,56,48,2);
    const conn=(x,lbl,cols,id,info)=>part(id,`<rect x="${x}" y="20" width="${cols*3+2}" height="8" rx=".8" fill="#15191C"/>`+
      Array.from({length:cols},(_,i)=>`<rect x="${x+1.2+i*3}" y="23" width="1.8" height="1.8" fill="#050607"/>`).join('')+
      wires(x+2.2,20,info,3,18,{w:1.3})+T(x+cols*1.5+1,36,lbl,{a:'middle',s:3,f:'#3B454C',w:700}));
    g+=conn(4,'POWER SW',2,'pwr',['w','b'])+conn(26,'RESET SW',2,'rst',['w','bl'])+conn(48,'POWER LED+/−',2,'pled',['g','w'])+conn(72,'HDD LED+/−',2,'hdd',['r','w']);
    g+=T(55,50,'Coloured wire is + on LEDs',{a:'middle',s:3.4,f:'#56616A'});
    return g; }}},
  power:false, viewNotes:{plug:'Each tiny plug is printed with its name. Switches have no polarity; LEDs do.'},
  parts:{pwr:{name:'POWER SW',info:'Case power button. Goes on JFP1 pins 6 and 8.'},rst:{name:'RESET SW',info:'Case reset button. Pins 5 and 7.'},pled:{name:'POWER LED + / −',info:'Pins 2 (+) and 4 (−). Backwards means the light stays off.'},hdd:{name:'HDD LED + / −',info:'Pins 1 (+) and 3 (−).'}}
});
A.register('cb-usb3-header',{ name:'Front USB 3.0 cable (19-pin)', cat:'cable',
  views:{plug:{w:50,h:60,pad:5,draw:s=>{ let g=P.shadow(25,56,20,2);
    g+=part('cable',P.cableRun('M25 30 C 25 18 22 10 22 0',{w:8,color:'#1E4E8C',dark:'#0E2A50'}));
    g+=part('plug',`<rect x="6" y="30" width="38" height="14" rx="1.2" fill="url(#m-port-blue)"/>`+
      Array.from({length:20},(_,i)=>{ const c=i%10, r=Math.floor(i/10); if(i===10) return `<rect x="${8.5+c*3.3}" y="${33+r*4.6}" width="2.2" height="2.2" fill="#8FB8E6"/>`; return `<rect x="${8.5+c*3.3}" y="${33+r*4.6}" width="2.2" height="2.2" fill="#07182E"/>`; }).join('')+
      `<rect x="21" y="44" width="8" height="2" fill="#1A4A85"/>`);
    g+=T(25,55,'One hole blocked = key',{a:'middle',s:3.3,f:'#56616A'});
    return g; }}},
  power:false, viewNotes:{plug:'Line up the blocked hole with the missing pin on JUSB3, then press straight in.'},
  parts:{cable:{name:'Thick shielded cable',info:'Carries two USB 3.0 ports from the front of the case.'},plug:{name:'19-pin plug',info:'The blocked hole is the key. Forcing it bends the thin pins.'}}
});
A.register('cb-hd-audio',{ name:'Front HD AUDIO cable', cat:'cable',
  views:{plug:{w:40,h:60,pad:5,draw:s=>{ let g=P.shadow(20,56,16,2);
    g+=part('wires',wires(12,30,['b','r','g','w','o'],3,28,{w:1.2}));
    g+=part('plug',`<rect x="8" y="30" width="22" height="10" rx="1" fill="url(#m-black)"/>`+Array.from({length:10},(_,i)=>{ const c=i%5,r=Math.floor(i/5); return `<rect x="${9.6+c*4}" y="${31.6+r*4}" width="2.2" height="2.2" fill="${i===8?'#3A424A':'#050607'}"/>`; }).join(''));
    g+=part('label',T(19,48,'HD AUDIO',{a:'middle',s:3.6,f:'#3B454C',w:700}));
    return g; }}},
  power:false, viewNotes:{plug:'Use the plug marked HD AUDIO, not AC’97 (for very old boards).'},
  parts:{wires:{name:'Wires',info:'Headphone and microphone signals.'},plug:{name:'9-pin plug',info:'Goes on JAUD1 at the bottom-left of the board.'},label:{name:'HD AUDIO marking',info:'Some cases also include an AC’97 plug; leave that one unused.'}}
});
A.register('cb-hdmi',{ name:'HDMI cable', cat:'cable',
  views:{plug:{w:70,h:40,pad:5,draw:s=>{ let g=P.shadow(35,36,30,2);
    g+=part('cable',P.cableRun('M30 20 C 45 20 55 26 70 26',{w:5}));
    g+=part('plug',`<rect x="12" y="11" width="20" height="18" rx="3" fill="url(#m-black)"/>`+P.hdmi(0,15.5,{w:13,h:9}));
    return g; }}},
  power:false, viewNotes:{plug:'The plug is wider at the top, so it only fits one way.'},
  parts:{cable:{name:'Cable',info:'Carries video and audio.'},plug:{name:'HDMI plug',info:'With a graphics card, plug it into the card, not the motherboard.'}}
});

/* ===================== network cable coils ===================== */
function coil(name,col,dark,print,info){
  return { name, cat:'cable', views:{coil:{w:120,h:90,pad:5,draw:s=>{
    let g=P.shadow(60,86,50,3);
    g+=part('coil',[0,1,2,3,4].map(i=>`<ellipse cx="${56+i*1.5}" cy="${44+i*.8}" rx="${40-i*3}" ry="${30-i*2.4}" fill="none" stroke="${dark}" stroke-width="7.2"/><ellipse cx="${56+i*1.5}" cy="${44+i*.8}" rx="${40-i*3}" ry="${30-i*2.4}" fill="none" stroke="${col}" stroke-width="6"/><ellipse cx="${56+i*1.5}" cy="${43+i*.8}" rx="${40-i*3}" ry="${30-i*2.4}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.6"/>`).join(''));
    g+=part('plug',`<path d="M92 50 C 104 54 108 62 110 70" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round"/><rect x="104" y="68" width="12" height="14" rx="1.5" fill="url(#m-clear)" stroke="#9DB3C0" stroke-width=".6"/>`+
      [0,1,2,3,4,5,6,7].map(i=>`<rect x="${105.3+i*1.2}" y="70" width=".7" height="4" fill="url(#m-gold)"/>`).join(''));
    g+=part('print',`<rect x="14" y="80" width="80" height="8" rx="2" fill="#FFFFFF" opacity=".75"/>`+T(54,85.6,print,{a:'middle',s:3.4,f:'#2A3035',w:700}));
    return g; }}}, power:false,
    viewNotes:{coil:info},
    parts:{coil:{name:'Cable',info},plug:{name:'RJ45 plug',info:'8 gold contacts. The clip locks it into the port.'},print:{name:'Jacket print',info:'Always read it: category, type and rating are printed every metre.'}} };
}
A.register('cb-cat5e',coil('Cat5e patch cable','#9AA4AB','#5F6A72','CAT5E U/UTP 24AWG · 1 Gbps','1 Gbps up to 100 m. Fine for most desks.'));
A.register('cb-cat6',coil('Cat6 cable','#2E6FD8','#1A4586','CAT6 U/UTP 23AWG · CMR','1 Gbps to 100 m; 10 Gbps only up to about 55 m.'));
A.register('cb-cat6a',coil('Cat6A cable','#2E9E4F','#1A5E30','CAT6A F/UTP 23AWG · 10G','10 Gbps for the full 100 m. Thicker and stiffer.'));
A.register('cb-outdoor',coil('Outdoor Cat6 (UV, gel-filled)','#1E2327','#050607','OUTDOOR CAT6 · UV · GEL','Black UV-resistant jacket for runs between buildings and to outdoor cameras.'));
A.register('cb-fiber-lc',{ name:'Fiber patch cable (LC duplex)', cat:'cable',
  views:{coil:{w:120,h:90,pad:5,draw:s=>{ let g=P.shadow(60,86,50,3);
    g+=part('coil',[0,1,2].map(i=>`<ellipse cx="${56+i*2}" cy="${42+i}" rx="${40-i*4}" ry="${28-i*3}" fill="none" stroke="#B88E00" stroke-width="3.6"/><ellipse cx="${56+i*2}" cy="${42+i}" rx="${40-i*4}" ry="${28-i*3}" fill="none" stroke="#F4C21A" stroke-width="2.6"/>`).join(''));
    g+=part('lc',`<path d="M92 48 C 102 52 104 60 106 66" fill="none" stroke="#F4C21A" stroke-width="3"/><rect x="99" y="64" width="16" height="10" rx="1.5" fill="url(#m-blue)"/><rect x="101" y="74" width="4" height="7" fill="#EEF1F3"/><rect x="109" y="74" width="4" height="7" fill="#EEF1F3"/>`);
    g+=T(54,86,'OS2 single-mode · LC/UPC duplex',{a:'middle',s:3.6,f:'#3B454C',w:700});
    return g; }}}, power:false,
  viewNotes:{coil:'Yellow jacket means single-mode. Needs SFP ports or media converters at both ends.'},
  parts:{coil:{name:'Single-mode fiber',info:'Light instead of electricity: kilometres of range and no interference. Never look into the end.'},lc:{name:'LC duplex connector',info:'One fiber sends, the other receives.'}}
});
A.register('cb-utp-roll',{ name:'Box of Cat6 cable (305 m)', cat:'cable',
  views:{box:{w:120,h:120,pad:5,draw:s=>{ let g=P.shadow(60,118,52,3);
    g+=part('box',`<path d="M10 20 L60 6 L110 20 L110 104 L60 116 L10 104Z" fill="#C6A57A"/><path d="M10 20 L60 34 L110 20 L60 6Z" fill="#DDBE93"/><path d="M60 34 L60 116" stroke="#A88659" stroke-width="1"/><path d="M60 34 L110 20 L110 104 L60 116Z" fill="#B8966A"/>`+
      T(35,62,'CAT6',{a:'middle',s:9,f:'#2E4A6B',w:700})+T(35,72,'U/UTP · 23AWG',{a:'middle',s:4.2,f:'#3B3528'})+T(35,79,'305 m · SOLID CU',{a:'middle',s:4.2,f:'#3B3528'}));
    g+=part('pull',`<circle cx="85" cy="60" r="7" fill="#8C6B42"/>`+P.cableRun('M85 60 C 95 50 110 46 118 30',{w:4,color:'#2E6FD8',dark:'#1A4586'}));
    return g; }}}, power:false,
  viewNotes:{box:'Pull the cable straight out of the hole: the box stops it from kinking.'},
  parts:{box:{name:'Pull box',info:'Solid copper, not CCA. Check the print: “CU” or “solid copper”.'},pull:{name:'Pull-out hole',info:'Never pull it into a loop; kinks change the pair spacing and hurt performance.'}}
});

/* ===================== RJ45 plug (for crimping) ===================== */
A.register('rj45-plug',{ name:'RJ45 plug', cat:'cable',
  views:{
    top:{w:60,h:44,pad:4,draw:s=>{
      const order=s.order||['wo','o','wg','b','wb','g','wbr','br'];
      const C={wo:['#fff','#F08A24'],o:['#F08A24','#F08A24'],wg:['#fff','#2E9E4F'],g:['#2E9E4F','#2E9E4F'],wb:['#fff','#2E6FD8'],b:['#2E6FD8','#2E6FD8'],wbr:['#fff','#7B4A2A'],br:['#7B4A2A','#7B4A2A']};
      let g=P.shadow(30,43,26,1.5);
      g+=part('jacket',`<rect x="36" y="12" width="26" height="20" rx="3" fill="url(#m-cable-blue)"/>`);
      g+=part('wires',order.map((c,i)=>{ const y=13+i*2.3, len=s.short?16:26; const [a,b]=C[c]||C.wo; return `<rect x="${36-len}" y="${y}" width="${len+4}" height="1.8" rx=".9" fill="${a}"/>`+(a!==b?Array.from({length:6},(_,k)=>`<rect x="${37-len+k*4.6}" y="${y}" width="2" height="1.8" fill="${b}"/>`).join(''):''); }).join(''));
      g+=part('body',`<path d="M2 8 H40 V36 H2 Z" fill="url(#m-clear)" stroke="#8FA6B4" stroke-width=".6"/>`+
        (s.crimped?`<path d="M26 10 v24" stroke="#8FA6B4" stroke-width="1.4"/>`:''));
      g+=part('contacts',[0,1,2,3,4,5,6,7].map(i=>`<rect x="3" y="${13+i*2.3}" width="${s.crimped?5.5:4}" height="1.4" fill="url(#m-gold)"/>`).join(''));
      g+=part('pin1',T(0,14.6,'1',{a:'end',s:3.4,f:'#56616A',w:700})+T(0,31.4,'8',{a:'end',s:3.4,f:'#56616A',w:700}));
      return g; }},
    side:{w:60,h:30,pad:4,draw:s=>{
      let g=P.shadow(30,29,26,1.2);
      g+=part('jacket',`<rect x="36" y="10" width="26" height="12" rx="3" fill="url(#m-cable-blue)"/>`);
      g+=part('body',`<path d="M2 6 H40 V24 H2Z" fill="url(#m-clear)" stroke="#8FA6B4" stroke-width=".6"/>`);
      g+=part('clip',`<path d="M8 24 L30 24 L34 30 L10 30Z" fill="url(#m-clear)" stroke="#8FA6B4" stroke-width=".6"/>`);
      g+=part('strain',`<path d="M26 6 v${s.crimped?8:3}" stroke="#8FA6B4" stroke-width="2"/>`);
      return g; }},
  },
  defaultView:'top', power:false, state:{crimped:false},
  viewNames:{top:'Top (clip down)',side:'Side'},
  viewNotes:{top:'Clip facing away from you and pin 1 on the left: the T568B order reads white-orange first.',side:'The strain relief bar presses onto the jacket when crimped.'},
  actions:[{label:'Crimp',key:'crimped',toggle:true}],
  parts:{body:{name:'Clear plug body',info:'You can check the colour order through it before crimping.'},contacts:{name:'Gold contacts',info:'Crimping pushes them down through the insulation into the copper.'},
    wires:{name:'The eight wires',info:'Each must reach the front of the plug.'},jacket:{name:'Jacket',info:'Must sit inside the plug, under the strain relief.'},
    clip:{name:'Locking clip',info:'Holds the plug in the port. Boots protect it from snapping.'},strain:{name:'Strain relief',info:'Grips the jacket so the wires do not take the pull.'},pin1:{name:'Pin numbers',info:'Pin 1 on the left with the clip away from you.'}}
});

/* ===================== tools ===================== */
A.register('tool-crimper',{ name:'RJ45 crimping tool', cat:'tool',
  views:{side:{w:180,h:90,pad:5,draw:s=>{ const sq=s.squeezed?1:0;
    let g=P.shadow(90,86,80,3);
    g+=part('handle-top',`<g transform="rotate(${-8+sq*6} 60 40)"><path d="M60 34 L172 18 Q178 18 178 24 L176 28 L62 44Z" fill="url(#m-red)"/></g>`);
    g+=part('handle-bottom',`<g transform="rotate(${8-sq*6} 60 44)"><path d="M60 44 L176 58 Q180 62 176 66 L60 52Z" fill="url(#m-red)"/></g>`);
    g+=part('head',`<path d="M4 28 Q4 20 12 20 H64 V60 H12 Q4 60 4 52Z" fill="url(#m-gunmetal)"/>`+
      `<rect x="12" y="34" width="16" height="12" rx="1" fill="#0B0D0F"/><rect x="32" y="36" width="12" height="9" rx="1" fill="#0B0D0F"/>`+T(20,56,'8P',{a:'middle',s:4.5,f:'#C9D2D8',w:700})+T(38,56,'6P',{a:'middle',s:4.5,f:'#C9D2D8',w:700}));
    g+=part('cutter',`<rect x="48" y="24" width="12" height="4" fill="url(#m-metal)"/><rect x="48" y="30" width="12" height="3" fill="#0B0D0F"/>`);
    g+=part('ratchet',`<circle cx="62" cy="42" r="5" fill="url(#m-screw)"/>`);
    return g; }}}, power:false, state:{squeezed:false},
  actions:[{label:'Squeeze',key:'squeezed',toggle:true}],
  viewNotes:{side:'Squeeze until the ratchet releases. A half squeeze leaves loose contacts.'},
  parts:{head:{name:'Crimp die (8P and 6P)',info:'8P for RJ45, 6P for RJ11 phone plugs.'},cutter:{name:'Cutter and stripper blades',info:'Square cut and a light score for the jacket.'},
    ratchet:{name:'Ratchet',info:'Will not open until the crimp is complete.'},'handle-top':{name:'Handle',info:'Squeeze firmly.'},'handle-bottom':{name:'Handle',info:'Squeeze firmly.'}}
});
A.register('tool-cable-tester',{ name:'RJ45 cable tester', cat:'tool',
  views:{front:{w:170,h:90,pad:5,draw:s=>{
    const unit=(x,lbl,id,remote)=>{ let u=`<rect x="${x}" y="6" width="74" height="78" rx="6" fill="url(#m-black)"/><rect x="${x+6}" y="12" width="62" height="18" rx="2" fill="#15191C"/>`;
      for(let i=0;i<8;i++){ const lit=on(s)&&(s.step==null?true:((s.map&&remote?s.map[s.step]===i:s.step===i))); u+=P.led(x+10+i*7.5,21,{r:2.3,lit,color:(s.fault&&remote&&lit)?'a':'g'})+T(x+10+i*7.5,34,String(i+1),{a:'middle',s:3.6,f:'#AEB8BF'}); }
      u+=P.led(x+64,44,{r:2,lit:on(s),color:'g'})+T(x+64,51,'G',{a:'middle',s:3.4,f:'#AEB8BF'});
      u+=P.rj45(x+22,54,{w:16,h:14})+T(x+37,80,lbl,{a:'middle',s:4.2,f:'#C9D2D8',w:700});
      if(!remote) u+=`<rect x="${x+48}" y="58" width="16" height="8" rx="2" fill="url(#m-red)"/>`+T(x+56,74,'ON/AUTO',{a:'middle',s:3,f:'#AEB8BF'});
      return part(id,u); };
    return P.shadow(85,88,80,2)+unit(0,'MASTER','master',false)+unit(90,'REMOTE','remote',true); }}},
  state:{on:false},
  viewNotes:{front:'Plug one end into each unit. The lights step 1 to 8 on both units together on a good straight-through cable.'},
  parts:{master:{name:'Master unit',info:'Sends a signal down each wire in turn.'},remote:{name:'Remote unit',info:'Shows which pin each signal arrives on. Out of step means crossed wires; a dark light is an open.'}}
});
A.register('tool-stripper',{ name:'Cable stripper', cat:'tool',
  views:{side:{w:110,h:60,pad:5,draw:s=>{ let g=P.shadow(55,56,48,2);
    g+=part('body',`<path d="M6 16 Q6 8 14 8 H96 Q104 8 104 16 V40 Q104 48 96 48 H14 Q6 48 6 40Z" fill="url(#m-orange)"/>`);
    g+=part('blade',`<circle cx="30" cy="28" r="10" fill="#15191C"/><circle cx="30" cy="28" r="4" fill="url(#m-metal)"/><path d="M26 22 L34 22" stroke="url(#m-metal)" stroke-width="1.4"/>`);
    g+=part('grip',P.hvents(50,14,46,28,{n:6,slot:2,col:'#B04E10'}));
    return g; }}}, power:false,
  viewNotes:{side:'Rotate it once around the cable, then pull the jacket off. The blade depth is set to miss the wires.'},
  parts:{body:{name:'Body',info:'Clamps around the cable.'},blade:{name:'Adjustable blade',info:'Scores only the jacket. A knife would nick the conductors.'},grip:{name:'Grip',info:'Rotate once, then slide off.'}}
});
A.register('tool-esd-strap',{ name:'Anti-static wrist strap', cat:'tool',
  views:{top:{w:130,h:70,pad:5,draw:s=>{ let g=P.shadow(65,66,56,2);
    g+=part('band',`<ellipse cx="30" cy="34" rx="24" ry="18" fill="none" stroke="#1E5BD8" stroke-width="7"/><ellipse cx="30" cy="34" rx="24" ry="18" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2" transform="translate(0 -1.5)"/><rect x="48" y="28" width="12" height="12" rx="2" fill="url(#m-metal)"/>`);
    g+=part('cord',`<path d="M60 34 ${Array.from({length:9},(_,i)=>`q 3 ${i%2?8:-8} 6 0`).join(' ')}" fill="none" stroke="#1B1F22" stroke-width="2.2"/>`);
    g+=part('clip',`<path d="M114 28 L128 24 L128 30 L116 34Z M114 38 L128 44 L128 38 L116 34Z" fill="url(#m-metal)" stroke="#6F787F" stroke-width=".5"/>`);
    return g; }}}, power:false,
  viewNotes:{top:'Band on the wrist, crocodile clip on bare metal of the case, with the PC unplugged.'},
  parts:{band:{name:'Wrist band',info:'Must touch skin. It contains a 1 MΩ resistor for safety.'},cord:{name:'Coiled cord',info:'Lets you move while staying grounded.'},clip:{name:'Crocodile clip',info:'Clip to unpainted metal on the case.'}}
});
A.register('tool-screwdriver',{ name:'Phillips screwdriver (#2)', cat:'tool',
  views:{side:{w:170,h:40,pad:5,draw:s=>{ let g=P.shadow(85,36,76,2);
    g+=part('handle',`<rect x="2" y="8" width="70" height="22" rx="10" fill="url(#m-red)"/>`+P.hvents(12,12,52,14,{n:4,slot:1.6,col:'#8E1E16'}));
    g+=part('shaft',`<rect x="70" y="16" width="86" height="6" rx="1" fill="url(#m-metal)"/>`);
    g+=part('tip',`<path d="M156 16 L168 19 L156 22Z" fill="url(#m-metal)"/><path d="M158 19 L168 19" stroke="#6F787F" stroke-width=".8"/>`);
    return g; }}}, power:false,
  viewNotes:{side:'A magnetic #2 Phillips fits almost every screw in a PC.'},
  parts:{handle:{name:'Handle',info:'Insulated grip.'},shaft:{name:'Shaft',info:'Magnetised to hold small screws.'},tip:{name:'#2 Phillips tip',info:'Use the right size to avoid stripping screw heads.'}}
});
A.register('tool-thermal-paste',{ name:'Thermal paste syringe', cat:'tool',
  views:{side:{w:120,h:34,pad:5,draw:s=>{ let g=P.shadow(60,31,52,2);
    g+=part('barrel',`<rect x="20" y="8" width="70" height="16" rx="4" fill="url(#m-clear)" stroke="#9DB3C0" stroke-width=".6"/><rect x="22" y="10" width="${s.used?30:62}" height="12" rx="3" fill="#9CA3A8"/>`+T(55,19,'THERMAL PASTE',{a:'middle',s:4,f:'#2A3035',w:700}));
    g+=part('plunger',`<rect x="4" y="12" width="18" height="8" rx="2" fill="url(#m-metal)"/><rect x="0" y="8" width="6" height="16" rx="2" fill="url(#m-grey)"/>`);
    g+=part('tip',`<path d="M90 12 L110 15 L110 17 L90 20Z" fill="url(#m-clear)" stroke="#9DB3C0" stroke-width=".6"/>`);
    return g; }}}, power:false,
  viewNotes:{side:'A pea-size drop is enough for a desktop CPU.'},
  parts:{barrel:{name:'Paste',info:'Fills microscopic air gaps between CPU and cooler.'},plunger:{name:'Plunger',info:'Press gently.'},tip:{name:'Nozzle',info:'Keep the cap on so it does not dry out.'}}
});
A.register('tool-zip-ties',{ name:'Cable ties', cat:'tool',
  views:{top:{w:110,h:50,pad:5,draw:s=>{ let g=P.shadow(55,46,48,2);
    g+=part('ties',[0,1,2,3,4].map(i=>`<rect x="6" y="${8+i*7}" width="90" height="3" rx="1.5" fill="#1B1F22"/><rect x="${96}" y="${6.5+i*7}" width="8" height="6" rx="1" fill="#1B1F22"/>`).join(''));
    return g; }}}, power:false,
  viewNotes:{top:'Snug, not tight. Reusable hook-and-loop straps are kinder to cables.'},
  parts:{ties:{name:'Cable ties',info:'Pulled too tight they deform the cable pairs.'}}
});
A.register('part-io-shield',{ name:'I/O shield', cat:'computer',
  views:{front:{w:160,h:46,pad:5,draw:s=>{ let g=P.shadow(80,44,72,2);
    g+=part('plate',`<rect x="0" y="0" width="160" height="44" rx="1" fill="url(#m-metal)" stroke="#8C959C" stroke-width=".5"/>`);
    g+=part('cutouts',[[8,6,13,20],[26,6,13,20],[44,8,18,16],[68,10,16,8],[68,22,14,7],[92,6,12,32],[112,8,14,14],[132,6,20,32]].map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="#15191C"/>`).join(''));
    g+=part('tabs',Array.from({length:14},(_,i)=>`<rect x="${6+i*11}" y="40" width="6" height="2" fill="#AEB6BC"/>`).join(''));
    return g; }}}, power:false,
  viewNotes:{front:'Fit it from inside the case before the motherboard. The audio end goes to the bottom.'},
  parts:{plate:{name:'Shield plate',info:'Grounds the ports and closes the gap around them.'},cutouts:{name:'Port cut-outs',info:'Match these to the rear ports before pressing it in.'},tabs:{name:'Grounding tabs',info:'Keep them outside the port openings, or they block the plugs.'}}
});
A.register('part-standoffs',{ name:'Brass standoffs and screws', cat:'computer',
  views:{side:{w:110,h:50,pad:5,draw:s=>{ let g=P.shadow(55,46,48,2);
    g+=part('standoff',[0,1,2].map(i=>`<path d="M${10+i*18} 18 h10 l2 4 v10 l-2 4 h-10 l-2 -4 v-10Z" fill="url(#m-gold)"/><rect x="${13+i*18}" y="36" width="4" height="8" fill="url(#m-gold-h)"/>`).join(''));
    g+=part('screw',[0,1].map(i=>`<ellipse cx="${74+i*18}" cy="22" rx="8" ry="3" fill="url(#m-metal)"/><rect x="${71+i*18}" y="22" width="6" height="16" fill="url(#m-metal-h)"/><path d="M${70+i*18} 22 h8" stroke="#6F787F" stroke-width="1"/>`).join(''));
    return g; }}}, power:false,
  viewNotes:{side:'Standoffs screw into the case tray; the motherboard screws into the standoffs.'},
  parts:{standoff:{name:'Brass standoffs',info:'Lift the board off the metal tray. One under every board hole, none anywhere else.'},screw:{name:'Motherboard screws',info:'Snug, in a cross pattern. Do not overtighten.'}}
});

/* ===================== Disc image file (ISO) icon ===================== */
A.register('iso-file',{
  name:'ISO file', cat:'tools',
  views:{ icon:{w:60,h:70,draw:s=>{
    let g=P.shadow(30,69,22,1.5);
    g+=part('file',`<path d="M8 2 H40 L54 16 V66 H8Z" fill="url(#m-white)" stroke="#AEB8BF" stroke-width="1"/><path d="M40 2 V16 H54" fill="#E3E8EC" stroke="#AEB8BF" stroke-width="1"/>`);
    g+=part('disc',`<circle cx="31" cy="38" r="15" fill="url(#m-metal-h)" stroke="#8C979E" stroke-width=".8"/><circle cx="31" cy="38" r="15" fill="url(#m-gloss)"/><circle cx="31" cy="38" r="4" fill="#fff" stroke="#8C979E" stroke-width=".8"/>`);
    g+=T(31,62,'.ISO',{a:'middle',s:6,f:'#3B4650',w:700});
    return g; }} },
  defaultView:'icon', state:{},
  parts:{file:{name:'Disc image file',info:'One file holding a whole installer disc. Check its SHA-256 checksum against the one published on the vendor site.'},disc:{name:'Disc icon',info:'Rufus writes this image to the USB drive and makes the drive bootable.'}}
});
})();
