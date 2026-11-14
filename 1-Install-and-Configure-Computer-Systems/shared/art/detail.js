/* Fine detail layer: surface texture, rating labels, screws, feet, printed icons.
   Each entry adds to an existing drawing (under = behind it, over = on top), so the base drawings stay simple. */
(function(){
const A=window.Art, P=A.P, T=P.text, part=P.part;
const on=s=>!!s.on;

/* ---------- deterministic pseudo-random numbers (same picture every time) ---------- */
function rng(seed){ let x=seed>>>0||1; return ()=>{ x^=x<<13; x^=x>>>17; x^=x<<5; return ((x>>>0)%10000)/10000; }; }

/* ---------- patterns ---------- */
(function(){
  const r=rng(7); let dark='', light='', lightW='';
  for(let i=0;i<110;i++){ const x=(r()*48).toFixed(1), y=(r()*48).toFixed(1), rad=(.25+r()*.35).toFixed(2);
    if(i%2) dark+=`<circle cx="${x}" cy="${y}" r="${rad}" fill="#000" opacity="${(.05+r()*.07).toFixed(3)}"/>`;
    else light+=`<circle cx="${x}" cy="${y}" r="${rad}" fill="#fff" opacity="${(.05+r()*.07).toFixed(3)}"/>`;
    lightW+=`<circle cx="${x}" cy="${y}" r="${rad}" fill="#5A6770" opacity="${(.015+r()*.025).toFixed(3)}"/>`; }
  let brush=''; const rb=rng(21); for(let i=0;i<14;i++){ brush+=`<rect x="0" y="${(i*0.43).toFixed(2)}" width="80" height=".22" fill="${rb()>.5?'#fff':'#000'}" opacity="${(.05+rb()*.08).toFixed(3)}"/>`; }
  A.addDefs(
    `<pattern id="p-grain" width="48" height="48" patternUnits="userSpaceOnUse">${dark}${light}</pattern>`+
    `<pattern id="p-grain-w" width="48" height="48" patternUnits="userSpaceOnUse">${lightW}</pattern>`+
    `<pattern id="p-brush" width="80" height="6" patternUnits="userSpaceOnUse">${brush}</pattern>`+
    `<pattern id="p-diag" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1" height="3" fill="#fff" opacity=".05"/></pattern>`+
    `<pattern id="p-holes" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".55" fill="#0B0D0F"/></pattern>`+
    `<linearGradient id="m-sticker" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBFBF8"/><stop offset="1" stop-color="#E9E9E2"/></linearGradient>`+
    `<linearGradient id="m-sticker-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6ECEF"/><stop offset="1" stop-color="#C9D2D8"/></linearGradient>`+
    `<linearGradient id="m-rubber-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A2F33"/><stop offset="1" stop-color="#0B0D0F"/></linearGradient>`);
})();

/* ---------- primitives ---------- */
P.grain=(x,y,w,h,rx=0,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#${o.light?'p-grain-w':'p-grain'})" opacity="${o.op==null?1:o.op}" pointer-events="none"/>`;
P.brush=(x,y,w,h,rx=0,op=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#p-brush)" opacity="${op}" pointer-events="none"/>`;
P.barcode=(x,y,w,h,seed=3)=>{ const r=rng(seed); let s='', cx=x; while(cx<x+w-0.6){ const bw=.18+r()*.55; if(r()>.35) s+=`<rect x="${cx.toFixed(2)}" y="${y}" width="${bw.toFixed(2)}" height="${h}" fill="#15191C"/>`; cx+=bw+.12+r()*.3; } return s; };
P.qr=(x,y,size,seed=5)=>{ const r=rng(seed), n=11, c=size/n; let s=`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff"/>`;
  const finder=(fx,fy)=>`<rect x="${fx}" y="${fy}" width="${c*3}" height="${c*3}" fill="#15191C"/><rect x="${fx+c*.7}" y="${fy+c*.7}" width="${c*1.6}" height="${c*1.6}" fill="#fff"/><rect x="${fx+c}" y="${fy+c}" width="${c}" height="${c}" fill="#15191C"/>`;
  for(let i=0;i<n;i++) for(let j=0;j<n;j++){ if((i<4&&j<4)||(i>6&&j<4)||(i<4&&j>6)) continue; if(r()>.52) s+=`<rect x="${(x+i*c).toFixed(2)}" y="${(y+j*c).toFixed(2)}" width="${c.toFixed(2)}" height="${c.toFixed(2)}" fill="#15191C"/>`; }
  return s+finder(x,y)+finder(x+c*8,y)+finder(x,y+c*8); };
/* a rating / serial label: title line, small lines, optional barcode, QR and marks */
P.sticker=(x,y,w,h,o={})=>{
  const fs=o.fs||Math.max(1.6,Math.min(3.2,h/8));
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx==null?.8:o.rx}" fill="url(#${o.silver?'m-sticker-s':'m-sticker'})" stroke="#BDB9A8" stroke-width=".25"/>`;
  const qrS=o.qr?Math.min(h-2*fs*.4-1,w*.3):0; const tx=x+fs*.6;
  let ty=y+fs*1.3;
  if(o.title){ s+=T(tx,ty,o.title,{s:fs*1.05,f:'#1E2328',w:700}); ty+=fs*1.25; }
  (o.lines||[]).forEach(l=>{ s+=T(tx,ty,l,{s:fs*.8,f:'#3A4046'}); ty+=fs*1.05; });
  if(o.barcode){ const bh=Math.max(1.4,Math.min(fs*1.6,y+h-ty-fs*.4)); if(bh>0.8) s+=P.barcode(tx,ty-fs*.4,Math.min(w*.55,w-qrS-fs*1.6),bh,o.seed||9); ty+=bh; }
  if(o.qr) s+=P.qr(x+w-qrS-fs*.5,y+(h-qrS)/2,qrS,o.seed||5);
  if(o.marks){ const my=y+h-fs*.55; s+=T(x+w-(o.qr?qrS+fs*1.2:fs*.6),my,'CE  ⚠  ♻',{a:'end',s:fs*.8,f:'#3A4046',w:700}); }
  return s; };
P.foot=(x,y,w,h=3)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="url(#m-rubber-f)"/>`;
P.seam=(x1,y1,x2,y2,op=.35)=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#000" stroke-opacity="${op}" stroke-width=".6"/><path d="M${x1} ${y1+.7} L${x2} ${y2+.7}" stroke="#fff" stroke-opacity="${op*.6}" stroke-width=".5"/>`;
P.thumbscrew=(x,y,r=3.2)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#m-metal)" stroke="#5A636A" stroke-width=".5"/>`+
  Array.from({length:12},(_,i)=>{ const a=i*30*Math.PI/180; return `<path d="M${(x+Math.cos(a)*r*.78).toFixed(2)} ${(y+Math.sin(a)*r*.78).toFixed(2)} L${(x+Math.cos(a)*r).toFixed(2)} ${(y+Math.sin(a)*r).toFixed(2)}" stroke="#6F787F" stroke-width=".35"/>`; }).join('')+
  `<path d="M${x-r*.45} ${y}h${r*.9}M${x} ${y-r*.45}v${r*.9}" stroke="#4A535A" stroke-width="${r*.18}" stroke-linecap="round"/>`;
/* small printed icons, centred on x,y, size = height */
P.icon=(name,x,y,sz=5,col='#9FAAB2')=>{ const k=sz/10, sw=(1.1*k).toFixed(2), st=`fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
  const g=inner=>`<g transform="translate(${x-5*k} ${y-5*k}) scale(${k})">${inner}</g>`;
  const S=`fill="none" stroke="${col}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"`;
  switch(name){
    case 'power': return g(`<path d="M3.2 3.2 A4 4 0 1 0 6.8 3.2" ${S}/><path d="M5 1 V5" ${S}/>`);
    case 'wifi': return g(`<path d="M1 4.2 Q5 0.6 9 4.2" ${S}/><path d="M2.6 6 Q5 3.6 7.4 6" ${S}/><circle cx="5" cy="8" r=".9" fill="${col}"/>`);
    case 'globe': return g(`<circle cx="5" cy="5" r="4" ${S}/><path d="M1 5 H9 M5 1 Q2.4 5 5 9 Q7.6 5 5 1" ${S}/>`);
    case 'lan': return g(`<rect x="1" y="1" width="3" height="3" ${S}/><rect x="6" y="1" width="3" height="3" ${S}/><rect x="3.5" y="6" width="3" height="3" ${S}/><path d="M2.5 4 V5 H7.5 V4 M5 5 V6" ${S}/>`);
    case 'wps': return g(`<path d="M8.4 3.4 A4 4 0 1 0 8.6 6.6" ${S}/><path d="M8.8 1.4 V3.8 H6.4" ${S}/>`);
    case 'usb': return g(`<path d="M5 9 V1.6 M5 1.6 L3.6 3 M5 1.6 L6.4 3 M5 6 L2.6 4.4 V3.6 M5 7 L7.4 5.4 V4.6" ${S}/><circle cx="5" cy="9" r=".9" fill="${col}"/>`);
    case 'home': return g(`<path d="M1.4 5 L5 1.6 L8.6 5 M2.6 4 V8.6 H7.4 V4" ${S}/>`);
    case 'stop': return g(`<path d="M2.4 2.4 L7.6 7.6 M7.6 2.4 L2.4 7.6" ${S}/>`);
    case 'back': return g(`<path d="M4 2.4 L1.6 4.8 L4 7.2 M1.6 4.8 H6.4 Q8.6 4.8 8.6 7" ${S}/>`);
    case 'ok': return g(`<path d="M2 5.2 L4.2 7.4 L8 2.8" ${S}/>`);
    case 'mute': return g(`<path d="M3 4 V6 Q3 8 5 8 Q7 8 7 6 V4 Q7 2 5 2 Q3 2 3 4 Z M1.4 1.4 L8.6 8.6" ${S}/>`);
    case 'speaker': return g(`<path d="M1.4 3.8 H3.4 L5.8 1.8 V8.2 L3.4 6.2 H1.4Z M7.2 3.4 Q8.4 5 7.2 6.6" ${S}/>`);
    case 'hold': return g(`<path d="M3.4 2 V8 M6.6 2 V8" ${S}/>`);
    case 'transfer': return g(`<path d="M1.4 3.4 H8 L6.4 1.8 M8.6 6.6 H2 L3.6 8.2" ${S}/>`);
    case 'menu': return g(`<path d="M2 3 H8 M2 5 H8 M2 7 H8" ${S}/>`);
    case 'input': return g(`<rect x="1.4" y="2" width="7.2" height="5" rx=".6" ${S}/><path d="M5 7 V8.6 M3.4 8.6 H6.6" ${S}/>`);
    case 'phone': return g(`<path d="M2.4 1.6 L4 1.6 L4.8 3.6 L3.8 4.4 Q4.6 6 5.8 6.4 L6.6 5.4 L8.6 6.2 V7.8 Q8.6 8.6 7.8 8.6 Q2 8.2 1.6 2.4 Q1.6 1.6 2.4 1.6Z" ${S}/>`);
    case 'sun': return g(`<circle cx="5" cy="5" r="2" ${S}/><path d="M5 .8V2 M5 8V9.2 M.8 5H2 M8 5H9.2 M2 2L2.8 2.8 M7.2 7.2L8 8 M8 2L7.2 2.8 M2.8 7.2L2 8" ${S}/>`);
    case 'lock': return g(`<rect x="2.4" y="4.4" width="5.2" height="4.4" rx=".6" ${S}/><path d="M3.4 4.4 V3.2 Q3.4 1.4 5 1.4 Q6.6 1.4 6.6 3.2 V4.4" ${S}/>`);
    case 'disk': return g(`<rect x="2" y="1.4" width="6" height="7.2" rx=".8" ${S}/><circle cx="5" cy="4.4" r="1.6" ${S}/>`);
  }
  return '';
};

/* ---------- decorating helper ---------- */
function deco(type, view, over, under){ const d=A.def(type); if(!d||!d.views[view]) return; const v=d.views[view], f=v.draw;
  v.draw=(s,o)=>(under?under(s):'')+f(s,o)+(over?over(s):''); }
function parts(type, obj){ const d=A.def(type); if(d) d.parts=Object.assign(d.parts||{},obj); }

/* ===================== Router ===================== */
deco('router','back',s=>{
  let g=P.grain(0,118,250,46,9,{op:.9});
  [30,92,158,220].forEach(x=>{ g+=`<rect x="${x-3.5}" y="112" width="7" height="3" rx="1" fill="#0B0D0F" opacity=".55"/><circle cx="${x}" cy="116.5" r="4.4" fill="url(#m-black-h)" stroke="#0B0D0F" stroke-width=".5"/><circle cx="${x}" cy="116.5" r="1.4" fill="#0B0D0F" opacity=".6"/>`+
    `<path d="M${x-3.5} 50 h7" stroke="#000" stroke-opacity=".35" stroke-width=".6"/><path d="M${x-2} 42 v-4" stroke="#fff" stroke-opacity=".12" stroke-width="1.2"/>`; });
  g+=`<rect x="6" y="119" width="238" height="1.2" rx=".6" fill="#fff" opacity=".12"/>`;
  return g; }, s=>P.foot(20,162,20,4)+P.foot(210,162,20,4));
deco('router','front',s=>{
  const ic=['power','wifi','wifi','globe','lan','wps'];
  let g=P.grain(0,18,250,44,10,{op:.9})+`<rect x="0" y="18" width="250" height="18" rx="10" fill="url(#p-diag)"/>`;
  ic.forEach((n,i)=>{ const x=58+i*27; g+=P.icon(n,x,31,5.4,'#9FAAB2'); if(i===1||i===2) g+=T(x+4.2,29,i===1?'2.4':'5',{s:2.6,f:'#9FAAB2',w:700}); });
  g+=`<rect x="14" y="56.2" width="222" height="1" rx=".5" fill="url(#m-metal)" opacity=".55"/>`;
  return g; }, s=>P.foot(22,58,18,5)+P.foot(210,58,18,5));

/* ===================== ONT ===================== */
deco('ont','back',s=>P.grain(0,12,210,52,6,{light:true})+P.vents(14,14.5,182,3,{n:46,slot:1.1,col:'#BCC5CB'}), s=>P.foot(16,62,16,4)+P.foot(178,62,16,4));
deco('ont','top',s=>P.grain(0,0,210,112,10,{light:true})+`<rect x="6" y="3" width="198" height="2" rx="1" fill="#fff" opacity=".6"/>`);

/* ===================== Switches ===================== */
['switch','poeswitch'].forEach(t=>{ const poe=t==='poeswitch';
  deco(t,'back',s=>P.grain(0,6,210,44,4,{op:.9})+P.screw(3.2,28,1.3)+P.screw(206.8,28,1.3), s=>P.foot(16,48,18,4)+P.foot(176,48,18,4));
  deco(t,'front',s=>{ let g=P.grain(0,6,210,38,4,{op:.9});
    g+=T(poe?56:44,13,'LINK/ACT',{s:2.8,f:'#8C979F',w:700});
    if(poe) g+=T(52,30.2,'PoE',{a:'end',s:2.8,f:'#8C979F',w:700});
    g+=T(204,13,poe?'8-Port Gigabit PoE+ Switch':'8-Port Gigabit Desktop Switch',{a:'end',s:3.2,f:'#8C979F'});
    return g; }, s=>P.foot(16,42,18,4)+P.foot(176,42,18,4));
});

/* ===================== Access point ===================== */
deco('ap','top',s=>P.grain(5,2,160,160,80,{light:true})+`<circle cx="85" cy="82" r="70" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/><circle cx="85" cy="82" r="71" fill="none" stroke="#B9C2C8" stroke-opacity=".5" stroke-width=".6"/>`);
deco('ap','back',s=>P.grain(5,2,160,160,80,{light:true})+part('label',P.sticker(58,124,54,22,{title:'MAC: 3C-52-A1-7F-20-0C',lines:['S/N: 2231047000123','Model: AP-AX1800  ·  48V ⎓ 0.3A'],qr:true,fs:2.5,seed:11}))+
  [0,90,180,270].map(a=>{ const x=85+Math.cos(a*Math.PI/180)*38, y=82+Math.sin(a*Math.PI/180)*38; return P.screw(x,y,1.5); }).join(''));
parts('ap',{label:{name:'Device label',info:'MAC address, serial number and a QR code. Write the MAC down before the access point goes up on the ceiling: you need it for DHCP reservations and controller adoption.'}});

/* ===================== Desktop PC ===================== */
deco('pc','front',s=>P.grain(0,0,200,412,10,{op:.8})+`<rect x="8" y="2" width="184" height="2" rx="1" fill="#fff" opacity=".12"/>`+P.seam(14,64,186,64,.4)+
  `<rect x="86" y="394" width="28" height="5" rx="2.5" fill="url(#m-metal)" opacity=".7"/>`);
deco('pc','back',s=>{
  let g=P.grain(0,0,200,412,10,{op:.8});
  g+=P.thumbscrew(193,22)+P.thumbscrew(193,392)+P.thumbscrew(7,22)+P.thumbscrew(7,392);
  for(let i=0;i<7;i++) g+=P.screw(15,209.5+i*16,1.5);
  g+=[[18,334],[182,334],[18,396],[182,396]].map(([x,y])=>P.screw(x,y,1.8)).join('');
  g+=part('psu-label',P.sticker(146,372,36,24,{title:'650W ATX',lines:['AC 100-240V~ 8A','50/60Hz','+12V ⎓ 54A'],fs:2.3,barcode:true,seed:4}));
  g+=[[50,36,'USB'],[36,82,'LAN'],[58,113,'HDMI'],[58,124,'DP']].map(([x,y,t])=>T(x,y,t,{s:2.6,f:'#3A4450',w:700})).join('');
  return g; });
parts('pc',{'psu-label':{name:'PSU rating label',info:'Wattage, input voltage and current. The +12V rating matters most for the CPU and graphics card.'}});

/* ===================== Laptop ===================== */
deco('laptop','front',s=>{
  let g=`<rect x="58" y="167.5" width="204" height="4" rx="1.5" fill="#20262B"/>`;
  g+=P.brush(26,172,268,42,0,.5);
  g+=part('power-key',`<rect x="283" y="175" width="9" height="4" rx="1" fill="#2A3036"/>`+P.icon('power',287.5,177,2.6,'#AEB8BF'));
  g+=`<path d="M14 196 L30 196 M10 202 L30 202" stroke="#6F787F" stroke-width="1.6" stroke-dasharray=".8 1.1" opacity=".8"/><path d="M290 196 L306 196 M290 202 L310 202" stroke="#6F787F" stroke-width="1.6" stroke-dasharray=".8 1.1" opacity=".8"/>`;
  g+=`<rect x="252" y="204" width="11" height="6" rx="1" fill="#E9EEF3" stroke="#AEB8BF" stroke-width=".3"/><rect x="253" y="205" width="9" height="2" fill="#2E6FD8" opacity=".6"/>`;
  if(on(s)) g+=[0,1,2].map(i=>`<rect x="44" y="${16+i*14}" width="8" height="8" rx="1.5" fill="#fff" opacity=".75"/>`).join('')+[0,1,2,3].map(i=>`<rect x="${134+i*10}" y="152" width="6" height="6" rx="1" fill="${['#E6E9EC','#F4C21A','#3AA15A','#2E6FD8'][i]}" opacity=".9"/>`).join('');
  return g; });
deco('laptop','side',s=>part('vent',P.vents(180,30,86,7,{n:22,slot:1.4,col:'#6F787F'}))+part('sd',`<rect x="132" y="29.8" width="18" height="2.4" rx=".6" fill="#15191C"/>`)+part('kensington',`<rect x="286" y="28" width="5.4" height="4" rx="1" fill="#15191C"/>`)+P.brush(4,22,314,22,3,.6));
parts('laptop',{'power-key':{name:'Power key',info:'Top-right of the keyboard on most laptops. Hold 10 seconds to force it off if it freezes.'},vent:{name:'Air vent',info:'Hot air leaves here. Do not block it on a bed or cushion.'},sd:{name:'SD card slot',info:'Reads camera memory cards.'},kensington:{name:'Security slot',info:'For a cable lock in labs and offices.'}});

/* ===================== Printer ===================== */
deco('printer','front',s=>{
  let g=P.grain(6,44,248,168,8,{light:true})+P.grain(10,0,240,46,6,{light:true});
  g+=P.seam(10,45,250,45,.25)+P.seam(14,136,246,136,.2);
  g+=P.icon('home',222,64,4,'#E3E8EB')+P.icon('stop',234,64,4,'#E3E8EB')+P.icon('ok',228,77,4,'#E3E8EB');
  g+=T(168,108,'USB',{a:'middle',s:3,f:'#8A949B',w:700})+P.icon('usb',176,99.5,4,'#8A949B');
  g+=`<rect x="34" y="62" width="96" height="3" fill="#FFFFFF" stroke="#D4DADE" stroke-width=".3"/>`;
  return g; });
deco('printer','back',s=>P.grain(6,6,248,206,8,{light:true})+part('label',P.sticker(178,86,62,40,{title:'Laser MFP  ·  Model LP-4020dn',lines:['220-240V~ 50/60Hz 4.5A','S/N: VNB3K21456','MAC: 00:1E:0B:4C:7A:91'],barcode:true,marks:true,fs:2.9,seed:13}))+
  [[36,114],[164,114],[36,186],[164,186]].map(([x,y])=>P.screw(x,y,1.4)).join(''));
parts('printer',{label:{name:'Rating label',info:'Model, power rating, serial number and the MAC address of the network card. Use the MAC to reserve a fixed address in DHCP.'}});

/* ===================== NAS ===================== */
deco('nas','front',s=>P.grain(0,0,120,172,8,{op:.8})+T(35,13.5,'1',{a:'middle',s:4,f:'#8C979F',w:700})+T(85,13.5,'2',{a:'middle',s:4,f:'#8C979F',w:700})+
  P.icon('disk',28,152,3.4,'#8C979F')+P.icon('disk',78,152,3.4,'#8C979F')+`<rect x="6" y="2" width="108" height="1.6" rx=".8" fill="#fff" opacity=".12"/>`);
deco('nas','back',s=>P.grain(0,0,120,172,8,{op:.8})+part('label',P.sticker(30,146,46,18,{title:'S/N 2280QVR00821',lines:['MAC1 00:11:32:A4:0E:5B','12V ⎓ 5A'],fs:2.3,barcode:false}))+
  P.screw(10,10,1.8)+P.screw(110,10,1.8)+P.screw(10,162,1.8)+P.screw(110,162,1.8)+part('kensington',`<rect x="99" y="148" width="6" height="4.4" rx="1" fill="#0B0D0F" stroke="#5A636A" stroke-width=".4"/>`));
parts('nas',{label:{name:'Serial and MAC label',info:'The MAC address lets you find the NAS in the router’s client list or reserve its IP address.'},kensington:{name:'Security slot',info:'Lock the NAS to the desk.'}});

/* ===================== Camera ===================== */
deco('camera','side',s=>P.grain(20,36,150,40,18,{light:true})+[0,1,2,3,4,5].map(i=>`<path d="M${34+i*22} 31 v6" stroke="#C3CBD1" stroke-width=".8"/>`).join('')+
  `<circle cx="170" cy="56" r="5.2" fill="url(#m-white-h)" stroke="#BFC7CD" stroke-width=".6"/>`+P.screw(134,114,1.4)+P.screw(164,114,1.4)+
  part('label',P.sticker(74,63,44,9,{title:'IPC-B2 · 12V⎓ / PoE',lines:['S/N 7F31A0092'],fs:2.2})));
deco('camera','front',s=>`<circle cx="65" cy="62" r="44" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.2"/><path d="M34 40 A38 38 0 0 1 60 25" stroke="#fff" stroke-opacity=".18" stroke-width="2.4" fill="none"/>`+
  part('sensor',`<circle cx="65" cy="27" r="2" fill="#2A3035" stroke="#5A636A" stroke-width=".4"/>`));
parts('camera',{label:{name:'Model and serial label',info:'Shows the power options (12 V or PoE) and serial number.'},sensor:{name:'Light sensor',info:'Switches the camera to night mode (infrared) when it gets dark.'}});

/* ===================== IP phone ===================== */
deco('voip','front',s=>{
  let g=P.grain(0,10,220,152,12,{op:.8});
  g+=part('softkeys',[0,1,2,3].map(i=>`<rect x="${70+i*27}" y="71" width="22" height="5" rx="2" fill="url(#m-grey)"/>`).join(''));
  g+=part('linekeys',[0,1].map(i=>`<rect x="183" y="${34+i*12}" width="12" height="7" rx="1.5" fill="url(#m-grey)"/>`+P.led(199,37.5+i*12,{r:1.2,lit:on(s)&&i===0,color:'g'})).join(''));
  g+=part('fkeys',[['hold',68,84],['transfer',68,101],['mute',184,124],['speaker',198,124]].map(([n,x,y])=>`<rect x="${x-8}" y="${y-5}" width="16" height="10" rx="2.5" fill="url(#m-grey)"/>`+P.icon(n,x,y,5,'#EEF2F4')).join(''));
  return g; });
deco('voip','back',s=>P.grain(0,10,220,152,12,{op:.8})+part('label',P.sticker(166,32,46,26,{title:'MAC 805E0C3A91F2',lines:['S/N 3120029811','5V⎓0.6A / PoE'],qr:true,fs:2.3,seed:17})));
parts('voip',{softkeys:{name:'Soft keys',info:'Their job changes with the screen: History, Directory, DND, Menu.'},linekeys:{name:'Line keys',info:'Each line (account) has a key; the light shows its status.'},
  fkeys:{name:'Hold, Transfer, Mute and Speaker',info:'Hold parks the caller, Transfer passes the call to another extension.'},label:{name:'MAC label',info:'The phone system identifies the phone by this MAC address during setup (provisioning).'}});

/* ===================== Smart plug ===================== */
deco('iot','front',s=>P.grain(8,4,104,116,22,{light:true})+T(60,96,'10A · 220–240V~',{a:'middle',s:3.4,f:'#8A949B'}));
deco('iot','side',s=>P.grain(14,4,70,116,16,{light:true})+P.vents(30,14,38,5,{n:8,slot:1.4,col:'#C3CBD1'})+part('reset',P.pinhole(49,100)));
parts('iot',{reset:{name:'Reset pinhole',info:'Clears the Wi-Fi settings so the plug can be paired again.'}});

/* ===================== Monitor ===================== */
deco('monitor','front',s=>P.grain(0,176,320,14,0,{op:.7})+part('osd',[0,1,2,3].map(i=>`<rect x="${246+i*9}" y="186.5" width="6" height="2.4" rx=".8" fill="#2E353B"/>`).join('')+P.icon('menu',249,183,3,'#6F7A82')+P.icon('input',258,183,3,'#6F7A82')+P.icon('sun',267,183,3,'#6F7A82')));
deco('monitor','back',s=>P.grain(0,0,320,190,6,{op:.7})+part('vent',P.vents(90,48,140,8,{n:30,slot:1.6,col:'#0B0D0F'}))+
  part('label',P.sticker(52,126,66,26,{title:'24" LED Monitor  ·  Model M24F',lines:['100-240V~ 50/60Hz 1.0A','S/N: 2305MX104428'],barcode:true,marks:true,fs:2.8,seed:19}))+
  part('kensington',`<rect x="26" y="150" width="6" height="4.6" rx="1" fill="#0B0D0F" stroke="#5A636A" stroke-width=".4"/>`)+
  [['HDMI',213],['DP',232.5],['DC IN',260],['AUDIO',278]].map(([t,x])=>T(x,168,t,{a:'middle',s:2.6,f:'#AEB8BF',w:700})).join(''));
parts('monitor',{osd:{name:'Menu buttons',info:'Input source, brightness and the on-screen menu. If the PC is on but the screen says No signal, press Input and choose the port you used.'},
  vent:{name:'Vents',info:'Heat from the power board escapes here.'},label:{name:'Rating label',info:'Model, power rating and serial number, needed for warranty claims.'},kensington:{name:'Security slot',info:'Cable lock for labs.'}});

/* ===================== PC parts ===================== */
deco('hdd','top',s=>P.brush(4,4,93.6,139,2,.55));
deco('ssd25','top',s=>P.brush(3,3,63.85,94,2,.5)+part('sn-label',P.sticker(8,68,54,24,{title:'SATA SSD 500GB',lines:['S/N: 2231E6A0F17C','5V ⎓ 1.7A'],barcode:true,marks:true,fs:2.6,seed:23})));
parts('ssd25',{'sn-label':{name:'Serial label',info:'Serial number and power rating, needed for warranty claims.'}});
deco('nvme','top',s=>P.barcode(54,13.6,16,2.6,29)+`<rect x="74.4" y="4" width="1.8" height="1" fill="#C9A74A"/><rect x="74.4" y="17" width="1.8" height="1" fill="#C9A74A"/>`);
deco('gpu','face',s=>P.grain(8,6,220,98,6,{op:.7})+[[14,12],[222,12],[14,98],[222,98]].map(([x,y])=>P.screw(x,y,1.5)).join('')+
  `<path d="M24 10 L40 22 M200 10 L184 22 M24 100 L40 88" stroke="#fff" stroke-opacity=".07" stroke-width="1.2"/><rect x="8" y="102.6" width="214" height="1.6" fill="url(#m-metal)" opacity=".6"/>`);
deco('ram-ddr4','front',s=>P.brush(1.5,1,130.35,23,0,.5));
deco('ram-ddr5','front',s=>P.brush(1.5,1,130.35,23,0,.5));
deco('usbdrive','top',s=>[0,1,2,3,4].map(i=>`<rect x="${44+i*2}" y="3" width=".8" height="14" rx=".4" fill="#1A3D66" opacity=".35"/>`).join(''));
})();
