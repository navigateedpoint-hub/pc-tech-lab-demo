/* Server Setup: the Ubuntu Server console of SRV-01 (text only) and the technician's laptop (router page and SSH). */
window.UbSrv=(function(){
const {t,abtn,field,radio,win,term,nano,taskbar,esc}=UI;
const prompt=s=>`sysadmin@${s.host||'ubuntu'}:~$ `;
/* the server's own screen */
function screen(s,b,o){
  const m=s.mon;
  if(m==='off') return `<div style="position:absolute;inset:0;background:#030405"></div>`;
  if(m==='login'){ const L=s.login||0;
    return `<div style="position:absolute;inset:0;background:#0C0C0C"></div><div style="position:absolute;left:12px;top:12px;font-family:var(--mono);font-size:.72rem;color:#E6E6E6;line-height:1.5">Ubuntu 26.04 LTS ${s.host||'ubuntu'} tty1<br><br>${s.host||'ubuntu'} login: ${t('ub-user',L>=1?'sysadmin':'<span style="border-bottom:1px dashed #888">sysadmin</span>')}<br>${L>=1?'Password: '+t('ub-pw',L>=2?'':'<span style="border-bottom:1px dashed #888">••••••••••</span>'):''}${L>=2?`<br><br>Welcome to Ubuntu 26.04 LTS (GNU/Linux x86_64)<br><br> * Documentation:  https://help.ubuntu.com<br> * Management:     https://landscape.canonical.com<br><br>  System load:  0.08              Processes:             142<br>  Usage of /:   3.1% of 438.9GB   Users logged in:       0<br>  Memory usage: 4%                IPv4 address for eno1: 192.168.1.37<br><br><span style="color:#8AE234">sysadmin@ubuntu:~$</span> _`:''}</div>`; }
  if(m==='nano'){ const N=s.nano; return nano(N.file,N.lines,{add:N.add||[],modified:N.modified,msg:N.msg,fs:N.fs}); }
  const pending=b&&b.cmd&&!o.done&&b.where!=='lap'?b.cmd:null;
  return term(s.con,pending,{curPrompt:prompt(s),idle:true,fs:s.conFs});
}
/* the technician's laptop: router page in a browser, or a terminal with SSH */
function lap(s,b,o){ const L=s.lap||{};
  let inner='';
  if(L.app==='browser'){ const R=s.router||{};
    const page=!L.logged?`<div style="max-width:300px;margin:40px auto;text-align:center"><div style="font-size:1.2rem;font-weight:700;margin-bottom:10px">Router login</div>${field('','Password','••••••••••••',{win11:true})}<div style="margin-top:10px">${abtn('r-login','Log in')}</div><div style="font-size:.75rem;color:#666;margin-top:8px">The admin password was changed in Station 4.</div></div>`:
      `<div style="display:grid;grid-template-columns:150px 1fr;gap:14px"><div style="line-height:2;font-size:.82rem">Status<br>Wireless<br><b style="color:#1D5B96">LAN / DHCP</b><br>Connected devices<br>System tools</div>
       <div><div style="font-size:1.1rem;font-weight:700;margin-bottom:8px">LAN settings</div>${field('','Router IP address','192.168.1.1')}${field('','Subnet mask','255.255.255.0')}
       <div style="margin-top:10px;font-weight:700">DHCP server</div><div data-t="r-dhcp" style="display:flex;gap:16px">${radio('','Enable',R.dhcp!==false)}${radio('','Disable',R.dhcp===false)}</div>
       ${R.dhcp!==false?`${field('','Start IP address','192.168.1.100')}${field('','End IP address','192.168.1.199')}`:'<div style="font-size:.8rem;color:#8A5300;background:#FFF4CE;padding:6px;border-radius:4px;margin:6px 0">Another device must hand out addresses on this network.</div>'}
       <div style="margin-top:10px">${R.saved?'<span style="color:#1C7F52;font-weight:700">✓ Saved</span>':abtn('r-save','Save')}</div></div></div>`;
    inner=win('Browser',`<div style="display:flex;gap:6px;align-items:center;padding:6px 8px;background:#F1F3F4;border-bottom:1px solid #ddd;font-size:.8rem"><span>← → ⟳</span><div style="flex:1;background:#fff;border:1px solid #ccc;border-radius:14px;padding:2px 10px">http://192.168.1.1</div></div><div style="padding:14px 18px;font-size:.88rem">${page}</div>`,{l:'5%',t:'5%',w:'88%',h:'78%'}); }
  if(L.app==='term'){ const pending=b&&b.cmd&&!o.done&&b.where==='lap'?b.cmd:null;
    const N=s.nano;
    inner=win(s.sshOn?'sysadmin@srv-01: ~ (SSH)':'Terminal',L.nano&&N?nano(N.file,N.lines,{add:N.add||[],modified:N.modified,msg:N.msg,fs:N.fs}):term(s.ssh,pending,{curPrompt:s.sshOn?prompt(s):'PS C:\\Users\\tech> ',idle:true}),{l:'5%',t:'5%',w:'88%',h:'78%'}); }
  inner+=taskbar([['app-browser','Browser',L.app==='browser'],['app-term','Terminal',L.app==='term']]);
  return inner;
}
return {screen,lap,prompt};
})();
