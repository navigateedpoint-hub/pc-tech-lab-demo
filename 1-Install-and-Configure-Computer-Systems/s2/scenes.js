/* Station 2 demo scenes: the desk, the working laptop's screen and the new PC's monitor.
   Every screen is driven by the state (s.lap for the laptop, s.mon for the monitor), so a click moves straight to the next screen. */
window.S2Scenes=(function(){
const A=window.Art, P=A.P, esc=Demo.esc, DESK=window.OsScene;
const HASH={win:'9F4C2A7D3B18E05C6A91F2D4B7C30E8A5F16D92B4C7E0A3F81D56B9C2E47E71B',ubuntu:'3D81B75E0C92A4F6D13B8E27C5A09F4D6E1B3C8A72F50D9E4B6C1A8F37D2A50C'};
const ISO={win:'Win11_25H2_English_x64.iso',ubuntu:'ubuntu-26.04-desktop-amd64.iso'};
const t=(id,html,style='')=>`<span data-t="${id}" style="${style}">${html}</span>`;
const btn=(id,label,style='')=>`<span data-t="${id}" style="display:inline-block;padding:.35rem 1.1rem;border-radius:6px;background:#1D5B96;color:#fff;font-weight:700;${style}">${label}</span>`;
const btnL=(id,label,style='')=>`<span data-t="${id}" style="display:inline-block;padding:.35rem 1.1rem;border-radius:6px;background:#fff;color:#1b1b1b;border:1px solid #bbb;${style}">${label}</span>`;
const field=(id,label,val,style='')=>`<div style="margin:.35rem 0"><div style="font-size:.78rem;color:#555">${label}</div><div ${id?`data-t="${id}"`:''} style="border:1px solid #aaa;border-radius:3px;padding:.2rem .45rem;background:#fff;min-height:1.6em;${style}">${val}</div></div>`;

/* ---------- the desk (laptop, USB drive, new PC) ---------- */
function desk(s){ return DESK.scene(Object.assign({},s,{workScreen:s.lap&&s.lap.app==='rufus'?'rufus':s.lap&&s.lap.app==='browser'?'browser':'desktop',machine:s.machine}),{hl:[]}).replace('<svg ','<svg data-main '); }

/* ---------- the working laptop ---------- */
function lapFrame(inner,s){
  const icons=[['browser','Browser'],['terminal','Terminal'],['rufus','Rufus'],['explorer','File Explorer']].map(([k,l])=>`<span data-t="app-${k}" title="${l}" style="display:inline-grid;place-items:center;height:30px;padding:0 .55rem;border-radius:6px;font-size:.78rem;background:${s.lap.app===k?'#fff':'transparent'};border:1px solid ${s.lap.app===k?'#ccc':'transparent'}">${l}</span>`).join('');
  const tray=`<span data-t="tray-usb" title="Safely Remove Hardware" style="display:inline-grid;place-items:center;height:30px;width:34px;border-radius:6px">${s.usb.loc==='work'?`<svg width="18" height="18" viewBox="0 0 10 10">${P.icon('usb',5,5,9,'#1B2A33')}</svg>`:''}</span>`;
  return `<div style="width:100%;max-width:1080px;display:flex;flex-direction:column;align-items:center">
   <div style="width:100%;aspect-ratio:16/10;background:#1E2328;border-radius:14px 14px 4px 4px;padding:10px 10px 8px">
    <div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:3px;background:linear-gradient(135deg,#2F62B8,#86B1EE);font-family:'Segoe UI',Arial,sans-serif;color:#1b1b1b">
     ${inner}
     <div style="position:absolute;left:0;right:0;bottom:0;height:38px;background:rgba(243,243,243,.95);display:flex;justify-content:center;align-items:center;gap:.25rem">${icons}<span style="position:absolute;right:8px;top:4px">${tray}</span></div></div></div>
   <div style="width:106%;height:14px;background:linear-gradient(#C9D0D5,#8E989F);border-radius:0 0 12px 12px"></div>
   <div style="font-size:.85rem;color:var(--ink-2);margin-top:6px">Working PC (technician’s laptop)</div></div>`;
}
const win=(title,body,o={})=>`<div style="position:absolute;left:${o.l||'6%'};top:${o.t||'5%'};width:${o.w||'88%'};height:${o.h||'80%'};background:#fff;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden">
  <div style="display:flex;justify-content:space-between;padding:.3rem .7rem;border-bottom:1px solid #eee;font-size:.82rem"><b>${title}</b><span style="color:#888">—  ☐  ✕</span></div><div style="flex:1;overflow:auto;position:relative">${body}</div></div>`;
function lap(s){
  const L=s.lap, trk=s.track==='U'?'ubuntu':'win';
  let inner='';
  if(L.app==='browser'){
    const url=trk==='win'?'microsoft.com/software-download/windows11':'ubuntu.com/download/desktop';
    let page='';
    if(trk==='win'){
      page=`<h2 style="margin:.2rem 0 .4rem;font-size:1.3rem">Download Windows 11 Disk Image (ISO) for x64 devices</h2>
        <p style="font-size:.85rem;color:#444;margin:.2rem 0 .6rem">This download is a multi-edition ISO which uses your product key to unlock the correct edition.</p>
        ${field('dl-edition','Select Download',L.edition?'Windows 11 (multi-edition ISO for x64 devices)':'Select Download ▾')}
        ${L.edition?field('dl-lang','Select the product language',L.lang?'English International':'Choose one ▾'):''}
        ${L.lang?`<div style="margin-top:.6rem;padding:.6rem;border:1px solid #ddd;border-radius:6px"><b>Windows 11 English International</b><div style="margin-top:.4rem">${L.downloaded?`<span style="color:#1C7F52;font-weight:700">✓ ${ISO.win} downloaded (6.4 GB)</span>`:btn('dl-go','64-bit Download')}</div></div>`:''}
        ${L.downloaded?`<div data-t="dl-hash" style="margin-top:.6rem;font-size:.8rem;padding:.5rem;border-radius:6px;background:#F3F6F8"><b>Verify your download</b> · SHA256 (English International, x64): <span style="font-family:var(--mono)">${HASH.win}</span></div>`:''}`;
    } else {
      page=`<h2 style="margin:.2rem 0 .4rem;font-size:1.3rem">Download Ubuntu Desktop</h2>
        <div style="padding:.7rem;border:1px solid #ddd;border-radius:8px"><b>Ubuntu 26.04 LTS</b><div style="font-size:.85rem;color:#444">The latest LTS version of Ubuntu, with five years of free security and maintenance updates.</div>
        <div style="margin-top:.5rem">${L.downloaded?`<span style="color:#1C7F52;font-weight:700">✓ ${ISO.ubuntu} downloaded (5.9 GB)</span>`:btn('dl-go','Download 26.04 LTS','background:#0E8420')}</div></div>
        ${L.downloaded?`<div data-t="dl-hash" style="margin-top:.6rem;font-size:.8rem;padding:.5rem;border-radius:6px;background:#F3F6F8"><b>Verify your download</b> · SHA256SUMS: <span style="font-family:var(--mono)">${HASH.ubuntu}</span></div>`:''}`;
    }
    inner=win('Browser',`<div style="display:flex;gap:6px;align-items:center;padding:6px 8px;background:#F1F3F4;border-bottom:1px solid #ddd;font-size:.82rem"><span>← → ⟳</span><div style="flex:1;background:#fff;border:1px solid #ccc;border-radius:14px;padding:2px 10px">🔒 ${url}</div></div><div style="padding:12px 16px;font-size:.92rem">${page}</div>`);
  }
  if(L.app==='terminal'){
    const cmd=trk==='win'?`Get-FileHash .\\Downloads\\${ISO.win} -Algorithm SHA256`:`certutil -hashfile Downloads\\${ISO.ubuntu} SHA256`;
    const out=L.hashed?(trk==='win'?`\n\nAlgorithm       Hash                                                                   Path\n---------       ----                                                                   ----\nSHA256          <span data-t="hash-out" style="background:#264F2A">${HASH.win}</span>       C:\\Users\\tech\\Downloads\\${ISO.win}\n`
      :`\nSHA256 hash of Downloads\\${ISO.ubuntu}:\n<span data-t="hash-out" style="background:#264F2A">${HASH.ubuntu.toLowerCase()}</span>\nCertUtil: -hashfile command completed successfully.\n`):'';
    inner=win('Terminal · PowerShell',`<pre style="margin:0;min-height:100%;background:#0C0C0C;color:#E6E6E6;font-family:var(--mono);font-size:.74rem;padding:10px;white-space:pre-wrap">PS C:\\Users\\tech&gt; <span data-t="term-line" style="border-bottom:1px solid #555">${L.hashed?esc(cmd):esc(cmd)}</span>${out}${L.hashed?'\nPS C:\\Users\\tech&gt; ':''}</pre>`);
  }
  if(L.app==='rufus') inner=rufus(s);
  if(L.app==='explorer') inner=win('File Explorer',`<div style="padding:12px;font-size:.9rem"><b>This PC</b><div style="display:flex;gap:14px;margin-top:10px">
      <div style="padding:10px;border:1px solid #ddd;border-radius:8px;width:170px">💽 Local Disk (C:)<div style="font-size:.78rem;color:#666">312 GB free of 475 GB</div></div>
      ${s.usb.loc==='work'&&!L.ejected?`<div style="padding:10px;border:1px solid #ddd;border-radius:8px;width:190px">🔌 ${esc(s.usb.content==='win'?'CCCOMA_X64FRE (E:)':s.usb.content==='ubuntu'?'Ubuntu 26.04 (E:)':'USB DRIVE (E:)')}<div style="font-size:.78rem;color:#666">32 GB</div></div>`:''}</div></div>`);
  if(L.ejectMenu&&!L.ejected) inner+=`<div style="position:absolute;right:8px;bottom:44px;background:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.3);padding:8px 10px;font-size:.85rem">${t('eject','⏏ Eject USB DRIVE (E:)','display:block;padding:6px 8px;border-radius:6px;background:#EEF4FB')}</div>`;
  if(L.ejected&&s.usb.loc==='work') inner+=`<div style="position:absolute;right:8px;bottom:44px;background:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.3);padding:10px 12px;font-size:.85rem;max-width:280px"><b>Safe To Remove Hardware</b><div>The USB drive can now be safely removed from the computer.</div></div>`;
  return lapFrame(inner,s);
}
function rufus(s){
  const R=s.rufus, trk=s.track==='U'?'ubuntu':'win';
  const row=(l,v,id)=>`<div style="margin:.2rem 0"><div style="font-size:.74rem;color:#333">${l}</div><div ${id?`data-t="${id}"`:''} style="border:1px solid #9aa;border-radius:2px;padding:.12rem .4rem;background:#fff;min-height:1.45em;font-size:.82rem">${v}</div></div>`;
  let body=`<div style="padding:8px 12px;font-size:.82rem;display:grid;grid-template-columns:1fr;gap:0">
    <div style="font-weight:700;font-size:.95rem;border-bottom:1px solid #ccc;margin-bottom:.2rem">Drive Properties</div>
    ${row('Device',R.device?'USB DRIVE (E:) [32 GB]':'(no device)','ru-device')}
    <div style="display:grid;grid-template-columns:1fr auto;gap:6px;align-items:end">${row('Boot selection',R.iso?ISO[trk]:'Disk or ISO image (Please select)')}<div style="margin-bottom:.28rem">${t('ru-select','SELECT ▾','display:inline-block;padding:.12rem .6rem;border:1px solid #888;border-radius:2px;background:#eee;font-size:.8rem')}</div></div>
    ${trk==='win'?row('Image option',R.iso?'Standard Windows installation':''):''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${row('Partition scheme',R.gpt?'GPT':'MBR','ru-scheme')}${row('Target system',R.gpt?'UEFI (non CSM)':'BIOS (or UEFI-CSM)','ru-target')}</div>
    <div style="font-weight:700;font-size:.95rem;border-bottom:1px solid #ccc;margin:.35rem 0 .2rem">Format Options</div>
    ${row('Volume label',R.iso?(trk==='win'?'CCCOMA_X64FRE_EN-US_DV9':'Ubuntu 26.04 LTS amd64'):'')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${row('File system',R.iso?(trk==='win'?'NTFS':'FAT32'):'')}${row('Cluster size',R.iso?'4096 bytes (Default)':'')}</div>
    <div style="font-weight:700;font-size:.95rem;border-bottom:1px solid #ccc;margin:.35rem 0 .2rem">Status</div>
    <div style="border:1px solid #9aa;height:22px;position:relative;background:#eee"><div style="position:absolute;inset:0;width:${R.done?100:R.writing?55:0}%;background:${R.done?'#3BAA5C':'#3B8FDB'}"></div><div style="position:absolute;inset:0;text-align:center;font-weight:700;font-size:.8rem;line-height:22px">${R.done?'READY':R.writing?'Copying ISO files: 55.0%':'READY'}</div></div>
    <div style="display:flex;justify-content:flex-end;gap:6px;margin-top:8px">${t('ru-start','START','display:inline-block;padding:.2rem 1.2rem;border:1px solid #888;border-radius:2px;background:#eee;font-weight:700')}${t('ru-close','CLOSE','display:inline-block;padding:.2rem 1.2rem;border:1px solid #888;border-radius:2px;background:#eee')}</div></div>`;
  let dlg='';
  if(R.dialog==='custom') dlg=`<div style="position:absolute;inset:0;background:rgba(0,0,0,.2);display:grid;place-items:center"><div style="background:#fff;border:1px solid #888;width:78%;padding:10px 12px;font-size:.8rem;box-shadow:0 8px 20px rgba(0,0,0,.3)"><b>Customize Windows installation?</b>
     ${['Remove requirement for 4GB+ RAM, Secure Boot and TPM 2.0','Remove requirement for an online Microsoft account','Create a local account with username:','Set regional options to the same values as this user\'s','Disable data collection (Skip privacy questions)','Disable BitLocker automatic device encryption'].map(x=>`<div>☐ ${x}</div>`).join('')}
     <div style="text-align:right;margin-top:6px">${t('ru-ok','OK','display:inline-block;padding:.15rem 1.2rem;border:1px solid #888;background:#eee')} ${t('ru-cancel','Cancel','display:inline-block;padding:.15rem 1rem;border:1px solid #888;background:#eee')}</div></div></div>`;
  if(R.dialog==='iso') dlg=`<div style="position:absolute;inset:0;background:rgba(0,0,0,.2);display:grid;place-items:center"><div style="background:#fff;border:1px solid #888;width:78%;padding:10px 12px;font-size:.8rem"><b>ISOHybrid image detected</b><div>The image you have selected is an ISOHybrid image. It can be written in ISO Image (file copy) mode or DD Image (disk image) mode.</div>
     <div style="margin-top:4px">◉ Write in ISO Image mode (Recommended)</div><div>○ Write in DD Image mode</div><div style="text-align:right;margin-top:6px">${t('ru-ok','OK','display:inline-block;padding:.15rem 1.2rem;border:1px solid #888;background:#eee')}</div></div></div>`;
  if(R.dialog==='warn') dlg=`<div style="position:absolute;inset:0;background:rgba(0,0,0,.2);display:grid;place-items:center"><div style="background:#fff;border:1px solid #888;width:78%;padding:10px 12px;font-size:.8rem"><b>Rufus</b><div style="margin:.3rem 0">⚠ WARNING: ALL DATA ON DEVICE 'USB DRIVE (E:) [32 GB]' WILL BE DESTROYED.<br>To continue with this operation, click OK. To quit click CANCEL.</div><div style="text-align:right">${t('ru-ok','OK','display:inline-block;padding:.15rem 1.2rem;border:1px solid #888;background:#eee')} ${t('ru-cancel','Cancel','display:inline-block;padding:.15rem 1rem;border:1px solid #888;background:#eee')}</div></div></div>`;
  if(R.pick) dlg=`<div style="position:absolute;inset:0;background:rgba(0,0,0,.15);display:grid;place-items:center"><div style="background:#fff;border:1px solid #888;width:70%;font-size:.82rem"><div style="padding:6px 10px;border-bottom:1px solid #ddd"><b>Open</b> · Downloads</div>
     <div style="padding:8px 10px">${t('pick-iso','💿 '+ISO[trk],'display:block;padding:6px;border-radius:4px;background:#EEF4FB')}<div style="padding:6px;color:#666">📄 notes.txt</div></div></div></div>`;
  return win('Rufus 4.9',`<div style="position:relative;height:100%">${body}${dlg}</div>`,{l:'24%',w:'52%',t:'2%',h:'88%'});
}

/* ---------- the new PC's monitor ---------- */
function monFrame(inner,keys){
  const kb=keys?`<div style="display:flex;gap:8px;padding:8px 12px;border-radius:10px;background:#2A3036;margin-top:10px">${keys.map(([k,id])=>`<span data-t="${id}" style="display:inline-grid;place-items:center;min-width:52px;height:38px;padding:0 8px;border-radius:6px;background:linear-gradient(#F4F6F7,#D5DBDF);border:1px solid #9AA3AA;box-shadow:0 3px 0 #8A949B;font-weight:700;color:#1b2328">${k}</span>`).join('')}</div>`:'';
  return `<div style="width:100%;max-width:1080px;display:flex;flex-direction:column;align-items:center">
    <div style="width:100%;aspect-ratio:16/9;background:#111;border-radius:10px;padding:10px 10px 18px;position:relative">
      <div style="position:relative;width:100%;height:100%;overflow:hidden;background:#000;font-family:Arial,sans-serif">${inner}</div>
      <div style="position:absolute;right:16px;bottom:5px;width:5px;height:5px;border-radius:50%;background:#EAF4FF"></div></div>
    <div style="width:70px;height:26px;background:linear-gradient(90deg,#3A4148,#5A636A,#3A4148)"></div><div style="width:180px;height:9px;border-radius:5px;background:#2A3036"></div>${kb}</div>`;
}
const KEYS={post:[['Del','key-del'],['F11','key-f11'],['Esc','key-esc']],uefi:[['F7','key-f7'],['F10','key-f10'],['Esc','key-esc']],any:[['Space','key-any'],['Enter','key-enter']],enter:[['Enter','key-enter']]};
/* Windows Setup style page */
const wsetup=(title,body,next)=>`<div style="position:absolute;inset:0;background:linear-gradient(135deg,#0B2A5B,#1F4E9C 60%,#3A6FC8);display:grid;place-items:center">
  <div style="width:74%;min-height:66%;background:#fff;border-radius:10px;box-shadow:0 20px 50px rgba(0,0,0,.4);padding:22px 28px;display:flex;flex-direction:column;color:#1b1b1b">
   <div style="font-size:.8rem;color:#555;margin-bottom:4px">Windows 11 Setup</div><div style="font-size:1.35rem;font-weight:600;margin-bottom:12px">${title}</div>
   <div style="flex:1;font-size:.92rem">${body}</div><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">${next||''}</div></div></div>`;
/* Windows first-run (OOBE) page */
const oobe=(title,body,next,sub)=>`<div style="position:absolute;inset:0;background:linear-gradient(135deg,#E9EEF6,#C8D6EC);display:grid;place-items:center;color:#1b1b1b">
  <div style="width:84%;height:78%;background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.18);display:grid;grid-template-columns:1fr 1.3fr;overflow:hidden">
   <div style="background:linear-gradient(160deg,#DDE8F8,#F4F7FC);display:grid;place-items:center;font-size:3rem;color:#3A6FC8">❖</div>
   <div style="padding:26px 28px;display:flex;flex-direction:column"><div style="font-size:1.3rem;font-weight:600">${title}</div>${sub?`<div style="font-size:.85rem;color:#555;margin:.3rem 0">${sub}</div>`:''}
    <div style="flex:1;margin-top:10px;font-size:.92rem">${body}</div><div style="display:flex;justify-content:flex-end;gap:8px">${next||''}</div></div></div></div>`;
/* Ubuntu installer page */
const uinst=(title,body,next)=>`<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,#7A2E5E,#2C001E 70%);display:grid;place-items:center">
  <div style="width:74%;height:80%;background:#FAFAFA;border-radius:12px;box-shadow:0 20px 50px rgba(0,0,0,.45);display:flex;flex-direction:column;overflow:hidden;color:#1b1b1b;font-family:Ubuntu,Arial,sans-serif">
   <div style="padding:8px 14px;background:#EBEBEB;font-size:.8rem;text-align:center">Install Ubuntu 26.04 LTS</div>
   <div style="flex:1;padding:18px 26px;overflow:auto"><div style="font-size:1.3rem;font-weight:600;margin-bottom:10px">${title}</div><div style="font-size:.9rem">${body}</div></div>
   <div style="display:flex;justify-content:flex-end;gap:8px;padding:10px 16px;border-top:1px solid #e3e3e3">${next||''}</div></div></div>`;
const ubtn=(id,l,prim=true)=>`<span data-t="${id}" style="display:inline-block;padding:.35rem 1.2rem;border-radius:5px;${prim?'background:#0E8420;color:#fff;font-weight:700':'background:#fff;border:1px solid #bbb'}">${l}</span>`;
const radio=(id,l,on,sub)=>`<div ${id?`data-t="${id}"`:''} style="display:flex;gap:8px;align-items:flex-start;margin:.35rem 0;padding:.35rem .5rem;border-radius:6px;${on?'background:#EEF4FB':''}"><span>${on?'◉':'○'}</span><span>${l}${sub?`<div style="font-size:.78rem;color:#666">${sub}</div>`:''}</span></div>`;
const check=(id,l,on,sub)=>`<div ${id?`data-t="${id}"`:''} style="display:flex;gap:8px;align-items:flex-start;margin:.35rem 0;padding:.35rem .5rem;border-radius:6px"><span>${on?'☑':'☐'}</span><span>${l}${sub?`<div style="font-size:.78rem;color:#666">${sub}</div>`:''}</span></div>`;

function mon(s){
  const m=s.mon, W=s.track!=='U', F=s.fw||{}; let inner='', keys=null;
  const post=()=>`<div style="position:absolute;inset:0;background:#000;color:#E7EEF0;display:grid;place-items:center;text-align:center"><div><div style="font-size:2.4rem;font-weight:700;letter-spacing:.1em">B760M</div>
     <div style="margin-top:14px;font-size:1rem">Press <b>DEL</b> to enter Setup · <b>F11</b> for Boot Menu</div></div></div>`;
  switch(m){
    case 'off': inner=`<div style="position:absolute;inset:0;background:#030405"></div>`; break;
    case 'post': inner=post(); keys=KEYS.post; break;
    case 'ez': inner=uefiEZ(s); keys=KEYS.uefi; break;
    case 'adv-sec': case 'adv-boot': case 'adv-exit': inner=uefiAdv(s); keys=KEYS.uefi; break;
    case 'bootmenu': inner=`<div style="position:absolute;inset:0;background:#000;display:grid;place-items:center"><div style="background:#1B2530;color:#E7EEF0;border:2px solid #3E5566;width:56%;padding:14px 18px;font-size:.95rem">
       <div style="text-align:center;font-weight:700;margin-bottom:8px">Please select boot device:</div>
       ${t('boot-uefi-usb','UEFI: USB DRIVE 1.00, Partition 1','display:block;padding:6px 8px;background:#2E4A63')}<div style="padding:6px 8px">NVMe SSD 1TB (empty)</div><div style="padding:6px 8px">Enter Setup</div>
       <div style="font-size:.78rem;color:#9FB2C2;margin-top:8px">↑ and ↓ to move selection · ENTER to select boot device · Only UEFI entries are listed because CSM is off.</div></div></div>`; break;
    case 'anykey': inner=`<div style="position:absolute;inset:0;background:#000;color:#ddd;padding:24px;font-family:var(--mono);font-size:1rem">Press any key to boot from CD or DVD.._</div>`; keys=KEYS.any; break;
    case 'grub': inner=`<div style="position:absolute;inset:0;background:#000;color:#ddd;font-family:var(--mono);font-size:.95rem;padding:30px 50px"><div style="text-align:center;margin-bottom:14px">GNU GRUB  version 2.12</div>
       <div style="border:1px solid #aaa;padding:10px">${t('grub-install','*Try or Install Ubuntu','display:block;background:#ddd;color:#000;padding:2px 6px')}<div style="padding:2px 6px">Ubuntu (safe graphics)</div><div style="padding:2px 6px">Test memory</div><div style="padding:2px 6px">UEFI Firmware Settings</div></div>
       <div style="margin-top:12px;font-size:.8rem">Use the ↑ and ↓ keys to select which entry is highlighted. Press enter to boot the selected OS.</div></div>`; break;
    default: inner=W?winScreens(s):ubScreens(s); if(m==='u-remove') keys=KEYS.enter;
  }
  return monFrame(inner,keys);
}
function uefiEZ(s){ return `<div style="position:absolute;inset:0;background:#0E151C;color:#E7EEF0;font-size:.88rem">
  <div style="display:flex;justify-content:space-between;padding:8px 14px;background:#101B24;border-bottom:1px solid #22303B"><b>UEFI BIOS · EZ Mode</b><span style="color:#8FA3B3">${t('ez-f7','F7: Advanced','padding:.1rem .4rem;border:1px solid #3E5566;border-radius:4px')} · F10: Save &amp; Exit</span></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px">${[['CPU','Intel Core i5-12400 · 2.5 GHz'],['Memory','16384 MB · DDR4-3200'],['Storage','M2_1: 1 TB NVMe SSD'],['CPU temperature','35 °C'],['Security','fTPM / PTT: '+((s.fw||{}).ptt?'Enabled':'Disabled')],['Boot mode','UEFI']].map(([a,b])=>`<div style="background:#1B2530;border:1px solid #2E3B47;border-radius:8px;padding:10px"><div style="font-size:.72rem;color:#8FA3B3;text-transform:uppercase">${a}</div><b>${b}</b></div>`).join('')}</div>
  <div style="padding:0 14px;color:#8FA3B3">Boot priority: ${s.usb.loc==='lab'?'USB DRIVE · ':''}NVMe SSD</div></div>`; }
function uefiAdv(s){ const F=s.fw||{}, m=s.mon;
  const tab=(id,l)=>`<span data-t="${id}" style="padding:.2rem .8rem;border-radius:4px;${(m==='adv-sec'&&id==='tab-sec')||(m==='adv-boot'&&id==='tab-boot')||(m==='adv-exit'&&id==='tab-exit')?'background:#C8322A;color:#fff':''}">${l}</span>`;
  const opt=(id,l,v,good)=>`<div style="display:grid;grid-template-columns:1fr 150px;gap:10px;padding:6px 10px;border-bottom:1px solid #22303B"><span>${l}</span><span data-t="${id}" style="text-align:center;padding:.1rem .4rem;border-radius:4px;background:${good?'#1F4D33':'#3A2A20'};color:${good?'#7FE0AE':'#FFB27A'}">[${v}]</span></div>`;
  let body='';
  if(m==='adv-sec') body=`<div style="color:#8FA3B3;margin-bottom:6px">Settings › Security</div>`+(s.track!=='U'?opt('opt-ptt','Trusted Computing › Intel Platform Trust Technology (PTT)',F.ptt?'Enabled':'Disabled',F.ptt):'')+opt('opt-sb','Secure Boot › Secure Boot',F.sb?'Enabled':'Disabled',F.sb);
  if(m==='adv-boot') body=`<div style="color:#8FA3B3;margin-bottom:6px">Settings › Advanced › Windows OS Configuration</div>`+opt('opt-csm','BIOS UEFI/CSM Mode',F.csmOff?'UEFI':'CSM',F.csmOff)+opt('','Fast Boot','Disabled',true);
  if(m==='adv-exit') body=`<div style="color:#8FA3B3;margin-bottom:6px">Save &amp; Exit</div>`+`<div style="padding:6px 10px">Discard Changes and Exit</div>${t('opt-save','Save Changes and Reboot','display:block;padding:6px 10px;background:#2E4A63;border-radius:4px')}<div style="padding:6px 10px">Restore Defaults</div>`+
    (F.confirm?`<div style="position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.4)"><div style="background:#1B2530;border:2px solid #3E5566;padding:14px 18px;width:46%"><b>Save &amp; Exit</b><div style="margin:.4rem 0;font-size:.85rem">Intel PTT: ${F.ptt?'Enabled':'—'}<br>Secure Boot: ${F.sb?'Enabled':'Disabled'}<br>BIOS UEFI/CSM Mode: ${F.csmOff?'UEFI':'CSM'}</div><div style="text-align:right">${t('opt-yes','Yes','padding:.1rem 1rem;background:#C8322A;border-radius:4px')} <span style="padding:.1rem 1rem">No</span></div></div></div>`:'');
  return `<div style="position:absolute;inset:0;background:#0E151C;color:#E7EEF0;font-size:.88rem">
   <div style="display:flex;gap:8px;align-items:center;padding:8px 14px;background:#101B24;border-bottom:2px solid #C8322A"><b style="margin-right:10px">UEFI BIOS · Advanced</b>${tab('tab-sec','Security')}${tab('tab-boot','Advanced')}${tab('tab-exit','Save &amp; Exit')}<span style="flex:1"></span><span style="color:#8FA3B3">F7: EZ Mode</span></div>
   <div style="padding:12px 18px;position:relative;height:calc(100% - 40px)">${body}</div></div>`; }

/* ---------- Windows setup, OOBE and desktop ---------- */
function winScreens(s){ const w=s.w||{};
  switch(s.mon){
    case 'w-lang': return wsetup('Select language settings',field('','Language to install','English (United States)')+field('ws-time','Time and currency format',w.time?'English (Philippines)':'English (United States)')+`<div style="margin-top:.6rem;font-size:.8rem;color:#555">Keyboard layout on the next page: US.</div>`,btn('ws-next','Next'));
    case 'w-kb': return wsetup('Select keyboard settings',field('','Keyboard or input method','US'),btn('ws-next','Next'));
    case 'w-opt': return wsetup('Select setup option',radio('ws-install','Install Windows 11',!!w.install)+radio('','Repair my PC',false)+check('ws-agree','I agree everything will be deleted including files, apps, and settings',!!w.agree),btn('ws-next','Next'));
    case 'w-key': return wsetup('Product key','Enter your product key or choose that you don’t have one. PCs sold with Windows activate from the key stored in the firmware.'+field('','Product key','XXXXX-XXXXX-XXXXX-XXXXX-XXXXX','color:#999'),`${t('ws-nokey','I don’t have a product key','padding:.35rem .6rem;color:#1D5B96;text-decoration:underline')}${btn('','Next','opacity:.5')}`);
    case 'w-ed': return wsetup('Select image',['Windows 11 Home','Windows 11 Education','Windows 11 Pro','Windows 11 Pro for Workstations'].map((x,i)=>radio(i===2?'ws-pro':'',x,i===2&&w.pro)).join(''),btn('ws-next','Next'));
    case 'w-lic': return wsetup('Applicable notices and license terms',`<div style="height:130px;overflow:hidden;border:1px solid #ddd;padding:8px;font-size:.78rem;color:#444">MICROSOFT SOFTWARE LICENSE TERMS · WINDOWS OPERATING SYSTEM · IF YOU LIVE IN (OR IF YOUR PRINCIPAL PLACE OF BUSINESS IS IN) THE UNITED STATES… These license terms are an agreement between you and Microsoft Corporation…</div>`,btnL('','Decline')+btn('ws-accept','Accept'));
    case 'w-disk': return wsetup('Select location to install Windows 11',`<table style="width:100%;border-collapse:collapse;font-size:.85rem"><tr style="text-align:left;color:#555"><th>Name</th><th>Total size</th><th>Free space</th><th>Type</th></tr>
        <tr data-t="ws-disk0" style="background:${w.disk?'#DCEBFA':'transparent'}"><td style="padding:6px">Disk 0 Unallocated Space</td><td>953.9 GB</td><td>953.9 GB</td><td></td></tr></table>
        <div style="margin-top:10px;display:flex;gap:10px;font-size:.8rem;color:#1D5B96"><span>⟳ Refresh</span><span>✕ Delete partition</span><span>＋ Create partition</span><span>⬆ Load driver</span></div>`,btn('ws-next','Next'));
    case 'w-ready': return wsetup('Ready to install','Windows 11 Pro<br>Keep nothing<div style="margin-top:.5rem;font-size:.82rem;color:#555">Make sure the customer’s files are backed up: this deletes everything on the selected disk.</div>',btn('ws-installgo','Install'));
    case 'w-installing': return `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#0B2A5B,#1F4E9C);color:#fff;display:grid;place-items:center;text-align:center"><div><div style="font-size:1.4rem">Installing Windows 11</div><div style="margin:12px auto;width:320px;height:8px;background:rgba(255,255,255,.25);border-radius:4px"><div style="width:${w.pct||0}%;height:100%;background:#fff;border-radius:4px"></div></div><div>${w.pct||0}% complete · Your PC will restart several times.</div></div></div>`;
    case 'o-region': return oobe('Is this the right country or region?',['Peru','Philippines','Pitcairn Islands','Poland'].map(x=>`<div ${x==='Philippines'?'data-t="oo-ph"':''} style="padding:6px 8px;border-radius:6px;${x==='Philippines'&&w.ph?'background:#DCEBFA;font-weight:700':''}">${x}</div>`).join(''),btn('oo-yes','Yes'));
    case 'o-kb': return oobe('Is this the right keyboard layout or input method?',['US','Canadian Multilingual Standard','United Kingdom'].map((x,i)=>`<div style="padding:6px 8px;border-radius:6px;${i===0?'background:#DCEBFA;font-weight:700':''}">${x}</div>`).join(''),btn('oo-yes','Yes'));
    case 'o-kb2': return oobe('Want to add a second keyboard layout?','',btnL('','Add layout')+btn('oo-skip','Skip'));
    case 'o-net': return oobe('Let’s connect you to a network','',btn('oo-next','Next'),'You’ll need an internet connection to continue setting up your device.').replace('<div style="flex:1;margin-top:10px;font-size:.92rem"></div>',`<div style="flex:1;margin-top:10px"><div data-t="oo-eth" style="padding:10px;border:1px solid #ddd;border-radius:8px">🖧 <b>Ethernet</b><div style="font-size:.8rem;color:#1C7F52">Connected</div></div></div>`);
    case 'o-name': return oobe('Let’s name your device','Make it easier to recognize this PC on the network.'+field('oo-name','Name',w.name?'LAB-PC-01':'','font-family:var(--mono)')+'<div style="font-size:.78rem;color:#666">Up to 15 characters: letters, numbers and hyphens.</div>',btnL('','Skip for now')+btn('oo-next','Next'));
    case 'o-how': return oobe('How would you like to set up this device?',radio('oo-personal','Set up for personal use',!!w.personal,'We’ll help you set it up with a Microsoft account.')+radio('','Set up for work or school',false,'Your organization manages access to this device.'),btn('oo-next','Next'));
    case 'o-acct': return oobe('Let’s add your Microsoft account',field('oo-email','Email, phone, or Skype',w.email?'lab.student@outlook.com':''),btn('oo-next','Next'));
    case 'o-pass': return oobe('Enter password',field('oo-pw','Password',w.pw?'••••••••••••':''),btn('oo-signin','Sign in'));
    case 'o-pin': return oobe('Create a PIN',field('oo-pin','New PIN',w.pin?'••••••':'')+field('','Confirm PIN',w.pin?'••••••':'')+'<div style="font-size:.78rem;color:#666">A PIN only works on this device.</div>',btn('oo-ok','OK'));
    case 'o-priv': return oobe('Choose privacy settings for your device',[['Location','No'],['Find my device','Yes'],['Diagnostic data','Required only'],['Inking & typing','No'],['Tailored experiences','No'],['Advertising ID','No']].map(([a,b])=>`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #eee"><span>${a}</span><b>${b}</b></div>`).join(''),btn('oo-accept','Accept'));
    case 'desk': case 'about': case 'devmgr': case 'update': return winDesktop(s);
  }
  return '';
}
function winDesktop(s){ const w=s.w||{}, m=s.mon;
  const tb=[['start','⊞'],['settings','Settings'],['devmgr','Device Manager']].map(([k,l])=>`<span data-t="wd-${k}" style="display:inline-grid;place-items:center;height:30px;padding:0 .6rem;border-radius:6px;font-size:.8rem">${l}</span>`).join('');
  let app='';
  const W=(title,body)=>`<div style="position:absolute;left:6%;top:5%;width:88%;height:80%;background:#fff;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.35);overflow:hidden;color:#1b1b1b"><div style="padding:.3rem .7rem;border-bottom:1px solid #eee;font-size:.82rem;display:flex;justify-content:space-between"><b>${title}</b><span>—  ☐  ✕</span></div><div style="display:flex;height:calc(100% - 30px)">${body}</div></div>`;
  const nav=sel=>`<div style="width:170px;border-right:1px solid #eee;padding:8px;font-size:.85rem">${[['about','System › About'],['update','Windows Update']].map(([k,l])=>`<div data-t="set-${k}" style="padding:6px;border-radius:6px;${sel===k?'background:#E6F0FA;font-weight:700':''}">${l}</div>`).join('')}</div>`;
  if(m==='about') app=W('Settings',nav('about')+`<div style="padding:12px 16px;font-size:.88rem;flex:1"><div style="font-size:1.2rem;font-weight:600;margin-bottom:8px">About</div>
     <div data-t="ab-spec"><div><span style="color:#666">Device name</span> <b>LAB-PC-01</b></div><div><span style="color:#666">Processor</span> 12th Gen Intel(R) Core(TM) i5-12400 2.50 GHz</div><div><span style="color:#666">Installed RAM</span> 16.0 GB (15.8 GB usable)</div><div><span style="color:#666">System type</span> 64-bit operating system, x64-based processor</div></div>
     <div data-t="ab-win" style="margin-top:10px"><div><span style="color:#666">Edition</span> Windows 11 Pro</div><div><span style="color:#666">Version</span> 25H2</div><div><span style="color:#666">Activation</span> <b style="color:#1C7F52">Windows is activated</b></div></div></div>`);
  if(m==='update') app=W('Settings',nav('update')+`<div style="padding:12px 16px;font-size:.88rem;flex:1"><div style="font-size:1.2rem;font-weight:600;margin-bottom:8px">Windows Update</div>
     ${w.upd==='done'?'<div style="color:#1C7F52;font-weight:700">You’re up to date</div><div style="font-size:.8rem;color:#666">Last checked: today</div>':w.upd==='found'?`<div>Updates available</div><div style="font-size:.82rem;margin:.3rem 0">• 2026-09 Cumulative Update for Windows 11 Version 25H2 for x64-based Systems<br>• Intel Corporation - Display driver<br>• Microsoft Defender Antivirus security intelligence update</div>${btn('up-install','Download &amp; install all')}`:btn('up-check','Check for updates')}</div>`);
  if(m==='devmgr') app=W('Device Manager',`<div style="padding:10px 14px;font-size:.85rem;flex:1;font-family:'Segoe UI',Arial"><div>🖥 LAB-PC-01</div>${[['Disk drives','NVMe SSD 1TB'],['Display adapters','Intel(R) UHD Graphics 730'],['Network adapters','Intel(R) Ethernet Controller I226-V'],['Processors','12th Gen Intel(R) Core(TM) i5-12400 (×12)'],['Sound, video and game controllers','Realtek(R) Audio'],['Universal Serial Bus controllers','Intel(R) USB 3.20 eXtensible Host Controller']].map(([a,b])=>`<div style="margin-left:14px">▾ ${a}<div style="margin-left:20px;color:#333">${b}</div></div>`).join('')}
     <div data-t="dm-ok" style="margin-top:10px;padding:6px 8px;border-radius:6px;background:#E2F3EA;color:#1C7F52;font-weight:700;display:inline-block">No yellow warning marks</div></div>`);
  return `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#1F3F8A,#5E8FDB 55%,#9CC3F2)">${app}
    <div style="position:absolute;left:0;right:0;bottom:0;height:38px;background:rgba(243,243,243,.95);display:flex;justify-content:center;align-items:center;gap:.25rem">${tb}</div></div>`; }

/* ---------- Ubuntu installer and desktop ---------- */
function ubScreens(s){ const u=s.u||{};
  switch(s.mon){
    case 'u-lang': return uinst('Welcome to Ubuntu',['Deutsch','English','Español','Filipino','Français'].map(x=>`<div ${x==='English'?'data-t="u-en"':''} style="padding:5px 8px;border-radius:5px;${x==='English'&&u.en?'background:#E95420;color:#fff':''}">${x}</div>`).join(''),ubtn('u-next','Next'));
    case 'u-access': return uinst('Accessibility in Ubuntu','Seeing · Hearing · Typing · Pointing and clicking · Zoom<div style="font-size:.8rem;color:#666;margin-top:6px">Set these now or later in Settings.</div>',ubtn('u-next','Next'));
    case 'u-kb': return uinst('Select your keyboard layout',field('','Keyboard layout','English (US)')+field('u-kbtest','Type here to test your keyboard',u.kbtest?'The quick brown fox 123 @#':'','font-family:var(--mono)'),ubtn('u-next','Next'));
    case 'u-net': return uinst('Connect to the internet',radio('u-wired','Use wired connection',!!u.wired,'Wired connection detected')+radio('','Connect to a Wi-Fi network',false)+radio('','I don’t want to connect to the internet right now',false),ubtn('u-next','Next'));
    case 'u-what': return uinst('What do you want to do with Ubuntu?',radio('u-install','Install Ubuntu',!!u.install)+radio('','Try Ubuntu',false,'Runs from the USB only. Nothing is installed.'),ubtn('u-next','Next'));
    case 'u-how': return uinst('How would you like to install Ubuntu?',radio('u-inter','Interactive installation',!!u.inter)+radio('','Automated installation',false,'Uses an autoinstall file prepared in advance.'),ubtn('u-next','Next'));
    case 'u-apps': return uinst('What apps would you like to install to start with?',radio('u-default','Default selection',!!u.defApps,'Just the essentials: a web browser and basic utilities.')+radio('','Extended selection',false,'Office tools and more, for offline use.'),ubtn('u-next','Next'));
    case 'u-prop': return uinst('Install recommended proprietary software?',check('u-3rd','Install third-party software for graphics and Wi-Fi hardware',!!u.third)+check('u-media','Download and install support for additional media formats',!!u.media),ubtn('u-next','Next'));
    case 'u-disk': return uinst('How do you want to install Ubuntu?',radio('','Erase disk and install Ubuntu',false,'Deletes everything on the disk.')+radio('u-manual','Manual installation',!!u.manual,'Create or resize partitions yourself.'),ubtn('u-next','Next'));
    case 'u-part': { const parts=[]; if(u.esp) parts.push(['nvme0n1p1','EFI System Partition (FAT32)','1.1 GB','/boot/efi']); if(u.root) parts.push(['nvme0n1p2','ext4','998.9 GB','/']);
      return uinst('Manual installation',`<div style="font-size:.82rem;color:#555">Device: NVMe SSD 1TB (/dev/nvme0n1) · Partition table: GPT</div><table style="width:100%;border-collapse:collapse;font-size:.85rem;margin-top:6px"><tr style="text-align:left;color:#555"><th>Device</th><th>Type</th><th>Size</th><th>Mount point</th></tr>`+
        parts.map(p=>`<tr style="border-top:1px solid #ddd"><td style="padding:4px">${p[0]}</td><td>${p[1]}</td><td>${p[2]}</td><td>${p[3]}</td></tr>`).join('')+
        `<tr style="border-top:1px solid #ddd"><td style="padding:4px;color:#888">free space</td><td></td><td>${u.root?'0 B':u.esp?'998.9 GB':'1.0 TB'}</td><td></td></tr></table>
        <div style="margin-top:8px;display:flex;gap:8px">${t('u-add','＋ Add partition','padding:.2rem .6rem;border:1px solid #bbb;border-radius:4px;background:#fff')}<span style="padding:.2rem .6rem;color:#999">－</span></div>
        <div style="font-size:.8rem;color:#555;margin-top:6px">Bootloader installation: NVMe SSD 1TB</div>`,ubtn('u-next','Next')); }
    case 'u-acct': return uinst('Create your account',field('u-name','Your name',u.acct?'Lab Student':'')+field('','Your computer’s name',u.acct?'lab-pc-02':'')+field('','Your username',u.acct?'student':'')+field('','Password',u.acct?'••••••••••':'')+check('','Require my password to log in',true),ubtn('u-next','Next'));
    case 'u-tz': return uinst('Select your timezone',`<div style="height:120px;border-radius:8px;background:linear-gradient(135deg,#BFD8EA,#E8F1F7);position:relative"><span style="position:absolute;left:78%;top:52%;color:#E95420;font-size:1.3rem">●</span></div>`+field('u-tzf','Timezone',u.tz?'Asia/Manila':''),ubtn('u-next','Next'));
    case 'u-review': return uinst('Review your choices','General: English · US keyboard · Asia/Manila<br>Disk setup: GPT on NVMe SSD 1TB<br>• nvme0n1p1: EFI System Partition, 1.1 GB, formatted<br>• nvme0n1p2: ext4 mounted at /, 998.9 GB, formatted<br>Applications: default selection, third-party drivers, media formats',ubtn('','Back',false)+ubtn('u-installgo','Install'));
    case 'u-installing': return uinst('Installing Ubuntu…',`<div style="margin-top:20px;height:8px;background:#ddd;border-radius:4px"><div style="width:${u.pct||0}%;height:100%;background:#E95420;border-radius:4px"></div></div><div style="margin-top:8px">${u.pct>=100?'<b>Ubuntu 26.04 LTS is installed and ready to use.</b>':'Copying files…'}</div>`,u.pct>=100?ubtn('u-restart','Restart now'):'');
    case 'u-remove': return `<div style="position:absolute;inset:0;background:#000;color:#ddd;font-family:var(--mono);padding:30px;font-size:1rem">Please remove the installation medium, then press ENTER:</div>`;
    case 'u-login': return `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,#7A2E5E,#2C001E 70%);display:grid;place-items:center;color:#fff;text-align:center"><div><div style="width:70px;height:70px;border-radius:50%;background:#E95420;margin:0 auto 8px;display:grid;place-items:center;font-size:1.8rem">LS</div><b>Lab Student</b>
       <div data-t="ul-pw" style="margin:10px auto;width:220px;padding:6px;border-radius:6px;background:rgba(255,255,255,.15)">${u.logged?'••••••••••':'Password'}</div></div></div>`;
    case 'u-desk': case 'u-about': case 'u-upd': return ubDesktop(s);
  }
  return '';
}
function ubDesktop(s){ const u=s.u||{}, m=s.mon;
  const dock=`<div style="position:absolute;left:0;top:28px;bottom:0;width:52px;background:rgba(20,0,15,.75);display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:10px">${[['settings','⚙'],['updater','⟳'],['files','🗀']].map(([k,i])=>`<span data-t="ud-${k}" style="width:38px;height:38px;border-radius:8px;display:grid;place-items:center;color:#fff;background:rgba(255,255,255,.08);font-size:1.1rem">${i}</span>`).join('')}</div>`;
  let app='';
  const W=(title,body)=>`<div style="position:absolute;left:12%;top:12%;width:80%;height:78%;background:#FAFAFA;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.4);overflow:hidden;color:#1b1b1b"><div style="padding:.35rem .8rem;background:#EBEBEB;font-size:.82rem;text-align:center"><b>${title}</b></div><div style="padding:12px 18px;font-size:.88rem">${body}</div></div>`;
  if(m==='u-about') app=W('Settings · System · About',`<div data-t="ua-spec"><div><span style="color:#666">Hardware Model</span> Micro-ATX B760 system</div><div><span style="color:#666">Memory</span> 16.0 GiB</div><div><span style="color:#666">Processor</span> 12th Gen Intel® Core™ i5-12400 × 12</div><div><span style="color:#666">Graphics</span> Intel® UHD Graphics 730</div><div><span style="color:#666">Disk Capacity</span> 1.0 TB</div></div>
     <div data-t="ua-os" style="margin-top:10px"><div><span style="color:#666">OS Name</span> Ubuntu 26.04 LTS</div><div><span style="color:#666">OS Type</span> 64-bit</div></div>`);
  if(m==='u-upd') app=W('Software Updater',u.upd==='done'?'<b style="color:#0E8420">The software on this computer is up to date.</b>':`Updated software is available for this computer. Do you want to install it now?<div style="font-size:.82rem;margin:.4rem 0">• Security updates (38)<br>• Other updates (112)</div>${ubtn('uu-install','Install Now')}`);
  return `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 70% 30%,#E95420 0%,#77216F 45%,#2C001E 85%)"><div style="position:absolute;left:0;right:0;top:0;height:28px;background:#111;color:#ddd;font-size:.8rem;display:flex;justify-content:center;align-items:center">Tue 14:05</div>${dock}${app}</div>`; }

const FIT=(w,h)=>`<div data-fit="${w}" style="width:100%;max-width:${w}px;display:flex;justify-content:center">${h}</div>`;
function render(s,b,o){
  switch(b.scene){
    case 'desk': return desk(s);
    case 'lap': return FIT(1000,lap(s));
    case 'mon': return FIT(1000,mon(s));
    case 'pick': return Common.pick(s,b,o);
    case 'intro': return Common.intro(s,b);
    case 'part': return Common.part(s,b);
  }
  return 'Missing scene '+esc(b.scene);
}
return {render,HASH,ISO};
})();
