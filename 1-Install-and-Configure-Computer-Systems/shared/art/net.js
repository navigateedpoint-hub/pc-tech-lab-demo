/* Network devices, shaded style. Units are roughly millimetres. Layouts follow common real products (no logos). */
(function(){
const A=window.Art, P=A.P, T=P.text;
const part=P.part;
const on=s=>!!s.on;

/* ===================== Wi-Fi router (4 antennas, rear ports) ===================== */
A.register('router',{
  name:'Wi-Fi router', cat:'network',
  views:{
    back:{w:250,h:168,box:[-4,28,258,146],draw:s=>{
      let g='';
      g+=P.shadow(125,166,122,5);
      [30,92,158,220].forEach((x,i)=>g+=part('antenna',P.antenna(x,122,86)));
      g+=P.body(0,118,250,46,{rx:9});
      g+=`<rect x="8" y="124" width="234" height="34" rx="4" fill="#15191C"/>`;
      g+=part('power-btn',P.button(20,140,4.2,{icon:'power'}));
      g+=part('dc',P.dc(36,140,{r:4.4}));
      g+=part('usb',P.usbA(47,137,{color:'blue'}));
      g+=part('WAN',P.rj45(66,133,{color:'blue',plug:s.plugs&&s.plugs.WAN}));
      ['LAN1','LAN2','LAN3','LAN4'].forEach((id,i)=>g+=part(id,P.rj45(90+i*20,133,{color:'yellow',plug:s.plugs&&s.plugs[id]})));
      g+=part('reset',P.pinhole(184,140));
      g+=part('wps',`<rect x="194" y="136" width="14" height="8" rx="2" fill="url(#m-black)" stroke="#5E676E" stroke-width=".6"/>`);
      g+=part('wifi-btn',`<rect x="214" y="136" width="14" height="8" rx="2" fill="url(#m-black)" stroke="#5E676E" stroke-width=".6"/>`);
      const lab=[[20,'POWER'],[36,'DC IN'],[53,'USB'],[74,'WAN'],[119,'LAN 1  2  3  4'],[184,'RESET'],[201,'WPS'],[221,'Wi-Fi']];
      lab.forEach(([x,t])=>g+=T(x,155,t,{a:'middle',s:3.8,f:'#AEB8BF'}));
      return g; }},
    front:{w:250,h:70,draw:s=>{
      let g=P.shadow(125,68,122,4);
      g+=P.body(0,18,250,44,{rx:10});
      g+=`<rect x="8" y="22" width="234" height="6" rx="3" fill="#fff" opacity=".07"/>`;
      const wan=s.wan==null?s.on:s.wan, lan=s.lan==null?s.on:s.lan;
      const leds=[['pwr','Power','g',on(s),false],['w24','2.4G','g',on(s)&&s.wifi!==false,true],['w5','5G','g',on(s)&&s.wifi!==false,true],
        ['inet','Internet',s.internet===false?'a':'g',on(s)&&wan,false],['lanled','LAN','g',on(s)&&lan,true],['wpsled','WPS','g',false,false]];
      leds.forEach(([id,t,c,lit,blink],i)=>{ const x=58+i*27;
        g+=part(id,P.led(x,40,{r:2.4,lit,blink,color:c})+T(x,52,t,{a:'middle',s:4,f:'#9FAAB2'})); });
      g+=`<path d="M14 60 h222" stroke="#000" stroke-opacity=".35" stroke-width="1"/>`;
      return g; }},
  },
  defaultView:'back', thumbView:'back', state:{on:false,wifi:true,internet:true},
  viewNames:{back:'Back',front:'Front'},
  viewNotes:{back:'The blue WAN port takes the cable from the ISP modem. The four yellow LAN ports feed your office.',front:'Status lights. Internet turns orange when the WAN cable is in but there is no internet.'},
  parts:{
    antenna:{name:'Antenna',info:'Point them in different directions (some upright, some sideways) for the best coverage.'},
    'power-btn':{name:'Power button',info:'Turns the router on and off. Rebooting fixes many temporary faults.'},
    dc:{name:'Power jack (DC in)',info:'Takes the 12 V adapter. Use the adapter that came with the router.'},
    usb:{name:'USB port',info:'Shares a USB drive or printer on the network on some routers.'},
    WAN:{name:'WAN / Internet port (blue)',info:'The only port for the cable from the ISP modem (ONT). Traffic to the internet goes through here.'},
    LAN1:{name:'LAN 1',info:'Connects your own devices or a switch. All LAN ports are on the same network.'},
    LAN2:{name:'LAN 2',info:'Connects your own devices or a switch.'},
    LAN3:{name:'LAN 3',info:'Connects your own devices or a switch.'},
    LAN4:{name:'LAN 4',info:'Connects your own devices or a switch.'},
    reset:{name:'Reset pinhole',info:'Hold for about 10 seconds with a pin to erase all settings and return to factory defaults.'},
    wps:{name:'WPS button',info:'Pairs a device without typing the password. Many technicians disable WPS for security.'},
    'wifi-btn':{name:'Wi-Fi on/off button',info:'Turns the wireless radios on or off.'},
    pwr:{name:'Power light',info:'On means the router has power.'},
    w24:{name:'2.4 GHz light',info:'Wi-Fi on the 2.4 GHz band: longer range, slower. Blinks with traffic.'},
    w5:{name:'5 GHz light',info:'Wi-Fi on the 5 GHz band: faster, shorter range. Blinks with traffic.'},
    inet:{name:'Internet light',info:'Green: online. Orange: the WAN cable is connected but there is no internet.'},
    lanled:{name:'LAN light',info:'On when at least one device is connected to a LAN port.'},
    wpsled:{name:'WPS light',info:'Blinks while WPS pairing is running.'},
  }
});

/* ===================== Fiber modem (ONT), white ===================== */
A.register('ont',{
  name:'Fiber modem (ONT)', cat:'network',
  views:{
    back:{w:210,h:70,draw:s=>{
      let g=P.shadow(105,68,102,4);
      g+=P.body(0,12,210,52,{rx:6,mat:'m-white'});
      g+=`<rect x="7" y="20" width="196" height="36" rx="3" fill="#E1E6EA" stroke="#C3CBD1" stroke-width=".6"/>`;
      /* PON with green SC/APC connector and yellow fiber */
      g+=part('PON',`<rect x="12" y="27" width="16" height="16" rx="1.5" fill="#2A3035"/>`+
        (s.fiber!==false?`<rect x="14" y="29" width="12" height="12" rx="1" fill="url(#m-port-green)"/><path d="M20 41 v18" stroke="#F4C21A" stroke-width="3" stroke-linecap="round"/>`:`<rect x="15" y="30" width="10" height="10" rx="1" fill="#0B0D0F"/>`));
      g+=part('TEL1',`<rect x="36" y="31" width="12" height="11" rx="1" fill="#8D969C"/><rect x="38" y="33" width="8" height="7" rx=".8" fill="#0B0D0F"/>`);
      ['LAN1','LAN2','LAN3','LAN4'].forEach((id,i)=>g+=part(id,P.rj45(55+i*19,29,{w:15,h:13,plug:s.plugs&&s.plugs[id]})));
      g+=part('usb',P.usbA(134,33,{color:'black'}));
      g+=part('power-btn',P.button(158,36,4,{icon:'power',mat:'m-white',ring:'#9AA3AA',ic:'#56616A'}));
      g+=part('dc',P.dc(172,36,{r:4.2}));
      g+=part('reset',P.pinhole(186,36));
      g+=part('wlan-btn',`<rect x="193" y="32" width="7" height="8" rx="1.5" fill="#CFD6DB" stroke="#9AA3AA" stroke-width=".5"/>`);
      [[20,52,'OPTICAL'],[42,52,'TEL1'],[84,52,'LAN 1   2   3   4'],[140,52,'USB'],[158,52,'ON/OFF'],[172,52,'POWER'],[186,52,'RESET'],[196.5,29.4,'WLAN']].forEach(([x,y,t])=>g+=T(x,y,t,{a:'middle',s:3.4,f:'#5A656D'}));
      return g; }},
    top:{w:210,h:120,draw:s=>{
      let g=P.shadow(105,118,100,4);
      g+=P.body(0,0,210,112,{rx:10,mat:'m-white'});
      g+=`<rect x="10" y="8" width="190" height="30" rx="6" fill="#EEF1F3"/>`;
      g+=T(105,28,'GPON TERMINAL',{a:'middle',s:6,f:'#9AA3AA',w:700,ls:1.5});
      const los=s.los===true;
      const L=[['pwr','POWER','g',on(s),false],['pon','PON','g',on(s)&&!los,false],['los','LOS','r',on(s)&&los,true],
        ['l1','LAN1','g',on(s)&&s.lan1,true],['l2','LAN2','g',on(s)&&s.lan2,true],['l3','LAN3','g',on(s)&&s.lan3,true],['l4','LAN4','g',on(s)&&s.lan4,true],
        ['tel','TEL','g',false,false],['wlan','WLAN','g',on(s)&&s.wlan!==false,true],['usbled','USB','g',false,false]];
      L.forEach(([id,t,c,lit,blink],i)=>{ const x=20+i*19;
        g+=part(id,P.led(x,62,{r:2.3,lit,blink,color:c})+T(x,74,t,{a:'middle',s:3.7,f:'#6A757D'})); });
      g+=P.vents(20,88,170,12,{n:28,slot:2,col:'#C7CFD5'});
      return g; }},
  },
  defaultView:'back', thumbView:'back', state:{on:false,fiber:true,los:false,wlan:false},
  viewNames:{back:'Back',top:'Top'},
  viewNotes:{back:'The yellow fiber plugs into the green optical (PON) port. Never look into a fiber end.',top:'LOS in red means the fiber signal is lost: call the ISP.'},
  parts:{
    PON:{name:'Optical (PON) port',info:'Where the ISP fiber plugs in, with a green SC/APC connector. Do not bend the fiber tightly or look into the end.'},
    TEL1:{name:'TEL port',info:'For a landline phone (RJ11) when the plan includes voice.'},
    LAN1:{name:'LAN 1',info:'Hands the internet on to your router or a PC.'},LAN2:{name:'LAN 2',info:'Ethernet port.'},LAN3:{name:'LAN 3',info:'Ethernet port.'},LAN4:{name:'LAN 4',info:'Ethernet port.'},
    usb:{name:'USB port',info:'For storage sharing on some models.'},
    'power-btn':{name:'ON/OFF button',info:'Power switch.'},dc:{name:'Power jack',info:'12 V adapter from the ISP.'},
    reset:{name:'Reset pinhole',info:'Factory reset. The ISP may have to re-provision the unit afterwards.'},
    'wlan-btn':{name:'WLAN button',info:'Turns the built-in Wi-Fi on or off. Turn it off when your own router provides Wi-Fi.'},
    pwr:{name:'POWER light',info:'On when powered.'},pon:{name:'PON light',info:'Steady green: registered with the ISP. Blinking: registering.'},
    los:{name:'LOS light',info:'Red means loss of signal on the fiber: a broken or disconnected fiber. Call the ISP.'},
    l1:{name:'LAN1 light',info:'Link and activity on LAN1.'},l2:{name:'LAN2 light',info:'Link on LAN2.'},l3:{name:'LAN3 light',info:'Link on LAN3.'},l4:{name:'LAN4 light',info:'Link on LAN4.'},
    tel:{name:'TEL light',info:'Voice service registered.'},wlan:{name:'WLAN light',info:'Built-in Wi-Fi is on.'},usbled:{name:'USB light',info:'A USB device is connected.'},
  }
});

/* ===================== Switch, 8-port desktop (LEDs front, ports back) ===================== */
function switchDef(poe){
  const parts={
    dc:{name:'Power jack',info:poe?'53.5 V DC from the PoE adapter. PoE needs much more power than a plain switch.':'9 V DC adapter.'},
    kens:{name:'Security slot',info:'For a cable lock that stops the switch from walking away.'},
    pwr:{name:'Power light',info:'On when the switch has power.'},
  };
  for(let i=1;i<=8;i++){ parts['P'+i]={name:'Port '+i+(poe?' (PoE+)':''),info:poe?'Data and up to 30 W of power over the same cable (802.3at PoE+).':'Gigabit Ethernet port. All ports are equal on an unmanaged switch.'};
    parts['led'+i]={name:'Port '+i+' light',info:'Steady: link. Blinking: traffic.'}; }
  if(poe){ parts.poemax={name:'PoE Max light',info:'Lights when the total PoE budget is almost used up.'}; for(let i=1;i<=8;i++) parts['poe'+i]={name:'PoE '+i+' light',info:'Power is being delivered on this port.'}; }
  return {
    name:poe?'8-port PoE+ switch':'8-port gigabit switch', cat:'network',
    views:{
      back:{w:210,h:56,draw:s=>{
        let g=P.shadow(105,54,102,3);
        g+=P.body(0,6,210,44,{rx:4,mat:poe?'m-gunmetal':'m-black'});
        g+=`<rect x="5" y="12" width="200" height="32" rx="2" fill="#15191C"/>`;
        g+=part('kens',`<rect x="10" y="24" width="5" height="4" rx="1" fill="#050607" stroke="#5A636A" stroke-width=".5"/>`);
        g+=part('dc',P.dc(26,27,{r:4.3}));
        for(let i=1;i<=8;i++){ g+=part('P'+i,P.rj45(40+(i-1)*20.5,19,{plug:s.plugs&&s.plugs['P'+i]})); }
        g+=T(26,40,poe?'53.5V':'9V DC',{a:'middle',s:3.3,f:'#AEB8BF'});
        for(let i=1;i<=8;i++) g+=T(48+(i-1)*20.5,40,String(i)+(poe?' PoE':''),{a:'middle',s:3.3,f:poe?'#7FE0AE':'#AEB8BF'});
        return g; }},
      front:{w:210,h:50,draw:s=>{
        let g=P.shadow(105,48,102,3);
        g+=P.body(0,6,210,38,{rx:4,mat:poe?'m-gunmetal':'m-black'});
        g+=part('pwr',P.led(16,20,{lit:on(s)})+T(16,32,'Power',{a:'middle',s:3.4,f:'#AEB8BF'}));
        if(poe) g+=part('poemax',P.led(34,20,{lit:on(s)&&s.poemax,color:'a'})+T(34,32,'PoE Max',{a:'middle',s:3.4,f:'#AEB8BF'}));
        const links=s.links||[];
        for(let i=1;i<=8;i++){ const x=(poe?56:44)+(i-1)*(poe?18.5:20);
          g+=part('led'+i,P.led(x,20,{lit:on(s)&&links[i-1],blink:on(s)&&links[i-1]&&s.traffic,color:'g',r:2}));
          if(poe) g+=part('poe'+i,P.led(x,29,{lit:on(s)&&s.poe&&s.poe[i-1],color:'a',r:1.6}));
          g+=T(x,38,String(i),{a:'middle',s:3.4,f:'#AEB8BF'}); }
        g+=T(200,40,poe?'PoE+':'1000M',{a:'end',s:3.6,f:'#6F7A82',w:700});
        return g; }},
    },
    defaultView:'back', thumbView:'back', state:{on:false,links:[],traffic:true},
    viewNames:{back:'Back (ports)',front:'Front (lights)'},
    viewNotes:{back:'On most desktop switches the ports are at the back and the lights at the front.',front:'Each port has a light. Steady means a link; blinking means traffic.'},
    parts
  };
}
A.register('switch',switchDef(false));
A.register('poeswitch',switchDef(true));

/* ===================== Ceiling access point ===================== */
A.register('ap',{
  name:'Ceiling access point', cat:'network',
  views:{
    top:{w:170,h:170,draw:s=>{
      let g=P.shadow(85,168,70,4);
      g+=part('body',`<circle cx="85" cy="82" r="80" fill="url(#m-dome)"/><circle cx="85" cy="82" r="80" fill="none" stroke="#C3CBD1" stroke-width="1"/>`+
        `<ellipse cx="68" cy="52" rx="42" ry="20" fill="#fff" opacity=".45"/>`);
      const ringCol = !on(s)?'#C9D0D5': s.adopting?'#FFFFFF':'#2F8EF0';
      g+=part('ring',`<circle cx="85" cy="82" r="18" fill="none" stroke="${ringCol}" stroke-width="3.2"${on(s)?' filter="url(#f-glow)"':''} class="${on(s)&&s.adopting?'pulse':''}"/>`);
      return g; }},
    back:{w:170,h:170,draw:s=>{
      let g=P.shadow(85,168,70,4);
      g+=`<circle cx="85" cy="82" r="80" fill="url(#m-white)"/>`;
      g+=part('mount',`<circle cx="85" cy="82" r="46" fill="#E6EBEE" stroke="#BFC7CD"/>`+[0,90,180,270].map(a=>`<rect x="81" y="32" width="8" height="10" rx="2" fill="#CBD2D8" transform="rotate(${a} 85 82)"/>`).join(''));
      g+=`<rect x="67" y="70" width="36" height="26" rx="3" fill="#D7DDE1"/>`;
      g+=part('ETH (PoE in)',P.rj45(77,75,{w:16,h:14,plug:s.plugs&&s.plugs['ETH (PoE in)']}));
      g+=part('reset',P.pinhole(98,90));
      g+=T(85,108,'ETH · PoE IN',{a:'middle',s:4,f:'#5A656D',w:700});
      return g; }},
  },
  defaultView:'top', thumbView:'top', state:{on:false,adopting:false},
  viewNames:{top:'Face',back:'Back'},
  viewNotes:{top:'The light ring: blue means working; a slow white pulse means waiting to be set up.',back:'A single cable carries both data and power (PoE) from the switch.'},
  parts:{
    body:{name:'Antenna housing',info:'Antennas sit inside. Mount on the ceiling in the middle of the area to cover.'},
    ring:{name:'Status light ring',info:'Blue: working. Pulsing white: waiting to be adopted. Off: no power (check PoE).'},
    mount:{name:'Mounting plate',info:'Screws to the ceiling; the access point twists onto it.'},
    'ETH (PoE in)':{name:'Ethernet / PoE in',info:'Data and power in one cable. Needs 802.3af/at PoE from a switch or injector.'},
    reset:{name:'Reset pinhole',info:'Hold to return to factory defaults.'},
  }
});

/* ===================== Desktop PC (mid tower) ===================== */
A.register('pc',{
  name:'Desktop PC', cat:'network',
  views:{
    front:{w:200,h:420,draw:s=>{
      let g=P.shadow(100,418,96,6);
      g+=P.body(0,0,200,412,{rx:10});
      g+=part('mesh',`<rect x="14" y="70" width="172" height="318" rx="6" fill="#0E1215"/><rect x="14" y="70" width="172" height="318" rx="6" fill="url(#p-hex)" opacity=".9"/>`+
        (on(s)&&s.rgb!==false?`<rect x="16" y="72" width="168" height="314" rx="5" fill="none" stroke="#3A9BFF" stroke-opacity=".45" stroke-width="2"/>`:''));
      g+=`<rect x="14" y="14" width="172" height="46" rx="6" fill="#171B1F"/>`;
      g+=part('power-btn',P.button(40,37,9,{icon:'power',ring:on(s)?'#3AA7FF':'#6E787F',sw:1.6})+(on(s)?`<circle cx="40" cy="37" r="9.4" fill="none" stroke="#3AA7FF" stroke-width="1.2" filter="url(#f-glow)"/>`:''));
      g+=part('reset-btn',P.button(62,37,3.6,{}));
      g+=part('usb-front',P.usbA(78,31,{color:'blue'})+P.usbA(96,31,{color:'blue'}));
      g+=part('usbc-front',P.usbC(116,33.5));
      g+=part('audio-front',P.audio(136,37,{color:'#1B1F22'})+`<path d="M133 43 h6" stroke="#7F8A92" stroke-width=".8"/>`);
      g+=part('hdd-led',P.led(154,37,{r:1.9,lit:on(s)&&s.disk,blink:true,color:'a',fast:true}));
      g+=part('pwr-led',P.led(166,37,{r:1.9,lit:on(s),color:'b'}));
      if(s.usbIn) g+=`<rect x="80" y="18" width="9" height="14" rx="1.5" fill="url(#m-blue)"/><rect x="79.5" y="31" width="10" height="3" fill="url(#m-metal)"/>`;
      g+=`<rect x="22" y="404" width="30" height="8" rx="3" fill="#0B0D0F"/><rect x="148" y="404" width="30" height="8" rx="3" fill="#0B0D0F"/>`;
      return g; }},
    back:{w:200,h:420,draw:s=>{
      let g=P.shadow(100,418,96,6);
      g+=P.body(0,0,200,412,{rx:10});
      /* seen from the back: motherboard I/O and slots on the left, exhaust fan on the right */
      g+=part('io-shield',`<rect x="22" y="30" width="46" height="158" rx="2" fill="url(#m-metal)" stroke="#6F787F" stroke-width=".6"/>`);
      g+=part('usb-rear',[0,1,2,3].map(i=>P.usbA(28,40+i*9,{color:i<2?'blue':'black'})).join('')+P.usbA(46,40,{color:'red'})+P.usbC(47,50));
      g+=part('Ethernet',P.rj45(28,84,{w:17,h:15,leds:true,link:on(s)&&s.link,act:on(s)&&s.link,plug:s.plugs&&s.plugs.Ethernet}));
      g+=part('hdmi',P.hdmi(29,110));
      g+=part('dp',P.dp(29,121));
      g+=part('audio-rear',P.audio(38,146,{color:'#58C0E8'})+P.audio(38,156,{color:'#6ABF4B'})+P.audio(38,166,{color:'#E985B6'}));
      g+=part('exhaust',P.fan(134,82,34,{spin:on(s),grille:true}));
      g+=part('slots',[0,1,2,3,4,5,6].map(i=>`<rect x="20" y="${204+i*16}" width="118" height="11" rx="1" fill="url(#m-metal-h)" stroke="#6F787F" stroke-width=".4"/>`+P.vents(32,207+i*16,90,5,{n:12,slot:1.6,col:'#6F787F'})).join('')+
        `<rect x="144" y="204" width="40" height="108" rx="3" fill="#15191C"/>`+P.hvents(150,210,28,96,{n:14,slot:2.4,col:'#050607'}));
      if(s.gpu) g+=part('gpu-ports',`<rect x="20" y="220" width="118" height="27" rx="1" fill="url(#m-metal)" stroke="#555" stroke-width=".5"/>`+P.hdmi(28,231)+P.dp(48,231)+P.dp(66,231)+P.dp(84,231)+P.vents(108,226,24,16,{n:4,slot:2}));
      g+=part('psu',`<rect x="14" y="330" width="172" height="70" rx="3" fill="url(#m-black)"/><rect x="22" y="336" width="92" height="58" rx="3" fill="#0E1215"/><rect x="22" y="336" width="92" height="58" rx="3" fill="url(#p-hex)"/>`);
      g+=part('psu-switch',`<rect x="126" y="347" width="14" height="22" rx="2" fill="#0B0D0F"/><rect x="128" y="${s.psuOff?359:349}" width="10" height="9" rx="1.5" fill="#2D3338"/>`+T(133,376,'I / O',{a:'middle',s:4.5,f:'#AEB8BF'}));
      g+=part('iec',P.iec(150,350,{w:22,h:16}));
      return g; }},
  },
  defaultView:'front', thumbView:'front', state:{on:false,link:false,disk:true},
  viewNames:{front:'Front',back:'Back'},
  viewNotes:{front:'Front ports go to the motherboard through the case cables.',back:'The network port is on the motherboard I/O area, next to the USB ports.'},
  parts:{
    'power-btn':{name:'Power button',info:'Starts the PC. Holding it for 4 seconds forces it off, which can lose unsaved work.'},
    'reset-btn':{name:'Reset button',info:'Restarts the PC immediately.'},
    'usb-front':{name:'Front USB 3.0 ports',info:'Work only if the case cable is connected to the JUSB3 header.'},
    'usbc-front':{name:'Front USB-C port',info:'Needs a USB-C front-panel header on the motherboard.'},
    'audio-front':{name:'Headphone/mic jack',info:'Connected to the HD AUDIO header.'},
    'hdd-led':{name:'Drive activity light',info:'Flickers when the storage is being read or written.'},
    'pwr-led':{name:'Power light',info:'On while the PC is running.'},
    mesh:{name:'Mesh front panel',info:'Lets the front fans pull in cool air. Clean the dust filter regularly.'},
    exhaust:{name:'Rear exhaust fan',info:'Pushes warm air out of the case.'},
    'io-shield':{name:'Rear I/O panel',info:'Ports built into the motherboard.'},
    'usb-rear':{name:'Rear USB ports',info:'Blue and red ports are USB 3.x; black are USB 2.0. The small oval one is USB-C.'},
    Ethernet:{name:'Ethernet port',info:'Network cable to the switch. Green light: link. Amber: activity.'},
    hdmi:{name:'HDMI (motherboard)',info:'Uses the CPU’s graphics. Not used when a graphics card is installed.'},
    dp:{name:'DisplayPort (motherboard)',info:'Also uses the CPU’s graphics.'},
    'audio-rear':{name:'Audio jacks',info:'Blue: line in. Green: speakers. Pink: microphone.'},
    slots:{name:'Expansion slot covers',info:'Removed where a graphics or network card is installed.'},
    'gpu-ports':{name:'Graphics card outputs',info:'Plug the monitor in here when a graphics card is installed.'},
    psu:{name:'Power supply',info:'Converts wall AC to the DC voltages the parts need.'},
    'psu-switch':{name:'PSU switch',info:'I is on, O is off. Must be on before the power button does anything.'},
    iec:{name:'Power socket (IEC C14)',info:'Takes the mains power cord.'},
  }
});

/* ===================== Laptop ===================== */
A.register('laptop',{
  name:'Laptop', cat:'network',
  views:{
    front:{w:320,h:230,draw:s=>{
      let g=P.shadow(160,226,158,5);
      g+=part('screen',`<rect x="30" y="0" width="260" height="170" rx="8" fill="url(#m-grey)"/><rect x="36" y="8" width="248" height="152" rx="3" fill="url(#${on(s)?'m-glass-on':'m-glass'})"/>`+
        (on(s)?`<rect x="36" y="150" width="248" height="10" fill="#E9EEF2" opacity=".9"/><rect x="150" y="152" width="20" height="6" rx="1" fill="#1D63B0"/>`:'')+
        `<path d="M36 8 L150 8 L80 160 L36 160Z" fill="#fff" opacity=".06"/>`);
      g+=part('webcam',`<circle cx="160" cy="4" r="1.6" fill="#0B0D0F"/>`);
      g+=part('keyboard',`<path d="M26 172 H294 L318 214 H2 Z" fill="url(#m-alu)"/>`+
        [0,1,2,3].map(r=>`<path d="M${40-r*5} ${178+r*7} H${280+r*5}" stroke="#2A3036" stroke-width="4.5" stroke-dasharray="11 1.8" opacity=".9"/>`).join('')+
        `<path d="M120 208 H200 L203 212 H117Z" fill="#9CA5AC"/>`);
      g+=`<path d="M2 214 H318 L314 220 H6Z" fill="#7F8990"/>`;
      return g; }},
    side:{w:320,h:60,draw:s=>{
      let g=P.shadow(160,58,158,3);
      g+=`<path d="M4 22 L316 18 Q318 18 318 22 L318 38 Q318 42 314 42 L8 44 Q4 44 4 40Z" fill="url(#m-alu)"/>`;
      g+=`<path d="M4 14 L316 12 L316 18 L4 22Z" fill="url(#m-grey)"/>`;
      g+=part('dc',P.usbC(20,28.5,{w:10,h:4}));
      g+=part('hdmi',P.hdmi(40,28,{w:13,h:5}));
      g+=part('usb',P.usbA(62,27.8,{color:'blue'}));
      g+=part('Ethernet',`<path d="M84 26 h18 v10 h-4 v3 h-10 v-3 h-4Z" fill="#0B0D0F" stroke="#6F787F" stroke-width=".5"/>`+[0,1,2,3,4,5,6,7].map(i=>`<rect x="${86+i*1.8}" y="27" width="1" height="3" fill="url(#m-gold)"/>`).join('')+
        (s.plugs&&s.plugs.Ethernet?`<rect x="85.5" y="27" width="15" height="11" rx="1" fill="url(#m-clear)" stroke="#9DB3C0" stroke-width=".5"/>`+P.cableRun('M93 38 C93 50 100 56 112 58',{w:3.4,color:'#3E6FA8'}):''));
      g+=part('audio',P.audio(116,31,{r:2.2,color:'#1B1F22'}));
      g+=part('led',P.led(300,31,{r:1.5,lit:on(s),color:'w'}));
      return g; }},
  },
  defaultView:'front', thumbView:'front', state:{on:false},
  viewNames:{front:'Open',side:'Left side'},
  viewNotes:{front:'Laptops use Wi-Fi most of the time, but a cable is faster and more reliable for installs.',side:'This model has a fold-down Ethernet port. Many thin laptops need a USB adapter instead.'},
  parts:{
    screen:{name:'Screen',info:'The Wi-Fi icon in the taskbar shows the connection.'},
    webcam:{name:'Webcam',info:'Used for meetings and Windows Hello face sign-in on some models.'},
    keyboard:{name:'Keyboard and touchpad',info:'Built-in input.'},
    dc:{name:'USB-C charging port',info:'Charging, display out and data on one connector.'},
    hdmi:{name:'HDMI',info:'For a projector or second monitor.'},usb:{name:'USB-A port',info:'Flash drives, mouse, keyboard.'},
    Ethernet:{name:'Ethernet port (fold-down)',info:'Wired network. The lower jaw folds down to fit the plug.'},
    audio:{name:'Headset jack',info:'Combined headphone and microphone.'},led:{name:'Power light',info:'On while the laptop is running.'},
  }
});

/* ===================== Laser multifunction printer ===================== */
A.register('printer',{
  name:'Network printer', cat:'network',
  views:{
    front:{w:260,h:220,draw:s=>{
      let g=P.shadow(130,218,124,5);
      g+=part('scanner',`<rect x="10" y="0" width="240" height="46" rx="6" fill="url(#m-white)"/><rect x="18" y="8" width="130" height="14" rx="3" fill="#D6DCE0"/>`+T(83,18,'Document feeder',{a:'middle',s:5,f:'#8A949B'}));
      g+=P.body(6,44,248,168,{rx:8,mat:'m-white'});
      g+=part('panel',`<rect x="160" y="54" width="86" height="34" rx="4" fill="#2A3035"/><rect x="166" y="58" width="44" height="26" rx="2" fill="${on(s)?'#8FD0FF':'#0E1418'}"/>`+
        (on(s)?T(188,68,'Ready',{a:'middle',s:5,f:'#0B2F4A',w:700})+T(188,78,s.ip==null?'192.168.1.20':(s.ip||'No network'),{a:'middle',s:4.2,f:'#0B2F4A'}):'')+
        P.button(222,64,3.2,{})+P.button(234,64,3.2,{})+P.button(228,77,3.2,{})+P.led(240,77,{r:1.6,lit:on(s),color:'g'}));
      g+=part('output',`<rect x="22" y="64" width="126" height="18" rx="2" fill="#2A3035"/><rect x="30" y="68" width="110" height="6" fill="#F3F5F7"/>`);
      g+=part('usbhost',P.usbA(160,96,{color:'black'}));
      g+=part('tray',`<rect x="14" y="140" width="232" height="60" rx="4" fill="url(#m-white)" stroke="#BFC7CD"/><rect x="104" y="160" width="52" height="8" rx="4" fill="#AEB6BC"/>`+
        `<rect x="228" y="150" width="8" height="40" rx="2" fill="#2A3035"/><rect x="229.5" y="${150+40*(1-(s.paper==null?.7:s.paper))}" width="5" height="${40*(s.paper==null?.7:s.paper)}" fill="#F3F5F7"/>`);
      g+=part('power-btn',P.button(24,110,5,{icon:'power',mat:'m-white',ring:'#8A949B',ic:'#56616A'}));
      return g; }},
    back:{w:260,h:220,draw:s=>{
      let g=P.shadow(130,218,124,5);
      g+=P.body(6,6,248,206,{rx:8,mat:'m-white'});
      g+=P.hvents(20,24,120,60,{n:10,col:'#BFC7CD'});
      g+=`<rect x="160" y="30" width="80" height="44" rx="3" fill="#D4DADE"/>`;
      g+=part('Ethernet',P.rj45(168,40,{w:17,h:15,leds:true,link:on(s)&&s.link,act:on(s)&&s.link,plug:s.plugs&&s.plugs.Ethernet}));
      g+=part('usbb',`<path d="M200 42 h12 v9 l-2 2 h-8 l-2 -2Z" fill="url(#m-metal)" stroke="#5B646A" stroke-width=".4"/><rect x="202" y="44" width="8" height="6" rx="1" fill="#0B0D0F"/>`);
      g+=T(176,68,'LAN',{a:'middle',s:4.5,f:'#56616A',w:700})+T(206,68,'USB',{a:'middle',s:4.5,f:'#56616A',w:700});
      g+=part('iec',P.iec(200,150,{w:22,h:18}));
      g+=part('rear-door',`<rect x="30" y="110" width="140" height="80" rx="4" fill="#E4E8EB" stroke="#BFC7CD"/><rect x="92" y="114" width="16" height="5" rx="2" fill="#AEB6BC"/>`);
      return g; }},
  },
  defaultView:'front', thumbView:'front', state:{on:false,paper:.7},
  viewNames:{front:'Front',back:'Back'},
  viewNotes:{front:'The panel shows the printer’s IP address. Give network printers a fixed address.',back:'Use the LAN port so every PC can print, rather than USB to one PC.'},
  parts:{
    scanner:{name:'Scanner and document feeder',info:'Copies and scans. Scan-to-folder needs the printer to reach a PC or NAS on the network.'},
    panel:{name:'Control panel',info:'Network settings (IP address, mask, gateway) are set here or from the printer’s web page.'},
    output:{name:'Output tray',info:'Printed pages come out here.'},usbhost:{name:'USB port (front)',info:'Print from a flash drive.'},
    tray:{name:'Paper tray',info:'The gauge on the right shows how much paper is left.'},
    'power-btn':{name:'Power button',info:'Turns the printer on and off.'},
    Ethernet:{name:'LAN port',info:'Connects the printer to the switch. Green: link. Amber: activity.'},
    usbb:{name:'USB-B port',info:'Direct connection to one PC only.'},iec:{name:'Power socket',info:'Mains power. Laser printers draw a lot of power when warming up; avoid small UPS units.'},
    'rear-door':{name:'Rear access door',info:'Open to clear paper jams near the fuser. The fuser gets very hot.'},
  }
});

/* ===================== NAS, 2-bay ===================== */
A.register('nas',{
  name:'NAS file server', cat:'network',
  views:{
    front:{w:120,h:180,draw:s=>{
      let g=P.shadow(60,178,58,4);
      g+=P.body(0,0,120,172,{rx:8});
      [0,1].forEach(i=>g+=part('bay'+(i+1),`<rect x="${14+i*50}" y="18" width="42" height="130" rx="3" fill="#15191C"/>`+P.vents(20+i*50,30,30,100,{n:8,slot:1.8,col:'#2E353B'})+
        `<rect x="${24+i*50}" y="136" width="22" height="6" rx="2" fill="#2E353B"/>`+P.led(35+i*50,152,{r:1.8,lit:on(s),color:'g',blink:s.disk})));
      g+=part('status',P.led(20,164,{r:1.8,lit:on(s),color:'g'})+T(26,166,'STATUS',{s:3.3,f:'#AEB8BF'}));
      g+=part('usb',P.usbA(58,160,{color:'black',w:11,h:5}));
      g+=part('power-btn',P.button(98,162,5,{icon:'power',ring:on(s)?'#2F8EF0':'#6E787F'}));
      return g; }},
    back:{w:120,h:180,draw:s=>{
      let g=P.shadow(60,178,58,4);
      g+=P.body(0,0,120,172,{rx:8});
      g+=part('fan',P.fan(60,58,38,{spin:on(s),frame:false,grille:true}));
      g+=part('LAN1',P.rj45(18,112,{w:16,h:14,leds:true,link:on(s)&&s.link,act:on(s)&&s.link,plug:s.plugs&&s.plugs.LAN1}));
      g+=part('LAN2',P.rj45(40,112,{w:16,h:14,leds:true,plug:s.plugs&&s.plugs.LAN2}));
      g+=part('usb',P.usbA(64,116,{color:'blue',w:11}));
      g+=part('dc',P.dc(94,120,{r:4.5}));
      g+=part('reset',P.pinhole(82,142));
      g+=T(26,134,'LAN1',{a:'middle',s:3.6,f:'#AEB8BF'})+T(48,134,'LAN2',{a:'middle',s:3.6,f:'#AEB8BF'})+T(94,134,'DC IN',{a:'middle',s:3.6,f:'#AEB8BF'});
      return g; }},
  },
  defaultView:'front', thumbView:'front', state:{on:false,disk:true},
  viewNames:{front:'Front',back:'Back'},
  viewNotes:{front:'Two drives can mirror each other (RAID 1) so one can fail without losing data.',back:'Give the NAS a fixed IP address so shared folders never move.'},
  parts:{
    bay1:{name:'Drive bay 1',info:'Hot-swappable drive tray.'},bay2:{name:'Drive bay 2',info:'Second drive, often a mirror of the first.'},
    status:{name:'Status light',info:'Green: healthy. Amber: a warning such as a failing drive.'},usb:{name:'USB port',info:'Copy files from a USB drive or back up to one.'},
    'power-btn':{name:'Power button',info:'Press to start; hold to shut down safely. Never pull the power.'},
    fan:{name:'Cooling fan',info:'Keeps the drives cool. Leave space behind the NAS.'},
    LAN1:{name:'LAN 1',info:'Main network port to the switch.'},LAN2:{name:'LAN 2',info:'Second port for failover or more bandwidth.'},
    dc:{name:'Power jack',info:'12 V adapter.'},reset:{name:'Reset pinhole',info:'Resets the admin password and network settings, not the data.'},
  }
});

/* ===================== IP camera (bullet) ===================== */
A.register('camera',{
  name:'IP camera', cat:'network',
  views:{
    side:{w:220,h:130,draw:s=>{
      let g=P.shadow(110,128,100,4);
      g+=part('bracket',`<rect x="140" y="70" width="18" height="44" rx="3" fill="url(#m-white-h)"/><rect x="126" y="110" width="46" height="8" rx="3" fill="url(#m-white)"/><circle cx="149" cy="66" r="9" fill="url(#m-dome)"/>`);
      g+=part('body',`<rect x="20" y="36" width="150" height="40" rx="18" fill="url(#m-white)"/><path d="M14 30 H176 Q180 30 180 34 L176 38 H18Z" fill="url(#m-white)"/>`);
      g+=part('lens',`<rect x="8" y="40" width="14" height="32" rx="6" fill="#1A1F24"/><circle cx="14" cy="56" r="7" fill="url(#m-lens)"/>`);
      const pl=s.plugs&&s.plugs['ETH (PoE in)'];
      g+=part('ETH (PoE in)',P.cableRun('M170 56 C200 56 205 80 196 100',{w:4})+`<rect x="186" y="98" width="14" height="12" rx="2" fill="#1A1F24" stroke="#5E676E" stroke-width=".5"/><rect x="188.5" y="104" width="9" height="6" rx=".6" fill="#0B0D0F"/>`+
        (pl?`<rect x="188" y="108" width="10" height="9" rx="1" fill="url(#m-clear)" stroke="#9DB3C0" stroke-width=".5"/>`+P.cableRun('M193 117 C193 124 200 126 214 126',{w:3.4,color:'#3E6FA8'}):''));
      g+=part('led',P.led(40,68,{r:1.3,lit:on(s)&&s.ir,color:'r'}));
      return g; }},
    front:{w:130,h:130,draw:s=>{
      let g=P.shadow(65,128,50,4);
      g+=part('body',`<circle cx="65" cy="62" r="52" fill="url(#m-white)"/><circle cx="65" cy="62" r="44" fill="#14191D"/>`);
      g+=part('lens',`<circle cx="65" cy="62" r="18" fill="url(#m-lens)"/><circle cx="59" cy="56" r="5" fill="#fff" opacity=".35"/>`);
      g+=part('ir',[0,60,120,180,240,300].map(a=>{ const r=31, x=65+r*Math.cos(a*Math.PI/180), y=62+r*Math.sin(a*Math.PI/180); return P.led(x,y,{r:3.2,lit:on(s)&&s.ir,color:'r'}); }).join(''));
      return g; }},
  },
  defaultView:'side', thumbView:'side', state:{on:false,ir:false},
  viewNames:{side:'Side',front:'Lens'},
  viewNotes:{side:'The short cable (pigtail) ends in an RJ45 plug. One PoE cable powers it.',front:'Infrared LEDs light the scene at night; they glow faint red.'},
  parts:{
    body:{name:'Weatherproof housing',info:'Rated for outdoor use. Seal the cable joint against rain.'},lens:{name:'Lens and sensor',info:'Keep it clean and out of direct sun.'},
    ir:{name:'Infrared LEDs',info:'Night vision. They draw extra power at night.'},bracket:{name:'Wall bracket',info:'Adjusts the viewing angle.'},
    'ETH (PoE in)':{name:'Network pigtail (PoE in)',info:'Short lead ending in an RJ45 coupler. One cable from a PoE switch brings data and about 5–7 W of power.'},led:{name:'IR status',info:'Glows when night vision is active.'},
  }
});

/* ===================== IP desk phone ===================== */
A.register('voip',{
  name:'IP phone', cat:'network',
  views:{
    front:{w:220,h:170,draw:s=>{
      let g=P.shadow(110,168,106,4);
      g+=P.body(0,10,220,152,{rx:12});
      g+=part('handset',`<path d="M12 24 Q12 14 22 14 H44 Q54 14 54 24 V148 Q54 158 44 158 H22 Q12 158 12 148Z" fill="url(#m-black)" stroke="#0B0D0F"/>`+
        `<rect x="20" y="24" width="26" height="20" rx="5" fill="#15191C"/><rect x="20" y="126" width="26" height="20" rx="5" fill="#15191C"/>`);
      g+=part('screen',`<rect x="68" y="22" width="110" height="46" rx="3" fill="${on(s)?'#CFE6F5':'#1A2126'}"/>`+
        (on(s)?T(123,40,'201',{a:'middle',s:9,f:'#15324A',w:700})+T(123,56,s.ip==null?'192.168.1.60':(s.ip||'No network'),{a:'middle',s:6,f:'#15324A'}):''));
      g+=part('msg-led',P.led(200,22,{r:3,lit:on(s)&&s.msg,blink:true,color:'r'}));
      let keys=''; for(let r=0;r<4;r++) for(let c=0;c<3;c++) keys+=`<rect x="${82+c*28}" y="${82+r*18}" width="24" height="13" rx="3" fill="url(#m-grey)"/>`+T(94+c*28,91+r*18,['1','2','3','4','5','6','7','8','9','*','0','#'][r*3+c],{a:'middle',s:6,f:'#EEF2F4',w:700});
      g+=part('keypad',keys);
      g+=part('nav',`<circle cx="194" cy="100" r="14" fill="url(#m-grey)"/><circle cx="194" cy="100" r="6" fill="url(#m-black)"/>`);
      return g; }},
    back:{w:220,h:170,draw:s=>{
      let g=P.shadow(110,168,106,4);
      g+=P.body(0,10,220,152,{rx:12});
      g+=`<rect x="40" y="96" width="140" height="44" rx="4" fill="#15191C"/>`;
      g+=part('ETH (PoE in)',P.rj45(50,106,{w:16,h:14,plug:s.plugs&&s.plugs['ETH (PoE in)']}));
      g+=part('pc',P.rj45(74,106,{w:16,h:14}));
      g+=part('dc',P.dc(108,113,{r:4.2}));
      g+=part('handset-port',`<rect x="124" y="108" width="12" height="10" rx="1" fill="#0B0D0F" stroke="#6F787F" stroke-width=".5"/>`);
      g+=part('headset-port',`<rect x="146" y="108" width="12" height="10" rx="1" fill="#0B0D0F" stroke="#6F787F" stroke-width=".5"/>`);
      [[58,'Internet'],[82,'PC'],[108,'DC5V'],[130,'Handset'],[152,'Headset']].forEach(([x,t])=>g+=T(x,134,t,{a:'middle',s:4,f:'#AEB8BF'}));
      g+=part('stand',`<rect x="60" y="30" width="100" height="46" rx="6" fill="url(#m-black)" stroke="#0B0D0F"/>`);
      return g; }},
  },
  defaultView:'front', thumbView:'front', state:{on:false,msg:false},
  viewNames:{front:'Front',back:'Back'},
  viewNotes:{front:'The phone registers with the phone system over the network.',back:'Plug the wall cable into Internet; the PC port lets the desk PC share the same cable.'},
  parts:{
    handset:{name:'Handset',info:'Connects with a coiled RJ9 cable.'},screen:{name:'Display',info:'Shows the extension number and IP address.'},
    'msg-led':{name:'Message light',info:'Blinks red for voicemail or a missed call.'},keypad:{name:'Keypad',info:'Dialling.'},nav:{name:'Navigation key',info:'Menus and settings.'},
    'ETH (PoE in)':{name:'Internet port (PoE in)',info:'To the switch. Also powers the phone over PoE (about 5 W).'},
    pc:{name:'PC port',info:'Pass-through: the desk PC plugs in here and shares the phone’s cable.'},
    dc:{name:'Power jack',info:'Only needed when the switch has no PoE.'},'handset-port':{name:'Handset port',info:'RJ9 for the handset cord.'},
    'headset-port':{name:'Headset port',info:'For a call-centre headset.'},stand:{name:'Stand',info:'Adjusts the viewing angle; can be wall mounted.'},
  }
});

/* ===================== Smart plug ===================== */
A.register('iot',{
  name:'Smart plug (IoT)', cat:'network',
  views:{
    front:{w:120,h:130,draw:s=>{
      let g=P.shadow(60,128,48,4);
      g+=part('body',`<rect x="8" y="4" width="104" height="116" rx="22" fill="url(#m-white)" stroke="#C3CBD1"/>`);
      g+=part('socket',`<circle cx="60" cy="58" r="32" fill="#EEF1F3" stroke="#CBD2D7"/>`+
        `<rect x="44" y="46" width="5" height="18" rx="1.5" fill="#2A3035"/><rect x="71" y="46" width="5" height="18" rx="1.5" fill="#2A3035"/><path d="M56 74 a4 4 0 0 1 8 0 v3 h-8Z" fill="#2A3035"/>`);
      const col=!on(s)?'off':s.pairing?'b':'b';
      g+=part('button',`<circle cx="60" cy="104" r="8" fill="url(#m-white)" stroke="#AEB6BC"/>`+P.led(60,104,{r:2.4,lit:on(s),blink:on(s)&&s.pairing,color:'b'}));
      return g; }},
    side:{w:120,h:130,draw:s=>{
      let g=P.shadow(60,128,48,4);
      g+=`<rect x="14" y="4" width="70" height="116" rx="16" fill="url(#m-white-h)" stroke="#C3CBD1"/>`;
      g+=part('prongs',`<rect x="84" y="44" width="26" height="6" rx="1.5" fill="url(#m-metal)"/><rect x="84" y="70" width="26" height="6" rx="1.5" fill="url(#m-metal)"/>`);
      return g; }},
  },
  defaultView:'front', thumbView:'front', state:{on:false,pairing:false},
  viewNames:{front:'Front',side:'Side'},
  viewNotes:{front:'A fast blue blink means pairing mode. Most smart plugs only work on 2.4 GHz Wi-Fi.',side:'Plugs straight into the wall outlet.'},
  parts:{
    body:{name:'Housing',info:'Contains a relay and a small 2.4 GHz Wi-Fi module.'},socket:{name:'Outlet',info:'The appliance plugs in here. Check the load rating.'},
    button:{name:'Button and status light',info:'Press to switch; hold 5 seconds to enter pairing mode (fast blue blink).'},prongs:{name:'Plug pins',info:'Fits the wall outlet.'},
  }
});
})();
