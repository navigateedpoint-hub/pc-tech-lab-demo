/* Server Setup: the Windows 11 office PCs (PC-01, PC-02) used to test the server. s.pc holds everything shown on the PC's screen. */
window.Client=(function(){
const {t,wbtn,abtn,link,field,check,radio,tabs,win,dlg,term,taskbar,esc}=UI;
const wall='linear-gradient(135deg,#1F3F8A,#5E8FDB 55%,#9CC3F2)';
function screen(s){ const C=s.pc||{}, m=C.mon||'desk', U=s.track==='U';
  const dom=U?'lan.opisina.ph':'ad.opisina.ph';
  if(m==='busy') return `<div style="position:absolute;inset:0;background:${wall};display:grid;place-items:center;color:#fff;font-family:'Segoe UI',Arial;text-align:center"><div><div style="font-size:2rem;letter-spacing:.3em">· · · · ·</div><div style="font-size:1.2rem;margin-top:10px">${esc(C.busyMsg||'Please wait')}</div></div></div>`;
  if(m==='signin'||m==='mustchange'||m==='newpw'){ let box='';
    if(m==='signin') box=`<div style="font-size:1.3rem;margin-bottom:10px">Other user</div><div data-t="li-user" style="width:260px;margin:0 auto">${field('','',C.userTyped?'OPISINA\\'+C.user:'User name',{win11:true,style:'color:#333'})}${field('','',C.userTyped?'••••••••••':'Password',{win11:true,style:'color:#333'})}</div><div style="font-size:.8rem;margin-top:6px;opacity:.85">Sign in to: OPISINA</div>`;
    if(m==='mustchange') box=`<div style="font-size:1rem;max-width:340px;margin:0 auto 14px">The user’s password must be changed before signing in.</div>${abtn('li-ok','OK',{light:true})}`;
    if(m==='newpw') box=`<div style="font-size:1.2rem;margin-bottom:10px">OPISINA\\${esc(C.user)}</div><div data-t="li-newpw" style="width:260px;margin:0 auto">${field('','',C.newTyped?'••••••••••':'Old password',{win11:true,style:'color:#333'})}${field('','',C.newTyped?'••••••••••••':'New password',{win11:true,style:'color:#333'})}${field('','',C.newTyped?'••••••••••••':'Confirm password',{win11:true,style:'color:#333'})}</div>`;
    return `<div style="position:absolute;inset:0;background:${wall};display:grid;place-items:center;color:#fff;text-align:center;font-family:'Segoe UI',Arial"><div><div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.22);margin:0 auto 10px;display:grid;place-items:center;font-size:2rem">👤</div>${box}</div></div>`; }
  let body='';
  if(C.app==='cmd') body=win('Command Prompt',term(C.lines,C.pending,{prompt:`C:\\Users\\${C.user||'staff'}>`,pc:'#E6E6E6',idle:true}),{l:'8%',t:'6%',w:'80%',h:'80%'});
  if(C.app==='exp') body=explorer(s);
  if(C.app==='set') body=settings(s);
  body+=dialogs(s);
  const tb=[['tb-cmd','Command Prompt',C.app==='cmd'],['tb-explorer','📁 File Explorer',C.app==='exp'],['tb-settings','⚙ Settings',C.app==='set'],['tb-signout','⏻ Sign out',false]];
  return `<div style="position:absolute;inset:0;background:${wall}">${body}${taskbar(tb)}</div>`;
}
function explorer(s){ const C=s.pc, U=s.track==='U';
  const p=C.path||'pc';
  const addr={pc:'This PC',acct:'\\\\SRV-01\\Accounting',srv:'\\\\SRV-01',home:U?'\\\\SRV-01\\'+C.user:'\\\\SRV-01\\Home$\\'+C.user}[p];
  let list='';
  if(p==='pc') list=`<div style="font-weight:600;margin-bottom:6px">Devices and drives</div><div style="display:flex;gap:10px;flex-wrap:wrap">
     <div style="padding:8px;border:1px solid #E5E5E5;border-radius:6px;width:190px">💽 Local Disk (C:)<div style="font-size:.72rem;color:#666">412 GB free of 475 GB</div></div>
     ${C.hDrive?t('fe-h',`<div style="padding:8px;border:1px solid #E5E5E5;border-radius:6px;width:250px;background:#F3F9FF">🌐 ${esc(C.user)} (\\\\SRV-01${U?'':'\\Home$'}) (H:)<div style="font-size:.72rem;color:#666">Network location · 1.80 TB free</div></div>`,'display:inline-block'):''}</div>`;
  if(p==='srv') list=`<div style="display:flex;gap:10px;flex-wrap:wrap">${[U?'accounting':'Accounting',C.user,'PRN-01'].map(n=>`<div data-t="fe-sh-${esc(n.toLowerCase())}" style="padding:8px;border:1px solid #E5E5E5;border-radius:6px;width:150px">${n==='PRN-01'?'🖨':'📁'} ${esc(n)}</div>`).join('')}</div>`;
  if(p==='acct'||p==='home') list=`<div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">${t('fe-new','＋ New ▾','padding:2px 8px;border:1px solid #DDD;border-radius:4px')}<span style="color:#666">Sort ▾ &nbsp; View ▾</span></div>`+
     (C.files&&C.files.length?C.files.map(f=>`<div style="padding:4px 6px;border-bottom:1px solid #F2F2F2">📗 ${esc(f)} <span style="color:#666;float:right">11/14/2026 3:05 PM · ${esc(C.user)}</span></div>`).join(''):'<div style="color:#666;padding:6px">This folder is empty.</div>');
  return win('File Explorer',`<div style="display:flex;flex-direction:column;height:100%"><div style="display:flex;gap:8px;align-items:center;padding:.3rem .6rem;border-bottom:1px solid #EEE;font-size:.78rem"><span>← → ↑ ⟳</span>${t('fe-addr',C.addrTyping?esc(C.addrTyping):esc(addr),'flex:1;border:1px solid #DDD;border-radius:4px;padding:1px 8px;background:#fff;font-family:var(--mono)')}</div>
     <div style="display:flex;flex:1"><div style="width:150px;border-right:1px solid #EEE;padding:6px;font-size:.76rem;line-height:1.8">🏠 Home<br>🖥 This PC<br>🌐 Network</div><div style="flex:1;padding:10px 14px;font-size:.8rem">${list}</div></div></div>`,{l:'6%',t:'5%',w:'84%',h:'82%'}); }
function settings(s){ const C=s.pc, U=s.track==='U';
  let main='';
  if(C.page==='about') main=`<div style="font-size:1.2rem;font-weight:600;margin-bottom:10px">System › About</div><div style="border:1px solid #E5E5E5;border-radius:6px;padding:10px;background:#fff;line-height:1.7"><b>${esc(C.dev)}</b><br>Device name ${esc(C.dev)}<br>Processor 12th Gen Intel(R) Core(TM) i5-12400<br>Installed RAM 16.0 GB</div>
     <div style="margin-top:8px">Related links: ${link('','Domain or workgroup')} ${link('','System protection')} ${link('','Advanced system settings')}</div>`.replace(link('','Domain or workgroup'),link('ab-domain','Domain or workgroup'));
  if(C.page==='printers') main=`<div style="font-size:1.2rem;font-weight:600;margin-bottom:10px">Bluetooth &amp; devices › Printers &amp; scanners</div>
     <div style="display:flex;justify-content:space-between;align-items:center;border:1px solid #E5E5E5;border-radius:6px;padding:8px 10px;background:#FBFBFB">Add a printer or scanner ${abtn('pr-adddev',C.prnSearch?'Refresh':'Add device')}</div>
     ${C.prnSearch&&!C.prnAdded?`<div style="border:1px solid #E5E5E5;border-top:none;padding:8px 10px;background:#fff;display:flex;justify-content:space-between;align-items:center">🖨 ${U?'PRN-01 @ srv-01 (IPP)':'PRN-01 on SRV-01'}${abtn('pr-add','Add device',{light:true})}</div>`:''}
     ${C.prnAdded?t('pr-ready',`<div style="border:1px solid #E5E5E5;border-radius:6px;padding:8px 10px;background:#fff;margin-top:8px">🖨 <b>${U?'PRN-01 @ srv-01':'PRN-01 on SRV-01'}</b> · Ready${C.testPage?' · <span style="color:#2E7D32">Test page printed</span>':''}</div>`,'display:block'):''}
     ${C.prnAdded&&!C.testPage?`<div style="margin-top:6px">${link('pr-test','Print a test page')}</div>`:''}`;
  return win('Settings',`<div style="display:flex;height:100%"><div style="width:170px;background:#F3F3F3;padding:10px;font-size:.78rem;line-height:2">${C.page==='about'?'<b style="background:#fff;padding:2px 6px;border-radius:4px">System</b><br>Bluetooth &amp; devices':'System<br><b style="background:#fff;padding:2px 6px;border-radius:4px">Bluetooth &amp; devices</b>'}<br>Network &amp; internet<br>Accounts<br>Windows Update</div><div style="padding:14px 18px;font-size:.82rem;flex:1">${main}</div></div>`,{l:'6%',t:'5%',w:'86%',h:'82%'}); }
function dialogs(s){ const C=s.pc, d=C.dlg; if(!d) return '';
  const U=s.track==='U';
  if(d==='sysprops'||d==='join'||d==='cred'||d==='welcome'||d==='restart'||d==='joinerr'){
    let x=dlg('System Properties',tabs([['','Computer Name'],['','Hardware'],['','Advanced'],['','System Protection'],['','Remote']],'Computer Name')+`<div style="margin:6px 0;line-height:1.7">Full computer name: ${esc(C.dev)}<br>Workgroup: WORKGROUP</div>To rename this computer or change its domain or workgroup, click Change. ${wbtn('sp-change','Change…')}`,wbtn('','OK',{def:true})+wbtn('','Cancel'),{w:'44%',l:'14%',t:'8%'});
    if(d!=='sysprops') x+=dlg('Computer Name/Domain Changes',field('','Computer name:',esc(C.dev))+'<b>Member of</b>'+`<div data-t="rn-domain">${radio('','Domain:',!!C.domTyped)}${field('','',C.domTyped?'ad.opisina.ph':'')}</div>`+radio('','Workgroup:',!C.domTyped)+field('','',C.domTyped?'':'WORKGROUP',{dis:!!C.domTyped}),wbtn('rn-ok','OK',{def:true,dis:!C.domTyped})+wbtn('','Cancel'),{w:'38%',l:'36%',t:'14%',z:6});
    if(d==='cred') x+=dlg('Windows Security','<b>Computer Name/Domain Changes</b><div style="margin:4px 0 8px">Enter the name and password of an account with permission to join the domain.</div>'+`<div data-t="cr-user">${field('','',C.credTyped?'OPISINA\\Administrator':'User name')}${field('','',C.credTyped?'••••••••••••':'Password')}</div>`,wbtn('cr-ok','OK',{def:true,dis:!C.credTyped})+wbtn('','Cancel'),{w:'36%',z:7});
    if(d==='welcome') x+=dlg('Computer Name/Domain Changes','Welcome to the ad.opisina.ph domain.',wbtn('wl-ok','OK',{def:true}),{w:'34%',z:7});
    if(d==='restart') x+=dlg('Microsoft Windows','You must restart your computer to apply these changes.<br><br>Before restarting, save any open files and close all programs.',wbtn('rs-now','Restart Now',{def:true})+wbtn('','Restart Later'),{w:'38%',z:8});
    if(d==='joinerr') x+=dlg('Computer Name/Domain Changes',`<div style="display:flex;gap:10px"><span style="color:#C62828;font-size:1.4rem">⨂</span><div>An Active Directory Domain Controller (AD DC) for the domain "ad.opisina.ph" could not be contacted.<br><br>Ensure that the domain name is typed correctly.<br><br>If the name is correct, click Details for troubleshooting information.</div></div>`,wbtn('je-ok','OK',{def:true})+wbtn('','Details &gt;&gt;'),{w:'48%',z:8});
    return x; }
  const sh=U?'accounting':'Accounting';
  if(d==='denied') return dlg('Network Error',`<div style="display:flex;gap:10px"><span style="color:#C62828;font-size:1.4rem">⨂</span><div>Windows cannot access \\\\SRV-01\\${sh}<br><br>You do not have permission to access \\\\SRV-01\\${sh}. Contact your network administrator to request access.</div></div>`,wbtn('dn-ok','Close',{def:true}),{w:'50%'});
  if(d==='neterr') return dlg('Network Error',`<div style="display:flex;gap:10px"><span style="color:#C62828;font-size:1.4rem">⨂</span><div>Windows cannot access \\\\SRV-01<br><br>Check the spelling of the name. Otherwise, there might be a problem with your network.<br><br>Error code: 0x80070035<br>The network path was not found.</div></div>`,wbtn('ne-ok','Close',{def:true})+wbtn('','Diagnose'),{w:'50%'});
  if(d==='netcred') return dlg('Windows Security',`<b>Enter network credentials</b><div style="margin:4px 0 8px">Enter your credentials to connect to: SRV-01</div><div data-t="cred-user">${field('','',C.credTyped?esc(C.credUser):'User name')}${field('','',C.credTyped?'••••••••••':'Password')}</div>`+check('','Remember my credentials',!!C.credTyped),wbtn('cred-ok','OK',{def:true,dis:!C.credTyped})+wbtn('','Cancel'),{w:'38%'});
  if(d==='ipv4') return dlg('Internet Protocol Version 4 (TCP/IPv4) Properties',radio('','Obtain an IP address automatically',true)+radio('','Use the following IP address:',false)+field('','IP address:','',{dis:true})+
      radio('ip4-autodns','Obtain DNS server address automatically',!!C.autoDns)+radio('','Use the following DNS server addresses:',!C.autoDns)+field('','Preferred DNS server:',C.autoDns?'':'8.8.8.8',{dis:!!C.autoDns,mono:true})+field('','Alternate DNS server:','',{dis:true}),wbtn('ip4-ok','OK',{def:true})+wbtn('','Cancel'),{w:'44%'});
  return '';
}
return {screen};
})();
