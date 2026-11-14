/* Station 4 guided demo: Network Setup of a small office. */
(function(){
const N=window.NET, E=window.NetEngine;
const PROMPT='Microsoft Windows [Version 10.0.26200]\n(c) Microsoft Corporation. All rights reserved.\n';
const link=(s,a,ap,b,bp)=>{ E.setState(s); E.H.addLink(a,ap,b,bp,'cat6',Math.max(2,E.distanceM(s.dev[a],s.dev[b])+1)); s.sel=null; };
const run=(s,id,cmd,out)=>{ E.setState(s); E.compute(); s.term=s.term||{}; s.term[id]=(s.term[id]||PROMPT)+'\nC:\\Users\\student>'+cmd+'\n'+out(); };
const ipcfg=id=>()=>E.ipconfig(id,false);
const ping=(id,t)=>()=>E.pingCmd(id,t).text;
function make(){
  const b=[]; const add=(ch,t,say,o={})=>b.push(Object.assign({ch,t,say},o));

  /* ===== 1. Short lessons ===== */
  const L=N.lessons;
  const lessonSay=[
    'The <b>WAN</b> side is the link to your internet provider: fiber into the ONT. The <b>LAN</b> is everything inside the office. The router sits between the two.',
    'The ONT converts fiber to Ethernet. The router joins your LAN to the internet and hands out addresses. A switch adds ports. An access point adds Wi-Fi.',
    'Cat5e and Cat6 both carry 1 Gbps to 100 m; Cat6A carries 10 Gbps to 100 m. Past 100 m of copper you need fiber or a switch in between.',
    'An IP address is like a house number. The mask says which part is the street. The gateway is the exit from the street, and DNS is the phone book for names.',
    '<b>ipconfig</b> shows the address, mask and gateway. <b>ping</b> tests a path. Test in order: the gateway, then 8.8.8.8, then a name like google.com.',
    'Never use Open or WEP. WPA2 is the minimum and WPA2/WPA3 is best, with a passphrase of at least 12 characters and a changed admin password.'];
  L.forEach((l,i)=>{
    add('learn',l.title,lessonSay[i],{scene:'lesson',lesson:i});
    add('learn','Question: '+l.title,'Choose the right answer.',{scene:'quiz',lesson:i,target:'ans'+l.q.c,label:'The right answer',act:s=>{},ok:l.q.why});
  });

  /* ===== 2. Cable the office ===== */
  add('physical','Meet the equipment','Open each device to see what it does and what it looks like.',{scene:'intro',explore:true,items:[['ont','Fiber modem (ONT)'],['router','Wi-Fi router'],['switch','8-port switch'],['pc','Desktop PCs'],['printer','Network printer'],['nas','NAS file server'],['laptop','Laptop'],['cb-cat6','Cat6 patch cables']]});
  add('physical','The office','An ONT from the ISP, a Wi-Fi router, an 8-port switch, two PCs, a printer, a NAS and a laptop. Nothing is cabled yet.',{scene:'plan'});
  add('physical','Choose the patch cable','Every run here is well under 100 m and every port is gigabit copper.',
    {scene:'pick',target:'cat6',label:'Choose this cable',options:[
      {id:'cat6',art:'cb-cat6',name:'Cat6 UTP patch cable',sub:'1 Gbps · 100 m',good:true,verdict:'Right for gigabit desks'},
      {id:'fiber',art:'cb-fiber-lc',name:'Single-mode fiber',sub:'Needs SFP ports',good:false,verdict:'These are copper RJ45 ports'},
      {id:'outdoor',art:'cb-outdoor',name:'Outdoor Cat6',sub:'UV and water resistant',good:false,verdict:'Only needed outdoors'}],
      act:s=>{s.cable='cat6';},ok:'Cat6 patch cables, like the ones made at Station 3.',photo:'cb-cat6'});
  add('physical','The back of the ONT and the router','The ONT’s yellow LAN ports hand the internet on. The router’s blue WAN port is the only one that takes it in.',{scene:'panel',a:'ONT',b:'RTR',photo:'router'});
  add('physical','Plug into the ONT','Plug one end of the cable into LAN1 on the ONT.',
    {scene:'panel',a:'ONT',b:'RTR',target:'css:[data-dev="ONT"][data-port="LAN1"]',label:'ONT LAN1',act:s=>{s.sel={dev:'ONT',port:'LAN1'};},ok:'The fiber stays in the green optical port. Never look into a fiber end.'});
  add('physical','Plug into the router’s WAN port','Plug the other end into the blue WAN port of the router.',
    {scene:'panel',a:'ONT',b:'RTR',target:'css:[data-dev="RTR"][data-port="WAN"]',label:'Router WAN (blue)',act:s=>link(s,'ONT','LAN1','RTR','WAN'),ok:'The internet now reaches the router.',
     tip:'A LAN port here is the most common small-office mistake: local devices still work, but nobody gets internet.'});
  add('physical','Check the router lights','The Internet light is on: the router has a working WAN connection.',{scene:'status',dev:'RTR'});
  add('physical','Router to switch','Plug a cable into a yellow LAN port on the router.',
    {scene:'panel',a:'RTR',b:'SW1',target:'css:[data-dev="RTR"][data-port="LAN1"]',label:'Router LAN1',act:s=>{s.sel={dev:'RTR',port:'LAN1'};},ok:'LAN ports face your own network.'});
  add('physical','Into switch port 1','Plug the other end into port 1 of the switch.',
    {scene:'panel',a:'RTR',b:'SW1',target:'css:[data-dev="SW1"][data-port="P1"]',label:'Switch port 1',act:s=>link(s,'RTR','LAN1','SW1','P1'),ok:'The switch now extends the router’s LAN: eight more ports.',
     tip:'Never connect two ports of the same switch to each other. It creates a loop that freezes the whole network.'});
  [['PC-01','Ethernet','P2','The network port is on the rear I/O panel, next to the USB ports.'],['PC-02','Ethernet','P3','Same as PC-01.'],
   ['PRN-01','Ethernet','P4','Use the LAN port, not USB, so every PC can print.'],['NAS-01','LAN1','P5','The NAS has two LAN ports. Use LAN1.']].forEach(([id,port,sp,why])=>{
    add('physical',`Connect ${id}`,`Plug ${id} into switch port ${sp.slice(1)}. ${why}`,
      {scene:'panel',a:id,b:'SW1',target:`css:[data-dev="${id}"][data-port="${port}"]`,label:`${id} ${port}`,act:s=>link(s,id,port,'SW1',sp),
       ok:`${id} is linked to switch port ${sp.slice(1)}. The cable follows the walls, so it is longer than the straight line on the plan.`,photo:({'PC-01':'pc','PC-02':'pc','PRN-01':'printer','NAS-01':'nas'})[id]}); });
  add('physical','Everything is linked','Green lines are working links. The moving dots show traffic: faster dots mean a faster link.',{scene:'plan',
    tip:'The printer’s link runs at only 100 Mbps: a link runs at the speed of its slower end.'});
  add('physical','The switch lights','One light per port: steady means a link, blinking means traffic.',{scene:'status',dev:'SW1',photo:'switch'});

  /* ===== 3. Addresses ===== */
  add('address','Open PC-01','Check what the router’s DHCP server gave the PCs.',{scene:'plan',hl:['PC-01'],target:'PC-01',label:'PC-01',act:s=>{s.app=null;},ok:'PC-01’s screen opens.'});
  add('address','Open the Command Prompt','Click Command Prompt on the taskbar.',{scene:'screen',dev:'PC-01',target:'tb-cmd',label:'Command Prompt',act:s=>{s.app='cmd';}});
  add('address','Run ipconfig','Type <b>ipconfig</b> and press Enter.',{scene:'screen',dev:'PC-01',typing:'ipconfig',target:'cmdline',label:'ipconfig ↵',act:s=>run(s,'PC-01','ipconfig',ipcfg('PC-01')),
    ok:'An address from the pool 192.168.1.100–199, mask 255.255.255.0, gateway 192.168.1.1: DHCP works.'});
  add('address','Why the printer needs a fixed address','PCs can change address; nobody minds. A printer that moves stops every PC that has it installed. Fixed addresses go in .10–.49, away from the DHCP pool.',
    {scene:'plan',hl:['PRN-01','NAS-01']});
  add('address','Open the printer','Network settings are on the printer’s own control panel.',{scene:'plan',hl:['PRN-01'],target:'PRN-01',label:'PRN-01',act:s=>{}});
  const lcdSteps=[['ip','IP address','192.168.1.20','Outside the DHCP pool, inside the fixed block.'],['mask','Subnet mask','255.255.255.0','Same street as everyone else.'],['gw','Gateway','192.168.1.1','The router: the exit to the internet.'],['dns','DNS','192.168.1.1','The router forwards name lookups.']];
  lcdSteps.forEach(([k,l,v,why])=>add('address',`Printer: ${l}`,`Enter <b>${v}</b>.`,{scene:'lcd',dev:'PRN-01',target:'f-'+k,label:l,act:s=>{s.lcd=s.lcd||{}; s.lcd['PRN-01']=Object.assign({},s.lcd['PRN-01'],{[k]:v});},ok:why}));
  add('address','Apply','Save the settings.',{scene:'lcd',dev:'PRN-01',target:'f-apply',label:'Apply',act:s=>{Object.assign(s.dev['PRN-01'].cfg,{mode:'static',ip:'192.168.1.20',mask:'255.255.255.0',gw:'192.168.1.1',dns:'192.168.1.1'});},
    ok:'The printer now always answers at 192.168.1.20. Print a configuration page so the address is on paper.',photo:'printer'});
  add('address','The NAS too','Open the NAS and give it 192.168.1.10 with the same mask, gateway and DNS.',{scene:'plan',hl:['NAS-01'],target:'NAS-01',label:'NAS-01',act:s=>{s.lcd=s.lcd||{}; s.lcd['NAS-01']={ip:'192.168.1.10',mask:'255.255.255.0',gw:'192.168.1.1',dns:'192.168.1.1'};}});
  add('address','Apply on the NAS','The fields are filled in. Apply them.',{scene:'lcd',dev:'NAS-01',target:'f-apply',label:'Apply',act:s=>{Object.assign(s.dev['NAS-01'].cfg,{mode:'static',ip:'192.168.1.10',mask:'255.255.255.0',gw:'192.168.1.1',dns:'192.168.1.1'});},
    ok:'Shared folders and backups keep working because the address never moves.',photo:'nas'});

  /* ===== 4. Secure the Wi-Fi ===== */
  add('wifi','The Wi-Fi is open','The router’s Wi-Fi came with no password, and its admin password is still the default on the sticker. Fix both from a PC.',
    {scene:'plan',hl:['RTR','PC-01']});
  add('wifi','Open PC-01','Routers are configured from a browser on a PC that is already on the network.',{scene:'plan',hl:['PC-01'],target:'PC-01',label:'PC-01',act:s=>{s.app=null;}});
  add('wifi','Open the browser','Click Browser on the taskbar.',{scene:'screen',dev:'PC-01',target:'tb-browser',label:'Browser',act:s=>{s.app='browser'; s.url='';}});
  add('wifi','Go to the router','Type the router’s address, <b>192.168.1.1</b>, in the address bar.',{scene:'screen',dev:'PC-01',typingUrl:'192.168.1.1',target:'urlbar',label:'192.168.1.1 ↵',act:s=>{s.url='192.168.1.1';},ok:'The router’s login page opens.'});
  add('wifi','Type the default password','The default password is printed on the label under the router.',{scene:'screen',dev:'PC-01',target:'r-pass',label:'Password',act:s=>{s.passTyped=true;}});
  add('wifi','Log in','Click Log in.',{scene:'screen',dev:'PC-01',target:'r-login',label:'Log in',act:s=>{s.logged=true; s.page='status';},ok:'The status page shows the Wi-Fi as Open and the admin password as default.'});
  add('wifi','Wireless settings','Open the Wireless page.',{scene:'screen',dev:'PC-01',target:'rp-wireless',label:'Wireless',act:s=>{s.page='wireless';}});
  add('wifi','Choose the security','Set Security to <b>WPA2/WPA3</b>.',{scene:'screen',dev:'PC-01',target:'w-sec',label:'Security',act:s=>{s.form=Object.assign({},s.form,{sec:'WPA2/WPA3'});},ok:'WPA2/WPA3 mixed mode: strong, and older devices can still join.'});
  add('wifi','Set the passphrase','Type a passphrase of at least 12 characters: <b>Opisina-2026!</b>',{scene:'screen',dev:'PC-01',target:'w-pass',label:'Passphrase',act:s=>{s.form=Object.assign({},s.form,{pass:'Opisina-2026!'});}});
  add('wifi','Save','Click Save.',{scene:'screen',dev:'PC-01',target:'w-save',label:'Save',act:s=>{Object.assign(s.dev.RTR.cfg,{security:'WPA2/WPA3',pass:'Opisina-2026!'}); s.form={};},ok:'Every Wi-Fi device must now use the passphrase.'});
  add('wifi','Change the admin password','Open System tools.',{scene:'screen',dev:'PC-01',target:'rp-system',label:'System tools',act:s=>{s.page='system';}});
  add('wifi','New admin password','Type a new admin password, different from the Wi-Fi passphrase.',{scene:'screen',dev:'PC-01',target:'s-admin',label:'New password',act:s=>{s.form=Object.assign({},s.form,{admin:true});}});
  add('wifi','Save the admin password','Click Save.',{scene:'screen',dev:'PC-01',target:'s-save',label:'Save',act:s=>{Object.assign(s.dev.RTR.cfg,{adminChanged:true,adminPass:'(set)'}); s.form={};},
    ok:'Nobody on the Wi-Fi can take over the router with the sticker password any more.',tip:'Record the SSID, passphrase and admin password in the handover document.'});
  add('wifi','Connect the laptop','Now check the Wi-Fi works. Open the laptop.',{scene:'plan',hl:['LAP-01'],target:'LAP-01',label:'LAP-01',act:s=>{s.app=null; s.wifiOpen=false;}});
  add('wifi','Open the Wi-Fi list','Click the Wi-Fi icon on the taskbar.',{scene:'screen',dev:'LAP-01',target:'tb-wifi',label:'Wi-Fi',act:s=>{s.wifiOpen=true;}});
  add('wifi','Choose the office network','Click OFFICE-WIFI.',{scene:'screen',dev:'LAP-01',target:'net-0',label:'OFFICE-WIFI',act:s=>{s.wifiPick=true;}});
  add('wifi','Enter the passphrase','Type <b>Opisina-2026!</b>',{scene:'screen',dev:'LAP-01',target:'wifi-key',label:'Security key',act:s=>{s.wifiKey=true;}});
  add('wifi','Connect','Click Connect.',{scene:'screen',dev:'LAP-01',target:'wifi-connect',label:'Connect',act:s=>{s.dev['LAP-01'].join={ssid:'OFFICE-WIFI',pass:'Opisina-2026!'};},ok:'Connected, and the laptop got an address from the same DHCP pool.'});

  /* ===== 5. Test ===== */
  add('testing','Test from PC-01','Test in order: local first, then the internet.',{scene:'plan',hl:['PC-01'],target:'PC-01',label:'PC-01',act:s=>{s.app='cmd'; s.wifiOpen=false;}});
  add('testing','Ping the printer','Type <b>ping 192.168.1.20</b>.',{scene:'screen',dev:'PC-01',typing:'ping 192.168.1.20',target:'cmdline',label:'ping 192.168.1.20 ↵',act:s=>run(s,'PC-01','ping 192.168.1.20',ping('PC-01','192.168.1.20')),
    ok:'Four replies: PC, cable, switch and printer all work. No router was involved.'});
  add('testing','Ping google.com','Type <b>ping google.com</b>.',{scene:'screen',dev:'PC-01',typing:'ping google.com',target:'cmdline',label:'ping google.com ↵',act:s=>run(s,'PC-01','ping google.com',ping('PC-01','google.com')),
    ok:'The name was found (DNS works) and replies came back through the router (gateway and internet work).',
    tip:'If a name fails but ping 8.8.8.8 replies, the problem is DNS.'});
  add('testing','Run a speed test','Click Speed test on the taskbar.',{scene:'screen',dev:'PC-01',target:'tb-speed',label:'Speed test',act:s=>{s.app='speed';}});
  add('testing','Start the test','Click Start test.',{scene:'screen',dev:'PC-01',target:'speed-go',label:'Start test',act:s=>{E.setState(s); E.compute(); s.speed=E.speedTest('PC-01');},
    ok:'About what the plan promises. Test wired first; Wi-Fi is always slower.'});

  /* ===== 6. Document ===== */
  add('document','Connected devices','In the router page, open Connected devices.',{scene:'screen',dev:'PC-01',target:'tb-browser',label:'Browser',act:s=>{s.app='browser'; s.page='clients';},
    ok:'Every device is listed with its address and MAC. Look out for anything you do not recognise.'});
  add('document','Check the list','PC-01, PC-02, the printer, the NAS and the laptop are all here.',{scene:'screen',dev:'PC-01'});
  add('document','Save the network log','The log records every device, its address and where it is plugged in.',{scene:'log',target:'log-save',label:'Save log',act:s=>{s.logSaved=true;},
    ok:'The job is documented. The next technician will thank you.'});
  return b;
}
function where(s,b){
  switch(b.scene){
    case 'lesson': return ['Lesson '+(b.lesson+1)];
    case 'quiz': return ['Lesson '+(b.lesson+1),'Question'];
    case 'intro': return ['Equipment table'];
    case 'pick': return ['Equipment table','Choose'];
    case 'plan': return ['Office floor plan'];
    case 'panel': return ['Back panels',b.a+' and '+b.b];
    case 'status': return ['Office floor plan',b.dev,'Front lights'];
    case 'screen': { const app={cmd:'Command Prompt',browser:'Browser',speed:'Speed test',net:'Network settings'}[s.app];
      const pg=s.app==='browser'&&s.url==='192.168.1.1'?(s.logged?['Router page',{status:'Status',wireless:'Wireless',lan:'LAN & DHCP',clients:'Connected devices',system:'System tools'}[s.page||'status']]:['Router login']):[];
      return [b.dev+' screen'].concat(app?[app]:['Desktop'],pg,s.wifiOpen&&b.dev==='LAP-01'?['Wi-Fi list']:[]); }
    case 'lcd': return [b.dev,'Front-panel network settings'];
    case 'log': return ['Network log'];
  }
  return [];
}
const INSTALLED={'Plug into the router’s WAN port':'ONT LAN port connected to router WAN port','Check the router lights':'wifi router front status lights internet','Into switch port 1':'router LAN port connected to network switch',
  'Connect PC-01':'PC ethernet cable plugged into motherboard rear I/O','Connect PRN-01':'printer ethernet port cable connected','Connect NAS-01':'Synology NAS rear LAN port cable','The switch lights':'network switch front port lights',
  'Run ipconfig':'ipconfig output Windows 11 command prompt','Apply':'printer control panel network settings static IP','Log in':'router login page 192.168.1.1','Choose the security':'router wireless security WPA2 WPA3 settings',
  'Connect':'Windows 11 wifi connect network security key','Ping google.com':'ping google.com command prompt reply','Start the test':'internet speed test result','Connected devices':'router connected devices DHCP client list'};
function withPhotos(list){ list.forEach(x=>{ if(INSTALLED[x.t]) x.photo='q:'+INSTALLED[x.t]; }); return list; }
const CH=[
  {id:'learn',title:'Short lessons',ends:'You can name each device, read an IP address and say what the gateway and DNS do.'},
  {id:'physical',title:'Cable the office',ends:'ONT to router WAN, router to switch, and every wired device connected.'},
  {id:'address',title:'Addresses',ends:'PCs use DHCP; the printer and NAS have fixed addresses outside the pool.'},
  {id:'wifi',title:'Secure the Wi-Fi',ends:'WPA2/WPA3 with a strong passphrase, admin password changed, laptop connected.'},
  {id:'testing',title:'Test the network',ends:'Ping and a speed test prove the network works.'},
  {id:'document',title:'Document and hand over',ends:'The device list is checked and the network log is saved.'},
];
Demo.start({
  id:'s4', station:'Station 4', title:'Network Setup',
  tracks:{office:{name:'Small office network',chapters:CH,beats:withPhotos(make()),init:()=>{ E.loadScenario('S1'); const s=E.getS(); Object.assign(s,{term:{},app:null,sel:null,lcd:{},form:{}}); return s; }}},
  render:S4Scenes.render,
  where,
  finishText:'You have set up a complete small-office network: cabled, addressed, secured, tested and documented.',
  next:{href:'../3-Set-up-Computer-Servers/index.html',label:'Next: Set-up Computer Servers'},
});
})();
