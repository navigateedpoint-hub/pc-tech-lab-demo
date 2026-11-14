/* Server Setup drawings: a small-office tower server and a line-interactive UPS. Units are roughly millimetres; layouts follow common real products (no logos). */
(function(){
const A=window.Art, P=A.P, T=P.text, part=P.part;
const on=s=>!!s.on;

/* ===================== Tower server (single CPU, 4 hot-swap bays) ===================== */
A.register('server',{
  name:'Tower server', cat:'network',
  views:{
    front:{w:180,h:400,draw:s=>{
      let g=P.shadow(90,398,88,6);
      g+=P.body(0,0,180,392,{rx:8,mat:'m-gunmetal'});
      /* control panel */
      g+=`<rect x="12" y="12" width="156" height="44" rx="5" fill="#15191C"/>`;
      g+=part('power-btn',P.button(32,34,8,{icon:'power',ring:on(s)?'#3BD07A':'#6E787F',sw:1.5})+(on(s)?`<circle cx="32" cy="34" r="8.4" fill="none" stroke="#3BD07A" stroke-width="1.1" filter="url(#f-glow)"/>`:''));
      g+=part('id-btn',`<rect x="48" y="28" width="12" height="12" rx="2" fill="url(#m-black)" stroke="#5E676E" stroke-width=".6"/>`+T(54,36.5,'i',{a:'middle',s:6,f:on(s)?'#4FA3FF':'#7F8A92',w:700}));
      g+=part('health',P.led(70,30,{r:1.9,lit:on(s),color:'g'})+T(70,44,'HEALTH',{a:'middle',s:3,f:'#AEB8BF'}));
      g+=part('nic-led',P.led(88,30,{r:1.9,lit:on(s)&&s.link,blink:on(s)&&s.link,color:'g',fast:true})+T(88,44,'NIC',{a:'middle',s:3,f:'#AEB8BF'}));
      g+=part('usb-front',P.usbA(104,26,{color:'blue'})+P.usbA(122,26,{color:'black'}));
      g+=part('mgmt-usb',P.usbA(142,26,{color:'white',w:11}));
      g+=T(110,44,'USB 3.2',{s:3,f:'#AEB8BF'})+T(141,44,'MGMT',{s:3,f:'#AEB8BF'});
      /* optical bay blank and four 3.5-inch hot-swap bays */
      g+=`<rect x="12" y="66" width="156" height="20" rx="3" fill="#1B2024"/>`+P.hvents(18,70,144,12,{n:3,slot:1.6,col:'#2E353B'});
      for(let i=0;i<4;i++){ const y=96+i*44;
        g+=part('bay'+(i+1),`<rect x="12" y="${y}" width="156" height="38" rx="3" fill="#1A1F23" stroke="#0B0D0F" stroke-width=".8"/>`+
          P.hvents(20,y+6,96,26,{n:6,slot:1.6,col:'#2E353B'})+
          `<rect x="122" y="${y+6}" width="38" height="26" rx="3" fill="url(#m-black)" stroke="#5E676E" stroke-width=".5"/>`+
          `<rect x="128" y="${y+16}" width="26" height="6" rx="2" fill="#C8322A"/>`+
          P.led(132,y+28,{r:1.4,lit:on(s),color:'g'})+P.led(150,y+28,{r:1.4,lit:on(s)&&s.disk,blink:true,fast:true,color:'a'})); }
      g+=T(90,282,'4 × 3.5" hot-swap bays',{a:'middle',s:4,f:'#AEB8BF'});
      /* front intake grille */
      g+=`<rect x="12" y="292" width="156" height="86" rx="4" fill="#0E1215"/><rect x="12" y="292" width="156" height="86" rx="4" fill="url(#p-hex)" opacity=".85"/>`;
      g+=part('tag',P.label(118,382,48,8,'SRV-01',{s:3.6,w:700}));
      g+=`<rect x="18" y="388" width="28" height="6" rx="2.5" fill="#0B0D0F"/><rect x="134" y="388" width="28" height="6" rx="2.5" fill="#0B0D0F"/>`;
      return g; }},
    back:{w:180,h:400,draw:s=>{
      let g=P.shadow(90,398,88,6);
      g+=P.body(0,0,180,392,{rx:8,mat:'m-gunmetal'});
      /* rear I/O column */
      g+=part('io',`<rect x="14" y="24" width="60" height="176" rx="2" fill="url(#m-metal)" stroke="#6F787F" stroke-width=".6"/>`);
      g+=part('mgmt',P.rj45(20,34,{w:17,h:15,color:'blue',leds:true,link:on(s),plug:s.plugs&&s.plugs.mgmt})+T(48,44,'MGMT',{s:3.4,f:'#2A333B',w:700}));
      g+=part('LAN1',P.rj45(20,64,{w:17,h:15,leds:true,link:on(s)&&s.link,act:on(s)&&s.link,plug:s.plugs&&s.plugs.LAN1})+T(48,74,'LAN 1',{s:3.6,f:'#2A333B',w:700}));
      g+=part('LAN2',P.rj45(20,92,{w:17,h:15,leds:true,plug:s.plugs&&s.plugs.LAN2})+T(48,102,'LAN 2',{s:3.6,f:'#2A333B',w:700}));
      g+=part('usb-rear',P.usbA(20,120,{color:'blue'})+P.usbA(20,130,{color:'blue'})+T(48,128,'USB',{s:3.4,f:'#2A333B'}));
      g+=part('vga',`<path d="M20 146 h22 l-2 9 h-18 Z" fill="#2E5AA8" stroke="#1B3A6E" stroke-width=".5"/>`+[0,1,2,3,4].map(i=>`<circle cx="${24+i*3.5}" cy="149.5" r=".7" fill="#0B0D0F"/>`).join('')+T(48,153,'VGA',{s:3.4,f:'#2A333B'}));
      g+=part('serial',`<path d="M20 166 h22 l-2 9 h-18 Z" fill="#5A636A" stroke="#2E353B" stroke-width=".5"/>`+T(48,173,'COM',{s:3.4,f:'#2A333B'}));
      /* expansion slot covers */
      g+=part('slots',[0,1,2,3].map(i=>`<rect x="86" y="${30+i*16}" width="80" height="10" rx="1" fill="url(#m-metal)" stroke="#6F787F" stroke-width=".5"/>`+P.hvents(92,32+i*16,68,6,{n:2,slot:1.2,col:'#5A636A'})).join(''));
      /* exhaust fan */
      g+=part('fan',P.fan(126,140,34,{spin:on(s),frame:false,grille:true}));
      /* power supply */
      g+=part('psu',`<rect x="14" y="250" width="152" height="74" rx="3" fill="url(#m-black)" stroke="#2E353B" stroke-width=".8"/>`+P.vents(24,260,62,54,{n:10,slot:2,col:'#0B0D0F'}));
      g+=part('power-in',P.iec(110,270,{w:22,h:16})+(s.power?`<rect x="111" y="268" width="20" height="21" rx="2" fill="#15191C" stroke="#3E464D" stroke-width=".6"/>`:''));
      g+=part('psu-led',P.led(146,276,{r:1.8,lit:!!s.power,color:'g'}));
      g+=T(121,300,'100–240 V~',{a:'middle',s:3.4,f:'#AEB8BF'});
      g+=`<rect x="18" y="388" width="28" height="6" rx="2.5" fill="#0B0D0F"/><rect x="134" y="388" width="28" height="6" rx="2.5" fill="#0B0D0F"/>`;
      return g; }},
  },
  defaultView:'front', thumbView:'front', state:{on:false,disk:true,link:false},
  viewNames:{front:'Front',back:'Back'},
  viewNotes:{front:'Drives slide out from the front while the server keeps running (hot-swap). Two mirrored drives (RAID 1) protect the data if one fails.',
    back:'LAN 1 goes to the office switch. The blue MGMT port is for the remote management controller, which can switch the server on and off over the network.'},
  parts:{
    'power-btn':{name:'Power button',info:'Press once to start. To shut down, use the operating system; holding the button is only for a frozen server.'},
    'id-btn':{name:'ID button',info:'Lights a blue lamp front and back so you can find this server in a rack.'},
    health:{name:'Health light',info:'Green: hardware is healthy. Amber or blinking: check the management log (a fan, drive or power supply problem).'},
    'nic-led':{name:'Network light',info:'On when LAN 1 has a link; blinks with traffic.'},
    'usb-front':{name:'Front USB',info:'For a keyboard, a USB installer or a backup drive.'},
    'mgmt-usb':{name:'Management USB',info:'Connects a laptop straight to the management controller.'},
    bay1:{name:'Drive bay 1',info:'Hot-swap 3.5-inch tray. Bays 1 and 2 hold the mirrored system drives.'},bay2:{name:'Drive bay 2',info:'Mirror of bay 1 (RAID 1).'},
    bay3:{name:'Drive bay 3',info:'Data drive for the shared folders.'},bay4:{name:'Drive bay 4',info:'Empty, ready for another drive.'},
    tag:{name:'Asset label',info:'The server’s name, matching its name on the network and in the inventory.'},
    io:{name:'Rear I/O panel',info:'Network, USB, video and serial ports on the motherboard.'},
    mgmt:{name:'Management port',info:'Remote management (BMC): console, power and hardware logs over the network, even when the OS is off.'},
    LAN1:{name:'LAN 1',info:'Main network port. Cable this one to the office switch.'},
    LAN2:{name:'LAN 2',info:'Second network port, for failover or a separate network.'},
    'usb-rear':{name:'Rear USB',info:'Keyboard and mouse for the server console.'},
    vga:{name:'VGA video',info:'Monitor for the server console. Servers often only have VGA.'},
    serial:{name:'Serial (COM) port',info:'Old console port, still used by some UPS units and network devices.'},
    slots:{name:'Expansion slots',info:'For extra network cards or a RAID controller.'},
    fan:{name:'Exhaust fan',info:'Pushes hot air out of the back. Keep 15 cm free behind the server.'},
    psu:{name:'Power supply',info:'Converts mains power for the server. Bigger servers have two, for redundancy.'},
    'power-in':{name:'Power inlet',info:'Takes the power cord. For a server it should come from a UPS, not the wall.'},
    'psu-led':{name:'Power supply light',info:'Green when the power supply has input power.'},
  }
});

/* ===================== Line-interactive UPS (tower, 1.5 kVA) ===================== */
A.register('ups',{
  name:'UPS (uninterruptible power supply)', cat:'network',
  views:{
    front:{w:110,h:230,draw:s=>{
      let g=P.shadow(55,228,53,4);
      g+=P.body(0,0,110,222,{rx:8});
      g+=part('lcd',`<rect x="16" y="22" width="78" height="40" rx="3" fill="${on(s)?'#163A4E':'#10181D'}" stroke="#2E353B"/>`+(on(s)?
        T(55,36,s.battery?'ON BATTERY':'ONLINE',{a:'middle',s:6,f:s.battery?'#FFB27A':'#8FE3FF',w:700})+T(55,47,'230 V   23 %',{a:'middle',s:5,f:'#8FE3FF'})+
        `<rect x="26" y="51" width="58" height="5" rx="1" fill="#0B2430"/><rect x="26" y="51" width="54" height="5" rx="1" fill="#3BD07A"/>`:''));
      g+=part('power-btn',P.button(55,84,7,{icon:'power',ring:on(s)?'#3BD07A':'#6E787F',sw:1.3}));
      g+=part('leds',P.led(30,104,{r:1.8,lit:on(s)&&!s.battery,color:'g'})+T(30,114,'ONLINE',{a:'middle',s:3.3,f:'#AEB8BF'})+
        P.led(55,104,{r:1.8,lit:on(s)&&s.battery,color:'a'})+T(55,114,'BATTERY',{a:'middle',s:3.3,f:'#AEB8BF'})+
        P.led(80,104,{r:1.8,lit:false,color:'r'})+T(80,114,'FAULT',{a:'middle',s:3.3,f:'#AEB8BF'}));
      g+=`<rect x="14" y="128" width="82" height="80" rx="4" fill="#15191C"/>`+P.hvents(20,134,70,68,{n:10,slot:1.6,col:'#2E353B'});
      g+=T(55,218,'1500 VA',{a:'middle',s:4,f:'#6F7A82',w:700});
      return g; }},
    back:{w:110,h:230,draw:s=>{
      let g=P.shadow(55,228,53,4);
      g+=P.body(0,0,110,222,{rx:8});
      g+=`<rect x="10" y="14" width="90" height="196" rx="3" fill="#15191C"/>`;
      g+=T(55,26,'BATTERY + SURGE',{a:'middle',s:4,f:'#7FE0AE',w:700});
      const out=(id,x,y,used)=>part(id,`<rect x="${x}" y="${y}" width="28" height="24" rx="3" fill="#E9EDF0" stroke="#9AA3AA" stroke-width=".6"/>`+
        `<rect x="${x+8}" y="${y+6}" width="3" height="9" rx="1" fill="#2A3035"/><rect x="${x+17}" y="${y+6}" width="3" height="9" rx="1" fill="#2A3035"/><circle cx="${x+14}" cy="${y+19}" r="1.8" fill="#2A3035"/>`+
        (used?`<rect x="${x+2}" y="${y+2}" width="24" height="20" rx="3" fill="#15191C" stroke="#3E464D" stroke-width=".6"/>`:''));
      g+=out('out1',18,34,s.out&&s.out.out1)+out('out2',64,34,s.out&&s.out.out2)+out('out3',18,72,s.out&&s.out.out3)+out('out4',64,72,s.out&&s.out.out4);
      g+=T(55,112,'SURGE ONLY',{a:'middle',s:4,f:'#FFB27A',w:700});
      g+=out('surge1',18,118,false)+out('surge2',64,118,false);
      g+=part('usb',P.usbA(22,160,{color:'black'})+T(30,174,'USB',{a:'middle',s:3.4,f:'#AEB8BF'}));
      g+=part('input',P.iec(62,158,{w:22,h:16})+`<path d="M73 174 C 73 190 80 200 92 210" fill="none" stroke="#15191C" stroke-width="5" stroke-linecap="round"/>`+T(73,186,'INPUT',{a:'middle',s:3.4,f:'#AEB8BF'}));
      return g; }},
  },
  defaultView:'front', thumbView:'front', state:{on:false},
  viewNames:{front:'Front',back:'Back'},
  viewNotes:{front:'The display shows input voltage and battery level. On a power cut it beeps and switches to battery within milliseconds.',
    back:'Plug the server and its monitor into the BATTERY outlets. The USB cable lets the server shut down safely before the battery runs out.'},
  parts:{
    lcd:{name:'Display',info:'Input voltage, load and battery level.'},
    'power-btn':{name:'Power button',info:'Hold for two seconds to switch the UPS on or off.'},
    leds:{name:'Status lights',info:'Green: on mains. Amber: on battery. Red: fault, such as a worn-out battery.'},
    out1:{name:'Battery outlet 1',info:'Battery backup and surge protection. Use for the server.'},out2:{name:'Battery outlet 2',info:'Battery backup. Use for the switch and router.'},
    out3:{name:'Battery outlet 3',info:'Battery backup. Use for the server monitor.'},out4:{name:'Battery outlet 4',info:'Battery backup.'},
    surge1:{name:'Surge-only outlet',info:'No battery: for a printer or a desk lamp. Laser printers draw too much power for a UPS battery.'},surge2:{name:'Surge-only outlet',info:'No battery backup.'},
    usb:{name:'USB port',info:'Connect to the server so it shuts down cleanly when the battery is low.'},
    input:{name:'Input cord',info:'Goes to a wall outlet.'},
  }
});

Object.assign(A.PHOTO||{},{
  server:'tower server 4 bay hot swap front Dell PowerEdge T150',
  ups:'1500VA line interactive UPS tower LCD',
});
})();
