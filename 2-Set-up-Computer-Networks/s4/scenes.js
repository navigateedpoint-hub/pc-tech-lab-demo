/* Station 4 demo scenes: lessons, the office floor plan, back panels, device screens, router pages. */
window.S4Scenes=(function(){
const A=window.Art, N=window.NET, E=window.NetEngine, SC=window.NetScene, C=window.Common, esc=Demo.esc;
const M=s=>{ E.setState(s); E.compute(); return E.getM(); };
const thumb=(t,st)=>A.thumb(t,{state:Object.assign({on:true},st||{})});
const card=(inner,style='')=>`<div style="background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px;${style}">${inner}</div>`;

/* ---------- lessons: one picture each ---------- */
function lesson(s,b){
  const i=b.lesson;
  const dev=(t,l,sub,st)=>`<div style="text-align:center;min-width:0"><div style="height:92px;display:grid;place-items:center">${thumb(t,st).replace('<svg ','<svg style="width:100%;height:92px" ')}</div><div style="font-weight:700">${l}</div>${sub?`<div style="font-size:.85rem;color:var(--ink-2)">${sub}</div>`:''}</div>`;
  const arrow='<div style="font-size:1.6rem;color:var(--ink-2);align-self:center">→</div>';
  if(i===0) return `<div style="width:100%;max-width:980px;display:flex;flex-direction:column;gap:14px">
    <div style="display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr auto 1fr;gap:6px;align-items:start">
     ${dev('cb-fiber-lc','Fiber','from the ISP')}${arrow}${dev('ont','ONT','fiber to Ethernet')}${arrow}${dev('router','Router','WAN in, LAN out')}${arrow}${dev('switch','Switch','more LAN ports')}${arrow}${dev('pc','PCs','and printers')}</div>
    <div style="display:grid;grid-template-columns:2fr 3fr;gap:10px;text-align:center;font-weight:700">
     <div style="padding:8px;border-radius:10px;background:#E3F0FB;color:#1D5B96;border:2px solid #1D5B96">WAN: the provider’s side</div>
     <div style="padding:8px;border-radius:10px;background:#FFF4CC;color:#6B5200;border:2px solid #C9A227">LAN: your office</div></div></div>`;
  if(i===1) return `<div class="sc-grid" style="grid-template-columns:repeat(4,minmax(0,1fr));max-width:1000px">
    ${[['ont','ONT','Turns the fiber signal into Ethernet.'],['router','Router','Joins LAN and internet. Runs DHCP, DNS forwarding and Wi-Fi.'],['switch','Switch','Connects wired devices. No settings.'],['ap','Access point','Adds Wi-Fi coverage, powered over the cable.']]
      .map(([t,l,sub])=>`<div class="sc-card">${thumb(t)}<div class="nm">${l}</div><div class="sb">${sub}</div></div>`).join('')}</div>`;
  if(i===2) return `<div style="width:100%;max-width:900px">`+card(`<table style="width:100%;border-collapse:collapse;font-size:1.05rem">
     <tr style="text-align:left;color:var(--ink-2)"><th></th><th>Cable</th><th>Speed</th><th>Distance</th></tr>
     ${[['cb-cat5e','Cat5e','1 Gbps','100 m'],['cb-cat6','Cat6','1 Gbps (10 Gbps)','100 m (55 m)'],['cb-cat6a','Cat6A','10 Gbps','100 m'],['cb-fiber-lc','Fiber','1–100 Gbps','kilometres']]
      .map(([t,l,sp,d])=>`<tr style="border-top:1px solid var(--line)"><td style="width:90px">${thumb(t).replace('<svg ','<svg style="width:80px;height:56px" ')}</td><td><b>${l}</b></td><td>${sp}</td><td>${d}</td></tr>`).join('')}</table>
     <p style="margin:.6rem 0 0;color:var(--ink-2)">A link runs at the speed of its slowest part: each port, the cable and its length.</p>`)+`</div>`;
  if(i===3) return `<div style="width:100%;max-width:900px;display:flex;flex-direction:column;gap:12px">`+card(`
     <div style="font-family:var(--mono);font-size:clamp(1.6rem,4vw,2.8rem);font-weight:700;text-align:center"><span style="background:#E3F0FB;color:#1D5B96;padding:0 .3rem;border-radius:6px">192.168.1</span>.<span style="background:#FFF4CC;color:#6B5200;padding:0 .3rem;border-radius:6px">20</span></div>
     <div style="display:grid;grid-template-columns:1fr 1fr;text-align:center;margin-top:.4rem"><div style="color:#1D5B96;font-weight:700">the street (network)</div><div style="color:#6B5200;font-weight:700">the house (device)</div></div>`)+
     `<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px">${[['Subnet mask','255.255.255.0','which part is the street'],['Default gateway','192.168.1.1','the exit: the router'],['DNS','192.168.1.1','the phone book for names'],['DHCP','automatic','hands out free numbers']].map(([a,v,d])=>card(`<div style="font-size:.85rem;color:var(--ink-2)">${a}</div><div style="font-family:var(--mono);font-weight:700">${v}</div><div style="font-size:.9rem">${d}</div>`,'padding:10px')).join('')}</div>
     <div style="text-align:center;color:var(--ink-2)">169.254.x.x means DHCP did not answer.</div></div>`;
  if(i===4) return `<pre style="margin:0;background:#0C0C0C;color:#E6E6E6;font-family:var(--mono);font-size:clamp(.7rem,1.3vw,.95rem);padding:16px 18px;border-radius:10px;width:100%;max-width:900px;white-space:pre-wrap">C:\\Users\\student&gt;ipconfig
   IPv4 Address. . . . . . . . . . . : <span style="background:#264F2A">192.168.1.100</span>
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : <span style="background:#264F2A">192.168.1.1</span>

C:\\Users\\student&gt;ping 192.168.1.1
Reply from 192.168.1.1: bytes=32 time&lt;1ms TTL=64      <span style="color:#7FE0AE">← gateway OK</span>
C:\\Users\\student&gt;ping 8.8.8.8
Reply from 8.8.8.8: bytes=32 time=24ms TTL=115        <span style="color:#7FE0AE">← internet OK</span>
C:\\Users\\student&gt;ping google.com
Ping request could not find host google.com.          <span style="color:#FFB4A8">← DNS problem</span></pre>`;
  if(i===5) return `<div class="sc-grid" style="grid-template-columns:repeat(4,minmax(0,1fr));max-width:980px">
    ${[['Open','No password. Anyone nearby can join and read traffic.','bad'],['WEP','Broken. Cracked in minutes.','bad'],['WPA2','The safe minimum.','ok'],['WPA2/WPA3','Best choice for an office. Long passphrase.','best']]
      .map(([t,d,k])=>`<div class="sc-card ${k==='bad'?'bad':'good'}" style="opacity:1"><div style="font-size:1.6rem">${k==='bad'?'✗':'✓'}</div><div class="nm">${t}</div><div class="sb">${d}</div></div>`).join('')}</div>`;
  return '';
}
function quiz(s,b,o){
  const L=N.lessons[b.lesson].q, chosen=o.done&&o.beat===b;
  return `<div style="width:100%;max-width:820px;display:flex;flex-direction:column;gap:12px">`+card(`<div style="font-size:1.25rem;font-weight:700">${esc(L.q)}</div>`)+
    L.a.map((a,i)=>`<div data-t="ans${i}" class="sc-card${chosen?(i===L.c?' good':' bad'):''}" style="align-items:flex-start;text-align:left;font-size:1.1rem;flex-direction:row;gap:10px"><b>${'ABC'[i]}</b><span>${esc(a)}</span></div>`).join('')+`</div>`;
}

/* ---------- floor plan ---------- */
function plan(s,b){
  const m=M(s); const hl=b.hl||[];
  let lines='';
  s.links.forEach(l=>{ const a=s.dev[l.a], d=s.dev[l.b]; if(!a||!d) return; const up=m.linkState[l.id]&&m.linkState[l.id].up;
    const sp=E.linkSpeed(l).mbps||100; const dur=sp>=1000?0.7:1.8;
    lines+=`<line x1="${a.x}" y1="${a.y}" x2="${d.x}" y2="${d.y}" stroke="${up?'#1C7F52':'#B8362A'}" stroke-width="4" vector-effect="non-scaling-stroke"${up?'':' stroke-dasharray="6 5"'}/>`;
    if(up) lines+=`<line class="flow" x1="${a.x}" y1="${a.y}" x2="${d.x}" y2="${d.y}" stroke="#fff" stroke-opacity=".85" stroke-width="2" stroke-dasharray="2 14" vector-effect="non-scaling-stroke" style="animation-duration:${dur}s"/>`; });
  Object.entries(m.assoc||{}).forEach(([id,a])=>{ if(!a.ap) return; const x=s.dev[id], y=s.dev[a.ap]; lines+=`<line x1="${x.x}" y1="${x.y}" x2="${y.x}" y2="${y.y}" stroke="#1D5B96" stroke-width="3" stroke-dasharray="2 6" vector-effect="non-scaling-stroke"/>`; });
  const nodes=Object.values(s.dev).map(d=>{ const t=N.types[d.type], h=m.hosts[d.id]; let st='';
    if(d.type==='router') st=d.cfg.lanIP; else if(d.type==='ont') st='fiber up'; else if(d.type==='switch'){ const n=s.links.filter(l=>(l.a===d.id||l.b===d.id)&&m.linkState[l.id].up).length; st=n+' link'+(n===1?'':'s'); }
    else if(h) st=!h.up?(t.ports.length?'no link':'not joined'):(h.ip||'—');
    const on=hl.includes(d.id);
    return `<div data-t="${d.id}" style="position:absolute;left:${d.x}%;top:${d.y}%;transform:translate(-50%,-50%);width:108px;text-align:center;background:var(--panel);border:${on?'3px solid #F4C430':'1px solid var(--line)'};border-radius:10px;padding:4px 4px 5px;box-shadow:0 2px 8px rgba(0,0,0,.12)">
      <div style="height:54px">${thumb(d.type).replace('<svg ','<svg style="width:100%;height:54px" ')}</div>
      <div style="font-weight:700;font-size:.85rem;line-height:1.1">${d.id}</div><div style="font-family:var(--mono);font-size:.7rem;color:var(--ink-2)">${esc(st)}</div></div>`; }).join('');
  return `<div style="position:relative;width:100%;height:100%;min-height:360px;border-radius:10px;background:repeating-linear-gradient(0deg,transparent 0 39px,rgba(120,140,150,.14) 39px 40px),repeating-linear-gradient(90deg,transparent 0 39px,rgba(120,140,150,.14) 39px 40px),var(--panel-2)">
    <style>.flow{animation:flowdash 1s linear infinite}@keyframes flowdash{to{stroke-dashoffset:-32}}@media (prefers-reduced-motion:reduce){.flow{display:none}}</style>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${lines}</svg>${nodes}
    <div style="position:absolute;left:10px;bottom:8px;font-size:.8rem;color:var(--ink-2)">Office floor plan · ${esc(N.isp.name)}</div></div>`;
}
/* ---------- two back panels, ports clickable ---------- */
function panel(s,b){
  const used=id=>s.links.filter(l=>l.a===id||l.b===id).map(l=>l.a===id?l.ap:l.bp);
  const one=(id)=>{ const r=SC.panel(id,s.dev[id].type,used(id),'A',s.sel&&s.sel.dev===id?s.sel.port:null); return `<div style="min-width:0">${r.node.outerHTML}<p style="font-size:.9rem;color:var(--ink-2);margin:.4rem 0 0">${esc(r.note)}</p></div>`; };
  return `<div style="display:grid;grid-template-columns:${b.b?'repeat(auto-fit,minmax(260px,1fr))':'1fr'};gap:16px;width:100%;max-width:1100px;align-items:start">${one(b.a)}${b.b?one(b.b):''}</div>`;
}
/* ---------- a device's own lights ---------- */
function status(s,b){ const m=M(s); const d=s.dev[b.dev];
  const svg=SC.status(d,m,s)||''; return `<div style="width:100%;max-width:820px;text-align:center">${svg.replace('<svg ','<svg data-main style="width:100%;height:auto;max-height:60vh" ')}<div style="font-weight:700;margin-top:6px">${esc(b.dev)} · ${esc(N.types[d.type].name)}</div></div>`; }

/* ---------- a Windows PC screen ---------- */
function screen(s,b){
  const id=b.dev, m=M(s), h=m.hosts[id], lap=s.dev[id].type==='laptop';
  const app=s.app;
  const tb=[['cmd','Command Prompt'],['browser','Browser'],['net','Network settings'],['speed','Speed test']].map(([k,l])=>`<button data-t="tb-${k}" style="background:${app===k?'#fff':'transparent'};border:1px solid ${app===k?'#ccc':'transparent'};border-radius:6px;padding:.25rem .6rem;font:inherit;font-size:.85rem">${l}</button>`).join('')+
    (lap?`<button data-t="tb-wifi" style="background:transparent;border:0;padding:.2rem .5rem">${A.P?`<svg width="22" height="22" viewBox="0 0 10 10">${A.P.icon('wifi',5,5,9,'#1B2A33')}</svg>`:'Wi-Fi'}</button>`:'');
  let win='';
  const W=(title,body)=>`<div style="position:absolute;left:5%;top:5%;width:90%;height:78%;background:#fff;color:#1b1b1b;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden">
     <div style="display:flex;justify-content:space-between;align-items:center;padding:.35rem .7rem;border-bottom:1px solid #eee;font-size:.85rem"><b>${title}</b><span style="color:#888">— ☐ ✕</span></div><div style="flex:1;overflow:auto">${body}</div></div>`;
  if(app==='cmd'){ const t=(s.term&&s.term[id])||'Microsoft Windows [Version 10.0.26200]\n(c) Microsoft Corporation. All rights reserved.\n';
    win=W('Command Prompt',`<pre style="margin:0;min-height:100%;background:#0C0C0C;color:#E6E6E6;font-family:var(--mono);font-size:.8rem;padding:10px 12px;white-space:pre-wrap">${esc(t)}\nC:\\Users\\student&gt;<span data-t="cmdline" style="display:inline-block;min-width:260px;border-bottom:1px solid #555">${esc(b.typing||'')}</span><span style="animation:blinkc 1s steps(2) infinite">▌</span></pre><style>@keyframes blinkc{50%{opacity:0}}</style>`); }
  if(app==='browser') win=W('Browser',browser(s,b,id,m));
  if(app==='speed'){ const r=s.speed;
    win=W('Speed test',`<div style="padding:20px;text-align:center">${r?`<div style="font-size:2.6rem;font-weight:700">${r.down} <span style="font-size:1rem">Mbps down</span></div><div style="font-size:1.3rem">${r.up} Mbps up · ${r.latency} ms</div><p style="color:#555">${esc(r.why)}</p>`:`<p>${esc(N.isp.name)}</p>`}<button data-t="speed-go" style="margin-top:10px;padding:.5rem 1.4rem;border-radius:20px;border:0;background:#1D5B96;color:#fff;font-weight:700;font:inherit">${r?'Run again':'Start test'}</button></div>`); }
  let fly='';
  if(lap&&s.wifiOpen){ const nets=['OFFICE-WIFI','Neighbour-5G','PLDT_HOME_8A2C'];
    const r=s.dev.RTR.cfg; const joined=m.assoc[id]&&m.assoc[id].ap;
    fly=`<div style="position:absolute;right:10px;bottom:44px;width:290px;background:#fff;color:#1b1b1b;border-radius:10px;box-shadow:0 10px 28px rgba(0,0,0,.35);padding:10px">
      <b>Wi-Fi</b>${nets.map((n,i)=>`<div data-t="net-${i}" style="margin-top:6px;padding:8px;border-radius:8px;border:1px solid #e0e0e0;background:${i===0&&s.wifiPick?'#EEF5FD':'#f7f7f7'}"><b>${n}</b><div style="font-size:.8rem;color:#555">${i===0?(joined?'Connected, secured':r.security==='Open'?'Open':'Secured ('+r.security+')'):'Secured'}</div>
      ${i===0&&s.wifiPick&&!joined?`<div style="margin-top:6px;font-size:.8rem">Network security key</div><div data-t="wifi-key" style="border:1px solid #999;border-radius:4px;padding:4px 6px;font-family:var(--mono);min-height:1.6em">${s.wifiKey?'••••••••••••':''}</div><button data-t="wifi-connect" style="margin-top:6px;padding:.3rem 1rem;border:0;border-radius:6px;background:#1D5B96;color:#fff;font:inherit">Connect</button>`:''}</div>`).join('')}</div>`; }
  const addr=h&&h.ip?h.ip:'no address';
  return `<div style="width:100%;max-width:1040px;aspect-ratio:16/10;max-height:100%;background:#15191C;border-radius:14px;padding:12px;box-shadow:0 12px 40px rgba(0,0,0,.35)">
    <div style="position:relative;width:100%;height:100%;border-radius:4px;overflow:hidden;background:linear-gradient(135deg,#2F62B8,#86B1EE);font-family:'Segoe UI',var(--font)">
      <div style="position:absolute;left:14px;top:10px;color:#fff;font-size:.85rem;text-shadow:0 1px 2px rgba(0,0,0,.4)">${esc(id)} · ${esc(addr)}</div>
      ${win}${fly}
      <div style="position:absolute;left:0;right:0;bottom:0;height:40px;background:rgba(243,243,243,.95);display:flex;justify-content:center;align-items:center;gap:.3rem">${tb}</div></div></div>`;
}
function browser(s,b,id,m){
  const url=s.url||'';
  const bar=`<div style="display:flex;gap:6px;align-items:center;padding:6px 8px;background:#F1F3F4;border-bottom:1px solid #ddd"><span>←</span><span>→</span><span>⟳</span><div data-t="urlbar" style="flex:1;background:#fff;border:1px solid #ccc;border-radius:14px;padding:3px 10px;font-size:.85rem;min-height:1.6em">${esc(b.typingUrl||url)}</div></div>`;
  if(url!=='192.168.1.1') return bar+`<div style="padding:30px;color:#666">New tab</div>`;
  const r=s.dev.RTR.cfg;
  if(!s.logged) return bar+`<div style="display:grid;place-items:center;padding:30px"><div style="width:300px;border:1px solid #ddd;border-radius:10px;padding:18px;background:#fafafa">
    <div style="font-weight:700;font-size:1.1rem;margin-bottom:4px">Wi-Fi Router</div><div style="font-size:.85rem;color:#555;margin-bottom:10px">Log in to manage the router</div>
    <div style="font-size:.8rem">Username</div><div style="border:1px solid #bbb;border-radius:4px;padding:4px 6px;margin-bottom:8px;background:#fff">admin</div>
    <div style="font-size:.8rem">Password</div><div data-t="r-pass" style="border:1px solid #bbb;border-radius:4px;padding:4px 6px;margin-bottom:10px;background:#fff;min-height:1.7em;font-family:var(--mono)">${s.passTyped?'•••••':''}</div>
    <div data-t="r-login" style="text-align:center;padding:6px;border-radius:6px;background:#1D5B96;color:#fff;font-weight:700">Log in</div>
    <div style="font-size:.75rem;color:#777;margin-top:8px">Default password: on the label under the router</div></div></div>`;
  const pages=[['status','Status'],['wireless','Wireless'],['lan','LAN & DHCP'],['clients','Connected devices'],['system','System tools']];
  const nav=`<div style="width:170px;border-right:1px solid #eee;padding:8px">${pages.map(([k,l])=>`<div data-t="rp-${k}" style="padding:6px 8px;border-radius:6px;${s.page===k?'background:#E6F0FA;font-weight:700':''}">${l}</div>`).join('')}</div>`;
  let body='';
  const row=(l,v,t)=>`<div style="display:grid;grid-template-columns:150px 1fr;gap:8px;align-items:center;margin:6px 0"><div style="color:#555;font-size:.9rem">${l}</div><div ${t?`data-t="${t}"`:''} style="border:1px solid #ccc;border-radius:4px;padding:4px 8px;background:#fff;min-height:1.7em">${v}</div></div>`;
  const pg=s.page||'status';
  if(pg==='status'){ body=`<h3 style="margin:.2rem 0 .6rem">Status</h3>`+row('Internet',m.routers.RTR&&m.routers.RTR.internet?'Connected':'Not connected')+row('LAN IP',r.lanIP)+row('Wi-Fi',esc(r.ssid)+' · '+esc(r.security))+row('Admin password',r.adminChanged?'Changed':'Default (change it!)'); }
  if(pg==='wireless'){ body=`<h3 style="margin:.2rem 0 .6rem">Wireless</h3>`+row('Network name (SSID)',esc(r.ssid))+row('Security',esc(s.form&&s.form.sec||r.security),'w-sec')+row('Passphrase',s.form&&s.form.pass?esc(s.form.pass):(r.pass?'••••••••':''),'w-pass')+row('Bands','2.4 GHz + 5 GHz')+`<div data-t="w-save" style="display:inline-block;margin-top:8px;padding:6px 18px;border-radius:6px;background:#1D5B96;color:#fff;font-weight:700">Save</div>`; }
  if(pg==='lan'){ body=`<h3 style="margin:.2rem 0 .6rem">LAN &amp; DHCP</h3>`+row('Router address',r.lanIP)+row('DHCP server',r.dhcp?'On':'Off')+row('Address pool',r.start+' – '+r.end); }
  if(pg==='system'){ body=`<h3 style="margin:.2rem 0 .6rem">System tools</h3>`+row('New admin password',s.form&&s.form.admin?'••••••••••••':'','s-admin')+`<div data-t="s-save" style="display:inline-block;margin-top:8px;padding:6px 18px;border-radius:6px;background:#1D5B96;color:#fff;font-weight:700">Save</div>`+
    `<p style="font-size:.85rem;color:#666;margin-top:1rem">Factory reset: hold the reset pinhole for 10 seconds.</p>`; }
  if(pg==='clients'){ const list=Object.values(s.dev).filter(d=>m.hosts[d.id]&&m.hosts[d.id].up&&m.hosts[d.id].ip);
    body=`<h3 style="margin:.2rem 0 .6rem">Connected devices</h3><table style="width:100%;border-collapse:collapse;font-size:.85rem"><tr style="text-align:left;color:#555"><th>Name</th><th>IP address</th><th>MAC address</th><th>Connection</th></tr>`+
      list.map(d=>{ const h=m.hosts[d.id]; return `<tr style="border-top:1px solid #eee"><td>${d.id}</td><td style="font-family:var(--mono)">${h.ip}</td><td style="font-family:var(--mono)">${E.mac(d.id)}</td><td>${h.wiredUp?'Wired':'Wi-Fi'}</td></tr>`; }).join('')+`</table>`; }
  return bar+`<div style="display:flex;min-height:100%">${nav}<div style="flex:1;padding:10px 16px">${body}</div></div>`;
}
/* ---------- printer / NAS front-panel settings ---------- */
function lcd(s,b){ const d=s.dev[b.dev], f=(s.lcd&&s.lcd[b.dev])||{}, m=M(s), h=m.hosts[b.dev];
  const art=A.svg(d.type==='printer'?'printer':'nas',{view:'front',state:{on:true,ip:h&&h.ip||''}}).replace('<svg ','<svg style="width:100%;height:auto;max-height:40vh" ');
  const row=(k,l,v)=>`<div style="display:grid;grid-template-columns:130px 1fr;gap:8px;align-items:center;margin:6px 0"><span>${l}</span><div data-t="f-${k}" style="border:1px solid #6F8A99;border-radius:4px;padding:4px 8px;background:#0E1A22;color:#BFE6FF;font-family:var(--mono);min-height:1.7em">${esc(v||'')}</div></div>`;
  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:18px;width:100%;max-width:1000px;align-items:center">
    <div>${art}<div style="text-align:center;font-weight:700">${esc(b.dev)}</div></div>
    <div style="background:#15222B;color:#DDEFFB;border-radius:12px;padding:16px 18px;font-size:1rem">
      <div style="font-weight:700;margin-bottom:6px">${d.type==='printer'?'Printer':'NAS'} · Network setup</div>
      <div style="font-size:.85rem;color:#8FB3C8;margin-bottom:6px">Current: ${esc(h&&h.ip?h.ip:'no address')} ${d.cfg.mode==='static'?'(manual)':'(DHCP)'}</div>
      ${row('ip','IP address',f.ip)}${row('mask','Subnet mask',f.mask)}${row('gw','Gateway',f.gw)}${row('dns','DNS',f.dns)}
      <div data-t="f-apply" style="display:inline-block;margin-top:8px;padding:6px 20px;border-radius:6px;background:#2F8EF0;color:#fff;font-weight:700">Apply</div></div></div>`; }
/* ---------- the network log ---------- */
function log(s,b){ const m=M(s);
  const rows=Object.values(s.dev).map(d=>{ const h=m.hosts[d.id]; const l=s.links.find(x=>x.a===d.id||x.b===d.id);
    const where=l?(l.a===d.id?`${l.ap} → ${l.b} ${l.bp}`:`${l.bp} → ${l.a} ${l.ap}`):(m.assoc&&m.assoc[d.id]&&m.assoc[d.id].ap?'Wi-Fi':'—');
    return `<tr><td>${d.id}</td><td>${esc(N.types[d.type].short)}</td><td style="font-family:var(--mono)">${d.type==='router'?d.cfg.lanIP:(h&&h.ip)||'—'}</td><td>${esc(where)}</td></tr>`; }).join('');
  return `<div class="sc-doc" style="width:min(820px,100%)"><div class="small">Network log · Small office · ${new Date().toLocaleDateString()}</div><h3>Devices, addresses and cables</h3>
   <table><tr><th>Device</th><th>Type</th><th>IP address</th><th>Port / link</th></tr>${rows}</table>
   <p class="small" style="margin-top:.6rem">Wi-Fi: ${esc(s.dev.RTR.cfg.ssid)} · ${esc(s.dev.RTR.cfg.security)} · DHCP pool 192.168.1.100–199 · fixed .10–.49</p>
   <div data-t="log-save" style="display:inline-block;margin-top:6px;padding:6px 18px;border-radius:6px;background:${s.logSaved?'#1C7F52':'#1D5B96'};color:#fff;font-weight:700">${s.logSaved?'Saved ✓':'Save log'}</div></div>`; }

const FIT=(w,h)=>`<div data-fit="${w}" style="width:100%;max-width:${w}px;display:flex;justify-content:center">${h}</div>`;
function render(s,b,o){
  switch(b.scene){
    case 'lesson': return FIT(960,lesson(s,b));
    case 'quiz': return FIT(760,quiz(s,b,o));
    case 'plan': return plan(s,b);
    case 'panel': return FIT(1000,panel(s,b)).replace('<div data-fit=','<div data-reflow data-fit=');
    case 'status': return status(s,b);
    case 'screen': return FIT(1000,screen(s,b));
    case 'lcd': return FIT(900,lcd(s,b));
    case 'log': return FIT(760,log(s,b));
    case 'pick': return C.pick(s,b,o);
    case 'intro': return C.intro(s,b);
    case 'part': return C.part(s,b);
  }
  return 'Missing scene '+esc(b.scene);
}
return {render};
})();
