/* Station 2 drawings: desk scene with the working laptop, the new PC (with a front-panel close-up) and the USB drive */
window.OsScene=(function(){
const A=window.Art, P=A.P;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const T=(x,y,t,o={})=>P.text(x,y,t,Object.assign({s:9,f:'#F3ECE0'},o));
const hit=(id,x,y,w,h,label,hl)=>`<rect class="hit${hl?' hl hl-pulse':''}" data-zone="${id}" x="${x}" y="${y}" width="${w}" height="${h}" rx="4" tabindex="0" role="button" aria-label="${esc(label)}"/>`;

/* laptop placement: front view (320×230) scaled .7 */
const LX=12, LY=64, LS=.7;
/* tower placement: front view (200×420) scaled .5 */
const PX=318, PY=15, PS=.5;
/* close-up of the tower's top I/O strip (art x14..186, y14..60) */
const CX=452, CY=34, CW=256, CH=CW*46/172;

function laptopScreen(S){
  const x=36, y=8, w=248, h=142; let s='';
  s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#os-wall)"/>`;
  const win=(title,body)=>`<rect x="${x+26}" y="${y+14}" width="${w-52}" height="${h-40}" rx="4" fill="#F7F9FB"/><rect x="${x+26}" y="${y+14}" width="${w-52}" height="12" rx="4" fill="#E4E9EE"/>`+
    P.text(x+32,y+23,title,{s:6.5,f:'#2A333B',w:700})+body;
  if(S.workScreen==='rufus') s+=win('Rufus',
      P.text(x+34,y+40,'Device',{s:5.5,f:'#56616A'})+`<rect x="${x+34}" y="${y+43}" width="${w-68}" height="9" rx="1.5" fill="#fff" stroke="#B9C3CC" stroke-width=".6"/>`+
      P.text(x+37,y+49.5,S.usb.loc==='work'?'USB flash drive (32 GB)':'(no USB drive)',{s:5,f:'#2A333B'})+
      P.text(x+34,y+62,'Boot selection',{s:5.5,f:'#56616A'})+`<rect x="${x+34}" y="${y+65}" width="${w-68}" height="9" rx="1.5" fill="#fff" stroke="#B9C3CC" stroke-width=".6"/>`+
      P.text(x+37,y+71.5,S.iso&&S.iso.win?'Win11_25H2_x64.iso':S.iso&&S.iso.ubuntu?'ubuntu-26.04-desktop-amd64.iso':'Disk or ISO image',{s:5,f:'#2A333B'})+
      `<rect x="${x+34}" y="${y+82}" width="${w-68}" height="8" rx="1.5" fill="#DDE3E8"/><rect x="${x+34}" y="${y+82}" width="${S.usb.content?(w-68):0}" height="8" rx="1.5" fill="#3BAA5C"/>`+
      P.text(x+w/2,y+88,S.usb.content?'READY':'',{a:'middle',s:5,f:'#fff',w:700}));
  else if(S.workScreen==='browser') s+=win('Browser',
      `<rect x="${x+32}" y="${y+30}" width="${w-64}" height="9" rx="4.5" fill="#fff" stroke="#C9D1D8" stroke-width=".6"/>`+P.text(x+38,y+36.5,S.track==='U'?'ubuntu.com/download/desktop':'microsoft.com/software-download',{s:5,f:'#56616A'})+
      P.text(x+34,y+52,S.track==='U'?'Download Ubuntu Desktop':'Download Windows 11',{s:8,f:'#1F3346',w:700})+`<rect x="${x+34}" y="${y+60}" width="54" height="11" rx="2" fill="#1F6FC5"/>`+P.text(x+61,y+67.6,'Download',{a:'middle',s:5.5,f:'#fff',w:700}));
  s+=`<rect x="${x}" y="${y+h-10}" width="${w}" height="10" fill="#EEF1F4" opacity=".95"/>`+[0,1,2,3].map(i=>`<rect x="${x+w/2-22+i*11}" y="${y+h-8}" width="7" height="6" rx="1.2" fill="${['#1D63B0','#F2B632','#3AA15A','#6B7883'][i]}"/>`).join('');
  return s;
}
function usbAt(x,y,s,rot,content,busy){
  return `<g class="nohit" transform="translate(${x} ${y}) rotate(${rot||0}) scale(${s})">${A.inner('usbdrive','top',{on:!!busy,busy:!!busy,content})}</g>`;
}

function scene(S,opt={}){
  const hl=opt.hl||[]; const work=S.machine==='work', lab=S.machine==='lab';
  let s=`<svg class="art notip" viewBox="0 0 720 262" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Desk with the working laptop, the new PC and the USB flash drive">`;
  s+=`<defs><linearGradient id="os-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B38A5E"/><stop offset=".12" stop-color="#9C7650"/><stop offset="1" stop-color="#7A5A3A"/></linearGradient>`+
     `<linearGradient id="os-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2F62B8"/><stop offset=".55" stop-color="#5E93DE"/><stop offset="1" stop-color="#9CC3F2"/></linearGradient>`+
     `<linearGradient id="os-back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF2F4"/><stop offset="1" stop-color="#D5DDE2"/></linearGradient></defs>`;
  s+=`<rect x="0" y="0" width="720" height="226" fill="url(#os-back)"/>`;
  s+=`<rect x="0" y="224" width="720" height="38" fill="url(#os-desk)"/><rect x="0" y="224" width="720" height="2.5" fill="#C9A37A"/>`;

  /* working laptop */
  s+=`<g transform="translate(${LX} ${LY}) scale(${LS})">`;
  s+=A.inner('laptop','front',{on:true});
  s+=laptopScreen(S);
  /* USB-A port on the right edge of the base, and the drive when plugged in */
  s+=`<rect x="306" y="190" width="7" height="12" rx="1" fill="#0B0D0F" stroke="#6F787F" stroke-width=".6"/><rect x="308" y="192" width="2.6" height="8" fill="#1E6FD9"/>`;
  s+=`</g>`;
  if(work) s+=`<rect x="${LX-4}" y="${LY-6}" width="${320*LS+8}" height="${230*LS+10}" rx="8" fill="none" stroke="#F4C430" stroke-width="2.5"/>`;
  const lpx=LX+310*LS, lpy=LY+196*LS;
  if(S.usb.loc==='work') s+=usbAt(lpx-4,lpy-7,.95,0,S.usb.content,S.usbBusy);
  s+=T(LX+160*LS,248,'Working PC (technician’s laptop)',{a:'middle',s:9.5,w:700,f:'#FFF6E8'});
  s+=T(lpx+10,lpy-12,'USB',{s:7,f:'#56616A',w:700});

  /* USB drive lying on the desk */
  if(S.usb.loc==='desk'){ s+=usbAt(232,203,1.1,0,S.usb.content,false)+T(265,198,'USB drive',{a:'middle',s:8,f:'#46525B',w:700}); }

  /* new PC: tower front */
  const pcState={on:!!S.poweredOn,disk:!!S.poweredOn,usbIn:S.usb.loc==='lab',rgb:true};
  s+=`<g transform="translate(${PX} ${PY}) scale(${PS})">${A.inner('pc','front',pcState)}</g>`;
  if(lab) s+=`<rect x="${PX-4}" y="${PY-4}" width="${200*PS+8}" height="${412*PS+8}" rx="7" fill="none" stroke="#F4C430" stroke-width="2.5"/>`;
  s+=T(PX+100*PS,248,'New PC (built in Station 1)',{a:'middle',s:9.5,w:700,f:'#FFF6E8'});

  /* close-up of the front panel strip, with leader lines */
  const sx=PX+14*PS, sy=PY+14*PS, sw=172*PS, sh=46*PS;
  s+=`<path d="M${sx+sw} ${sy} L${CX} ${CY}M${sx+sw} ${sy+sh} L${CX} ${CY+CH}" stroke="#8A969E" stroke-width="1" stroke-dasharray="3 3"/>`;
  s+=`<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="none" stroke="#8A969E" stroke-width="1" stroke-dasharray="3 3"/>`;
  s+=`<rect x="${CX-6}" y="${CY-6}" width="${CW+12}" height="${CH+12}" rx="10" fill="#FFFFFF" stroke="#C3CCD2"/>`;
  { const kk=CW/172; s+=`<clipPath id="os-clip"><rect x="${CX}" y="${CY}" width="${CW}" height="${CH}" rx="6"/></clipPath><g clip-path="url(#os-clip)"><g transform="translate(${CX-14*kk} ${CY-14*kk}) scale(${kk})">${A.inner('pc','front',pcState)}</g></g>`; }
  s+=T(CX+CW/2,CY+CH+20,'Front panel close-up: power, reset, USB',{a:'middle',s:8.5,f:'#46525B',w:700});
  const k=CW/172, X=v=>CX+(v-14)*k, Y=v=>CY+(v-14)*k;
  /* labels under the buttons */
  s+=P.text(X(40),Y(56.5),'POWER',{a:'middle',s:5.5,f:'#AEB8BF'})+P.text(X(62),Y(56.5),'RESET',{a:'middle',s:5.5,f:'#AEB8BF'})+P.text(X(96),Y(56.5),'USB 3.0',{a:'middle',s:5.5,f:'#AEB8BF'});
  if(S.usb.loc==='lab') s+=P.text(X(84.5),Y(16.6),S.usb.content==='win'?'WIN 11':S.usb.content==='ubuntu'?'UBUNTU':'USB',{a:'middle',s:4.2,f:'#fff',w:700});

  /* hit zones: close-up (large, touch friendly) */
  s+=hit('POWER_BTN',X(27),Y(19),X(53)-X(27),Y(55)-Y(19),'Power button on the new PC',hl.includes('POWER_BTN'));
  s+=hit('RESET_BTN',X(55),Y(19),X(69)-X(55),Y(55)-Y(19),'Reset button on the new PC',hl.includes('RESET_BTN'));
  s+=hit('USB_LAB',X(72),Y(17),X(112)-X(72),Y(55)-Y(17),'USB ports on the new PC',hl.includes('USB_LAB'));
  /* laptop USB port */
  s+=hit('USB_WORK',lpx-12,lpy-14,40,30,'USB port on the working PC',hl.includes('USB_WORK'));
  s+='</svg>';
  return s;
}
return {scene};
})();
