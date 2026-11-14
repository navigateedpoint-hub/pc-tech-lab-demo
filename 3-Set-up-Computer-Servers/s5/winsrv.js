/* Server Setup: the Windows Server 2025 console of SRV-01. Everything on screen is driven by the state, so each click moves straight to the next screen.
   s.mon: off | lock | pw | busy | desk.  s.app: the window in front.  s.dlg: the dialog on top of it.  s.w: what has been set up so far. */
window.WinSrv=(function(){
const {t,wbtn,abtn,link,field,check,radio,tabs,win,dlg,wizard,wzb,node,table,menu,term,taskbar,esc}=UI;
const DOM='ad.opisina.ph', NB='OPISINA';
const ico={sm:'🖥',ps:'⌨',ex:'📁',set:'⚙',dns:'🌐',dhcp:'🔢',aduc:'👥',ev:'📋'};
const blue='linear-gradient(135deg,#0A2A55,#1C4F93 55%,#2F6FC0)';

function screen(s){
  const m=s.mon;
  if(m==='off') return `<div style="position:absolute;inset:0;background:#030405"></div>`;
  if(m==='lock'||m==='lock2') return `<div style="position:absolute;inset:0;background:${blue};color:#fff;font-family:'Segoe UI',Arial">
     <div style="position:absolute;left:6%;bottom:16%"><div style="font-size:4rem;font-weight:300">10:42</div><div style="font-size:1.3rem">Saturday, November 14</div></div>
     <div style="position:absolute;right:6%;bottom:16%;font-size:1rem;background:rgba(0,0,0,.25);padding:8px 14px;border-radius:6px">Press Ctrl+Alt+Delete to unlock</div></div>`;
  if(m==='pw') return `<div style="position:absolute;inset:0;background:${blue};display:grid;place-items:center;color:#fff;text-align:center;font-family:'Segoe UI',Arial"><div>
     <div style="width:84px;height:84px;border-radius:50%;background:rgba(255,255,255,.2);margin:0 auto 10px;display:grid;place-items:center;font-size:2.2rem">👤</div>
     <div style="font-size:1.4rem">${s.w.dc?NB+'\\Administrator':'Administrator'}</div>
     <div data-t="pw-field" style="margin:14px auto 0;width:240px;padding:7px 10px;background:rgba(255,255,255,.92);color:#333;text-align:left;border-radius:4px;font-size:.9rem">${s.w.pwTyped?'••••••••••••':'Password'}</div>
     ${s.w.dc?'<div style="font-size:.8rem;margin-top:10px;opacity:.85">Sign in to: '+NB+'</div>':''}</div></div>`;
  if(m==='busy') return `<div style="position:absolute;inset:0;background:${blue};display:grid;place-items:center;color:#fff;font-family:'Segoe UI',Arial;text-align:center"><div><div style="font-size:2rem;letter-spacing:.3em">· · · · ·</div><div style="font-size:1.2rem;margin-top:10px">${esc(s.busyMsg||'Please wait')}</div></div></div>`;
  return desktop(s);
}

/* ---------- desktop with the window in front ---------- */
function desktop(s){
  const a=s.app;
  let body='';
  if(a==='sm') body=sm(s);
  else if(a==='ps') body=win('Administrator: Windows PowerShell',term(s.ps,s.psPending,{prompt:'PS C:\\Users\\Administrator> ',pc:'#E6E6E6',bg:'#012456',idle:true}),{l:'8%',t:'6%',w:'80%',h:'80%'});
  else if(a==='wu') body=wu(s);
  else if(a==='ev') body=ev(s);
  else if(a==='arw') body=sm(s)+arw(s);
  else if(a==='dcp') body=sm(s)+dcp(s);
  else if(a==='dhcppi') body=sm(s)+dhcppi(s);
  else if(a==='dhcp') body=dhcp(s);
  else if(a==='dns') body=dns(s);
  else if(a==='aduc') body=aduc(s);
  else if(a==='exp') body=exp(s);
  else if(a==='set') body=settings(s);
  body+=dialogs(s);
  const tb=[['tb-sm',ico.sm+' Server Manager',a==='sm'||a==='arw'||a==='dcp'||a==='dhcppi'],['tb-ps',ico.ps+' PowerShell',a==='ps'],['tb-explorer',ico.ex+' File Explorer',a==='exp'],['tb-settings',ico.set+' Settings',a==='set'||a==='wu']];
  if(s.w.dc) tb.push(['tb-aduc',ico.aduc+' AD Users',a==='aduc'],['tb-dns',ico.dns+' DNS',a==='dns']);
  if(s.w.dhcpInst) tb.push(['tb-dhcp',ico.dhcp+' DHCP',a==='dhcp']);
  return `<div style="position:absolute;inset:0;background:linear-gradient(160deg,#173E73,#2C5E9E 60%,#4F86C6)">${body}${taskbar(tb,{left:true})}</div>`;
}

/* ---------- Server Manager ---------- */
function sm(s){
  const W=s.w, p=s.smp||'dash';
  const navItems=[['dash','Dashboard','▦'],['local','Local Server','▮'],['all','All Servers','▤']];
  if(W.dc) navItems.push(['adds','AD DS','▤']);
  if(W.dhcpInst) navItems.push(['dhcp','DHCP','▤']);
  if(W.dc) navItems.push(['dnsr','DNS','▤']);
  navItems.push(['fs','File and Storage Services','▸']);
  const nav=`<div style="width:150px;background:#F3F3F3;border-right:1px solid #DDD;padding-top:6px;font-size:.76rem">${navItems.map(([k,l,i])=>`<div data-t="sm-nav-${k}" style="padding:.32rem .7rem;${p===k?'background:#CCE4F7;font-weight:700':''}">${i} ${l}</div>`).join('')}</div>`;
  const flag=s.flag?`<span style="position:relative">🚩<span style="position:absolute;right:-4px;top:-3px;color:#E0A100;font-size:.7rem">▲</span></span>`:'🚩';
  const top=`<div style="display:flex;align-items:center;gap:14px;padding:.45rem .8rem;border-bottom:1px solid #DDD;font-size:.8rem;background:#fff">
     <span style="font-size:1.05rem;font-weight:300">Server Manager <span style="color:#888">▸</span> ${({dash:'Dashboard',local:'Local Server',all:'All Servers',adds:'AD DS',dhcp:'DHCP',dnsr:'DNS',fs:'File and Storage Services'})[p]}</span>
     <span style="flex:1"></span><span>⟳</span><span data-t="sm-flag">${flag}</span>${t('sm-manage','Manage',s.menu==='manage'?'background:#CCE4F7;padding:0 4px':'padding:0 4px')}${t('sm-tools','Tools',s.menu==='tools'?'background:#CCE4F7;padding:0 4px':'padding:0 4px')}<span>View</span><span>Help</span></div>`;
  let main='';
  if(p==='dash') main=dash(s);
  if(p==='local') main=local(s);
  if(['all','adds','dhcp','dnsr','fs'].includes(p)) main=`<div style="padding:12px;font-size:.8rem">SERVERS · All servers | 1 total${table(['Server Name','IPv4 Address','Manageability','Last Update'],[{c:['SRV-01',W.ip?'192.168.1.11':'192.168.1.37','Online - Performance counters not started','11/14/2026 10:41 AM']}])}</div>`;
  let mn='';
  if(s.menu==='manage') mn=menu([['mg-add','Add Roles and Features'],['','Remove Roles and Features'],['','Add Servers'],['','Create Server Group'],['','Server Manager Properties']],{l:'auto;right:90px',t:'30px'});
  if(s.menu==='tools'){ const items=[];
    if(W.dc) items.push(['tl-aduc','Active Directory Users and Computers']);
    items.push(['','Computer Management']);
    if(W.dhcpInst) items.push(['tl-dhcp','DHCP']);
    if(W.dc) items.push(['tl-dns','DNS']);
    items.push(['tl-ev','Event Viewer']);
    if(W.dc) items.push(['','Group Policy Management']);
    items.push(['','Services'],['','Task Scheduler']);
    if(W.wsb) items.push(['tl-wsb','Windows Server Backup']);
    mn=menu(items,{l:'auto;right:40px',t:'30px',w:'240px'}); }
  return win('Server Manager',`<div style="display:flex;flex-direction:column;height:100%">${top}<div style="display:flex;flex:1;min-height:0">${nav}<div style="flex:1;overflow:hidden;position:relative">${main}</div></div>${mn}</div>`,{l:'2%',t:'2%',w:'96%',h:'88%'});
}
function tile(id,name,n,ok){ return `<div${id?` data-t="${id}"`:''} style="border:1px solid #DDD;font-size:.7rem;background:#fff"><div style="background:${ok?'#2E7D32':'#C62828'};color:#fff;padding:.2rem .4rem;font-weight:700">${name} <span style="float:right">${n}</span></div>${['Manageability','Events','Services','Performance','BPA results'].map((x,i)=>`<div style="padding:.06rem .4rem;${i===0&&!ok?'color:#C62828':''}">${x}</div>`).join('')}</div>`; }
function dash(s){ const W=s.w;
  const roles=[]; if(W.dc){ roles.push(['AD DS',1],['DNS',1]); } if(W.dhcpInst) roles.push(['DHCP',1]); roles.push(['File and Storage Services',1]);
  return `<div style="padding:10px 14px;font-size:.8rem">
    <div style="display:grid;grid-template-columns:150px 1fr;border:1px solid #DDD;margin-bottom:10px"><div style="background:#0067C0;color:#fff;padding:10px;font-weight:700">QUICK START</div>
      <div style="padding:8px 12px;line-height:1.7"><b>WELCOME TO SERVER MANAGER</b><br>1 Configure this local server<br>2 Add roles and features<br>3 Add other servers to manage<br>4 Create a server group<br>5 Connect this server to cloud services</div></div>
    <div style="font-weight:700;margin:6px 0">ROLES AND SERVER GROUPS <span style="font-weight:400;color:#555">Roles: ${roles.length} | Server groups: 1 | Servers total: 1</span></div>
    <div data-t="sm-tiles" style="display:grid;grid-template-columns:repeat(${Math.min(5,roles.length+2)},1fr);gap:8px">${roles.map(([n,c])=>tile('',n,c,true)).join('')}${tile('','Local Server',1,true)}${tile('','All Servers',1,true)}</div></div>`; }
function local(s){ const W=s.w;
  const row=(l,v,id)=>`<div style="display:grid;grid-template-columns:150px 1fr;padding:.12rem 0"><span style="color:#555">${l}</span>${id?link(id,v):`<span>${v}</span>`}</div>`;
  return `<div style="padding:10px 14px;font-size:.78rem"><div style="font-weight:700;margin-bottom:6px">PROPERTIES <span style="font-weight:400;color:#555">For ${W.renamed?'SRV-01':'WIN-7Q3K2L9F1MA'}</span></div>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 24px">
    <div>${row('Computer name',W.renamed?'SRV-01':'WIN-7Q3K2L9F1MA','lp-name')}${row(W.dc?'Domain':'Workgroup',W.dc?DOM:'WORKGROUP')}
      <br>${row('Windows Defender Firewall',W.dc?'Domain: On':'Public: On')}${row('Remote management','Enabled')}${row('Remote Desktop',W.rdp?'Enabled':'Disabled','lp-rdp')}${row('NIC Teaming','Disabled')}
      ${row('Ethernet',W.ip?'192.168.1.11, IPv6 enabled':'IPv4 address assigned by DHCP, IPv6 enabled','lp-eth')}</div>
    <div>${row('Last installed updates',W.upd==='done'?'Today at 11:05 AM':'Never')}${row('Windows Update',W.upd==='done'?'Download updates only, using Windows Update':'Not configured','lp-wu')}${row('Last checked for updates',W.upd?'Today at 10:58 AM':'Never')}
      <br>${row('Microsoft Defender Antivirus','Real-Time Protection: On')}${row('Feedback &amp; Diagnostics','Settings')}${t('lp-tz',row('Time zone','(UTC+08:00) Kuala Lumpur, Singapore'),'display:block')}${row('Product ID','00495-80000-00000-AA000 (activated)')}
      <br>${row('Processors','Intel(R) Xeon(R) E-2414 (4 cores)')}${row('Installed memory (RAM)','32 GB')}${row('Total disk space','2.46 TB')}</div></div>
   <div style="margin-top:10px;color:#555">Operating system: Microsoft Windows Server 2025 Standard · Hardware: Tower server, 4 × 3.5" bays</div></div>`; }

/* ---------- Windows Update and Event Viewer ---------- */
function wu(s){ const u=s.w.upd;
  return win('Settings',`<div style="display:flex;height:100%"><div style="width:170px;background:#F3F3F3;padding:10px;font-size:.78rem;line-height:2">System<br>Network &amp; internet<br>Apps<br>Accounts<br>Time &amp; language<br><b style="background:#fff;padding:2px 6px;border-radius:4px">Windows Update</b></div>
   <div style="padding:14px 18px;font-size:.82rem;flex:1"><div style="font-size:1.3rem;font-weight:600;margin-bottom:10px">Windows Update</div>
   ${u==='done'?'<div style="font-weight:700;color:#107C10">✓ You’re up to date</div><div style="color:#666">Last checked: Today, 10:58 AM</div>':
     u==='found'?`<div style="font-weight:700">Updates available</div><div style="margin:.4rem 0 .6rem;line-height:1.6">• 2026-11 Cumulative Update for Microsoft server operating system version 24H2 for x64-based Systems<br>• Security Intelligence Update for Microsoft Defender Antivirus<br>• Intel - System - 10.1.x (chipset)</div>${abtn('wu-install','Download &amp; install all')}`:
     `<div style="color:#555;margin-bottom:10px">Last checked: Never</div>${abtn('wu-check','Check for updates')}`}</div></div>`,{l:'6%',t:'5%',w:'86%',h:'82%'}); }
function ev(s){ const E=s.ev||{};
  const lvl=['Information','Information','Information','Warning','Information','Information','Information'];
  const src=['Kernel-General','Kernel-Boot','EventLog','Time-Service','Service Control Manager','Kernel-Power','Winlogon'];
  const rows=E.filter?[]:lvl.map((l,i)=>({c:[(l==='Warning'?'⚠ ':'ⓘ ')+l,'11/14/2026 10:3'+(9-i)+':0'+i+' AM',src[i],String([12,153,6005,129,7036,109,7001][i])]}));
  return win('Event Viewer',`<div style="display:grid;grid-template-columns:190px 1fr 170px;height:100%;font-size:.76rem">
    <div style="border-right:1px solid #DDD;padding-top:4px">${node('',0,'📋','Event Viewer (Local)',{exp:true})}${node('',1,'📁','Custom Views',{exp:false})}${node('',1,'📁','Windows Logs',{exp:true})}${node('',2,'📄','Application')}${node('',2,'📄','Security')}${node('',2,'📄','Setup')}${node('ev-system',2,'📄','System',{sel:E.sel})}${node('',1,'📁','Applications and Services Logs',{exp:false})}</div>
    <div style="padding:6px 10px;min-width:0">${E.sel?`<div style="font-weight:700;margin-bottom:4px">System</div><div style="color:#555;margin-bottom:4px">${E.filter?'Filtered: Log: System; Levels: Critical, Error; Since boot. Number of events: 0':'Number of events: 2,214'}</div>
      ${table(['Level','Date and Time','Source','Event ID'],rows)}${E.filter?'<div style="padding:16px;color:#107C10;font-weight:700">No Critical or Error events since the server started.</div>':''}`:'<div style="padding:10px;color:#555">Select a log.</div>'}</div>
    <div style="border-left:1px solid #DDD;background:#FAFAFA;padding:4px 6px">${E.sel?`<b>Actions</b><div>Open Saved Log…</div><div>Create Custom View…</div>${t('ev-filter','▽ Filter Current Log…','display:block;'+(E.filter?'background:#CCE4F7':''))}<div>Properties</div><div>Find…</div>`:''}</div></div>`,{l:'5%',t:'4%',w:'88%',h:'84%'}); }

/* ---------- Add Roles and Features ---------- */
function arw(s){ const R=s.arw||{}, p=R.page||'before';
  const role=R.role||'adds'; const roleStep=role==='adds'?'AD DS':role==='dhcp'?'DHCP Server':null;
  const steps=['Before You Begin','Installation Type','Server Selection','Server Roles','Features'].concat(roleStep?[roleStep]:[]).concat(['Confirmation','Results']);
  const names={before:'Before You Begin',type:'Installation Type',server:'Server Selection',roles:'Server Roles',features:'Features',info:roleStep,confirm:'Confirmation',results:'Results'};
  let h='', body='', b=wzb({install:false});
  if(p==='before'){ h='Before you begin'; body='This wizard helps you install roles, role services, or features. Before you continue, verify that:<ul style="margin:.4rem 0;line-height:1.6"><li>The Administrator account has a strong password</li><li>Network settings, such as static IP addresses, are configured</li><li>The most current security updates from Windows Update are installed</li></ul>'+check('',"Skip this page by default",false); b=wzb({prev:false,install:false}); }
  if(p==='type'){ h='Select installation type'; body=radio('','<b>Role-based or feature-based installation</b>',true,'Configure a single server by adding roles, role services, and features.')+radio('','Remote Desktop Services installation',false,'Install required role services for a Remote Desktop Services deployment.'); }
  if(p==='server'){ h='Select destination server'; body=radio('','Select a server from the server pool',true)+radio('','Select a virtual hard disk',false)+`<div style="margin-top:6px">Server Pool</div>`+table(['Name','IP Address','Operating System'],[{c:[s.w.dc?'SRV-01.'+DOM:'SRV-01','192.168.1.11','Microsoft Windows Server 2025 Standard'],sel:true}]); }
  if(p==='roles'){ h='Select server roles';
    const list=[['Active Directory Certificate Services'],['Active Directory Domain Services','role-adds',s.w.addsInst||R.adds],['Active Directory Federation Services'],['Device Health Attestation'],['DHCP Server','role-dhcp',s.w.dhcpInst||R.dhcp],['DNS Server','',s.w.dc],['Fax Server'],['File and Storage Services (2 of 12 installed)','',true],['Host Guardian Service'],['Hyper-V'],['Network Policy and Access Services'],['Print and Document Services'],['Remote Access'],['Remote Desktop Services'],['Web Server (IIS)'],['Windows Server Update Services']];
    body=`<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:12px"><div><div>Roles</div><div style="border:1px solid #ADADAD;padding:2px 6px;height:230px;overflow:hidden">${list.map(([n,id,on])=>check(id,n+((id==='role-adds'&&s.w.addsInst)||(n==='DNS Server'&&s.w.dc)||(id==='role-dhcp'&&s.w.dhcpInst)?' (Installed)':''),!!on,{m:'.05rem 0'})).join('')}</div></div>
      <div><div>Description</div><div style="color:#444;font-size:.76rem">${role==='dhcp'?'Dynamic Host Configuration Protocol (DHCP) Server enables you to centrally configure, manage, and provide temporary IP addresses and related information for client computers.':'Active Directory Domain Services (AD DS) stores information about objects on the network and makes this information available to users and network administrators. AD DS uses domain controllers to give network users access to permitted resources anywhere on the network through a single logon process.'}</div></div></div>`;
    b=wzb({install:false,next:(role==='adds'&&R.adds)||(role==='dhcp'&&R.dhcp)?undefined:false}); }
  if(p==='features'){ h='Select features'; body='Features<div style="border:1px solid #ADADAD;padding:2px 6px;height:200px;overflow:hidden">'+['.NET Framework 4.8 Features (2 of 7 installed)','BitLocker Drive Encryption','Group Policy Management'+(role==='adds'?' (will be added)':''),'Remote Server Administration Tools'+(role?' (will be added)':''),'SMB 1.0/CIFS File Sharing Support','Windows Server Backup','Windows PowerShell (2 of 5 installed)'].map((n,i)=>check('',n,i===0||i===6||((i===2||i===3)&&!!role),{m:'.08rem 0'})).join('')+'</div>'; }
  if(p==='info'){ h=role==='adds'?'Active Directory Domain Services':'DHCP Server'; body=role==='adds'?'Active Directory Domain Services (AD DS) stores information about users, computers, and other devices on the network.<br><br><b>Things to note:</b><ul style="line-height:1.6"><li>To help ensure that users can still log on to the network in the case of a server outage, install a minimum of two domain controllers for a domain.</li><li>AD DS requires that a DNS server be installed on the network. If you do not have a DNS server installed, you will be prompted to install the DNS Server role on this machine.</li></ul>':
     'Dynamic Host Configuration Protocol (DHCP) allows servers to assign, or lease, IP addresses to computers and other devices that are enabled as DHCP clients.<br><br><b>Things to note:</b><ul style="line-height:1.6"><li>You should configure at least one static IP address on this computer.</li><li>Before you install DHCP Server, you should plan your subnets, scopes, and exclusions.</li></ul>'; }
  if(p==='confirm'){ h='Confirm installation selections'; body=check('',"Restart the destination server automatically if required",false)+'<div style="margin-top:6px;line-height:1.7">'+(role==='adds'?'Active Directory Domain Services<br>Group Policy Management<br>Remote Server Administration Tools<br>&nbsp;&nbsp;Role Administration Tools<br>&nbsp;&nbsp;&nbsp;&nbsp;AD DS and AD LDS Tools':'DHCP Server<br>Remote Server Administration Tools<br>&nbsp;&nbsp;Role Administration Tools<br>&nbsp;&nbsp;&nbsp;&nbsp;DHCP Server Tools')+'</div>'; b=wzb({install:true,inst:true,next:false}); }
  if(p==='results'){ h='Installation progress'; body=`<div style="height:10px;background:#E0E0E0;margin:6px 0"><div style="width:100%;height:100%;background:#2E7D32"></div></div>Configuration required. Installation succeeded on ${s.w.dc?'SRV-01.'+DOM:'SRV-01'}.<div style="margin-top:8px;line-height:1.7"><b>${role==='adds'?'Active Directory Domain Services':'DHCP Server'}</b><br>Additional steps are required to make this machine a ${role==='adds'?'domain controller':'DHCP server'}.<br>${role==='adds'?link('rs-promote','Promote this server to a domain controller'):link('rs-dhcpcfg','Complete DHCP configuration')}</div>`;
    b=wbtn('','&lt; Previous',{dis:true})+wbtn('','Next &gt;',{dis:true})+wbtn('wz-close','Close',{def:true})+wbtn('','Cancel',{dis:true}); }
  let pop='';
  if(R.popup) pop=dlg('Add Roles and Features Wizard',`<div style="font-size:.9rem;margin-bottom:6px">Add features that are required for ${R.popup==='adds'?'Active Directory Domain Services':'DHCP Server'}?</div><div style="color:#444;line-height:1.5">The following tools are required to manage this feature, but do not have to be installed on the same server.<br>&nbsp;&nbsp;Remote Server Administration Tools<br>&nbsp;&nbsp;&nbsp;&nbsp;Role Administration Tools<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${R.popup==='adds'?'AD DS and AD LDS Tools':'DHCP Server Tools'}${R.popup==='adds'?'<br>&nbsp;&nbsp;Group Policy Management':''}</div>`+check('','Include management tools (if applicable)',true),wbtn('pf-add','Add Features',{def:true})+wbtn('','Cancel'),{w:'46%'});
  return wizard('Add Roles and Features Wizard',steps,names[p],h,body,b)+pop;
}

/* ---------- Active Directory Domain Services Configuration Wizard ---------- */
function dcp(s){ const D=s.dc||{}, p=D.page||'deploy';
  const steps=['Deployment Configuration','Domain Controller Options','DNS Options','Additional Options','Paths','Review Options','Prerequisites Check','Installation','Results'];
  const names={deploy:'Deployment Configuration',options:'Domain Controller Options',dnsopt:'DNS Options',additional:'Additional Options',paths:'Paths',review:'Review Options',prereq:'Prerequisites Check'};
  let h='', body='', b=wbtn('','&lt; Previous',{dis:p==='deploy'})+wbtn('wz-next','Next &gt;',{def:true})+wbtn('','Install',{dis:true})+wbtn('','Cancel');
  const warn=x=>`<div style="background:#FFF4CE;border:1px solid #E8D27A;padding:4px 8px;margin-bottom:6px;font-size:.74rem">⚠ ${x}</div>`;
  if(p==='deploy'){ h='Deployment Configuration'; body='Select the deployment operation'+radio('','Add a domain controller to an existing domain',!D.forest)+radio('','Add a new domain to an existing forest',false)+radio('dc-newforest','Add a new forest',!!D.forest)+
     `<div style="margin-top:8px">Specify the domain information for this operation</div>`+field('dc-root','Root domain name:',D.root?DOM:'',{inline:true,lw:'130px'});
     if(!D.root) b=wbtn('','&lt; Previous',{dis:true})+wbtn('','Next &gt;',{dis:true})+wbtn('','Install',{dis:true})+wbtn('','Cancel'); }
  if(p==='options'){ h='Domain Controller Options'; body=`Select functional level of the new forest and root domain`+field('','Forest functional level:','Windows Server 2025 ▾',{inline:true,lw:'170px'})+field('','Domain functional level:','Windows Server 2025 ▾',{inline:true,lw:'170px'})+
     '<div style="margin-top:6px">Specify domain controller capabilities</div>'+check('','Domain Name System (DNS) server',true)+check('','Global Catalog (GC)',true,{dis:true})+check('','Read only domain controller (RODC)',false,{dis:true})+
     '<div style="margin-top:6px">Type the Directory Services Restore Mode (DSRM) password</div>'+field('dc-dsrm','Password:',D.dsrm?'••••••••••••••':'',{inline:true,lw:'170px'})+field('','Confirm password:',D.dsrm?'••••••••••••••':'',{inline:true,lw:'170px'});
     if(!D.dsrm) b=wbtn('','&lt; Previous')+wbtn('','Next &gt;',{dis:true})+wbtn('','Install',{dis:true})+wbtn('','Cancel'); }
  if(p==='dnsopt'){ h='DNS Options'; body=warn('A delegation for this DNS server cannot be created because the authoritative parent zone cannot be found or it does not run Windows DNS server. If you are integrating with an existing DNS infrastructure, you should manually create a delegation…')+'Specify DNS delegation options'+check('','Create DNS delegation',false,{dis:true}); }
  if(p==='additional'){ h='Additional Options'; body='Verify the NetBIOS name assigned to the domain and change it if necessary'+field('dc-netbios','The NetBIOS domain name:',D.nb?NB:'AD',{inline:true,lw:'170px'}); }
  if(p==='paths'){ h='Paths'; body='Specify the location of the AD DS database, log files, and SYSVOL'+field('','Database folder:','C:\\Windows\\NTDS',{inline:true,lw:'130px'})+field('','Log files folder:','C:\\Windows\\NTDS',{inline:true,lw:'130px'})+field('','SYSVOL folder:','C:\\Windows\\SYSVOL',{inline:true,lw:'130px'}); }
  if(p==='review'){ h='Review Options'; body=`<div style="line-height:1.6">Review your selections:<br>Configure this server as the first Active Directory domain controller in a new forest.<br>The new domain name is "${DOM}". This is also the name of the new forest.<br>The NetBIOS name of the domain: ${NB}<br>Forest Functional Level: Windows Server 2025<br>Domain Functional Level: Windows Server 2025<br>Additional Options:<br>&nbsp;&nbsp;Global catalog: Yes<br>&nbsp;&nbsp;DNS Server: Yes<br>&nbsp;&nbsp;Create DNS Delegation: No</div><div style="margin-top:6px">${link('','View script')}</div>`; }
  if(p==='prereq'){ h='Prerequisites Check'; body=`<div style="background:#E8F5E9;border:1px solid #9CCC9F;padding:4px 8px;margin-bottom:6px">✔ All prerequisite checks passed successfully. Click 'Install' to begin installation.</div>`+warn('Windows Server 2025 domain controllers have a default for the security setting named "Allow cryptography algorithms compatible with Windows NT 4.0" that prevents weaker cryptography algorithms when establishing security channel sessions.')+
     '<div style="color:#444">If you click Install, the server automatically reboots at the end of the promotion operation.</div>';
     b=wbtn('','&lt; Previous')+wbtn('','Next &gt;',{dis:true})+wbtn('dc-install','Install',{def:true})+wbtn('','Cancel'); }
  return wizard('Active Directory Domain Services Configuration Wizard',steps,names[p],h,body,b,{dest:'SRV-01'});
}

/* ---------- DHCP post-install configuration ---------- */
function dhcppi(s){ const p=(s.pi||{}).page||'desc';
  const steps=['Description','Authorization','Summary'];
  let h='',body='',b='';
  if(p==='desc'){ h='Description'; body='The following steps will be performed to complete the configuration of the DHCP server on the target computer:<br><br>Create the following security groups for delegation of DHCP server administration:<br>&nbsp;&nbsp;- DHCP Administrators<br>&nbsp;&nbsp;- DHCP Users<br><br>Authorize DHCP server on the target computer (if the computer is domain joined).'; b=wbtn('','&lt; Previous',{dis:true})+wbtn('wz-next','Next &gt;',{def:true})+wbtn('','Commit',{dis:true})+wbtn('','Cancel'); }
  if(p==='auth'){ h='Authorization'; body='Specify the credentials to be used to authorize this DHCP server in AD DS.'+radio('','Use the following user’s credentials',true)+field('','User Name:',NB+'\\Administrator',{inline:true,lw:'90px'})+radio('','Use alternate credentials',false)+radio('','Skip AD authorization',false); b=wbtn('','&lt; Previous')+wbtn('','Next &gt;',{dis:true})+wbtn('pi-commit','Commit',{def:true})+wbtn('','Cancel'); }
  if(p==='summary'){ h='Summary'; body='The status of the post-install configuration steps are indicated below:<br><br>Security Group creation ......... <b style="color:#2E7D32">Done</b><br>Please restart the DHCP server service on the target computer for the security groups to be effective.<br><br>Authorizing DHCP server ......... <b style="color:#2E7D32">Done</b>'; b=wbtn('','&lt; Previous',{dis:true})+wbtn('','Next &gt;',{dis:true})+wbtn('pi-close','Close',{def:true})+wbtn('','Cancel',{dis:true}); }
  return wizard('DHCP Post-Install configuration wizard',steps,({desc:'Description',auth:'Authorization',summary:'Summary'})[p],h,body,b,{dest:false,pos:{l:'14%',t:'10%',w:'70%',h:'74%'}});
}

/* ---------- DHCP console and the New Scope Wizard ---------- */
function dhcp(s){ const D=s.dhcp||{};
  const scope=D.scope;
  const tree=node('',0,'🔢','DHCP',{exp:true})+node('dh-server',1,'🖥','srv-01.'+DOM,{exp:true})+node('dh-ipv4',2,'4️⃣','IPv4',{exp:true,sel:D.sel==='ipv4'})+
    (scope?node('dh-scope',3,'📂',`Scope [192.168.1.0] Office LAN${D.active===false?' [Inactive]':''}`,{exp:true,sel:D.sel==='scope'})+node('dh-pool',4,'📄','Address Pool',{sel:D.sel==='pool'})+node('dh-leases',4,'📄','Address Leases',{sel:D.sel==='leases'})+node('',4,'📄','Reservations')+node('',4,'📄','Scope Options')+node('',4,'📄','Policies'):'')+
    node('',3,'📄','Server Options')+node('',3,'📄','Policies')+node('',3,'📄','Filters')+node('',2,'6️⃣','IPv6',{exp:false});
  let right='';
  if(!scope) right=`<div style="padding:16px;color:#333"><b>Add a Scope</b><br><br>A scope is a range of IP addresses assigned to computers requesting a dynamic IP address. You must create and configure a scope before dynamic IP addresses can be assigned.<br><br>To add a new scope, on the Action menu, click New Scope.</div>`;
  else if(D.sel==='leases') right=table(['Client IP Address','Name','Lease Expiration','Type','Unique ID'],(D.leases||[]).map(l=>({c:l})));
  else right=table(['Start IP Address','End IP Address','Description'],[{c:['192.168.1.100','192.168.1.199','Address range for distribution']}]);
  let ctx='';
  if(D.ctx2) ctx=menu([['','Display Statistics…'],['','Reconcile…'],['dh-activate','Activate'],'-',['','Delete'],['','Refresh'],['','Properties']],{l:'200px',t:'70px'});
  if(D.ctx) ctx=menu([['','Display Statistics…'],['dh-newscope','New Scope…'],['','New Superscope…'],['','New Multicast Scope…'],'-',['','Configure Failover…'],['','Define User Classes…'],['','Set Predefined Options…'],'-',['','Refresh'],['','Properties']],{l:'150px',t:'52px'});
  return win('DHCP',`<div style="display:grid;grid-template-columns:240px 1fr;height:100%;font-size:.76rem"><div style="border-right:1px solid #DDD;padding-top:4px">${tree}</div><div style="overflow:hidden">${right}</div></div>${ctx}${D.wiz?nsw(s):''}`,{l:'4%',t:'4%',w:'90%',h:'84%',menu:'File &nbsp; Action &nbsp; View &nbsp; Help'});
}
function nsw(s){ const N=s.ns||{}, p=N.page||'welcome';
  const titles={welcome:'',name:['Scope Name','You have to provide an identifying scope name. You also have the option of providing a description.'],range:['IP Address Range','You define the scope address range by identifying a set of consecutive IP addresses.'],
    excl:['Add Exclusions and Delay','Exclusions are addresses or a range of addresses that are not distributed by the server.'],lease:['Lease Duration','The lease duration specifies how long a client can use an IP address from this scope.'],
    opts:['Configure DHCP Options','You have to configure the most common DHCP options before clients can use the scope.'],router:['Router (Default Gateway)','You can specify the routers, or default gateways, to be distributed by this scope.'],
    dns:['Domain Name and DNS Servers','The Domain Name System (DNS) maps and translates domain names used by clients on your network.'],wins:['WINS Servers','Computers running Windows can use WINS servers to convert NetBIOS computer names to IP addresses.'],
    activate:['Activate Scope','Clients can obtain address leases only if a scope is activated.'],finish:''};
  let body='';
  if(p==='welcome') body=`<div style="display:grid;grid-template-columns:120px 1fr;min-height:200px"><div style="background:linear-gradient(#2B5797,#1B3A66)"></div><div style="padding:14px"><div style="font-size:1.1rem;font-weight:700;margin-bottom:10px">Welcome to the New Scope Wizard</div>This wizard helps you set up a scope for distributing IP addresses to computers on your network.<br><br>To continue, click Next.</div></div>`;
  else if(p==='finish') body=`<div style="display:grid;grid-template-columns:120px 1fr;min-height:200px"><div style="background:linear-gradient(#2B5797,#1B3A66)"></div><div style="padding:14px"><div style="font-size:1.1rem;font-weight:700;margin-bottom:10px">Completing the New Scope Wizard</div>You have successfully completed the New Scope wizard.<br><br>To close this wizard, click Finish.</div></div>`;
  else { const [h,sub]=titles[p]; let c='';
    if(p==='name') c=field('ns-name','Name:',N.name?'Office LAN':'',{inline:true,lw:'90px'})+field('','Description:',N.name?'Staff PCs and laptops':'',{inline:true,lw:'90px'});
    if(p==='range') c='DHCP Server Configuration Settings'+field('ns-range','Start IP address:',N.range?'192.168.1.100':'',{inline:true,lw:'130px',mono:true})+field('','End IP address:',N.range?'192.168.1.199':'',{inline:true,lw:'130px',mono:true})+'Configuration settings that propagate to DHCP Client'+field('','Length:',N.range?'24':'',{inline:true,lw:'130px'})+field('','Subnet mask:',N.range?'255.255.255.0':'',{inline:true,lw:'130px',mono:true});
    if(p==='excl') c=field('','Start IP address:','',{inline:true,lw:'130px'})+field('','End IP address:','',{inline:true,lw:'130px'})+'Excluded address range:<div style="border:1px solid #ADADAD;background:#fff;height:60px"></div>'+field('','Subnet delay in milli second:','0',{inline:true,lw:'170px'});
    if(p==='lease') c='Lease duration for DHCP clients connecting through a wired network.<div style="display:flex;gap:10px;margin-top:6px">'+field('','Days:','8')+field('','Hours:','0')+field('','Minutes:','0')+'</div>';
    if(p==='opts') c='Do you want to configure the DHCP options for this scope now?'+radio('ns-yes','Yes, I want to configure these options now',true)+radio('','No, I will configure these options later',false);
    if(p==='router') c=`<div style="display:grid;grid-template-columns:1fr 90px;gap:6px">${field('ns-router','IP address:',N.router?'':'192.168.1.1',{mono:true})}<div style="padding-top:16px">${wbtn('','Add')}</div></div><div style="border:1px solid #ADADAD;background:#fff;height:54px;padding:2px 6px;font-family:var(--mono)">${N.router?'192.168.1.1':''}</div>`;
    if(p==='dns') c=field('','Parent domain:',DOM,{inline:true,lw:'110px'})+'To configure scope clients to use DNS servers on your network, enter the IP addresses for those servers.<div style="border:1px solid #ADADAD;background:#fff;height:44px;padding:2px 6px;font-family:var(--mono)" data-t="ns-dnslist">192.168.1.11</div>';
    if(p==='wins') c='Entering server IP addresses here enables Windows clients to query WINS before they use broadcasts to register and resolve NetBIOS names.<div style="border:1px solid #ADADAD;background:#fff;height:44px"></div>';
    if(p==='activate') c='Do you want to activate this scope now?'+radio('','Yes, I want to activate this scope now',!N.later)+radio('ns-actlater','No, I will activate this scope later',!!N.later);
    body=`<div style="background:#fff;padding:8px 12px;border-bottom:1px solid #DDD"><b>${h}</b><div style="color:#444;margin-left:12px">${sub}</div></div><div style="padding:10px 18px;min-height:160px">${c}</div>`; }
  const ready={name:N.name,range:N.range,router:N.router};
  const nextOk=!(p in ready)||ready[p];
  return dlg('New Scope Wizard',body,wbtn('','&lt; Back',{dis:p==='welcome'})+(p==='finish'?wbtn('ns-finish','Finish',{def:true}):wbtn(nextOk?'wz-next':'','Next &gt;',{def:true,dis:!nextOk}))+wbtn('','Cancel'),{w:'62%',bg:'#F0F0F0'});
}

/* ---------- DNS Manager ---------- */
function dns(s){ const D=s.dns||{};
  const zoneRecs=[['(same as parent folder)','Start of Authority (SOA)','[1], srv-01.'+DOM+'., hostmaster.'+DOM+'.'],['(same as parent folder)','Name Server (NS)','srv-01.'+DOM+'.'],['(same as parent folder)','Host (A)','192.168.1.11'],['srv-01','Host (A)','192.168.1.11']]
    .concat((D.recs||[]).map(r=>[r[0],'Host (A)',r[1]]));
  const folders=['_msdcs','_sites','_tcp','_udp','DomainDnsZones','ForestDnsZones'];
  const tree=node('',0,'🌐','DNS',{exp:true})+node('dz-server',1,'🖥','SRV-01',{exp:true,sel:D.sel==='server'})+node('',2,'📁','Forward Lookup Zones',{exp:true})+node('',3,'📄','_msdcs.'+DOM)+node('dz-zone',3,'📄',DOM,{exp:D.sel==='zone',sel:D.sel==='zone'})+node('',2,'📁','Reverse Lookup Zones',{exp:false})+node('',2,'📁','Trust Points',{exp:false})+node('',2,'📁','Conditional Forwarders',{exp:false})+node('',1,'📁','Global Logs',{exp:false});
  let right='<div style="padding:12px;color:#555">Select a zone to see its records.</div>';
  if(D.sel==='zone') right=table(['Name','Type','Data'],folders.map(f=>({c:['📁 '+f,'','']})).concat(zoneRecs.map(r=>({c:r,sel:D.recs&&D.recs.length&&r[0]===D.recs[D.recs.length-1][0]}))));
  if(D.sel==='server') right=table(['Name'],[{c:['📁 Forward Lookup Zones']},{c:['📁 Reverse Lookup Zones']},{c:['📁 Trust Points']},{c:['📁 Conditional Forwarders']}]);
  let ctx='';
  if(D.ctx) ctx=menu([['','Update Server Data File'],['','Reload'],['dz-newhost','New Host (A or AAAA)…'],['','New Alias (CNAME)…'],['','New Mail Exchanger (MX)…'],['','New Domain…'],'-',['','Refresh'],['','Properties']],{l:'170px',t:'86px'});
  let d='';
  if(D.dlg==='host') d=dlg('New Host',field('dh-name','Name (uses parent domain name if blank):',D.form?D.form[0]:'')+field('','Fully qualified domain name (FQDN):',D.form?D.form[0]+'.'+DOM+'.':DOM+'.',{dis:true})+field('','IP address:',D.form?D.form[1]:'',{mono:true})+
      check('','Create associated pointer (PTR) record',false)+check('','Allow any authenticated user to update DNS records with the same owner name',false),wbtn(D.form?'dh-add':'','Add Host',{def:true,dis:!D.form})+wbtn('dh-done',D.added?'Done':'Cancel'),{w:'48%'});
  if(D.dlg==='hostok') d=dlg('DNS',`ⓘ The host record ${D.recs[D.recs.length-1][0]}.${DOM} was successfully created.`,wbtn('dh-ok','OK',{def:true}),{w:'44%'});
  if(D.dlg==='props'){ const tb=[['','Interfaces'],['dp-fwtab','Forwarders'],['','Advanced'],['','Root Hints'],['','Debug Logging'],['','Event Logging'],['','Monitoring'],['','Security']];
    d=dlg('SRV-01 Properties',tabs(tb,D.ptab==='fw'?'Forwarders':'Interfaces')+(D.ptab==='fw'?'Forwarders are DNS servers that this server can use to resolve DNS queries for records that this server cannot resolve.'+table(['IP Address','Server FQDN'],D.fw?[{c:['1.1.1.1','one.one.one.one']},{c:['8.8.8.8','dns.google']}]:[{c:['192.168.1.1','&lt;Unable to resolve&gt;']}])+`<div style="margin:6px 0">${check('','Use root hints if no forwarders are available',true)}</div>${wbtn('dp-edit','Edit…')}`:
      'Select the IP addresses that will serve DNS requests.'+radio('','All IP addresses',true)+radio('','Only the following IP addresses:',false)),wbtn('dp-ok','OK',{def:true})+wbtn('','Cancel')+wbtn('','Apply'),{w:'56%'}); }
  return win('DNS Manager',`<div style="display:grid;grid-template-columns:250px 1fr;height:100%;font-size:.76rem"><div style="border-right:1px solid #DDD;padding-top:4px">${tree}</div><div style="overflow:hidden">${right}</div></div>${ctx}${d}`,{l:'4%',t:'4%',w:'90%',h:'84%',menu:'File &nbsp; Action &nbsp; View &nbsp; Help'});
}

/* ---------- Active Directory Users and Computers ---------- */
function aduc(s){ const A=s.ad||{};
  const ouObjs=(A.objs||[]);
  const tree=node('',0,'👥','Active Directory Users and Computers [SRV-01.'+DOM+']',{exp:true})+node('',1,'📁','Saved Queries',{exp:false})+node('au-domain',1,'🏢',DOM,{exp:true,sel:A.sel==='domain'})+
    ['Builtin','Computers','Domain Controllers','ForeignSecurityPrincipals','Managed Service Accounts','Users'].map(x=>node('',2,'📁',x,{exp:false})).join('')+(A.ou?node('au-ou',2,'🗂','Opisina',{exp:false,sel:A.sel==='ou'}):'');
  let right='';
  if(A.sel==='ou') right=table(['Name','Type','Description'],ouObjs.map(o=>({id:o.id,c:[o.icon+' '+o.name,o.type,o.desc||''],sel:A.pick===o.id})));
  else right=table(['Name','Type','Description'],['Builtin','Computers','Domain Controllers','ForeignSecurityPrincipals','Managed Service Accounts','Users'].map(x=>({c:['📁 '+x,x==='Domain Controllers'?'Organizational Unit':'Container','']})).concat(A.ou?[{c:['🗂 Opisina','Organizational Unit','Office staff']}]:[]));
  let ctx='';
  if(A.ctx==='new') ctx=menu([['','Delegate Control…'],['','Find…'],['','Move…'],['au-new','New',true],'-',['','Properties']],{l:'200px',t:A.sel==='ou'?'200px':'72px'})+menu([['','Computer'],['','Contact'],['au-new-group','Group'],['','InetOrgPerson'],['au-new-ou','Organizational Unit'],['','Printer'],['au-new-user','User'],['','Shared Folder']],{l:'392px',t:A.sel==='ou'?'260px':'132px',w:'160px'});
  let d='';
  const nobj=(kind,body,btns)=>dlg('New Object - '+kind,`<div style="margin-bottom:8px">Create in: ${DOM}/${A.sel==='ou'?'Opisina':''}</div>`+body,btns,{w:'50%'});
  if(A.dlg==='ou') d=nobj('Organizational Unit',field('ou-name','Name:',A.f?'Opisina':'')+check('','Protect container from accidental deletion',true),wbtn('ou-ok','OK',{def:true,dis:!A.f})+wbtn('','Cancel'));
  if(A.dlg==='group') d=nobj('Group',field('gp-name','Group name:',A.f?'Accounting':'')+field('','Group name (pre-Windows 2000):',A.f?'Accounting':'')+`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px"><div><b>Group scope</b>${radio('','Domain local',false)}${radio('','Global',true)}${radio('','Universal',false)}</div><div><b>Group type</b>${radio('','Security',true)}${radio('','Distribution',false)}</div></div>`,wbtn('gp-ok','OK',{def:true,dis:!A.f})+wbtn('','Cancel'));
  if(A.dlg==='user1') d=nobj('User',`<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 10px">${field('nu-name','First name:',A.f?A.u.first:'')}${field('','Last name:',A.f?A.u.last:'')}</div>`+field('','Full name:',A.f?A.u.first+' '+A.u.last:'')+`<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 10px">${field('','User logon name:',A.f?A.u.sam:'')}${field('','&nbsp;','@'+DOM)}</div>`+field('','User logon name (pre-Windows 2000):',A.f?NB+'\\'+A.u.sam:'',{dis:true}),
     wbtn('','&lt; Back',{dis:true})+wbtn('nu-next','Next &gt;',{def:true,dis:!A.f})+wbtn('','Cancel'));
  if(A.dlg==='user2') d=nobj('User',field('nu-pw','Password:',A.f2?'••••••••••••':'')+field('','Confirm password:',A.f2?'••••••••••••':'')+check('','User must change password at next logon',true)+check('','User cannot change password',false)+check('','Password never expires',false)+check('','Account is disabled',false),
     wbtn('','&lt; Back')+wbtn('nu-next','Next &gt;',{def:true,dis:!A.f2})+wbtn('','Cancel'));
  if(A.dlg==='user3') d=nobj('User',`When you click Finish, the following object will be created:<div style="border:1px solid #ADADAD;background:#fff;padding:6px;margin-top:6px;line-height:1.6">Full name: ${A.u.first} ${A.u.last}<br>User logon name: ${A.u.sam}@${DOM}<br>The user must change the password at next logon.</div>`,wbtn('','&lt; Back')+wbtn('nu-finish','Finish',{def:true})+wbtn('','Cancel'));
  if(A.dlg==='uprops'){ const u=ouObjs.find(o=>o.id===A.pick)||{}; const tb=[['','General'],['','Address'],['','Account'],['up-profile','Profile'],['','Telephones'],['','Organization'],['up-member','Member Of']];
    const tabName=A.tab==='member'?'Member Of':A.tab==='profile'?'Profile':'General';
    let c='';
    if(A.tab==='member') c='Member of:'+table(['Name','Active Directory Domain Services Folder'],[{c:['Domain Users',DOM+'/Users']}].concat((u.groups||[]).map(g=>({c:[g,DOM+'/Opisina']}))))+`<div style="margin-top:6px">${wbtn('up-add','Add…')} ${wbtn('','Remove')}</div>`;
    else if(A.tab==='profile') c='User profile'+field('','Profile path:','')+field('','Logon script:','')+'<div style="margin-top:8px"><b>Home folder</b></div>'+radio('','Local path:',false)+`<div data-t="pf-home" style="display:flex;gap:8px;align-items:center">${radio('','Connect:',!!u.home)}<span style="border:1px solid #9C9C9C;background:#fff;padding:0 6px">${u.home?'H:':'Z:'} ▾</span> To: <span style="flex:1;border:1px solid #9C9C9C;background:#fff;padding:0 6px;font-family:var(--mono);min-height:1.3em">${u.home?'\\\\SRV-01\\Home$\\%username%':''}</span></div>`;
    else c=field('','First name:',u.name?u.name.split(' ')[0]:'')+field('','Display name:',u.name||'')+field('','E-mail:','');
    d=dlg((u.name||'User')+' Properties',tabs(tb,tabName)+c,wbtn('up-ok','OK',{def:true})+wbtn('','Cancel')+wbtn('up-apply','Apply'),{w:'54%'}); }
  if(A.dlg2==='selgrp') d+=dlg('Select Groups','Select this object type:'+field('','','Groups or Built-in security principals',{dis:true})+'From this location:'+field('','',DOM,{dis:true})+'Enter the object names to select:'+
      `<div style="display:grid;grid-template-columns:1fr 100px;gap:8px">${field('sg-name','',A.sg?'<u>Accounting</u>':'',{})}<div style="padding-top:4px">${wbtn('sg-check','Check Names')}</div></div>`,wbtn('sg-ok','OK',{def:true})+wbtn('','Cancel'),{w:'50%',z:7,t:'56%'});
  return win('Active Directory Users and Computers',`<div style="display:grid;grid-template-columns:300px 1fr;height:100%;font-size:.76rem"><div style="border-right:1px solid #DDD;padding-top:4px">${tree}</div><div style="overflow:hidden">${right}</div></div>${ctx}${d}`,{l:'3%',t:'3%',w:'92%',h:'86%',menu:'File &nbsp; Action &nbsp; View &nbsp; Help'});
}

/* ---------- File Explorer, sharing and NTFS permissions ---------- */
function exp(s){ const E=s.ex||{};
  const items=E.folders?[['ex-shares','📁 Shares'],['ex-home','📁 Home']]:[];
  const inShares=E.path==='shares';
  const list=inShares?[['ex-acct','📁 Accounting']]:items;
  const nav=`<div style="width:170px;border-right:1px solid #EEE;padding:6px;font-size:.76rem;line-height:1.8">🏠 Home<br>🖥 This PC<br>&nbsp;&nbsp;💽 Local Disk (C:)<br>&nbsp;&nbsp;<b>💽 Data (D:)</b><br>🌐 Network</div>`;
  const tb=`<div style="display:flex;gap:10px;align-items:center;padding:.3rem .6rem;border-bottom:1px solid #EEE;font-size:.76rem">${t('ex-newfolder','＋ New ▾','padding:0 4px')}<span>✂</span><span>⧉</span><span>Sort ▾</span><span>View ▾</span><span style="flex:1"></span><span style="border:1px solid #DDD;border-radius:4px;padding:0 8px;min-width:260px">This PC › Data (D:)${inShares?' › Shares':''}</span></div>`;
  const body=`<div style="display:flex;flex-direction:column;height:100%">${tb}<div style="display:flex;flex:1">${nav}<div style="flex:1;padding:8px 12px;font-size:.78rem">${table(['Name','Date modified','Type'],list.map(([id,n])=>({id,c:[n,'11/14/2026 2:10 PM','File folder'],sel:E.sel===id})))}</div></div></div>`;
  return win(inShares?'Shares':'Data (D:)',body,{l:'4%',t:'4%',w:'84%',h:'82%'})+exDialogs(s);
}
function exDialogs(s){ const E=s.ex||{}; let d='';
  const who=E.target==='home'?'Home':'Accounting';
  if(E.dlg==='props'){ const tb=[['','General'],['pr-sharetab','Sharing'],['pr-sectab','Security'],['','Previous Versions'],['','Customize']];
    let c='';
    if(E.tab==='security') c=`Object name: ${E.target==='home'?'D:\\Home':'D:\\Shares\\Accounting'}<div style="margin-top:6px">Group or user names:</div><div style="border:1px solid #ADADAD;background:#fff;padding:2px 6px;line-height:1.5">${((E.target==='home'?E.ntfsHome:E.ntfs)||['CREATOR OWNER','SYSTEM','Administrators ('+NB+'\\Administrators)','Users ('+NB+'\\Users)']).map(x=>'👥 '+x).join('<br>')}</div><div style="margin-top:8px">For special permissions or advanced settings, click Advanced. ${wbtn('pr-secadv','Advanced')}</div>`;
    else c=`<b>Network File and Folder Sharing</b><div style="margin:4px 0 8px">${who}<br>${E.shared&&E.shared.includes(who)?'Shared<br>Network Path: \\\\SRV-01\\'+(who==='Home'?'Home$':who):'Not Shared'}</div>${wbtn('','Share…')}<div style="margin-top:12px"><b>Advanced Sharing</b><br>Set custom permissions, create multiple shares, and set other advanced sharing options.<br>${wbtn('pr-adv','Advanced Sharing…',{style:'margin-top:4px'})}</div>`;
    d+=dlg(who+' Properties',tabs(tb,E.tab==='security'?'Security':'Sharing')+c,wbtn('pr-ok','OK',{def:true})+wbtn('','Cancel')+wbtn('','Apply'),{w:'46%',l:'30%',t:'8%'}); }
  if(E.dlg2==='advshare') d+=dlg('Advanced Sharing',check('as-share','Share this folder',!!E.asOn)+'<b>Settings</b>'+field('','Share name:',E.asOn?(who==='Home'?'Home$':who):'',{dis:!E.asOn})+field('','Limit the number of simultaneous users to:','16777216',{dis:!E.asOn})+field('','Comments:',E.asOn?(who==='Home'?'Personal folders (hidden share)':'Accounting team files'):'',{dis:!E.asOn})+`<div style="margin-top:6px">${wbtn('as-perm','Permissions',{dis:!E.asOn})} ${wbtn('','Caching',{dis:!E.asOn})}</div>`,wbtn('as-ok','OK',{def:true})+wbtn('','Cancel')+wbtn('','Apply'),{w:'40%',l:'36%',t:'14%',z:6});
  if(E.dlg3==='shareperm') d+=dlg('Permissions for '+(who==='Home'?'Home$':who),'Group or user names:'+`<div style="border:1px solid #ADADAD;background:#fff;padding:2px 6px">${E.sp?'👥 Authenticated Users':'👥 Everyone'}</div>`+table(['Permissions for '+(E.sp?'Authenticated Users':'Everyone'),'Allow','Deny'],[['Full Control',E.sp&&who==='Home'],['Change',!!E.sp],['Read',true]].map(([n,a])=>({c:[n,a?'☑':'☐','☐']}))),wbtn('sp-ok','OK',{def:true})+wbtn('','Cancel')+wbtn('','Apply'),{w:'38%',l:'40%',t:'20%',z:7})
    .replace('<div style="border:1px solid #ADADAD;background:#fff;padding:2px 6px">',`<div data-t="sp-set" style="border:1px solid #ADADAD;background:#fff;padding:2px 6px">`);
  if(E.dlg2==='advsec'){ const tb=[['','Permissions'],['','Auditing'],['asx-eff','Effective Access']];
    let c='';
    if(E.atab==='eff') c=`For additional information, double-click a permission entry.<div style="display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:6px;align-items:end">${field('eff-user','User/ Group:',E.effUser?(E.effUser==='bcruz'?'Ben Cruz (bcruz@'+DOM+')':'Ana Reyes (areyes@'+DOM+')'):'',{})}<div>${wbtn('eff-view','View effective access')}</div></div>`+
      (E.effShown?table(['Effective access','Permission','Access limited by'],[['Full control',false],['Traverse folder / execute file',E.effUser==='areyes'],['List folder / read data',E.effUser==='areyes'],['Create files / write data',E.effUser==='areyes'],['Delete',E.effUser==='areyes'],['Change permissions',false],['Take ownership',false]].map(([n,a])=>({c:[a?'<b style="color:#2E7D32">✔</b>':'<b style="color:#C62828">✖</b>',n,a?'':'File Permissions']}))):'');
    else { const inh=E.inh===false?'None':'D:\\';
      const usersRows=E.users===false?[]:[['Allow','Users ('+NB+'\\Users)','Read & execute',inh,'This folder, subfolders and files'],['Allow','Users ('+NB+'\\Users)','Create folders / append data',inh,'This folder and subfolders'],['Allow','Users ('+NB+'\\Users)','Create files / write data',inh,'Subfolders only']];
      const base=[['Allow','SYSTEM','Full control',inh,'This folder, subfolders and files'],['Allow','Administrators ('+NB+'\\Administrators)','Full control',inh,'This folder, subfolders and files'],['Allow','CREATOR OWNER','Full control',inh,'Subfolders and files only']];
      const acc=E.acctAdded&&E.target!=='home'?[['Allow','Accounting ('+NB+'\\Accounting)','Modify','None','This folder, subfolders and files']]:E.homeAuth&&E.target==='home'?[['Allow','Authenticated Users','Traverse folder / List folder','None','This folder only']]:[];
      c=`Owner: Administrators (${NB}\\Administrators)<div style="margin-top:6px">Permission entries:</div>`+table(['Type','Principal','Access','Inherited from','Applies to'],base.concat(usersRows).concat(acc).map((r,i)=>({id:r[1].startsWith('Users')&&r[2]==='Read & execute'?'asx-users':(r[1].startsWith('Accounting')||r[1]==='Authenticated Users')?'asx-acct':'',c:r,sel:(r[1].startsWith('Users')&&E.selUsers)||((r[1].startsWith('Accounting')||r[1]==='Authenticated Users')&&acc.length)})),{fs:'.7rem'})+
        `<div style="margin-top:6px;display:flex;gap:6px">${wbtn('asx-add','Add')}${wbtn('asx-remove','Remove',{dis:!E.selUsers})}${wbtn('','View')}</div><div style="margin-top:8px">${wbtn('asx-disable',E.inh===false?'Enable inheritance':'Disable inheritance')}</div>`; }
    d+=dlg('Advanced Security Settings for '+who,tabs(tb,E.atab==='eff'?'Effective Access':'Permissions')+c,wbtn('asx-ok','OK',{def:true})+wbtn('','Cancel')+wbtn('','Apply'),{w:'66%',l:'17%',t:'6%',z:6});
    if(E.blockAsk) d+=dlg('Block Inheritance','What would you like to do with the current inherited permissions?<br><br>You are about to block inheritance to this object, which means that permissions inherited from a parent object will no longer be applied to this object.<div style="margin-top:8px">'+t('asx-convert','→ Convert inherited permissions into explicit permissions on this object.','display:block;padding:4px;color:#0067C0')+'<span style="display:block;padding:4px;color:#0067C0">→ Remove all inherited permissions from this object.</span></div>',wbtn('','Cancel'),{w:'52%',z:8}); }
  return d;
}

/* ---------- Settings: printers, and the Add Printer wizard ---------- */
function settings(s){ const S=s.prn||{};
  let body=`<div style="display:flex;height:100%"><div style="width:170px;background:#F3F3F3;padding:10px;font-size:.78rem;line-height:2">System<br><b style="background:#fff;padding:2px 6px;border-radius:4px">Bluetooth &amp; devices</b><br>Network &amp; internet<br>Apps<br>Accounts<br>Windows Update</div>
    <div style="padding:14px 18px;font-size:.82rem;flex:1"><div style="font-size:1.2rem;font-weight:600;margin-bottom:10px">Bluetooth &amp; devices › Printers &amp; scanners</div>
    <div style="display:flex;justify-content:space-between;align-items:center;border:1px solid #E5E5E5;border-radius:6px;padding:8px 10px;background:#FBFBFB">Add a printer or scanner ${abtn('pr-adddev','Add device')}</div>
    ${S.searching?`<div style="border:1px solid #E5E5E5;border-top:none;padding:8px 10px;background:#fff">Searching for printers… <span style="float:right">The printer that I want isn’t listed ${link('pr-manual','Add manually')}</span></div>`:''}
    <div style="margin-top:8px">${S.added?t('pr-prn01','<div style="border:1px solid #E5E5E5;border-radius:6px;padding:8px 10px;background:#fff">🖨 <b>PRN-01</b> · Shared · Office, near the door</div>','display:block'):''}<div style="border:1px solid #E5E5E5;border-radius:6px;padding:8px 10px;background:#fff;margin-top:4px">🖨 Microsoft Print to PDF</div></div></div></div>`;
  let w='';
  if(S.wiz){ const p=S.wiz; let c='', btn=wbtn('wz-next','Next',{def:true})+wbtn('','Cancel');
    if(p==='find') c='<b style="font-size:.95rem">Find a printer by other options</b><div style="margin-top:8px">'+radio('','My printer is a little older. Help me find it.',false)+radio('','Find a printer in the directory, based on location or feature',false)+radio('','Select a shared printer by name',false)+radio('apw-ip','Add a printer using an IP address or hostname',!!S.ipPick)+radio('','Add a Bluetooth, wireless or network discoverable printer',false)+radio('','Add a local printer or network printer with manual settings',false)+'</div>';
    if(p==='ip') c='<b style="font-size:.95rem">Type a printer hostname or IP address</b>'+field('','Device type:','Autodetect ▾',{inline:true,lw:'150px'})+field('apw-host','Hostname or IP address:',S.host?'192.168.1.20':'',{inline:true,lw:'150px',mono:true})+field('','Port name:',S.host?'192.168.1.20':'',{inline:true,lw:'150px',mono:true})+check('','Query the printer and automatically select the driver to use',true);
    if(p==='name') c='<b style="font-size:.95rem">Type a printer name</b>'+field('','Printer name:','PRN-01',{inline:true,lw:'110px'})+'This printer will be installed with the <b>Office Laser M400 PCL6 Class Driver</b> driver.';
    if(p==='share') c='<b style="font-size:.95rem">Printer Sharing</b><div style="margin:4px 0">If you want to share this printer, you must provide a share name. You can use the suggested name or type a new one. The share name will be visible to other network users.</div>'+radio('','Do not share this printer',false)+radio('apw-share','Share this printer so that others on your network can find and use it',true)+field('','Share name:','PRN-01',{inline:true,lw:'110px'})+field('','Location:',S.shareSet?'Office, near the door':'',{inline:true,lw:'110px'})+field('','Comment:',S.shareSet?'Mono laser, A4, duplex':'',{inline:true,lw:'110px'});
    if(p==='done'){ c='<b style="font-size:.95rem">You’ve successfully added PRN-01</b><div style="margin:8px 0">To check if your printer is working properly, or to see troubleshooting information for the printer, print a test page.</div>'+wbtn('apw-test','Print a test page')+(S.tested?'<div style="margin-top:6px;color:#2E7D32">✔ A test page has been sent to PRN-01.</div>':''); btn=wbtn('apw-finish','Finish',{def:true})+wbtn('','Cancel'); }
    w=dlg('Add Printer',c,btn,{w:'58%'}); }
  if(S.props) w=dlg('PRN-01 Properties',tabs([['','General'],['','Sharing'],['','Ports'],['','Advanced'],['','Security']],'Sharing')+'You can share this printer with other users on your network.'+check('','Share this printer',true)+field('','Share name:','PRN-01')+check('','Render print jobs on client computers',true)+check('prp-list','List in the directory',!!S.listed),wbtn('prp-ok','OK',{def:true})+wbtn('','Cancel')+wbtn('','Apply'),{w:'50%'});
  return win('Settings',body,{l:'6%',t:'5%',w:'86%',h:'82%'})+w;
}

/* ---------- dialogs over the desktop (rename, IP address, remote desktop) ---------- */
function dialogs(s){ const W=s.w, d=s.dlg; if(!d) return '';
  if(d==='sysprops'||d==='rename'||d==='restartmsg') { let x=dlg('System Properties',tabs([['','Computer Name'],['','Hardware'],['','Advanced'],['','Remote']],'Computer Name')+`Windows uses the following information to identify your computer on the network.<div style="margin:8px 0;line-height:1.7">Full computer name: ${W.renamed?'SRV-01':'WIN-7Q3K2L9F1MA'}<br>Workgroup: WORKGROUP</div>To rename this computer or change its domain or workgroup, click Change. ${wbtn('sp-change','Change…')}`,wbtn('','OK',{def:true})+wbtn('','Cancel')+wbtn('','Apply',{dis:true}),{w:'46%',l:'20%',t:'10%'});
    if(d==='rename') x+=dlg('Computer Name/Domain Changes','You can change the name and the membership of this computer. Changes might affect access to network resources.'+field('rn-name','Computer name:',W.nameTyped?'SRV-01':'WIN-7Q3K2L9F1MA')+'Full computer name: '+(W.nameTyped?'SRV-01':'WIN-7Q3K2L9F1MA')+'<div style="margin-top:8px"><b>Member of</b>'+radio('','Domain:',false)+radio('','Workgroup:',true)+field('','','WORKGROUP')+'</div>',wbtn('rn-ok','OK',{def:true})+wbtn('','Cancel'),{w:'40%',l:'38%',t:'16%',z:6});
    if(d==='restartmsg') x+=dlg('Microsoft Windows','You must restart your computer to apply these changes.<br><br>Before restarting, save any open files and close all programs.',wbtn('rs-now','Restart Now',{def:true})+wbtn('','Restart Later'),{w:'38%',z:7});
    return x; }
  if(d==='ncpa'||d==='ethprops'||d==='ipv4'){ let x=win('Network Connections',`<div style="padding:12px;font-size:.78rem">${t('nc-eth','<div style="display:inline-block;padding:8px;border:1px solid #CCE4F7;background:#E5F3FF;border-radius:2px">🖧 <b>Ethernet</b><br>'+(W.ip?'Network':'Unidentified network')+'<br>Intel(R) Ethernet Controller I210</div>','display:inline-block')}</div>`,{l:'10%',t:'8%',w:'60%',h:'50%'});
    if(d==='ethprops'||d==='ipv4') x+=dlg('Ethernet Properties','Connect using: Intel(R) Ethernet Controller I210<div style="margin-top:6px">This connection uses the following items:</div><div style="border:1px solid #ADADAD;background:#fff;padding:2px 6px;line-height:1.55">'+['Client for Microsoft Networks','File and Printer Sharing for Microsoft Networks','QoS Packet Scheduler','Internet Protocol Version 4 (TCP/IPv4)','Microsoft LLDP Protocol Driver','Internet Protocol Version 6 (TCP/IPv6)','Link-Layer Topology Discovery Responder'].map(n=>n.includes('IPv4')?t('ep-ipv4','☑ '+n,'display:block;background:#CCE8FF'):'☑ '+n+'<br>').join('')+'</div><div style="margin-top:6px">'+wbtn('','Install…')+' '+wbtn('','Uninstall')+' '+wbtn('','Properties')+'</div>',wbtn('','OK',{def:true})+wbtn('','Cancel'),{w:'42%',l:'22%',t:'8%',z:6});
    if(d==='ipv4') x+=dlg('Internet Protocol Version 4 (TCP/IPv4) Properties',tabs([['','General']],'General')+radio('','Obtain an IP address automatically',!W.ipTyped)+radio('ip-static','Use the following IP address:',!!W.ipTyped)+field('','IP address:',W.ipTyped?'192.168.1.11':'',{inline:true,lw:'150px',mono:true})+field('','Subnet mask:',W.ipTyped?'255.255.255.0':'',{inline:true,lw:'150px',mono:true})+field('','Default gateway:',W.ipTyped?'192.168.1.1':'',{inline:true,lw:'150px',mono:true})+
      radio('','Obtain DNS server address automatically',!W.dnsTyped)+radio('ip-dns','Use the following DNS server addresses:',!!W.dnsTyped)+field('','Preferred DNS server:',W.dnsTyped?'192.168.1.1':'',{inline:true,lw:'150px',mono:true})+field('','Alternate DNS server:','',{inline:true,lw:'150px',mono:true})+check('','Validate settings upon exit',false),wbtn('ip-ok','OK',{def:true})+wbtn('','Cancel'),{w:'44%',l:'48%',t:'4%',z:7});
    return x; }
  if(d==='rdp') return dlg('System Properties',tabs([['','Computer Name'],['','Hardware'],['','Advanced'],['','Remote']],'Remote')+'<b>Remote Desktop</b><div style="margin:4px 0">Choose an option, and then specify who can connect.</div>'+radio('','Don’t allow remote connections to this computer',!W.rdp)+radio('rdp-allow','Allow remote connections to this computer',!!W.rdp)+check('','Allow connections only from computers running Remote Desktop with Network Level Authentication (recommended)',true,{m:'.2rem 0 .2rem 1.4rem'})+`<div style="margin-top:6px">${wbtn('','Select Users…')}</div>`,wbtn('rdp-ok','OK',{def:true})+wbtn('','Cancel')+wbtn('','Apply'),{w:'46%'});
  return '';
}
return {screen,DOM,NB};
})();
