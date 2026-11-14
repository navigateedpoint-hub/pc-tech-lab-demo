/* Server Setup guided demo: Windows Server 2025 and Ubuntu Server 26.04 LTS.
   Chapters follow the competency Set-up Computer Servers: user access, network services, then testing, documentation and pre-deployment. */
(function(){
const init=tr=>()=>({track:tr,cab:{},on:false,ups:false,mon:'off',app:null,dlg:null,menu:null,smp:'dash',flag:null,w:{},ps:[],arw:{},dc:{},pi:{},dhcp:{},ns:{},dns:{},ad:{objs:[]},ex:{},prn:{},ev:{},
  lap:{},router:{},con:[],ssh:[],sshOn:false,host:'ubuntu',nano:null,reportSaved:false,
  pc:{dev:'PC-01',mon:'desk',app:null,lines:[],user:'staff'}});
const set=(k,o)=>s=>{ s[k]=Object.assign({},s[k],o); };
const put=o=>s=>{ Object.assign(s,o); };
const all=(...f)=>s=>f.forEach(x=>x(s));
const PSP='PS C:\\Users\\Administrator> ';
const ps=(cmd,out)=>s=>{ s.ps=s.ps.concat([[PSP,cmd,out]]); };
const pcRun=(cmd,out)=>s=>{ s.pc=Object.assign({},s.pc,{lines:s.pc.lines.concat([[`C:\\Users\\${s.pc.user}>`,cmd,out]])}); };
const pcSet=o=>s=>{ s.pc=Object.assign({},s.pc,o); };
const pingOut=(ip,name,ms,ttl)=>`\nPinging ${name?name+' ['+ip+']':ip} with 32 bytes of data:\n`+[0,1,2,3].map(i=>`Reply from ${ip}: bytes=32 time${ms==='<1'?'<1':'='+(ms+i%2)}ms TTL=${ttl}`).join('\n')+`\n\nPing statistics for ${ip}:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`;
const lpingOut=(ip,name,ms)=>`PING ${name||ip} (${ip}) 56(84) bytes of data.\n`+[1,2,3].map(i=>`64 bytes from ${name?name+' ('+ip+')':ip}: icmp_seq=${i} ttl=${name?117:64} time=${ms}${i%2?'.31':'.18'} ms`).join('\n')+`\n\n--- ${name||ip} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2003ms`;

function make(tr){
  const b=[]; const add=(ch,t,say,o={})=>b.push(Object.assign({ch,t,say},o));
  const W=tr==='W';
  const DOM=W?'ad.opisina.ph':'lan.opisina.ph';

  /* Ubuntu helpers */
  let remote=false;
  /* commands typed on the console until SSH is set up, then in the laptop's SSH window (r is fixed when the step is written) */
  const run=(r,cmd,out)=>s=>{ if(r) s.ssh=s.ssh.concat([[UbSrv.prompt(s),cmd,out]]); else s.con=s.con.concat([[UbSrv.prompt(s),cmd,out]]); };
  const C=(ch,t,say,cmd,out,o={})=>{ const r=remote; add(ch,t,say,Object.assign({scene:r?'lap':'srv',where:r?'lap':'srv',cmd,target:'term-line',label:cmd.length>34?cmd.slice(0,32)+'… ↵':cmd+' ↵',
    act:o.after?all(run(r,cmd,out),o.after):run(r,cmd,out)},o.x||{})); };
  const edit=(ch,file,before,after,addIdx,o)=>{ const r=remote;
    const open=s=>{ s.nano={file,lines:before,add:[],modified:false,msg:o.newFile?'[ New File ]':null}; if(r) s.lap=Object.assign({},s.lap,{nano:true}); else s.mon='nano'; };
    add(ch,o.t1||'Open the file',o.say1,{scene:r?'lap':'srv',where:r?'lap':'srv',cmd:'sudo nano '+file,target:'term-line',label:'sudo nano … ↵',act:all(run(r,'sudo nano '+file,''),open)});
    add(ch,o.t2||'Type the settings',o.say2,{scene:r?'lap':'srv',target:'nano-body',label:o.label2||'Type the highlighted lines',act:s=>{ s.nano=Object.assign({},s.nano,{lines:after,add:addIdx,modified:true,msg:null}); },ok:o.ok2,tip:o.tip2});
    add(ch,'Save',`Press <b>Ctrl+O</b>, then Enter.`,{scene:r?'lap':'srv',target:'nano-save',label:'^O Write Out',act:s=>{ s.nano=Object.assign({},s.nano,{modified:false,msg:`[ Wrote ${after.length} lines ]`}); }});
    add(ch,'Exit','Press <b>Ctrl+X</b> to leave nano.',{scene:r?'lap':'srv',target:'nano-exit',label:'^X Exit',act:s=>{ s.nano=null; if(r) s.lap=Object.assign({},s.lap,{nano:false}); else s.mon='tty'; }});
  };
  /* ================= 1. Get the server ready (shared) ================= */
  add('ready','What the server will do','The office from Station 4 gets its first server, SRV-01. Read the job sheet: each job is one chapter.',{scene:'doc',doc:'job'});
  add('ready','Check what you need','Open each item to see what it does and what it looks like.',{scene:'intro',explore:true,items:[['server','Tower server (SRV-01)'],['ups','UPS'],['switch','Office switch'],['monitor','Console monitor'],['laptop','Technician’s laptop'],['pc','Office PC (PC-01)'],['printer','Network printer']]});
  add('ready','The address and naming plan','Decide every address and name before touching the server. The server always gets a fixed address.',{scene:'doc',doc:'plan'});
  add('ready','Power cord into the server','Go behind the server. Plug the power cord into the server’s power inlet.',{scene:'back',target:'zone:SRV_PWR',label:'Power inlet',act:set('cab',{pwrSrv:true}),photo:'server'});
  add('ready','Into a battery outlet','Plug the other end into a <b>BATTERY</b> outlet of the UPS, not a surge-only outlet.',{scene:'back',target:'zone:UPS_OUT1',label:'Battery outlet',act:set('cab',{pwr:true}),
    ok:'A short power cut no longer switches the server off.',tip:'Never plug a laser printer into a UPS battery outlet: its heater draws more power than the battery can give.',photo:'ups'});
  add('ready','Network cable into LAN 1','Plug a patch cable into <b>LAN 1</b> on the back of the server.',{scene:'back',target:'zone:SRV_LAN1',label:'LAN 1',act:set('cab',{lanSrv:true}),
    tip:'The blue MGMT port is for the remote management controller, not for office traffic.'});
  add('ready','Into switch port 6','Plug the other end into the next free port of the office switch: port 6.',{scene:'back',target:'zone:SW_P6',label:'Port 6',act:set('cab',{lan:true}),ok:'Ports 1 to 5 were used in Station 4.'});
  add('ready','Switch on the UPS','Press and hold the UPS power button.',{scene:'room',target:'zone:UPS_BTN',label:'UPS power',act:put({ups:true}),ok:'The display shows ONLINE: running on mains, battery charging.'});
  add('ready','Power on the server','Press the server’s power button.',{scene:'room',target:'zone:SRV_BTN',label:'Server power',act:put({on:true,mon:W?'lock':'login'}),
    ok:W?'The server checks its hardware, then Windows Server starts. This takes longer than a PC.':'The server checks its hardware, then Ubuntu Server starts. There is no desktop: the console is text only.'});
  if(W){
    add('ready','Press Ctrl+Alt+Delete','Windows Server always asks for Ctrl+Alt+Delete before signing in.',{scene:'srv',target:'key-cad',label:'Ctrl + Alt + Del',act:put({mon:'pw'})});
    add('ready','Sign in','Type the Administrator password set during installation.',{scene:'srv',target:'pw-field',label:'Password',act:s=>{ s.w=Object.assign({},s.w,{pwTyped:true}); s.mon='desk'; s.app='sm'; s.smp='dash'; },
      ok:'Server Manager opens by itself at every sign-in.',tip:'The Administrator password should be long and kept in the office’s password record, never on a note on the monitor.'});
    add('ready','Server Manager','Server Manager is where roles are added and the server’s health is checked. Local Server, Manage and Tools are used in every chapter.',{scene:'srv'});
  } else {
    add('ready','Type the user name','The installer created the admin account <b>sysadmin</b>. Type it at the login prompt.',{scene:'srv',target:'ub-user',label:'sysadmin',act:put({login:1})});
    add('ready','Type the password','The password is not shown while you type, not even as dots.',{scene:'srv',target:'ub-pw',label:'Password ↵',act:s=>{ s.login=2; s.mon='tty';
      s.con=[['','','Welcome to Ubuntu 26.04 LTS (GNU/Linux x86_64)\n\n  System load:  0.08              Processes:             142\n  Usage of /:   3.1% of 438.9GB   Users logged in:       0\n  Memory usage: 4%                IPv4 address for eno1: 192.168.1.37\n']]; },
      ok:'You are at the command prompt. Everything on this server is done by typing commands.'});
  }

  if(W){
    /* ================= 2. Name, address and update ================= */
    add('basics','Open Local Server','Local Server shows this server’s settings. Each blue value is a link.',{scene:'srv',target:'sm-nav-local',label:'Local Server',act:put({smp:'local',menu:null})});
    add('basics','Click the computer name','Setup gave the server a random name. Click it.',{scene:'srv',target:'lp-name',label:'Computer name',act:put({dlg:'sysprops'})});
    add('basics','Change…','Click Change.',{scene:'srv',target:'sp-change',label:'Change…',act:put({dlg:'rename'})});
    add('basics','Type SRV-01','Type <b>SRV-01</b>, the name in the plan.',{scene:'srv',target:'rn-name',label:'Computer name',act:set('w',{nameTyped:true}),ok:'Rename before installing roles: renaming a domain controller later is much harder.'});
    add('basics','OK','Click OK.',{scene:'srv',target:'rn-ok',label:'OK',act:put({dlg:'restartmsg'})});
    add('basics','Restart now','The new name needs a restart.',{scene:'srv',target:'rs-now',label:'Restart Now',act:s=>{ s.w=Object.assign({},s.w,{renamed:true}); s.dlg=null; s.app='sm'; s.smp='local'; },ok:'After the restart and sign-in, Local Server shows SRV-01.'});
    add('basics','The network adapter','The Ethernet line says the address came from DHCP. Click it.',{scene:'srv',target:'lp-eth',label:'Ethernet',act:put({dlg:'ncpa'})});
    add('basics','Open Ethernet','Double-click Ethernet, then click Properties.',{scene:'srv',target:'nc-eth',label:'Ethernet',act:put({dlg:'ethprops'})});
    add('basics','IPv4 properties','Double-click Internet Protocol Version 4 (TCP/IPv4).',{scene:'srv',target:'ep-ipv4',label:'TCP/IPv4',act:put({dlg:'ipv4'})});
    add('basics','A fixed address','Choose <b>Use the following IP address</b> and type 192.168.1.11, mask 255.255.255.0, gateway 192.168.1.1.',{scene:'srv',target:'ip-static',label:'Use the following IP address',act:set('w',{ipTyped:true}),
      ok:'A server must never change address: PCs, printers and DNS records point to it.'});
    add('basics','DNS server for now','For now use the router, <b>192.168.1.1</b>, as preferred DNS so Windows Update works.',{scene:'srv',target:'ip-dns',label:'Use the following DNS',act:set('w',{dnsTyped:true}),
      ok:'When the server becomes a domain controller in chapter 3, setup changes this to the server itself.'});
    add('basics','OK','Click OK, then close the other windows.',{scene:'srv',target:'ip-ok',label:'OK',act:s=>{ s.dlg=null; s.w=Object.assign({},s.w,{ip:true}); }});
    add('basics','Remote Desktop','Remote Desktop is Disabled. Click it.',{scene:'srv',target:'lp-rdp',label:'Remote Desktop',act:put({dlg:'rdp'})});
    add('basics','Allow remote connections','Choose <b>Allow remote connections to this computer</b>. Keep Network Level Authentication ticked.',{scene:'srv',target:'rdp-allow',label:'Allow remote connections',act:set('w',{rdp:true}),
      ok:'Only administrators can connect, and they must give the password before a session opens.'});
    add('basics','OK','Click OK.',{scene:'srv',target:'rdp-ok',label:'OK',act:put({dlg:null})});
    add('basics','Check the time zone','<b>(UTC+08:00) Kuala Lumpur, Singapore</b> is the Windows time zone used for the Philippines.',{scene:'srv',target:'lp-tz',label:'Time zone',act:s=>{},
      ok:'Correct. The time zone only changes how the time is shown; what matters for domain sign-in is the clock itself (see chapter 3).'});
    add('basics','Windows Update','Click the Windows Update value.',{scene:'srv',target:'lp-wu',label:'Windows Update',act:put({app:'wu'})});
    add('basics','Check for updates','A new server is already behind on security fixes.',{scene:'srv',target:'wu-check',label:'Check for updates',act:set('w',{upd:'found'})});
    add('basics','Install the updates','Download and install all, then restart when asked.',{scene:'srv',target:'wu-install',label:'Download & install all',act:set('w',{upd:'done'}),ok:'The required updates and drivers are installed: the server is up to date.'});
    add('basics','Open the event log','Back in Server Manager, open <b>Tools</b>.',{scene:'srv',target:'tb-sm',label:'Server Manager',act:put({app:'sm',menu:'tools'})});
    add('basics','Event Viewer','Choose Event Viewer.',{scene:'srv',target:'tl-ev',label:'Event Viewer',act:put({app:'ev',menu:null,ev:{}})});
    add('basics','The System log','Select Windows Logs › System.',{scene:'srv',target:'ev-system',label:'System',act:set('ev',{sel:true})});
    add('basics','Show only errors','Filter the log for Critical and Error events since start-up.',{scene:'srv',target:'ev-filter',label:'Filter Current Log…',act:set('ev',{filter:true}),
      ok:'No errors in the boot sequence: the hardware and drivers started normally.'});
    add('basics','Open PowerShell','Now test the network connection.',{scene:'srv',target:'tb-ps',label:'PowerShell',act:put({app:'ps'})});
    add('basics','Ping the router','Type <b>ping 192.168.1.1</b>.',{scene:'srv',cmd:'ping 192.168.1.1',target:'term-line',label:'ping 192.168.1.1 ↵',act:ps('ping 192.168.1.1',pingOut('192.168.1.1','','<1',64))});
    add('basics','Ping the internet','Type <b>ping google.com</b>.',{scene:'srv',cmd:'ping google.com',target:'term-line',label:'ping google.com ↵',act:ps('ping google.com',pingOut('142.250.66.206','google.com',9,117)),
      ok:'Local and internet connections work: the server is functioning normally.'});

    /* ================= 3. Active Directory and DNS ================= */
    add('adds','Manage','In Server Manager, open <b>Manage</b>.',{scene:'srv',target:'tb-sm',label:'Server Manager',act:put({app:'sm',menu:'manage',smp:'dash'})});
    add('adds','Add Roles and Features','Choose Add Roles and Features.',{scene:'srv',target:'mg-add',label:'Add Roles and Features',act:put({app:'arw',menu:null,arw:{page:'before',role:'adds'}})});
    add('adds','Before You Begin','The checklist is done: strong password, fixed address, updates. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('arw',{page:'type'})});
    add('adds','Installation type','Keep <b>Role-based or feature-based installation</b>. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('arw',{page:'server'})});
    add('adds','Server selection','SRV-01, 192.168.1.11, is selected. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('arw',{page:'roles'})});
    add('adds','Active Directory Domain Services','Tick <b>Active Directory Domain Services</b>.',{scene:'srv',target:'role-adds',label:'Active Directory Domain Services',act:set('arw',{popup:'adds'})});
    add('adds','Add the tools','The wizard offers the management tools that go with the role. Click Add Features.',{scene:'srv',target:'pf-add',label:'Add Features',act:set('arw',{popup:null,adds:true})});
    add('adds','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('arw',{page:'features'})});
    add('adds','Features','The required features are already selected. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('arw',{page:'info'})});
    add('adds','Things to note','Read the notes: an office should have a second domain controller later, and AD DS needs DNS. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('arw',{page:'confirm'})});
    add('adds','Install','Check the list and click Install.',{scene:'srv',target:'wz-install',label:'Install',act:s=>{ s.arw=Object.assign({},s.arw,{page:'results'}); s.w=Object.assign({},s.w,{addsInst:true}); s.flag='adds'; },
      ok:'The role is installed, but the server is not a domain controller yet.'});
    add('adds','Promote the server','Click <b>Promote this server to a domain controller</b>.',{scene:'srv',target:'rs-promote',label:'Promote this server',act:put({app:'dcp',dc:{page:'deploy'}})});
    add('adds','A new forest','This is the office’s first domain: choose <b>Add a new forest</b>.',{scene:'srv',target:'dc-newforest',label:'Add a new forest',act:set('dc',{forest:true})});
    add('adds','Root domain name','Type <b>ad.opisina.ph</b>.',{scene:'srv',target:'dc-root',label:'Root domain name',act:set('dc',{root:true}),
      ok:'A subdomain of a name the office owns: it will never clash with a real internet name.',tip:'Avoid names ending in .local: they clash with the discovery system printers and phones use.'});
    add('adds','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('dc',{page:'options'})});
    add('adds','Domain controller options','The functional level is Windows Server 2025, and DNS server and Global Catalog are ticked. Type a DSRM password.',{scene:'srv',target:'dc-dsrm',label:'DSRM password',act:set('dc',{dsrm:true}),
      ok:'DSRM is the recovery password of this domain controller.',tip:'Write the DSRM password in the sealed documentation. It is not the Administrator password.'});
    add('adds','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('dc',{page:'dnsopt'})});
    add('adds','DNS Options','The yellow note about delegation is normal for a new forest with a private name. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('dc',{page:'additional'})});
    add('adds','NetBIOS name','The wizard suggests <b>AD</b>, the first part of the domain name. Change it to <b>OPISINA</b>.',{scene:'srv',target:'dc-netbios',label:'NetBIOS name',act:set('dc',{nb:true}),ok:'Staff will sign in as OPISINA\\username.'});
    add('adds','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('dc',{page:'paths'})});
    add('adds','Paths','Keep the default folders for the database, logs and SYSVOL. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('dc',{page:'review'})});
    add('adds','Review','Check the summary. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('dc',{page:'prereq'})});
    add('adds','Prerequisites check','All checks passed. Click Install.',{scene:'srv',target:'dc-install',label:'Install',act:s=>{ s.mon='lock2'; s.app='sm'; s.smp='dash'; s.flag=null; s.w=Object.assign({},s.w,{dc:true,pwTyped:false}); },
      ok:'The server installs Active Directory and DNS, then restarts by itself.'});
    add('adds','Press Ctrl+Alt+Delete','After the restart the sign-in screen offers the domain.',{scene:'srv',target:'key-cad',label:'Ctrl + Alt + Del',act:put({mon:'pw'})});
    add('adds','Sign in to the domain','Sign in as <b>OPISINA\\Administrator</b> with the same password.',{scene:'srv',target:'pw-field',label:'Password',act:s=>{ s.w=Object.assign({},s.w,{pwTyped:true}); s.mon='desk'; s.app='sm'; s.smp='dash'; },
      ok:'The local Administrator became the domain administrator.'});
    add('adds','A time source for the domain','Domain sign-in (Kerberos) fails when a PC’s clock is more than 5 minutes off the server’s. The first domain controller keeps time for everyone, so point it at internet time. Open PowerShell.',{scene:'srv',target:'tb-ps',label:'PowerShell',act:put({app:'ps'})});
    add('adds','Set the time source','Type the w32tm command.',{scene:'srv',cmd:'w32tm /config /manualpeerlist:"pool.ntp.org" /syncfromflags:manual /reliable:yes /update',target:'term-line',label:'w32tm /config … ↵',
      act:ps('w32tm /config /manualpeerlist:"pool.ntp.org" /syncfromflags:manual /reliable:yes /update','The command completed successfully.'),ok:'Domain PCs take their time from SRV-01, and SRV-01 takes it from the internet.'});
    add('adds','New roles on the dashboard','Back in Server Manager, the dashboard now shows AD DS and DNS. DNS was installed with AD DS because PCs find the domain controller through DNS.',{scene:'srv',target:'tb-sm',label:'Server Manager',act:put({app:'sm',smp:'dash'}),ok:'Both roles are green: running and healthy.'});

    /* ================= 4. DNS ================= */
    add('dns','Tools','Open <b>Tools</b>.',{scene:'srv',target:'sm-tools',label:'Tools',act:put({menu:'tools'})});
    add('dns','DNS Manager','Choose DNS.',{scene:'srv',target:'tl-dns',label:'DNS',act:put({app:'dns',menu:null,dns:{}})});
    add('dns','The office zone','Open Forward Lookup Zones › <b>ad.opisina.ph</b>.',{scene:'srv',target:'dz-zone',label:'ad.opisina.ph',act:set('dns',{sel:'zone'}),
      ok:'SRV-01 already has a host (A) record. The _msdcs, _sites, _tcp and _udp folders hold the records PCs use to find the domain controller.'});
    add('dns','New Host','Right-click the zone and choose <b>New Host (A or AAAA)…</b>',{scene:'srv',target:'dz-zone',label:'Right-click › New Host',act:set('dns',{dlg:'host'})});
    add('dns','The printer’s record','Type the name <b>PRN-01</b> and the address <b>192.168.1.20</b>.',{scene:'srv',target:'dh-name',label:'Name',act:set('dns',{form:['PRN-01','192.168.1.20']}),
      ok:'Leave the PTR box clear: this office has no reverse lookup zone.'});
    add('dns','Add Host','Click Add Host.',{scene:'srv',target:'dh-add',label:'Add Host',act:s=>{ s.dns=Object.assign({},s.dns,{recs:(s.dns.recs||[]).concat([['PRN-01','192.168.1.20']]),dlg:'hostok',form:null}); }});
    add('dns','Created','The record was created. Click OK.',{scene:'srv',target:'dh-ok',label:'OK',act:set('dns',{dlg:'host',added:true})});
    add('dns','The NAS too','Type <b>NAS-01</b> and <b>192.168.1.10</b>.',{scene:'srv',target:'dh-name',label:'Name',act:set('dns',{form:['NAS-01','192.168.1.10']})});
    add('dns','Add Host','Click Add Host, then OK.',{scene:'srv',target:'dh-add',label:'Add Host',act:s=>{ s.dns=Object.assign({},s.dns,{recs:s.dns.recs.concat([['NAS-01','192.168.1.10']]),dlg:'host',form:null}); }});
    add('dns','Done','Close the dialog.',{scene:'srv',target:'dh-done',label:'Done',act:set('dns',{dlg:null})});
    add('dns','Server properties','For names outside the office, such as google.com, the server needs forwarders. Right-click <b>SRV-01</b> › Properties.',{scene:'srv',target:'dz-server',label:'SRV-01 › Properties',act:set('dns',{dlg:'props',ptab:'if'})});
    add('dns','Forwarders tab','Open the Forwarders tab.',{scene:'srv',target:'dp-fwtab',label:'Forwarders',act:set('dns',{ptab:'fw'})});
    add('dns','Add forwarders','Setup copied the router, 192.168.1.1, from the adapter. Click Edit, remove it, and add <b>1.1.1.1</b> and <b>8.8.8.8</b>.',{scene:'srv',target:'dp-edit',label:'Edit…',act:set('dns',{fw:true}),ok:'Names this server does not know are passed to these public DNS servers.'});
    add('dns','OK','Click OK.',{scene:'srv',target:'dp-ok',label:'OK',act:set('dns',{dlg:null})});

    /* ================= 5. DHCP ================= */
    add('dhcp','Add Roles and Features','The router still hands out addresses. First prepare the server’s DHCP; the router is switched off only at the end. Open Manage › Add Roles and Features.',{scene:'srv',target:'tb-sm',label:'Server Manager',act:put({app:'sm',menu:'manage'})});
    add('dhcp','Add Roles and Features','Choose Add Roles and Features.',{scene:'srv',target:'mg-add',label:'Add Roles and Features',act:put({app:'arw',menu:null,arw:{page:'before',role:'dhcp'}})});
    add('dhcp','Go to Server Roles','Installation type and server stay the same. Click Next three times.',{scene:'srv',target:'wz-next',label:'Next ×3',act:set('arw',{page:'roles'})});
    add('dhcp','DHCP Server','Tick <b>DHCP Server</b>.',{scene:'srv',target:'role-dhcp',label:'DHCP Server',act:set('arw',{popup:'dhcp'})});
    add('dhcp','Add the tools','Click Add Features.',{scene:'srv',target:'pf-add',label:'Add Features',act:set('arw',{popup:null,dhcp:true})});
    add('dhcp','Next to Confirmation','Click Next until Confirmation. The DHCP page reminds you to plan the scope first: the plan is ready.',{scene:'srv',target:'wz-next',label:'Next ×3',act:set('arw',{page:'confirm'})});
    add('dhcp','Install','Click Install.',{scene:'srv',target:'wz-install',label:'Install',act:s=>{ s.arw=Object.assign({},s.arw,{page:'results'}); s.w=Object.assign({},s.w,{dhcpInst:true}); s.flag='dhcp'; }});
    add('dhcp','Complete DHCP configuration','Click <b>Complete DHCP configuration</b>.',{scene:'srv',target:'rs-dhcpcfg',label:'Complete DHCP configuration',act:put({app:'dhcppi',pi:{page:'desc'}})});
    add('dhcp','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('pi',{page:'auth'})});
    add('dhcp','Authorize the server','Use the domain administrator’s credentials. Click Commit.',{scene:'srv',target:'pi-commit',label:'Commit',act:set('pi',{page:'summary'}),
      ok:'Authorized: in a domain, a Windows DHCP server only hands out addresses after Active Directory approves it. This stops other Windows DHCP servers working without approval; it does not stop routers or other devices.'});
    add('dhcp','Close','Click Close.',{scene:'srv',target:'pi-close',label:'Close',act:put({app:'sm',flag:null})});
    add('dhcp','Open DHCP','Open Tools › DHCP.',{scene:'srv',target:'tb-dhcp',label:'DHCP',act:put({app:'dhcp',dhcp:{}})});
    add('dhcp','New Scope','Right-click <b>IPv4</b>.',{scene:'srv',target:'dh-ipv4',label:'IPv4',act:set('dhcp',{sel:'ipv4',ctx:true})});
    add('dhcp','New Scope…','Choose New Scope…',{scene:'srv',target:'dh-newscope',label:'New Scope…',act:s=>{ s.dhcp=Object.assign({},s.dhcp,{ctx:false,wiz:true}); s.ns={page:'welcome'}; }});
    add('dhcp','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('ns',{page:'name'})});
    add('dhcp','Scope name','Type <b>Office LAN</b>.',{scene:'srv',target:'ns-name',label:'Name',act:set('ns',{name:true})});
    add('dhcp','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('ns',{page:'range'})});
    add('dhcp','Address range','Start <b>192.168.1.100</b>, end <b>192.168.1.199</b>, length 24.',{scene:'srv',target:'ns-range',label:'Start IP address',act:set('ns',{range:true}),
      ok:'The fixed addresses (.1, .10, .11, .20) are outside this range, so no exclusions are needed.'});
    add('dhcp','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('ns',{page:'excl'})});
    add('dhcp','Exclusions','No exclusions. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('ns',{page:'lease'})});
    add('dhcp','Lease duration','Keep 8 days: right for desk PCs. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('ns',{page:'opts'}),tip:'Use a shorter lease, such as 1 day, for guest Wi-Fi where many devices come and go.'});
    add('dhcp','Configure options now','Keep “Yes, I want to configure these options now”. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('ns',{page:'router'})});
    add('dhcp','Default gateway','Type the router, <b>192.168.1.1</b>, and click Add.',{scene:'srv',target:'ns-router',label:'IP address',act:set('ns',{router:true})});
    add('dhcp','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('ns',{page:'dns'})});
    add('dhcp','Domain and DNS','Already filled in: parent domain ad.opisina.ph and DNS server 192.168.1.11 (SRV-01). Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('ns',{page:'wins'}),
      ok:'PCs must use SRV-01 as their DNS server, or they will not find the domain.'});
    add('dhcp','WINS','No WINS server. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('ns',{page:'activate'})});
    add('dhcp','Activate later','Choose <b>No, I will activate this scope later</b>: the router still hands out addresses, and two DHCP servers on one network give PCs conflicting settings.',{scene:'srv',target:'ns-actlater',label:'Activate later',act:set('ns',{later:true})});
    add('dhcp','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('ns',{page:'finish'})});
    add('dhcp','Finish','Click Finish.',{scene:'srv',target:'ns-finish',label:'Finish',act:s=>{ s.dhcp=Object.assign({},s.dhcp,{wiz:false,scope:true,active:false,sel:'scope'}); },
      ok:'The scope is ready but marked Inactive.'});
    add('dhcp','Now the router','Switch off the router’s DHCP. Use the laptop’s browser.',{scene:'lap',target:'app-browser',label:'Browser',act:set('lap',{app:'browser'})});
    add('dhcp','Log in to the router','The browser is at 192.168.1.1. Log in with the admin password from Station 4.',{scene:'lap',target:'r-login',label:'Log in',act:set('lap',{logged:true})});
    add('dhcp','Disable the router’s DHCP','Under LAN / DHCP, set DHCP server to <b>Disable</b>.',{scene:'lap',target:'r-dhcp',label:'Disable',act:set('router',{dhcp:false})});
    add('dhcp','Save','Click Save.',{scene:'lap',target:'r-save',label:'Save',act:set('router',{saved:true}),ok:'Do the next step right away: until the scope is active, a PC that restarts gets no address.'});
    add('dhcp','Activate the scope','On the server, right-click the scope.',{scene:'srv',target:'dh-scope',label:'Scope › right-click',act:set('dhcp',{ctx2:true})});
    add('dhcp','Activate','Choose Activate.',{scene:'srv',target:'dh-activate',label:'Activate',act:set('dhcp',{ctx2:false,active:true,sel:'pool'}),
      ok:'SRV-01 now hands out 192.168.1.100 to .199. The gap with no DHCP server was only a few seconds.'});

    /* ================= 6. Users and groups ================= */
    add('users','Active Directory Users and Computers','Click AD Users on the taskbar.',{scene:'srv',target:'tb-aduc',label:'AD Users',act:put({app:'aduc'})});
    add('users','Right-click the domain','Right-click <b>ad.opisina.ph</b> and point to New.',{scene:'srv',target:'au-domain',label:'ad.opisina.ph',act:set('ad',{sel:'domain',ctx:'new'})});
    add('users','Organizational Unit','Choose Organizational Unit.',{scene:'srv',target:'au-new-ou',label:'Organizational Unit',act:set('ad',{ctx:null,dlg:'ou'})});
    add('users','Name it','Type <b>Opisina</b>. Keep “Protect container from accidental deletion” ticked.',{scene:'srv',target:'ou-name',label:'Name',act:set('ad',{f:true}),ok:'The office’s users and groups go in this OU, apart from the built-in accounts.'});
    add('users','OK','Click OK.',{scene:'srv',target:'ou-ok',label:'OK',act:set('ad',{dlg:null,f:false,ou:true,sel:'ou'})});
    add('users','A group for Accounting','Right-click <b>Opisina</b> and point to New.',{scene:'srv',target:'au-ou',label:'Opisina',act:set('ad',{ctx:'new'})});
    add('users','Group','Choose Group.',{scene:'srv',target:'au-new-group',label:'Group',act:set('ad',{ctx:null,dlg:'group'})});
    add('users','Accounting','Type <b>Accounting</b>. Keep Global and Security.',{scene:'srv',target:'gp-name',label:'Group name',act:set('ad',{f:true}),
      ok:'Permissions are given to groups, not to people. When staff change jobs you only change their group.'});
    add('users','OK','Click OK.',{scene:'srv',target:'gp-ok',label:'OK',act:s=>{ s.ad=Object.assign({},s.ad,{dlg:null,f:false,objs:s.ad.objs.concat([{id:'au-o-acct',icon:'👥',name:'Accounting',type:'Security Group - Global',desc:'Accounting team'}])}); }});
    add('users','A user for Ana','Right-click Opisina › New › <b>User</b>.',{scene:'srv',target:'au-ou',label:'Opisina › New › User',act:set('ad',{dlg:'user1',u:{first:'Ana',last:'Reyes',sam:'areyes'}})});
    add('users','Her names','First name <b>Ana</b>, last name <b>Reyes</b>, logon name <b>areyes</b>.',{scene:'srv',target:'nu-name',label:'First name',act:set('ad',{f:true}),ok:'Use one naming rule for every logon name, here first initial + surname.'});
    add('users','Next','Click Next.',{scene:'srv',target:'nu-next',label:'Next',act:set('ad',{dlg:'user2'})});
    add('users','Temporary password','Type a temporary password. Keep <b>User must change password at next logon</b> ticked.',{scene:'srv',target:'nu-pw',label:'Password',act:set('ad',{f2:true}),
      ok:'Ana chooses her own password at her first sign-in, so even the technician will not know it.'});
    add('users','Next','Click Next.',{scene:'srv',target:'nu-next',label:'Next',act:set('ad',{dlg:'user3'})});
    add('users','Finish','Click Finish.',{scene:'srv',target:'nu-finish',label:'Finish',act:s=>{ s.ad=Object.assign({},s.ad,{dlg:null,f:false,f2:false,objs:s.ad.objs.concat([{id:'au-o-areyes',icon:'👤',name:'Ana Reyes',type:'User',desc:'Accounting',groups:[]}])}); }});
    add('users','A user for Ben','Create <b>Ben Cruz</b> (bcruz) the same way. Ben works in sales.',{scene:'srv',target:'au-ou',label:'Opisina › New › User',act:s=>{ s.ad=Object.assign({},s.ad,{objs:s.ad.objs.concat([{id:'au-o-bcruz',icon:'👤',name:'Ben Cruz',type:'User',desc:'Sales',groups:[]}])}); }});
    add('users','Open Ana’s account','Double-click <b>Ana Reyes</b>.',{scene:'srv',target:'au-o-areyes',label:'Ana Reyes',act:set('ad',{pick:'au-o-areyes',dlg:'uprops',tab:'general'})});
    add('users','Member Of','Open the Member Of tab.',{scene:'srv',target:'up-member',label:'Member Of',act:set('ad',{tab:'member'})});
    add('users','Add…','Click Add.',{scene:'srv',target:'up-add',label:'Add…',act:set('ad',{dlg2:'selgrp'})});
    add('users','Check the name','Type <b>Accounting</b> and click Check Names. It is underlined when found.',{scene:'srv',target:'sg-name',label:'Object name',act:set('ad',{sg:true})});
    add('users','OK','Click OK.',{scene:'srv',target:'sg-ok',label:'OK',act:s=>{ s.ad=Object.assign({},s.ad,{dlg2:null,sg:false,objs:s.ad.objs.map(o=>o.id==='au-o-areyes'?Object.assign({},o,{groups:['Accounting']}):o)}); }});
    add('users','OK','Click OK.',{scene:'srv',target:'up-ok',label:'OK',act:set('ad',{dlg:null}),ok:'Ana is in Accounting. Ben is only in Domain Users.'});

    /* ================= 7. Shared and home folders ================= */
    add('folders','File Explorer','Open File Explorer on the server.',{scene:'srv',target:'tb-explorer',label:'File Explorer',act:put({app:'exp',ex:{}})});
    add('folders','Make the folders','On the data drive D:, create <b>Home</b> and <b>Shares</b>, and in Shares a folder <b>Accounting</b>.',{scene:'srv',target:'ex-newfolder',label:'New › Folder',act:set('ex',{folders:true}),
      ok:'Shared files live on D:, the data drive, apart from Windows on C:.'});
    add('folders','Lock down Home first','The home folders will be created inside Home and copy its permissions. Right-click <b>Home</b> › Properties › Security.',{scene:'srv',target:'ex-home',label:'Home',act:set('ex',{sel:'ex-home',dlg:'props',tab:'security',target:'home'}),
      ok:'Home inherits from D:, where every user may read and create folders. That must change before any personal folder is made.'});
    add('folders','Advanced','Click Advanced.',{scene:'srv',target:'pr-secadv',label:'Advanced',act:set('ex',{dlg2:'advsec',atab:'perm'})});
    add('folders','Disable inheritance','Click Disable inheritance.',{scene:'srv',target:'asx-disable',label:'Disable inheritance',act:set('ex',{blockAsk:true})});
    add('folders','Keep a copy','Choose <b>Convert inherited permissions into explicit permissions</b>.',{scene:'srv',target:'asx-convert',label:'Convert',act:set('ex',{blockAsk:false,inh:false}),ok:'The same entries stay, but now they can be changed here.'});
    add('folders','Select the Users entries','Select all three <b>Users</b> entries.',{scene:'srv',target:'asx-users',label:'Users (3 entries)',act:set('ex',{selUsers:true})});
    add('folders','Remove','Click Remove.',{scene:'srv',target:'asx-remove',label:'Remove',act:set('ex',{users:false,selUsers:false})});
    add('folders','Let users reach their folder','Click Add, choose <b>Authenticated Users</b>, set Applies to <b>This folder only</b> and allow only <b>Traverse folder</b> and <b>List folder</b>.',{scene:'srv',target:'asx-add',label:'Add',act:set('ex',{homeAuth:true}),
      ok:'Everyone can pass through Home to reach their own folder, but cannot open anyone else’s.'});
    add('folders','OK','Click OK.',{scene:'srv',target:'asx-ok',label:'OK',act:set('ex',{dlg2:null,ntfsHome:['CREATOR OWNER','SYSTEM','Administrators (OPISINA\\Administrators)','Authenticated Users']})});
    add('folders','Sharing tab','Now share it. Open the Sharing tab.',{scene:'srv',target:'pr-sharetab',label:'Sharing',act:set('ex',{tab:'sharing'})});
    add('folders','Advanced Sharing','Click Advanced Sharing.',{scene:'srv',target:'pr-adv',label:'Advanced Sharing…',act:set('ex',{dlg2:'advshare'})});
    add('folders','Share it as Home$','Tick <b>Share this folder</b> and name the share <b>Home$</b>.',{scene:'srv',target:'as-share',label:'Share this folder',act:set('ex',{asOn:true}),ok:'The $ hides the share when people browse the network.'});
    add('folders','Share permissions','Click Permissions.',{scene:'srv',target:'as-perm',label:'Permissions',act:set('ex',{dlg3:'shareperm'})});
    add('folders','Authenticated Users','Replace Everyone with <b>Authenticated Users</b>, allowed <b>Full Control</b>.',{scene:'srv',target:'sp-set',label:'Authenticated Users',act:set('ex',{sp:true}),
      ok:'The share is the outer gate; the NTFS permissions you just set decide who gets into each folder.'});
    add('folders','OK','Click OK twice.',{scene:'srv',target:'sp-ok',label:'OK',act:s=>{ s.ex=Object.assign({},s.ex,{dlg3:null,dlg2:null,shared:['Home']}); }});
    add('folders','Close','Close the Properties window.',{scene:'srv',target:'pr-ok',label:'OK',act:s=>{ s.ex=Object.assign({},s.ex,{dlg:null,asOn:false,sp:false}); }});
    add('folders','Open Shares','Double-click <b>Shares</b>.',{scene:'srv',target:'ex-shares',label:'Shares',act:set('ex',{path:'shares',sel:null})});
    add('folders','Accounting › Properties','Right-click <b>Accounting</b> › Properties › Sharing.',{scene:'srv',target:'ex-acct',label:'Accounting',act:set('ex',{sel:'ex-acct',dlg:'props',tab:'sharing',target:'acct',inh:undefined,users:undefined,selUsers:false})});
    add('folders','Advanced Sharing','Click Advanced Sharing.',{scene:'srv',target:'pr-adv',label:'Advanced Sharing…',act:set('ex',{dlg2:'advshare'})});
    add('folders','Share this folder','Tick <b>Share this folder</b>. The share name is Accounting.',{scene:'srv',target:'as-share',label:'Share this folder',act:set('ex',{asOn:true})});
    add('folders','Share permissions','Click Permissions.',{scene:'srv',target:'as-perm',label:'Permissions',act:set('ex',{dlg3:'shareperm'})});
    add('folders','Authenticated Users: Change','Replace Everyone with <b>Authenticated Users</b>, allowed <b>Change</b>.',{scene:'srv',target:'sp-set',label:'Authenticated Users',act:set('ex',{sp:true}),
      ok:'Share permissions are the outer gate. The NTFS permissions on the Security tab decide exactly who gets in; the stricter of the two always wins.'});
    add('folders','OK','Click OK twice.',{scene:'srv',target:'sp-ok',label:'OK',act:s=>{ s.ex=Object.assign({},s.ex,{dlg3:null,dlg2:null,shared:['Home','Accounting']}); }});
    add('folders','Security tab','Open the Security tab. Every domain user can read this folder, because it inherits from D:.',{scene:'srv',target:'pr-sectab',label:'Security',act:set('ex',{tab:'security'})});
    add('folders','Advanced','Click Advanced.',{scene:'srv',target:'pr-secadv',label:'Advanced',act:set('ex',{dlg2:'advsec',atab:'perm'})});
    add('folders','Disable inheritance','Click Disable inheritance.',{scene:'srv',target:'asx-disable',label:'Disable inheritance',act:set('ex',{blockAsk:true})});
    add('folders','Keep a copy','Choose <b>Convert inherited permissions into explicit permissions</b>.',{scene:'srv',target:'asx-convert',label:'Convert',act:set('ex',{blockAsk:false,inh:false}),
      ok:'The folder keeps the same entries, but they can now be changed here.'});
    add('folders','Select the Users entries','Select all three <b>Users</b> entries: together they let every staff member read and add files.',{scene:'srv',target:'asx-users',label:'Users (3 entries)',act:set('ex',{selUsers:true})});
    add('folders','Remove','Click Remove.',{scene:'srv',target:'asx-remove',label:'Remove',act:set('ex',{users:false,selUsers:false})});
    add('folders','Add Accounting','Click Add, select the principal <b>Accounting</b> and allow <b>Modify</b>.',{scene:'srv',target:'asx-add',label:'Add',act:set('ex',{acctAdded:true}),
      ok:'Modify lets the team create, edit and delete files, but not change permissions.'});
    add('folders','OK','Click OK.',{scene:'srv',target:'asx-ok',label:'OK',act:set('ex',{dlg2:null,ntfs:['CREATOR OWNER','SYSTEM','Administrators (OPISINA\\Administrators)','Accounting (OPISINA\\Accounting)']})});
    add('folders','Back to Ana’s account','Now the home folders. Open AD Users.',{scene:'srv',target:'tb-aduc',label:'AD Users',act:s=>{ s.app='aduc'; s.ex=Object.assign({},s.ex,{dlg:null}); }});
    add('folders','Open Ana Reyes','Double-click Ana Reyes.',{scene:'srv',target:'au-o-areyes',label:'Ana Reyes',act:set('ad',{pick:'au-o-areyes',dlg:'uprops',tab:'general'})});
    add('folders','Profile tab','Open the Profile tab.',{scene:'srv',target:'up-profile',label:'Profile',act:set('ad',{tab:'profile'})});
    add('folders','Her home folder','Choose Connect <b>H:</b> To <b>\\\\SRV-01\\Home$\\%username%</b>.',{scene:'srv',target:'pf-home',label:'Connect H: To',act:s=>{ s.ad=Object.assign({},s.ad,{objs:s.ad.objs.map(o=>o.id==='au-o-areyes'?Object.assign({},o,{home:true}):o)}); }});
    add('folders','Apply','Click Apply.',{scene:'srv',target:'up-apply',label:'Apply',act:s=>{},ok:'Windows creates D:\\Home\\areyes and gives Ana Full Control. Home was locked down first, so only Ana, SYSTEM and the administrators can open it.'});
    add('folders','OK','Click OK.',{scene:'srv',target:'up-ok',label:'OK',act:set('ad',{dlg:null})});
    add('folders','Ben too','Give Ben Cruz a home folder the same way.',{scene:'srv',target:'au-o-bcruz',label:'Ben Cruz › Profile',act:s=>{ s.ad=Object.assign({},s.ad,{objs:s.ad.objs.map(o=>o.id==='au-o-bcruz'?Object.assign({},o,{home:true}):o)}); }});
    add('folders','Security check','Check what Ben can really do in Accounting. In File Explorer, open Accounting’s Properties again.',{scene:'srv',target:'tb-explorer',label:'File Explorer',act:s=>{ s.app='exp'; s.ex=Object.assign({},s.ex,{dlg:'props',tab:'security',dlg2:null}); }});
    add('folders','Advanced','Click Advanced.',{scene:'srv',target:'pr-secadv',label:'Advanced',act:set('ex',{dlg2:'advsec',atab:'perm'})});
    add('folders','Effective Access','Open the Effective Access tab.',{scene:'srv',target:'asx-eff',label:'Effective Access',act:set('ex',{atab:'eff'})});
    add('folders','Select Ben','Select a user: <b>bcruz</b>.',{scene:'srv',target:'eff-user',label:'Select a user',act:set('ex',{effUser:'bcruz',effShown:false})});
    add('folders','View effective access','Click View effective access.',{scene:'srv',target:'eff-view',label:'View effective access',act:set('ex',{effShown:true}),ok:'Every line has a red cross: Ben cannot open Accounting.'});
    add('folders','And Ana','Select <b>areyes</b> and view again.',{scene:'srv',target:'eff-user',label:'Select a user',act:set('ex',{effUser:'areyes',effShown:true}),
      ok:'Ana can read, write and delete, but not change permissions. The access levels match the plan.'});

    /* ================= 8. Share the printer ================= */
    add('printer','Settings','Open Settings › Bluetooth & devices › Printers & scanners.',{scene:'srv',target:'tb-settings',label:'Settings',act:put({app:'set',prn:{},dlg:null,ex:{}}),tip:'Microsoft advises against print sharing on a domain controller. It is common in a one-server office; a bigger office shares printers from a separate server.'});
    add('printer','Add device','Click Add device.',{scene:'srv',target:'pr-adddev',label:'Add device',act:set('prn',{searching:true})});
    add('printer','Add manually','The printer is on the network but not found automatically. Click <b>Add manually</b>.',{scene:'srv',target:'pr-manual',label:'Add manually',act:set('prn',{wiz:'find'})});
    add('printer','By IP address','Choose <b>Add a printer using an IP address or hostname</b>.',{scene:'srv',target:'apw-ip',label:'IP address or hostname',act:set('prn',{ipPick:true})});
    add('printer','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('prn',{wiz:'ip'})});
    add('printer','The printer’s address','Type <b>192.168.1.20</b>, the fixed address from Station 4.',{scene:'srv',target:'apw-host',label:'Hostname or IP address',act:set('prn',{host:true})});
    add('printer','Next','Windows asks the printer what it is and picks the driver. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('prn',{wiz:'name'})});
    add('printer','Printer name','Keep the name <b>PRN-01</b>. Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('prn',{wiz:'share'})});
    add('printer','Share it','Keep <b>Share this printer</b>, share name PRN-01, and add the location “Office, near the door”.',{scene:'srv',target:'apw-share',label:'Share this printer',act:set('prn',{shareSet:true}),
      ok:'Every PC now prints through SRV-01, so the queue, drivers and permissions are managed in one place.'});
    add('printer','Next','Click Next.',{scene:'srv',target:'wz-next',label:'Next',act:set('prn',{wiz:'done'})});
    add('printer','Print a test page','Print a test page from the server first.',{scene:'srv',target:'apw-test',label:'Print a test page',act:set('prn',{tested:true}),ok:'The page comes out of PRN-01.'});
    add('printer','Finish','Click Finish.',{scene:'srv',target:'apw-finish',label:'Finish',act:set('prn',{wiz:null,added:true})});
    add('printer','Printer properties','Open PRN-01 › Printer properties › Sharing.',{scene:'srv',target:'pr-prn01',label:'PRN-01',act:set('prn',{props:true})});
    add('printer','List in the directory','Tick <b>List in the directory</b>.',{scene:'srv',target:'prp-list',label:'List in the directory',act:set('prn',{listed:true}),ok:'Domain PCs will find PRN-01 when they search for printers.'});
    add('printer','OK','Click OK.',{scene:'srv',target:'prp-ok',label:'OK',act:set('prn',{props:false})});

    /* ================= 9. Test from an office PC ================= */
    add('test','Go to PC-01','Test the way staff will use the server. PC-01 runs Windows 11 Pro. Open the Command Prompt.',{scene:'pc',target:'tb-cmd',label:'Command Prompt',act:pcSet({app:'cmd'})});
    add('test','Give back the old address','PC-01 still has a lease from the router, which no longer answers. Type <b>ipconfig /release</b>.',{scene:'pc',cmd:'ipconfig /release',target:'term-line',label:'ipconfig /release ↵',act:pcRun('ipconfig /release','\nWindows IP Configuration\n\nEthernet adapter Ethernet:\n\n   Connection-specific DNS Suffix  . :\n   Default Gateway . . . . . . . . . :'),
      ok:'PC-01 has no address for a moment.',tip:'ipconfig /renew on its own would ask the router again, and fail.'});
    add('test','Get a new address','Type <b>ipconfig /renew</b>.',{scene:'pc',cmd:'ipconfig /renew',target:'term-line',label:'ipconfig /renew ↵',act:pcRun('ipconfig /renew','\nWindows IP Configuration\n\nEthernet adapter Ethernet:\n\n   Connection-specific DNS Suffix  . : ad.opisina.ph\n   IPv4 Address. . . . . . . . . . . : [[192.168.1.100]]\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.1.1'),
      ok:'192.168.1.100: the first address of the server’s scope.'});
    add('test','Where did it come from?','Type <b>ipconfig /all</b> and look at DHCP Server and DNS Servers.',{scene:'pc',cmd:'ipconfig /all',target:'term-line',label:'ipconfig /all ↵',act:pcRun('ipconfig /all','\n   Host Name . . . . . . . . . . . . : PC-01\n   …\n   DHCP Enabled. . . . . . . . . . . : Yes\n   Lease Obtained. . . . . . . . . . : Saturday, November 14, 2026 3:01:22 PM\n   Lease Expires . . . . . . . . . . : Sunday, November 22, 2026 3:01:22 PM\n   DHCP Server . . . . . . . . . . . : [[192.168.1.11]]\n   DNS Servers . . . . . . . . . . . : [[192.168.1.11]]'),
      ok:'Both point to SRV-01, and the lease lasts 8 days.'});
    add('test','Look up a name','Type <b>nslookup prn-01</b>.',{scene:'pc',cmd:'nslookup prn-01',target:'term-line',label:'nslookup prn-01 ↵',act:pcRun('nslookup prn-01','Server:  UnKnown\nAddress:  192.168.1.11\n\nName:    PRN-01.ad.opisina.ph\nAddress:  [[192.168.1.20]]'),
      ok:'SRV-01 answered with the record you created: DNS works. “UnKnown” only means there is no reverse (PTR) record for the server’s own address.'});
    add('test','Settings › About','Now join PC-01 to the domain. Open Settings › System › About.',{scene:'pc',target:'tb-settings',label:'Settings',act:pcSet({app:'set',page:'about'})});
    add('test','Domain or workgroup','Click <b>Domain or workgroup</b>.',{scene:'pc',target:'ab-domain',label:'Domain or workgroup',act:pcSet({dlg:'sysprops'})});
    add('test','Change…','Click Change.',{scene:'pc',target:'sp-change',label:'Change…',act:pcSet({dlg:'join'})});
    add('test','Member of a domain','Choose Domain and type <b>ad.opisina.ph</b>.',{scene:'pc',target:'rn-domain',label:'Domain',act:pcSet({domTyped:true})});
    add('test','OK','Click OK.',{scene:'pc',target:'rn-ok',label:'OK',act:pcSet({dlg:'cred'})});
    add('test','An account that may join','Type OPISINA\\Administrator and its password.',{scene:'pc',target:'cr-user',label:'User name',act:pcSet({credTyped:true}),
      tip:'In a bigger office, give the technician a separate account allowed to join computers, rather than using the domain administrator.'});
    add('test','OK','Click OK.',{scene:'pc',target:'cr-ok',label:'OK',act:pcSet({dlg:'welcome'})});
    add('test','Welcome','“Welcome to the ad.opisina.ph domain.” Click OK.',{scene:'pc',target:'wl-ok',label:'OK',act:pcSet({dlg:'restart'})});
    add('test','Restart','Click Restart Now.',{scene:'pc',target:'rs-now',label:'Restart Now',act:pcSet({dlg:null,app:null,mon:'signin',user:'areyes',userTyped:false,lines:[]})});
    add('test','Sign in as Ana','Choose Other user and type <b>OPISINA\\areyes</b> and the temporary password.',{scene:'pc',target:'li-user',label:'User name',act:pcSet({userTyped:true,mon:'mustchange'})});
    add('test','Change the password','Windows asks Ana to choose her own password. Click OK.',{scene:'pc',target:'li-ok',label:'OK',act:pcSet({mon:'newpw'})});
    add('test','Her own password','Ana types the temporary password once, then her new password twice.',{scene:'pc',target:'li-newpw',label:'New password',act:pcSet({newTyped:true,mon:'desk',hDrive:true}),ok:'Ana is signed in to the domain.'});
    add('test','File Explorer','Open File Explorer.',{scene:'pc',target:'tb-explorer',label:'File Explorer',act:pcSet({app:'exp',path:'pc'})});
    add('test','The H: drive','Her home folder is already connected as <b>H:</b>. Open it.',{scene:'pc',target:'fe-h',label:'H: drive',act:pcSet({path:'home',files:[]}),ok:'The user folder works: nobody else can open it.'});
    add('test','Open the Accounting share','Type <b>\\\\SRV-01\\Accounting</b> in the address bar.',{scene:'pc',target:'fe-addr',label:'Address bar',act:pcSet({path:'acct',files:[]})});
    add('test','Save a file','Create a file in the share.',{scene:'pc',target:'fe-new',label:'New',act:pcSet({files:['Budget 2027.xlsx']}),ok:'Ana can read and write in Accounting.'});
    add('test','Add the printer','Open Settings › Printers & scanners.',{scene:'pc',target:'tb-settings',label:'Settings',act:pcSet({app:'set',page:'printers'})});
    add('test','Add device','Click Add device. The printer listed in the directory appears.',{scene:'pc',target:'pr-adddev',label:'Add device',act:pcSet({prnSearch:true})});
    add('test','PRN-01 on SRV-01','Click Add device next to PRN-01 on SRV-01.',{scene:'pc',target:'pr-add',label:'Add device',act:pcSet({prnAdded:true}),ok:'PRN-01 uses a class driver already built into Windows 11, so Ana can add it without admin rights. If a driver had to be downloaded from the server, Windows would ask for an administrator.'});
    add('test','Print a test page','Print a test page.',{scene:'pc',target:'pr-test',label:'Print a test page',act:pcSet({testPage:true})});
    add('test','Sign out','Now the security check: Ben must not get into Accounting. Sign out.',{scene:'pc',target:'tb-signout',label:'Sign out',act:pcSet({mon:'signin',app:null,user:'bcruz',userTyped:false})});
    add('test','Sign in as Ben','Sign in as <b>OPISINA\\bcruz</b>. Ben sets his own password the same way.',{scene:'pc',target:'li-user',label:'User name',act:pcSet({userTyped:true,mon:'desk',hDrive:true,lines:[]})});
    add('test','Try the Accounting share','Open File Explorer and type \\\\SRV-01\\Accounting.',{scene:'pc',target:'tb-explorer',label:'File Explorer',act:pcSet({app:'exp',path:'pc'})});
    add('test','Access denied','Type the path in the address bar.',{scene:'pc',target:'fe-addr',label:'Address bar',act:pcSet({dlg:'denied'}),ok:'Windows refuses: the access levels work for a real user, not only on paper.'});
    add('test','Close','Close the message.',{scene:'pc',target:'dn-ok',label:'Close',act:pcSet({dlg:null})});
  } else {
    /* ================= Ubuntu Server 26.04 LTS ================= */
    /* ---------- 2. name, address, update ---------- */
    C('basics','Rename the server','Give the server the name from the plan.','sudo hostnamectl set-hostname srv-01','[sudo] password for sysadmin: ',{x:{ok:'sudo runs one command as the administrator (root) after asking for your password.'}});
    C('basics','Load the new name','Start a fresh shell so the prompt shows the new name.','exec bash','',{after:put({host:'srv-01'})});
    C('basics','Check the address','Look at the network interface <b>eno1</b>.','ip -br addr','lo               UNKNOWN        127.0.0.1/8 ::1/128\neno1             UP             [[192.168.1.37/24]] fe80::3a2c:4aff:fe61:11c2/64',{x:{ok:'The installer used DHCP and the router gave .37. A server needs a fixed address.'}});
    edit('basics','/etc/netplan/50-cloud-init.yaml',['network:','  version: 2','  ethernets:','    eno1:','      dhcp4: true'],
      ['network:','  version: 2','  ethernets:','    eno1:','      dhcp4: false','      addresses:','        - 192.168.1.11/24','      routes:','        - to: default','          via: 192.168.1.1','      nameservers:','        addresses: [192.168.1.1]','        search: [lan.opisina.ph]'],[4,5,6,7,8,9,10,11,12],
      {t1:'Open the network settings',say1:'Netplan keeps the network settings in a YAML file. Open it with the nano editor.',t2:'Type the fixed address',say2:'Turn off DHCP and type the fixed address, the gateway and, for now, the router as DNS.',
       tip2:'YAML uses spaces, never tabs, and the indentation must line up exactly.',ok2:'The server keeps using the router for DNS lookups; office PCs will use the server’s own DNS.'});
    C('basics','Try it safely','<b>netplan try</b> applies the settings and undoes them by itself if you do not confirm, so a typing mistake cannot lock you out.','sudo netplan try','Do you want to keep these settings?\n\nPress ENTER before the timeout to accept the new configuration\n\nChanges will revert in 118 seconds\nConfiguration accepted.');
    C('basics','Check the new address','Check eno1 again.','ip -br addr show eno1','eno1             UP             [[192.168.1.11/24]] fe80::3a2c:4aff:fe61:11c2/64');
    C('basics','Ping the router','Send three pings to the gateway.','ping -c 3 192.168.1.1',lpingOut('192.168.1.1','','0'));
    C('basics','Ping the internet','Now a name on the internet.','ping -c 3 google.com',lpingOut('142.250.66.206','google.com','9'),{x:{ok:'Local and internet connections work.'}});
    C('basics','Update the package list','<b>apt</b> installs and updates software. First fetch the list of updates.','sudo apt update','Hit:1 http://archive.ubuntu.com/ubuntu resolute InRelease\nGet:2 http://security.ubuntu.com/ubuntu resolute-security InRelease [126 kB]\n…\nReading package lists... Done\nBuilding dependency tree... Done\n37 packages can be upgraded. Run \'apt list --upgradable\' to see them.');
    C('basics','Install the updates','Install them.','sudo apt upgrade -y','Reading package lists... Done\n…\nSummary:\n  Upgrading: 37, Installing: 0, Removing: 0, Not Upgrading: 0\n…\nNo services need to be restarted.',{x:{ok:'The server is up to date.'}});
    C('basics','Errors since start-up?','Read only the errors in this boot’s system log.','journalctl -b -p err','-- No entries --',{x:{ok:'No errors in the boot sequence.'}});
    C('basics','Failed services?','Check that no service failed to start.','systemctl --failed','  UNIT LOAD ACTIVE SUB DESCRIPTION\n\n0 loaded units listed.',{x:{ok:'Everything started normally.'}});
    C('basics','Time and time zone','Check the clock.','timedatectl','               Local time: Sat 2026-11-14 14:31:05 PST\n           Universal time: Sat 2026-11-14 06:31:05 UTC\n                Time zone: [[Asia/Manila (PST, +0800)]]\nSystem clock synchronized: yes\n              NTP service: active',{x:{ok:'Correct time zone, and the clock is kept right over the internet (NTP).'}});
    C('basics','Remote access is on','The installer added OpenSSH. Check it is listening.','systemctl is-active ssh.socket','active',{x:{ok:'SSH lets the technician manage the server from the laptop.'}});
    add('basics','Open the laptop’s terminal','Manage the server remotely from now on. On the laptop, open Terminal.',{scene:'lap',target:'app-term',label:'Terminal',act:set('lap',{app:'term'})});
    remote=true;
    add('basics','Connect with SSH','Type <b>ssh sysadmin@192.168.1.11</b>, answer yes to the key question and type the password.',{scene:'lap',where:'lap',cmd:'ssh sysadmin@192.168.1.11',target:'term-line',label:'ssh sysadmin@192.168.1.11 ↵',
      act:s=>{ s.ssh=s.ssh.concat([['PS C:\\Users\\tech> ','ssh sysadmin@192.168.1.11',"The authenticity of host '192.168.1.11 (192.168.1.11)' can't be established.\nED25519 key fingerprint is SHA256:x7Rq1Lk9mP0b2YzE4wN6cT3vH8sJ5dA1fG2hK7uQ9oc.\nAre you sure you want to continue connecting (yes/no/[fingerprint])? yes\nsysadmin@192.168.1.11's password:\nWelcome to Ubuntu 26.04 LTS (GNU/Linux x86_64)"]]); s.sshOn=true; },
      ok:'You are on srv-01 from the laptop. The same commands work here.',tip:'Answer yes only on the first connection. If the key warning appears later, someone may be pretending to be the server: stop and check.'});
    /* ---------- 3. users and groups ---------- */
    C('users','A group for Accounting','Permissions go to groups, not to people.','sudo groupadd accounting','',{x:{ok:'When staff change jobs you only change their group.'}});
    C('users','A user for Ana','<b>adduser</b> creates the account and its home folder, then asks for a password and the full name. Let Ana type her own password at the prompt.','sudo adduser areyes',"info: Adding user `areyes' ...\ninfo: Selecting UID/GID from range 1000 to 59999 ...\ninfo: Adding new group `areyes' (1002) ...\ninfo: Adding new user `areyes' (1002) with group `areyes (1002)' ...\ninfo: Creating home directory `/home/areyes' ...\ninfo: Copying files from `/etc/skel' ...\nNew password:\nRetype new password:\npasswd: password updated successfully\nChanging the user information for areyes\nEnter the new value, or press ENTER for the default\n\tFull Name []: Ana Reyes\n\tRoom Number []:\n\tWork Phone []:\n\tHome Phone []:\n\tOther []:\nIs the information correct? [Y/n] Y\ninfo: Adding new user `areyes' to supplemental / extra groups `users' ...\ninfo: Adding user `areyes' to group `users' ...");
    C('users','A user for Ben','Create Ben Cruz the same way. Ben works in sales.','sudo adduser bcruz',"info: Adding user `bcruz' ...\n…\n\tFull Name []: Ben Cruz\n…\ninfo: Adding user `bcruz' to group `users' ...");
    C('users','Ana joins Accounting','<b>-aG</b> adds a group and keeps her other groups.','sudo usermod -aG accounting areyes','',{x:{tip:'Without -a, usermod -G replaces all of the user’s groups.'}});
    C('users','Check her groups','','id areyes','uid=1002(areyes) gid=1002(areyes) groups=1002(areyes),100(users),[[1001(accounting)]]');
    C('users','The home folders','Every user got a private home folder.','ls -l /home','total 12\ndrwxr-x--- 2 areyes   areyes   4096 Nov 14 14:41 areyes\ndrwxr-x--- 2 bcruz    bcruz    4096 Nov 14 14:42 bcruz\ndrwxr-x--- 4 sysadmin sysadmin 4096 Nov 14 14:20 sysadmin',
      {x:{ok:'drwxr-x--- means the owner has full access, and other users have none: each user folder is private.'}});
    /* ---------- 4. DNS with BIND ---------- */
    C('dns','Install BIND','BIND 9 is the DNS server.','sudo apt install -y bind9 bind9-utils','…\nSetting up bind9 ...\nCreated symlink /etc/systemd/system/multi-user.target.wants/named.service → /usr/lib/systemd/system/named.service.\n…');
    edit('dns','/etc/bind/named.conf.options',['options {','        directory "/var/cache/bind";','','        // forwarders {','        //      0.0.0.0;','        // };','','        dnssec-validation auto;','','        listen-on-v6 { any; };','};'],
      ['options {','        directory "/var/cache/bind";','','        forwarders {','                1.1.1.1;','                8.8.8.8;','        };','        allow-query { localhost; 192.168.1.0/24; };','','        dnssec-validation auto;','','        listen-on-v6 { any; };','};'],[3,4,5,6,7],
      {t1:'Open the options',say1:'First the general options.',t2:'Forwarders and who may ask',say2:'Add the forwarders 1.1.1.1 and 8.8.8.8, and allow queries only from the office network.',ok2:'Names the server does not know go to the forwarders. Nobody outside the office can use this DNS server.'});
    edit('dns','/etc/bind/named.conf.local',['//','// Do any local configuration here','//','','// Consider adding the 1918 zones here, if they are not used in your','// organization','//include "/etc/bind/zones.rfc1918";'],
      ['//','// Do any local configuration here','//','','// Consider adding the 1918 zones here, if they are not used in your','// organization','//include "/etc/bind/zones.rfc1918";','','zone "lan.opisina.ph" {','        type primary;','        file "/etc/bind/db.lan.opisina.ph";','};'],[8,9,10,11],
      {t1:'Declare the office zone',say1:'Now tell BIND it is in charge of lan.opisina.ph.',t2:'The zone',say2:'Add the zone and the file that will hold its records.'});
    edit('dns','/etc/bind/db.lan.opisina.ph',[''],
      ['$TTL 1h','@       IN SOA  srv-01.lan.opisina.ph. admin.lan.opisina.ph. (','                2026111401 ; serial','                1h         ; refresh','                15m        ; retry','                1w         ; expire','                1h )       ; negative cache','@       IN NS   srv-01.lan.opisina.ph.','srv-01  IN A    192.168.1.11','nas-01  IN A    192.168.1.10','prn-01  IN A    192.168.1.20','router  IN A    192.168.1.1'],[0,1,2,3,4,5,6,7,8,9,10,11],
      {newFile:true,t1:'Create the zone file',say1:'The records go in a new file.',t2:'The records',say2:'Type the SOA and NS lines, then one A record per device in the plan.',ok2:'Change the serial number every time you edit this file, or other servers will not see the change.',tip2:'Names ending in a dot are complete names; without the dot the zone name is added.'});
    C('dns','Check the configuration','No output means no errors.','sudo named-checkconf','');
    C('dns','Check the zone','','sudo named-checkzone lan.opisina.ph /etc/bind/db.lan.opisina.ph','zone lan.opisina.ph/IN: loaded serial 2026111401\n[[OK]]');
    C('dns','Restart BIND','The DNS service is called <b>named</b>.','sudo systemctl restart named','');
    C('dns','Look up the printer','Ask the server for prn-01.','dig @localhost prn-01.lan.opisina.ph +short','[[192.168.1.20]]',{x:{ok:'BIND answers from the office zone.'}});
    C('dns','Look up an outside name','Now a name on the internet.','dig @localhost google.com +short','142.250.66.206',{x:{ok:'The forwarders work.'}});
    /* ---------- 5. DHCP with Kea ---------- */
    C('dhcp','Install Kea','Kea is the DHCP server.','sudo apt install -y kea-dhcp4-server','…\nSetting up kea-dhcp4-server ...\n…');
    C('dhcp','Keep the example file','The default file is a long example. Rename it and write a short one.','sudo mv /etc/kea/kea-dhcp4.conf /etc/kea/kea-dhcp4.conf.orig','');
    edit('dhcp','/etc/kea/kea-dhcp4.conf',[''],
      ['{','"Dhcp4": {','  "interfaces-config": { "interfaces": [ "eno1" ] },','  "lease-database": { "type": "memfile", "persist": true,','                      "name": "/var/lib/kea/kea-leases4.csv" },','  "valid-lifetime": 86400,','  "authoritative": true,','  "subnet4": [ {','      "id": 1,','      "subnet": "192.168.1.0/24",','      "pools": [ { "pool": "192.168.1.100 - 192.168.1.199" } ],','      "option-data": [','        { "name": "routers", "data": "192.168.1.1" },','        { "name": "domain-name-servers", "data": "192.168.1.11" },','        { "name": "domain-name", "data": "lan.opisina.ph" }','      ]','  } ]','}','}'],
      [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],{newFile:true,t1:'Write the DHCP settings',say1:'Create a new kea-dhcp4.conf.',t2:'The scope',say2:'Serve eno1 only, hand out .100 to .199 for 24 hours, and give each PC the gateway, the DNS server and the domain name. <b>authoritative</b> tells PCs holding an old router address to ask again.',
       ok2:'The fixed addresses (.1, .10, .11, .20) are outside the pool.',tip2:'JSON is strict: every comma and bracket matters. The check in the next step finds mistakes.'});
    C('dhcp','Check the file','<b>-t</b> tests the configuration without starting the server.','sudo kea-dhcp4 -t /etc/kea/kea-dhcp4.conf','… INFO  [kea-dhcp4.dhcp4] DHCP4_CONFIG_COMPLETE DHCPv4 server has completed configuration: [[added IPv4 subnets: 1]]; DDNS: disabled');
    add('dhcp','Now the router','Kea is ready. Two DHCP servers on one network give PCs conflicting settings, so switch off the router’s DHCP just before Kea starts.',{scene:'lap',target:'app-browser',label:'Browser',act:set('lap',{app:'browser'})});
    add('dhcp','Log in to the router','The browser is at 192.168.1.1. Log in with the admin password from Station 4.',{scene:'lap',target:'r-login',label:'Log in',act:set('lap',{logged:true})});
    add('dhcp','Disable the router’s DHCP','Under LAN / DHCP, set DHCP server to <b>Disable</b>.',{scene:'lap',target:'r-dhcp',label:'Disable',act:set('router',{dhcp:false})});
    add('dhcp','Save','Click Save.',{scene:'lap',target:'r-save',label:'Save',act:set('router',{saved:true}),ok:'Start Kea right away: until it runs, a PC that restarts gets no address.'});
    add('dhcp','Back to the terminal','Switch back to the SSH window.',{scene:'lap',target:'app-term',label:'Terminal',act:set('lap',{app:'term'})});
    C('dhcp','Restart Kea','','sudo systemctl restart kea-dhcp4-server','');
    C('dhcp','Is it running?','','systemctl is-active kea-dhcp4-server','[[active]]',{x:{ok:'The server now hands out addresses to the office.'}});
    /* ---------- 6. Samba shares ---------- */
    C('shares','Install Samba','Samba shares folders with Windows PCs.','sudo apt install -y samba','…\nSetting up samba ...\n…');
    C('shares','The Accounting folder','<b>-p</b> also creates the folders above it.','sudo mkdir -p /srv/shares/accounting','');
    C('shares','Give it to the group','','sudo chgrp accounting /srv/shares/accounting','');
    C('shares','Set the access level','<b>2770</b>: owner and group may do everything, others nothing, and the 2 (setgid) makes new files belong to the accounting group.','sudo chmod 2770 /srv/shares/accounting','');
    C('shares','Check it','','ls -ld /srv/shares/accounting','[[drwxrws---]] 2 root accounting 4096 Nov 14 14:58 /srv/shares/accounting',{x:{ok:'rws for the group, nothing for others: only Accounting can open it.'}});
    edit('shares','/etc/samba/smb.conf',['#======================= Share Definitions =======================','','# Un-comment the following (and tweak the other settings below to suit)','# to enable the default home directory shares.',';[homes]',';   comment = Home Directories',';   browseable = no',';   read only = yes'],
      ['#======================= Share Definitions =======================','','[homes]','   comment = Home Directories','   browseable = no','   read only = no','   create mask = 0700','   directory mask = 0700','   valid users = %S','','[accounting]','   comment = Accounting team files','   path = /srv/shares/accounting','   valid users = @accounting','   read only = no','   create mask = 0660','   directory mask = 2770'],[2,3,4,5,6,7,8,10,11,12,13,14,15,16],
      {t1:'Open the Samba settings',say1:'Go to the share definitions near the end of smb.conf.',t2:'Homes and Accounting',say2:'Turn on [homes] so each user gets their own folder as a share, and add [accounting] for the group only.',
       ok2:'valid users = %S: only the owner may open a home share. @accounting means members of the group.'});
    C('shares','Check the settings','<b>testparm</b> checks smb.conf.','testparm -s','Load smb config files from /etc/samba/smb.conf\nLoaded services file OK.\nServer role: ROLE_STANDALONE\n\n[homes]\n…\n[accounting]\n\tcomment = Accounting team files\n\tpath = /srv/shares/accounting\n…');
    C('shares','Samba password for Ana','Samba keeps its own passwords. Let Ana type her own at the prompt.','sudo smbpasswd -a areyes','New SMB password:\nRetype new SMB password:\nAdded user areyes.');
    C('shares','And for Ben','Ben types his own.','sudo smbpasswd -a bcruz','New SMB password:\nRetype new SMB password:\nAdded user bcruz.');
    C('shares','Restart Samba','','sudo systemctl restart smbd','',{x:{ok:'\\\\SRV-01\\accounting and each user’s home share are ready.'}});
    /* ---------- 7. printer with CUPS ---------- */
    C('printer','Install CUPS','CUPS is the print server.','sudo apt install -y cups','…\nSetting up cups ...\n…');
    C('printer','Add PRN-01','<b>-m everywhere</b> uses IPP Everywhere: the printer describes itself, so no vendor driver is needed.','sudo lpadmin -p PRN-01 -E -v ipp://192.168.1.20/ipp/print -m everywhere -L "Office, near the door"','');
    C('printer','Share the queue','','sudo lpadmin -p PRN-01 -o printer-is-shared=true','');
    C('printer','Share printers on the network','By default CUPS only listens to the server itself.','sudo cupsctl --share-printers','',{x:{ok:'PCs on the office network can now print through srv-01.'}});
    C('printer','Check the queue','','lpstat -p PRN-01','printer PRN-01 is idle.  enabled since Sat 14 Nov 2026 03:02:11 PM PST');
    C('printer','Print a test page','','lp -d PRN-01 /usr/share/cups/data/testprint','request id is PRN-01-1 (1 file(s))',{x:{ok:'The page comes out of PRN-01.'}});
    /* ---------- 8. firewall and security checks ---------- */
    C('secure','Allow SSH','Open only the ports the office needs. SSH first, so the next steps do not lock you out.','sudo ufw allow OpenSSH','Rules updated\nRules updated (v6)');
    C('secure','Allow file sharing','','sudo ufw allow Samba','Rules updated\nRules updated (v6)');
    C('secure','Allow DNS','','sudo ufw allow 53','Rules updated\nRules updated (v6)');
    C('secure','Allow DHCP','','sudo ufw allow 67/udp','Rules updated\nRules updated (v6)');
    C('secure','Allow printing','','sudo ufw allow 631/tcp','Rules updated\nRules updated (v6)');
    C('secure','Allow printer discovery','CUPS announces the shared printer with mDNS, so PCs can find it.','sudo ufw allow 5353/udp','Rules updated\nRules updated (v6)');
    C('secure','Turn on the firewall','','sudo ufw enable','Command may disrupt existing ssh connections. Proceed with operation (y|n)? y\nFirewall is active and enabled on system startup');
    C('secure','Check the rules','','sudo ufw status','Status: [[active]]\n\nTo                         Action      From\n--                         ------      ----\nOpenSSH                    ALLOW       Anywhere\nSamba                      ALLOW       Anywhere\n53                         ALLOW       Anywhere\n67/udp                     ALLOW       Anywhere\n631/tcp                    ALLOW       Anywhere\n5353/udp                   ALLOW       Anywhere\n…');
    C('secure','A tool to test shares','smbclient opens shares from the command line.','sudo apt install -y smbclient','…\nSetting up smbclient ...');
    C('secure','Can Ben open Accounting?','Try as Ben, with his Samba password.','smbclient //localhost/accounting -U bcruz -c ls','Password for [WORKGROUP\\bcruz]:\ntree connect failed: {{NT_STATUS_ACCESS_DENIED}}',{x:{ok:'Refused: Ben is not in the accounting group.'}});
    C('secure','Can Ana?','Now as Ana.','smbclient //localhost/accounting -U areyes -c ls','Password for [WORKGROUP\\areyes]:\n  .                                   D        0  Sat Nov 14 14:58:02 2026\n  ..                                  D        0  Sat Nov 14 14:58:02 2026\n\n\t\t459822080 blocks of size 1024. 445611512 blocks available',{x:{ok:'Allowed. The access levels match the plan.'}});

    /* ---------- 9. test from PC-01 ---------- */
    add('test','Go to PC-01','Test the way staff will use the server. PC-01 runs Windows 11 Pro. Open the Command Prompt.',{scene:'pc',target:'tb-cmd',label:'Command Prompt',act:pcSet({app:'cmd'})});
    add('test','Give back the old address','PC-01 still has a lease from the router, which no longer answers. Type <b>ipconfig /release</b>.',{scene:'pc',cmd:'ipconfig /release',target:'term-line',label:'ipconfig /release ↵',act:pcRun('ipconfig /release','\nWindows IP Configuration\n\nEthernet adapter Ethernet:\n\n   Connection-specific DNS Suffix  . :\n   Default Gateway . . . . . . . . . :'),
      ok:'PC-01 has no address for a moment.',tip:'ipconfig /renew on its own would ask the router again, and fail.'});
    add('test','Get a new address','Type <b>ipconfig /renew</b>.',{scene:'pc',cmd:'ipconfig /renew',target:'term-line',label:'ipconfig /renew ↵',act:pcRun('ipconfig /renew','\nWindows IP Configuration\n\nEthernet adapter Ethernet:\n\n   Connection-specific DNS Suffix  . : lan.opisina.ph\n   IPv4 Address. . . . . . . . . . . : [[192.168.1.100]]\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.1.1'),
      ok:'192.168.1.100: the first address of the server’s pool.'});
    add('test','Where did it come from?','Type <b>ipconfig /all</b> and look at DHCP Server and DNS Servers.',{scene:'pc',cmd:'ipconfig /all',target:'term-line',label:'ipconfig /all ↵',act:pcRun('ipconfig /all','\n   Host Name . . . . . . . . . . . . : PC-01\n   …\n   DHCP Enabled. . . . . . . . . . . : Yes\n   Lease Obtained. . . . . . . . . . : Saturday, November 14, 2026 3:01:22 PM\n   Lease Expires . . . . . . . . . . : Sunday, November 15, 2026 3:01:22 PM\n   DHCP Server . . . . . . . . . . . : [[192.168.1.11]]\n   DNS Servers . . . . . . . . . . . : [[192.168.1.11]]'),
      ok:'Both point to srv-01, and the lease lasts 24 hours.'});
    add('test','Look up a name','Type <b>nslookup prn-01</b>.',{scene:'pc',cmd:'nslookup prn-01',target:'term-line',label:'nslookup prn-01 ↵',act:pcRun('nslookup prn-01','Server:  UnKnown\nAddress:  192.168.1.11\n\nName:    prn-01.lan.opisina.ph\nAddress:  [[192.168.1.20]]'),
      ok:'“UnKnown” only means there is no reverse (PTR) record for the server’s own address. The answer is correct.'});
    add('test','Map Ana’s home folder','Connect Ana’s home share as drive H:. Windows asks for her Samba password.',{scene:'pc',cmd:'net use H: \\\\srv-01\\areyes /user:areyes /persistent:yes',target:'term-line',label:'net use H: … ↵',
      act:all(pcRun('net use H: \\\\srv-01\\areyes /user:areyes /persistent:yes',"Enter the password for 'areyes' to connect to 'srv-01':\nThe command completed successfully."),pcSet({hDrive:true,user:'areyes'}))});
    add('test','File Explorer','Open File Explorer.',{scene:'pc',target:'tb-explorer',label:'File Explorer',act:pcSet({app:'exp',path:'pc'})});
    add('test','The H: drive','Open H:.',{scene:'pc',target:'fe-h',label:'H: drive',act:pcSet({path:'home',files:[]}),ok:'Ana’s user folder on the server. Nobody else can open it.'});
    add('test','Open the Accounting share','Type <b>\\\\SRV-01\\Accounting</b> in the address bar.',{scene:'pc',target:'fe-addr',label:'Address bar',act:pcSet({path:'acct',files:[]})});
    add('test','Save a file','Create a file in the share.',{scene:'pc',target:'fe-new',label:'New',act:pcSet({files:['Budget 2027.xlsx']}),ok:'Ana can read and write in Accounting.'});
    add('test','Add the printer','Open Settings › Printers & scanners.',{scene:'pc',target:'tb-settings',label:'Settings',act:pcSet({app:'set',page:'printers'})});
    add('test','Add device','Click Add device. Windows finds the shared queue on srv-01.',{scene:'pc',target:'pr-adddev',label:'Add device',act:pcSet({prnSearch:true})});
    add('test','PRN-01 @ srv-01','Click Add device next to it. Windows uses its built-in IPP driver.',{scene:'pc',target:'pr-add',label:'Add device',act:pcSet({prnAdded:true}),
      tip:'If it is not listed, choose Add manually › Select a shared printer by name and type http://srv-01.lan.opisina.ph:631/printers/PRN-01'});
    add('test','Print a test page','Print a test page.',{scene:'pc',target:'pr-test',label:'Print a test page',act:pcSet({testPage:true}),ok:'Printing through the server works.'});
  }

  /* ================= Respond to a problem (shared) ================= */
  add('fix','A call from the office','Read the problem report.',{scene:'doc',doc:'complaint',target:'go-pc02',label:'Go to PC-02',
    act:pcSet(W?{dev:'PC-02',mon:'desk',app:'set',page:'about',dlg:'joinerr',domTyped:true,lines:[],user:'mika',hDrive:false,files:[],path:'pc',prnAdded:false,prnSearch:false,testPage:false}:{dev:'PC-02',mon:'desk',app:'exp',path:'pc',dlg:'neterr',lines:[],user:'mika',hDrive:false,files:[],prnAdded:false,prnSearch:false,testPage:false})});
  add('fix','See it yourself',W?'The same error appears on PC-02: no domain controller could be contacted. Click OK.':'The same error appears on PC-02: the network path was not found. Click OK.',{scene:'pc',target:W?'je-ok':'ne-ok',label:'OK',act:pcSet({dlg:null,app:'cmd'})});
  add('fix','Check the settings','Type <b>ipconfig /all</b>.',{scene:'pc',cmd:'ipconfig /all',target:'term-line',label:'ipconfig /all ↵',act:pcRun('ipconfig /all','\n   Host Name . . . . . . . . . . . . : PC-02\n   …\n   DHCP Enabled. . . . . . . . . . . : Yes\n   IPv4 Address. . . . . . . . . . . : 192.168.1.101(Preferred)\n   Lease Obtained. . . . . . . . . . : Saturday, November 14, 2026 3:14:40 PM\n   Default Gateway . . . . . . . . . : 192.168.1.1\n   DHCP Server . . . . . . . . . . . : 192.168.1.11\n   DNS Servers . . . . . . . . . . . : {{8.8.8.8}}'),
    ok:'The address came from SRV-01, but someone typed 8.8.8.8 as a fixed DNS server. Google’s DNS knows nothing about '+DOM+'.'});
  add('fix','Open the adapter settings','Type <b>ncpa.cpl</b>, open Ethernet › Properties › Internet Protocol Version 4.',{scene:'pc',cmd:'ncpa.cpl',target:'term-line',label:'ncpa.cpl ↵',act:all(pcRun('ncpa.cpl',''),pcSet({dlg:'ipv4'}))});
  add('fix','Automatic DNS','Choose <b>Obtain DNS server address automatically</b>.',{scene:'pc',target:'ip4-autodns',label:'Obtain DNS automatically',act:pcSet({autoDns:true})});
  add('fix','OK','Click OK.',{scene:'pc',target:'ip4-ok',label:'OK',act:pcSet({dlg:null})});
  add('fix','Test again','Type <b>nslookup srv-01</b>.',{scene:'pc',cmd:'nslookup srv-01',target:'term-line',label:'nslookup srv-01 ↵',act:pcRun('nslookup srv-01',W?'Server:  UnKnown\nAddress:  192.168.1.11\n\nName:    srv-01.ad.opisina.ph\nAddress:  [[192.168.1.11]]':'Server:  UnKnown\nAddress:  192.168.1.11\n\nName:    srv-01.lan.opisina.ph\nAddress:  [[192.168.1.11]]'),
    ok:'PC-02 now asks SRV-01 and gets the right answer.'});
  if(W){
    add('fix','Join again','Repeat the domain join from Settings › About.',{scene:'pc',target:'tb-settings',label:'Settings',act:pcSet({app:'set',page:'about',dlg:'join',domTyped:true})});
    add('fix','OK','Click OK and give the administrator account when asked.',{scene:'pc',target:'rn-ok',label:'OK',act:pcSet({dlg:'welcome'}),ok:'“Welcome to the ad.opisina.ph domain.” Fixed.'});
    add('fix','Done','Click OK and restart PC-02.',{scene:'pc',target:'wl-ok',label:'OK',act:pcSet({dlg:null})});
  } else {
    add('fix','Open the server again','Type \\\\SRV-01 in File Explorer’s address bar.',{scene:'pc',target:'tb-explorer',label:'File Explorer',act:pcSet({app:'exp',path:'pc'})});
    add('fix','Address bar','Type \\\\SRV-01.',{scene:'pc',target:'fe-addr',label:'Address bar',act:pcSet({dlg:'netcred',credUser:'bcruz'})});
    add('fix','Ben’s account','Mika lets Ben test from her PC. Type <b>bcruz</b> and his Samba password.',{scene:'pc',target:'cred-user',label:'User name',act:pcSet({credTyped:true})});
    add('fix','OK','Click OK.',{scene:'pc',target:'cred-ok',label:'OK',act:pcSet({dlg:null,path:'srv',user:'bcruz'}),ok:'The server’s shares are listed: the problem is fixed.'});
    add('fix','Try Accounting as Ben','Open the accounting share.',{scene:'pc',target:'fe-sh-accounting',label:'accounting',act:pcSet({dlg:'denied'}),ok:'Refused from a real PC too: Ben has no access to Accounting.'});
    add('fix','Close','Close the message.',{scene:'pc',target:'dn-ok',label:'Close',act:pcSet({dlg:null})});
  }
  add('fix','Write it down','Every problem goes in the server’s log: what happened, the cause, the fix and the test.',{scene:'pc',ok:'It will be part of the hand-over report.'});

  /* ================= Pre-deployment and hand-over ================= */
  if(W){
    add('handover','Back up before going live','Plug a USB backup drive (E:) into the server and open PowerShell.',{scene:'srv',target:'tb-ps',label:'PowerShell',act:put({app:'ps',dlg:null})});
    add('handover','Install Windows Server Backup','Type the command.',{scene:'srv',cmd:'Install-WindowsFeature Windows-Server-Backup',target:'term-line',label:'Install-WindowsFeature … ↵',
      act:all(ps('Install-WindowsFeature Windows-Server-Backup','\nSuccess Restart Needed Exit Code      Feature Result\n------- -------------- ---------      --------------\n[[True ]]   No             Success        {Windows Server Backup}'),set('w',{wsb:true}))});
    add('handover','Back up the server','Back up C:, D: and everything needed to restore the server.',{scene:'srv',cmd:'wbadmin start backup -backupTarget:E: -include:C:,D: -allCritical -quiet',target:'term-line',label:'wbadmin start backup … ↵',
      act:ps('wbadmin start backup -backupTarget:E: -include:C:,D: -allCritical -quiet','wbadmin 1.0 - Backup command-line tool\n(C) Copyright Microsoft Corporation. All rights reserved.\n\nRetrieving volume information...\nThis will back up (EFI System Partition),(C:),(D:) to E:.\nThe backup operation to E: is starting.\n…\n[[The backup operation successfully completed.]]'),
      ok:'If anything goes wrong later, the server can be restored to this working state.'});
    add('handover','Restart test','Restart the server and check every service starts by itself.',{scene:'srv',cmd:'Restart-Computer',target:'term-line',label:'Restart-Computer ↵',act:all(ps('Restart-Computer',''),put({mon:'lock2',app:'sm',smp:'dash'}),set('w',{pwTyped:false}))});
    add('handover','Press Ctrl+Alt+Delete','',{scene:'srv',target:'key-cad',label:'Ctrl + Alt + Del',act:put({mon:'pw'})});
    add('handover','Sign in','Sign in as OPISINA\\Administrator.',{scene:'srv',target:'pw-field',label:'Password',act:s=>{ s.w=Object.assign({},s.w,{pwTyped:true}); s.mon='desk'; s.app='sm'; }});
    add('handover','All roles are green','AD DS, DHCP, DNS and File and Storage Services all started after the restart.',{scene:'srv',target:'sm-tiles',label:'Roles',act:s=>{},ok:'The server is ready for daily use.'});
    add('handover','Check the leases','Open DHCP › Address Leases: PC-01 and PC-02 have addresses from the server.',{scene:'srv',target:'tb-dhcp',label:'DHCP',act:put({app:'dhcp',dhcp:{scope:true,sel:'leases',leases:[['192.168.1.100','PC-01.ad.opisina.ph','11/22/2026 3:01:22 PM','DHCP','3c-7c-3f-a1-22-01'],['192.168.1.101','PC-02.ad.opisina.ph','11/22/2026 3:14:40 PM','DHCP','3c-7c-3f-a1-22-02']]}})});
  } else {
    C('handover','Back up the server','Archive the settings, the accounts, the Samba passwords and the shared and home folders.','sudo tar -czf /root/srv-01-backup.tar.gz /etc /var/lib/samba/private /srv/shares /home',"tar: Removing leading `/' from member names",{x:{ok:'Copy the archive to a USB drive or the NAS: a backup on the same server does not survive a dead disk.',tip:'The archive holds password hashes: keep it somewhere locked.'}});
    C('handover','Restart test','Restart the server and check every service starts by itself.','sudo reboot','Connection to 192.168.1.11 closed by remote host.',{after:put({sshOn:false})});
    add('handover','Connect again','After a minute, connect again.',{scene:'lap',where:'lap',cmd:'ssh sysadmin@192.168.1.11',target:'term-line',label:'ssh sysadmin@192.168.1.11 ↵',
      act:s=>{ s.ssh=s.ssh.concat([['PS C:\\Users\\tech> ','ssh sysadmin@192.168.1.11',"sysadmin@192.168.1.11's password:\nWelcome to Ubuntu 26.04 LTS (GNU/Linux x86_64)"]]); s.sshOn=true; }});
    C('handover','Are the services running?','','systemctl is-active named kea-dhcp4-server smbd cups','active\nactive\nactive\nactive',{x:{ok:'DNS, DHCP, file sharing and printing all started by themselves.'}});
    C('handover','Any errors?','','journalctl -b -p err','-- No entries --',{x:{ok:'A clean start: the server is ready for daily use.'}});
    C('handover','Who has an address?','Kea keeps its leases in a file.','sudo tail -n 2 /var/lib/kea/kea-leases4.csv','192.168.1.100,3c:7c:3f:a1:22:01,01:3c:7c:3f:a1:22:01,86400,1794726082,1,0,0,PC-01,0,,0\n192.168.1.101,3c:7c:3f:a1:22:02,01:3c:7c:3f:a1:22:02,86400,1794726880,1,0,0,PC-02,0,,0');
  }
  add('handover','The hand-over report','Everything set up, every test and the problem that was fixed, on one page for the office.',{scene:'doc',doc:'report',target:'rp-save',label:'Save report',act:put({reportSaved:true}),
    ok:'Give one copy to the office head and keep one with the server. Passwords are not written here: they go in the sealed password record.'});
  return b;
}
const CH_W=[
  {id:'ready',title:'Get the server ready',ends:'Plan read, server on a UPS and the switch, powered on and signed in.'},
  {id:'basics',title:'Name, address and update',ends:'SRV-01 at 192.168.1.11, Remote Desktop on, updated, clean event log, network working.'},
  {id:'adds',title:'Install Active Directory and DNS',ends:'SRV-01 is the domain controller of ad.opisina.ph, with DNS.'},
  {id:'dns',title:'Configure DNS',ends:'Records for PRN-01 and NAS-01, and forwarders for internet names.'},
  {id:'dhcp',title:'Configure DHCP',ends:'Router DHCP off; SRV-01 authorized with an active scope .100–.199.'},
  {id:'users',title:'Users and groups',ends:'OU Opisina, group Accounting, Ana and Ben with temporary passwords.'},
  {id:'folders',title:'Shared and home folders',ends:'Accounting share for the group only, private H: folders, access checked.'},
  {id:'printer',title:'Share the printer',ends:'PRN-01 shared from SRV-01 and listed in the directory.'},
  {id:'test',title:'Test from an office PC',ends:'Address, names, domain sign-in, folders and printing work; Ben is kept out.'},
  {id:'fix',title:'Respond to a problem',ends:'PC-02’s wrong DNS found and fixed.'},
  {id:'handover',title:'Pre-deployment and report',ends:'Backed up, restart-tested, and documented.'},
];
const CH_U=[
  {id:'ready',title:'Get the server ready',ends:'Plan read, server on a UPS and the switch, powered on and logged in.'},
  {id:'basics',title:'Name, address and update',ends:'srv-01 at 192.168.1.11, updated, clean boot, managed over SSH.'},
  {id:'users',title:'Users and groups',ends:'Group accounting, Ana and Ben with private home folders.'},
  {id:'dns',title:'Configure DNS (BIND)',ends:'Zone lan.opisina.ph and forwarders, answering the office only.'},
  {id:'dhcp',title:'Configure DHCP (Kea)',ends:'Router DHCP off; Kea hands out .100–.199.'},
  {id:'shares',title:'Shared and home folders (Samba)',ends:'Accounting for the group only, private home shares.'},
  {id:'printer',title:'Share the printer (CUPS)',ends:'PRN-01 shared from srv-01, test page printed.'},
  {id:'secure',title:'Firewall and security check',ends:'Only the needed ports are open; Ben is refused, Ana is allowed.'},
  {id:'test',title:'Test from an office PC',ends:'Address, names, folders and printing work from PC-01.'},
  {id:'fix',title:'Respond to a problem',ends:'PC-02’s wrong DNS found and fixed; Ben refused from a real PC.'},
  {id:'handover',title:'Pre-deployment and report',ends:'Backed up, restart-tested, and documented.'},
];
const APP={sm:'Server Manager',ps:'PowerShell',wu:'Windows Update',ev:'Event Viewer',arw:'Add Roles and Features Wizard',dcp:'AD DS Configuration Wizard',dhcppi:'DHCP post-install wizard',dhcp:'DHCP console',dns:'DNS Manager',aduc:'AD Users and Computers',exp:'File Explorer',set:'Settings'};
function where(s,b){
  if(b.scene==='doc') return ['Job sheet'];
  if(b.scene==='intro') return ['Materials table'];
  if(b.scene==='room') return ['Office','Server corner'];
  if(b.scene==='back') return ['Office','Behind the server'];
  if(b.scene==='lap') return ['Technician’s laptop'].concat(s.lap.app==='browser'?['Browser','Router 192.168.1.1']:s.lap.app==='term'?(s.sshOn?['SSH to srv-01']:['Terminal']).concat(s.lap.nano&&s.nano?['nano '+s.nano.file]:[]):[]);
  if(b.scene==='pc'){ const C=s.pc; return [C.dev].concat(C.mon!=='desk'?['Sign-in screen']:C.app==='cmd'?['Command Prompt']:C.app==='exp'?['File Explorer']:C.app==='set'?['Settings']:['Desktop']); }
  if(b.scene==='srv'){ if(s.track==='U') return ['SRV-01 console'].concat(s.mon==='nano'&&s.nano?['nano '+s.nano.file]:s.mon==='login'?['Login']:['Command line']);
    if(s.mon!=='desk') return ['SRV-01 console','Sign-in']; return ['SRV-01 console',APP[s.app]||'Desktop']; }
  return [];
}
const PH={'Power on the server':'tower server front power button','Into a battery outlet':'UPS battery backup outlets back','Install':'Add Roles and Features Wizard Active Directory Domain Services Windows Server 2025',
  'Promote the server':'Promote this server to a domain controller Windows Server 2025','Prerequisites check':'AD DS Configuration Wizard prerequisites check passed','Finish':'DHCP New Scope Wizard Windows Server',
  'Authorize the server':'DHCP post-install configuration wizard authorization','Disable inheritance':'Advanced Security Settings disable inheritance convert','View effective access':'Windows Effective Access tab',
  'Member of a domain':'Windows 11 join domain Computer Name Domain Changes','Try it safely':'netplan try Ubuntu server','The zone':'BIND named.conf.local zone','Check the zone':'named-checkzone OK',
  'Homes and Accounting':'smb.conf homes share valid users','Check the rules':'ufw status Ubuntu','Connect with SSH':'Windows terminal ssh first connection fingerprint'};
function withPhotos(list){ list.forEach(x=>{ if(!x.photo&&PH[x.t]) x.photo='q:'+PH[x.t]; }); return list; }
Demo.start({
  id:'s5', station:'Station 5', title:'Server Setup',
  tracks:{W:{name:'Windows Server 2025',chapters:CH_W,beats:withPhotos(make('W')),init:init('W')},U:{name:'Ubuntu Server 26.04 LTS',chapters:CH_U,beats:withPhotos(make('U')),init:init('U')}},
  where,
  render:S5Scenes.render,
  finishText:'You have set up user access, configured the network services, tested everything from real PCs, fixed a problem and documented the server for hand-over.',
});
})();
