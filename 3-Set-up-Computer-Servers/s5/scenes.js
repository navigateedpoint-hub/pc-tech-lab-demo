/* Server Setup: chooses the picture for each step, and holds the job-sheet pages (the plan, the problem report and the hand-over report). */
window.S5Scenes=(function(){
const esc=Demo.esc, {t,abtn,monFrame,lapFrame}=UI;
const FIT=(w,h)=>`<div data-fit="${w}" style="width:100%;max-width:${w}px;display:flex;justify-content:center">${h}</div>`;
const sheet=(title,body,o={})=>`<div class="s5-sheet" data-fith><div class="s5-head"><span class="s5-tag">${o.tag||'Job sheet'}</span><h2>${title}</h2></div>${body}</div>`;
const tbl=(cols,rows)=>`<table class="s5-t"><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;

function job(s){ const W=s.track!=='U';
  return sheet('What SRV-01 will do',`<p>The office from Station 4 is getting its first server. Every job below is one chapter of this demo.</p>`+
    tbl(['Job','Why the office needs it',W?'Windows Server 2025':'Ubuntu Server 26.04 LTS'],[
      ['Accounts and sign-in','Each person has their own account and password; access follows the person',W?'Active Directory (AD DS)':'Linux users and groups'],
      ['Names (DNS)','PCs find the server and printer by name',W?'DNS Server':'BIND 9'],
      ['Addresses (DHCP)','PCs get correct addresses automatically',W?'DHCP Server':'Kea DHCP'],
      ['Shared and personal folders','Team files in one place; a private folder for each person',W?'File sharing + NTFS permissions':'Samba'],
      ['Shared printer','Everyone prints to one managed queue',W?'Printer sharing':'CUPS'],
      ['Remote administration','The technician can manage the server without sitting at it',W?'Remote Desktop':'SSH']])+
    `<p class="s5-note">The demo follows the three parts of the competency <b>Set-up Computer Servers</b>: set up user access, configure network services, and perform testing, documentation and pre-deployment practices.</p>`); }
function plan(s){ const W=s.track!=='U', dom=W?'ad.opisina.ph':'lan.opisina.ph';
  return sheet('Address and naming plan',tbl(['Address','Device','How it gets the address'],[
      ['192.168.1.1','Router (gateway)','Fixed'],['192.168.1.10','NAS-01','Fixed (Station 4)'],['<b>192.168.1.11</b>','<b>SRV-01 (this server)</b>','<b>Fixed: set in chapter 2</b>'],['192.168.1.20','PRN-01 printer','Fixed (Station 4)'],['192.168.1.100 – .199','PCs and laptops',W?'DHCP from SRV-01':'DHCP from SRV-01 (Kea)']])+
    `<div class="s5-two"><div><h3>Names</h3>${tbl(['Item','Value'],[[W?'Domain':'DNS zone',`<b>${dom}</b>`],W?['Short domain name','OPISINA']:['Server name','srv-01'],['Server','SRV-01'],['Printer','PRN-01']])}</div>
     <div><h3>People and access</h3>${tbl(['Person','Account','Accounting folder'],[['Ana Reyes (accounting)','areyes','Read and write'],['Ben Cruz (sales)','bcruz','No access']])}<p class="s5-note">Each person also gets a private home folder (drive H:).</p></div></div>`+
    `<p class="s5-note">Use a name under a domain the office owns (opisina.ph). Avoid <b>.local</b>: it clashes with the way printers and phones discover each other.</p>`); }
function complaint(s){ const W=s.track!=='U';
  return sheet('A call from the office',`<div class="s5-call"><b>Mika (PC-02):</b> “${W?'I tried to add PC-02 to the new domain, but it says a domain controller could not be contacted.':'PC-02 cannot open \\\\SRV-01. It says the network path was not found.'} PC-01 works fine.”</div>
    <p>An unplanned event: follow the usual procedure. Reproduce it, find the cause, fix it, test again, and write it down.</p><div style="margin-top:10px">${abtn('go-pc02','Go to PC-02')}</div>`,{tag:'Problem report'}); }
function report(s){ const W=s.track!=='U', dom=W?'ad.opisina.ph':'lan.opisina.ph', saved=s.reportSaved;
  const rows=W?[['Server','SRV-01 · Windows Server 2025 Standard · 192.168.1.11/24 · gateway 192.168.1.1'],['Domain','ad.opisina.ph (OPISINA) · forest and domain level Windows Server 2025 · DSRM password in the sealed envelope · time from pool.ntp.org'],
      ['DNS','Zone ad.opisina.ph · host records PRN-01 (.20), NAS-01 (.10) · forwarders 1.1.1.1, 8.8.8.8'],['DHCP','Authorized · scope Office LAN 192.168.1.100–.199 · lease 8 days · gateway .1 · DNS .11 · router DHCP turned off just before activation'],
      ['Users and groups','OU Opisina · group Accounting (Ana Reyes) · Ben Cruz · must change password at first sign-in'],['Folders','\\\\SRV-01\\Accounting: Accounting = Modify, Users removed · \\\\SRV-01\\Home$: Home locked down, H: per user'],
      ['Printer','PRN-01 shared from SRV-01, listed in the directory'],['Remote access','Remote Desktop on, administrators only, NLA'],['Backup','Windows Server Backup to USB drive E:, completed 11/14/2026'],
      ['Tests passed','Clean event log · ping · DHCP lease on PC-01 · name lookup · domain join · H: drive · Accounting share · printing · Ben denied · restart test'],
      ['Problems','PC-02 could not join: static DNS 8.8.8.8. Fixed: DNS set to automatic.']]:
    [['Server','srv-01 · Ubuntu Server 26.04 LTS · 192.168.1.11/24 · gateway 192.168.1.1 · updates installed'],['Accounts','sysadmin (admin, sudo) · areyes (group accounting) · bcruz · users typed their own passwords'],
      ['DNS','BIND 9 · zone lan.opisina.ph · records srv-01, nas-01, prn-01, router · forwarders 1.1.1.1, 8.8.8.8 · LAN only'],['DHCP','Kea · 192.168.1.100–.199 · lease 24 h · gateway .1 · DNS .11 · router DHCP turned off'],
      ['Samba shares','[accounting] /srv/shares/accounting (2770, group accounting) · [homes] private per user'],['Printer','CUPS queue PRN-01 (IPP Everywhere), shared on the LAN'],
      ['Firewall','ufw on: OpenSSH, Samba, DNS 53, DHCP 67/udp, IPP 631/tcp, mDNS 5353/udp'],['Remote access','SSH, password login from the LAN'],['Backup','/root/srv-01-backup.tar.gz (/etc, Samba passwords, shares, home folders), copied off the server and kept locked'],
      ['Tests passed','No boot errors · ping · DNS lookups · DHCP lease on PC-01 · Accounting share · H: drive · printing · Ben denied · restart test'],
      ['Problems','PC-02 could not open \\\\SRV-01: static DNS 8.8.8.8. Fixed: DNS set to automatic.']];
  return sheet('Server hand-over report',tbl(['Item','Details'],rows)+`<div class="s5-sign"><span>Prepared by: <b>Technician</b></span><span>Checked by: <b>Office head</b></span><span>Date: 11/14/2026</span></div>
    <div style="margin-top:10px">${saved?'<span style="color:#1C7F52;font-weight:700">✓ Report saved and printed</span>':abtn('rp-save','Save report')}</div>`,{tag:'Documentation'}); }

const KEYS_CAD=[['Ctrl + Alt + Del','key-cad']];
function render(s,b,o){
  switch(b.scene){
    case 'room': return RoomScene.front(s);
    case 'back': return RoomScene.back(s);
    case 'srv': { const W=s.track!=='U';
      let inner;
      if(W){ const s2=Object.assign({},s,{psPending:b.cmd&&!o.done?b.cmd:null}); inner=WinSrv.screen(s2); }
      else inner=UbSrv.screen(s,b,o);
      return FIT(1000,monFrame(inner,{keys:W&&(s.mon==='lock'||s.mon==='lock2')?KEYS_CAD:null,caption:'SRV-01 · server console'})); }
    case 'pc': { const s2=Object.assign({},s,{pc:Object.assign({},s.pc,{pending:b.cmd&&!o.done?b.cmd:null})});
      return FIT(1000,monFrame(Client.screen(s2),{caption:(s.pc.dev||'PC-01')+' · office PC (Windows 11 Pro)'})); }
    case 'lap': return FIT(1000,lapFrame(UbSrv.lap(s,b,o)));
    case 'doc': return ({job,plan,complaint,report})[b.doc](s);
    case 'intro': return Common.intro(s,b);
  }
  return 'Missing scene '+esc(b.scene);
}
return {render};
})();
