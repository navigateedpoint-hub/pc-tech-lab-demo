/* Station 4 engine: addressing, reachability, link speed. Lifted from the tested v1 engine. */
window.NetEngine=(function(){
const N=window.NET;
let S=null, M=null;
const setState=s=>{S=s; return S;};
const getS=()=>S;
const getM=()=>M;
/* ---------------- IP helpers ---------------- */
const ipN=s=>{ if(typeof s!=='string') return null; const m=s.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/); if(!m) return null; const p=m.slice(1).map(Number); if(p.some(x=>x>255)) return null; return ((p[0]<<24)>>>0)+(p[1]<<16)+(p[2]<<8)+p[3]; };
const nIP=n=>[n>>>24,(n>>16)&255,(n>>8)&255,n&255].join('.');
const validMask=s=>{ const n=ipN(s); if(n==null||n===0) return false; const inv=(~n)>>>0; return ((inv+1)&inv)===0; };
const sameNet=(a,b,m)=>((ipN(a)&ipN(m))>>>0)===((ipN(b)&ipN(m))>>>0);
const isPrivate=ip=>{const n=ipN(ip); return n!=null && (ip.startsWith('10.')||ip.startsWith('192.168.')||ip.startsWith('169.254.')||ip.startsWith('127.')||(((n>>>24)===172)&&(((n>>16)&255)>=16)&&(((n>>16)&255)<=31)));};
const mac=id=>{ let h=0; for(const c of id) h=(h*31+c.charCodeAt(0))>>>0; const b=[0x3C,0x7C,0x3F,(h>>16)&255,(h>>8)&255,h&255]; return b.map(x=>x.toString(16).padStart(2,'0').toUpperCase()).join('-'); };

/* ---------------- state ---------------- */
function defaultCfg(type){
  if(type==='router') return {lanIP:'192.168.1.1',mask:'255.255.255.0',dhcp:true,start:'192.168.1.100',end:'192.168.1.199',ssid:'OFFICE-WIFI',security:'Open',pass:'',bands:'both'};
  if(type==='ap') return {mode:'dhcp',ip:'',mask:'',gw:'',dns:'',ssid:'OFFICE-WIFI',security:'Open',pass:''};
  return {mode:'dhcp',ip:'',mask:'',gw:'',dns:''};
}
function addDevice(id,type,x,y){ S.dev[id]={id,type,x,y,cfg:defaultCfg(type),join:{ssid:'',pass:''},fwPing:false,released:false}; }
let linkSeq=1;
const H={
  addLink(a,ap,b,bp,cable,len){ S.links.push({id:'L'+(linkSeq++),a,ap,b,bp,cable,len}); },
  removeLink(devId){ S.links=S.links.filter(l=>l.a!==devId&&l.b!==devId); },
};
function loadScenario(key){
  S={dev:{},links:[],succ:new Set(),sel:null,connect:false,pickA:null,leases:{},ticket:null,diagnosed:false,verified:false,awarded:new Set(),scen:key};
  const sc=N.scenarios[key]; sc.devices.forEach(d=>addDevice(d.id,d.type,d.x,d.y));
}
function loadSolved(){
  loadScenario('S1'); const so=N.solved;
  so.links.forEach(([a,ap,b,bp])=>H.addLink(a,ap,b,bp,'cat6',a==='ONT'?2:10));
  Object.entries(so.cfg).forEach(([id,c])=>Object.assign(S.dev[id].cfg,c));
  Object.assign(S.dev.RTR.cfg,{security:so.wifi.security,pass:so.wifi.pass});
  S.dev['LAP-01'].join={ssid:'OFFICE-WIFI',pass:so.wifi.pass};
}

/* ---------------- network engine ---------------- */
function nodeKey(devId,port){ const d=S.dev[devId]; if(d.type==='router') return devId+(port==='WAN'?'#wan':'#lan'); return devId; }
function compute(){
  const parent={}; const find=x=>{ if(parent[x]==null) parent[x]=x; while(parent[x]!==x){ parent[x]=parent[parent[x]]; x=parent[x]; } return x; };
  const loops=new Set(); const union=(a,b)=>{ const ra=find(a), rb=find(b); if(ra===rb){ loops.add(ra); return; } parent[ra]=rb; if(loops.has(ra)){loops.delete(ra); loops.add(rb);} };
  Object.values(S.dev).forEach(d=>{ if(d.type==='router'){find(d.id+'#lan');find(d.id+'#wan');} else find(d.id); });
  // PoE power
  const powered={};
  Object.values(S.dev).forEach(d=>{ const t=N.types[d.type]; if(!t.needsPoe){powered[d.id]=true;return;}
    powered[d.id]=S.links.some(l=>{ const other=l.a===d.id?l.b:l.b===d.id?l.a:null; return other && N.types[S.dev[other].type].poe && N.cables[l.cable].kind==='copper' && l.len<=100; }); });
  const linkState={};
  S.links.forEach(l=>{
    const c=N.cables[l.cable]; let up=true, why='';
    if(c.kind==='fiber'){ up=false; why='These ports are copper RJ45. Fiber needs SFP ports or media converters.'; }
    else if(l.len>100){ up=false; why='Copper Ethernet is limited to 100 m. Use fiber, or add a switch in between.'; }
    else if(!powered[l.a]||!powered[l.b]){ up=false; why='The device has no power. It needs PoE from a PoE switch or injector.'; }
    linkState[l.id]={up,why};
    if(up) union(nodeKey(l.a,l.ap),nodeKey(l.b,l.bp));
  });
  // loops must be recomputed after all unions: mark roots
  const loopRoots=new Set([...loops].map(find));
  // Wi-Fi
  const assoc={};
  const radios=Object.values(S.dev).filter(d=>N.types[d.type].wifiAP && powered[d.id] && (d.type==='router' || S.links.some(l=>(l.a===d.id||l.b===d.id)&&linkState[l.id].up)));
  Object.values(S.dev).forEach(d=>{
    const t=N.types[d.type]; if(!t.wifi||!d.join.ssid) return;
    const wired=S.links.some(l=>(l.a===d.id||l.b===d.id)&&linkState[l.id].up); if(wired) return;
    for(const r of radios){ const c=r.cfg;
      if(c.ssid!==d.join.ssid) continue;
      if(r.type==='router' && c.bands==='5' && !t.wifi.includes('5')) continue;
      if(c.security!=='Open' && c.pass!==d.join.pass){ assoc[d.id]={fail:'auth'}; continue; }
      assoc[d.id]={ap:r.id}; union(d.id, r.type==='router'?r.id+'#lan':r.id); break; }
  });
  const rootOf=d=>find(S.dev[d].type==='router'?d+'#lan':d);
  // hosts: link state
  const hosts={};
  const hostList=Object.values(S.dev).filter(d=>N.types[d.type].host).sort((a,b)=>a.id.localeCompare(b.id));
  hostList.forEach(d=>{
    const wired=S.links.find(l=>(l.a===d.id||l.b===d.id));
    const wiredUp=S.links.some(l=>(l.a===d.id||l.b===d.id)&&linkState[l.id].up);
    const wifiUp=!!(assoc[d.id]&&assoc[d.id].ap);
    hosts[d.id]={up:wiredUp||wifiUp, wiredUp, wifiUp, adapter:wiredUp?'eth':(wifiUp?'wifi':'eth'), root:rootOf(d.id), powered:powered[d.id]};
  });
  // routers
  const routers={};
  Object.values(S.dev).filter(d=>d.type==='router').forEach(r=>{
    const wanRoot=find(r.id+'#wan'); const internet=Object.values(S.dev).some(o=>o.type==='ont'&&find(o.id)===wanRoot);
    routers[r.id]={root:find(r.id+'#lan'), internet};
  });
  // statics first (so DHCP avoids them)
  const taken={}; const mark=(root,ip)=>{ (taken[root]=taken[root]||new Set()).add(ip); };
  Object.entries(routers).forEach(([id,r])=>mark(r.root,S.dev[id].cfg.lanIP));
  hostList.forEach(d=>{ const h=hosts[d.id]; if(d.cfg.mode==='static'&&h.up) mark(h.root,d.cfg.ip); });
  hostList.forEach(d=>{
    const h=hosts[d.id], c=d.cfg;
    if(!h.up){ Object.assign(h,{ip:'',mask:'',gw:'',dns:''}); return; }
    if(c.mode==='static'){ Object.assign(h,{ip:c.ip,mask:c.mask,gw:c.gw,dns:c.dns,static:true}); return; }
    if(d.released){ Object.assign(h,{ip:'',mask:'',gw:'',dns:'',released:true}); return; }
    const servers=Object.entries(routers).filter(([id,r])=>r.root===h.root && S.dev[id].cfg.dhcp);
    if(servers.length){
      const [rid]=servers[0]; const rc=S.dev[rid].cfg; const s=ipN(rc.start), e=ipN(rc.end);
      let ip=S.leases[d.id]; const tk=taken[h.root]=taken[h.root]||new Set();
      if(!ip || ipN(ip)<s || ipN(ip)>e || tk.has(ip) || !sameNet(ip,rc.lanIP,rc.mask)){ ip=null; for(let n=s;n<=e;n++){ const cand=nIP(n); if(!tk.has(cand)){ ip=cand; break; } } }
      if(ip){ S.leases[d.id]=ip; tk.add(ip); Object.assign(h,{ip,mask:rc.mask,gw:rc.lanIP,dns:rc.lanIP,dhcpServer:rc.lanIP,dhcp:true}); return; }
    }
    let x=0; for(const ch of d.id) x=(x*17+ch.charCodeAt(0))%64000;
    Object.assign(h,{ip:'169.254.'+(1+(x>>8)%254)+'.'+(1+x%254),mask:'255.255.0.0',gw:'',dns:'',apipa:true});
  });
  // duplicates
  const dup={}; const byRoot={};
  hostList.forEach(d=>{ const h=hosts[d.id]; if(!h.ip) return; const k=h.root+'|'+h.ip; (byRoot[k]=byRoot[k]||[]).push(d.id); });
  Object.entries(routers).forEach(([id,r])=>{ const k=r.root+'|'+S.dev[id].cfg.lanIP; (byRoot[k]=byRoot[k]||[]).push(id); });
  Object.values(byRoot).forEach(list=>{ if(list.length>1) list.forEach(id=>dup[id]=true); });
  M={linkState,hosts,routers,assoc,powered,loopRoots,dup,byRoot};
  return M;
}
function entitiesAt(root,ip){ return (M.byRoot[root+'|'+ip]||[]); }

/* ---------------- ping / nslookup / ipconfig ---------------- */
function resolveName(src,name){
  const h=M.hosts[src];
  const lname=name.toLowerCase();
  const local=Object.keys(S.dev).find(id=>id.toLowerCase()===lname);
  if(local){ const lh=M.hosts[local]; if(lh&&lh.ip&&lh.root===h.root) return {ip:lh.ip}; if(S.dev[local].type==='router'&&M.routers[local].root===h.root) return {ip:S.dev[local].cfg.lanIP}; return {fail:true}; }
  if(!N.dns[lname]) return {fail:true};
  if(!h.dns || !ipN(h.dns)) return {fail:true};
  const dnsOK = reach(src,h.dns,true).ok;
  if(!dnsOK) return {fail:true};
  const dnsRouter=Object.keys(M.routers).find(id=>S.dev[id].cfg.lanIP===h.dns && M.routers[id].root===h.root);
  if(dnsRouter && !M.routers[dnsRouter].internet) return {fail:true};
  return {ip:N.dns[lname]};
}
// core reachability: {ok, mode:'reply'|'unreach'|'timeout'|'general', ttl, flaky}
function reach(src,dst,dnsProbe){
  const h=M.hosts[src]; const d=S.dev[src];
  if(!h.up||!h.ip) return {mode:'general'};
  if(M.loopRoots.has(h.root)) return {mode:'timeout'};
  if(dst===h.ip) return {ok:true,mode:'reply',ttl:128};
  const mask=h.mask||'255.255.255.0';
  if(sameNet(dst,h.ip,mask)){
    const ents=entitiesAt(h.root,dst);
    if(!ents.length) return {mode:'unreach'};
    const flaky=ents.length>1;
    const t=ents[0], td=S.dev[t];
    if(td.type!=='router' && N.types[td.type].windows && !td.fwPing && !dnsProbe) return {mode:'timeout',fw:true};
    return {ok:true,mode:'reply',ttl:td.type==='router'?64:(N.types[td.type].windows?128:64),flaky};
  }
  if(!h.gw) return {mode:'general'};
  if(!ipN(h.gw)||!sameNet(h.gw,h.ip,mask)) return {mode:'general'};
  const gws=entitiesAt(h.root,h.gw).filter(id=>S.dev[id]&&S.dev[id].type==='router');
  if(!gws.length) return {mode:'unreach'};
  const r=M.routers[gws[0]];
  if(!isPrivate(dst)) return r.internet?{ok:true,mode:'reply',ttl:116,far:true}:{mode:'timeout'};
  return {mode:'timeout'};
}
function pingCmd(src,target){
  const out=[]; let ip=target, label=target;
  if(!ipN(target)){
    const r=resolveName(src,target);
    if(r.fail) return {text:`Ping request could not find host ${target}. Please check the name and try again.`,ok:false};
    ip=r.ip; label=`${target} [${ip}]`;
  }
  const res=reach(src,ip); const h=M.hosts[src];
  out.push(`\nPinging ${label} with 32 bytes of data:`);
  let recv=0, times=[];
  for(let i=0;i<4;i++){
    if(res.mode==='general'){ out.push('PING: transmit failed. General failure.'); continue; }
    if(res.mode==='unreach'){ out.push(`Reply from ${h.ip}: Destination host unreachable.`); recv++; continue; }
    if(res.mode==='timeout' || (res.flaky && i%2===1)){ out.push('Request timed out.'); continue; }
    const t=res.far?18+((i*7+ip.length)%17):0; times.push(t); recv++;
    out.push(`Reply from ${ip}: bytes=32 time${t?'='+t:'<1'}ms TTL=${res.ttl}`);
  }
  const lost=4-recv;
  out.push(`\nPing statistics for ${ip}:`,`    Packets: Sent = 4, Received = ${recv}, Lost = ${lost} (${lost*25}% loss),`);
  if(times.length){ const mn=Math.min(...times),mx=Math.max(...times),av=Math.round(times.reduce((a,b)=>a+b,0)/times.length); out.push('Approximate round trip times in milli-seconds:',`    Minimum = ${mn}ms, Maximum = ${mx}ms, Average = ${av}ms`); }
  const ok=res.mode==='reply'&&!res.flaky;
  return {text:out.join('\n'),ok,ip,fw:res.fw};
}
function ipconfig(src,all){
  const d=S.dev[src], h=M.hosts[src], t=N.types[d.type];
  const L=['','Windows IP Configuration',''];
  if(all) L.push(`   Host Name . . . . . . . . . . . . : ${src}`,'   Primary Dns Suffix  . . . . . . . :','   Node Type . . . . . . . . . . . . : Hybrid','   IP Routing Enabled. . . . . . . . : No','');
  const block=(title,active,phys)=>{
    L.push(title,'');
    if(!active){ L.push('   Media State . . . . . . . . . . . : Media disconnected','   Connection-specific DNS Suffix  . :'); if(all) L.push(`   Physical Address. . . . . . . . . : ${phys}`,`   DHCP Enabled. . . . . . . . . . . : ${d.cfg.mode==='dhcp'?'Yes':'No'}`); L.push(''); return; }
    L.push('   Connection-specific DNS Suffix  . :');
    if(all) L.push(`   Physical Address. . . . . . . . . : ${phys}`,`   DHCP Enabled. . . . . . . . . . . : ${d.cfg.mode==='dhcp'?'Yes':'No'}`,'   Autoconfiguration Enabled . . . . : Yes');
    if(h.ip){
      if(h.apipa) L.push(`   Autoconfiguration IPv4 Address. . : ${h.ip}${all?'(Preferred)':''}`);
      else L.push(`   IPv4 Address. . . . . . . . . . . : ${h.ip}${all?(M.dup[src]?'(Duplicate)':'(Preferred)'):''}`);
      L.push(`   Subnet Mask . . . . . . . . . . . : ${h.mask}`);
    }
    L.push(`   Default Gateway . . . . . . . . . : ${h.gw||''}`);
    if(all){ if(h.dhcpServer) L.push(`   DHCP Server . . . . . . . . . . . : ${h.dhcpServer}`); L.push(`   DNS Servers . . . . . . . . . . . : ${h.dns||''}`); }
    L.push('');
  };
  block('Ethernet adapter Ethernet:', h.wiredUp, mac(src));
  if(t.wifi) block('Wireless LAN adapter Wi-Fi:', h.wifiUp && !h.wiredUp, mac(src+'w'));
  return L.join('\n');
}
function nslookup(src,name){
  const h=M.hosts[src];
  if(!h.up||!h.ip) return 'DNS request timed out.\n    timeout was 2 seconds.\nDefault Server:  UnKnown\nAddress:  (none)';
  const r=resolveName(src,name);
  if(r.fail){
    const reachable=h.dns&&reach(src,h.dns,true).ok;
    if(!reachable) return `DNS request timed out.\n    timeout was 2 seconds.\nServer:  UnKnown\nAddress:  ${h.dns||'(none)'}\n\nDNS request timed out.\n    timeout was 2 seconds.\n*** Request to UnKnown timed-out`;
    return `Server:  UnKnown\nAddress:  ${h.dns}\n\n*** UnKnown can't find ${name}: Non-existent domain`;
  }
  return `Server:  UnKnown\nAddress:  ${h.dns}\n\nNon-authoritative answer:\nName:    ${name}\nAddress:  ${r.ip}`;
}


/* ---------- link speed, distance and PoE ---------- */
const SPEED={cat5e:1000,cat6:1000,cat6a:10000,outdoor:1000,fiber:10000};
function portSpeed(devId){ const t=N.types[S.dev[devId].type]; return t.speed||1000; }
function linkSpeed(l){
  const c=N.cables[l.cable]; const st=M.linkState[l.id];
  if(!st||!st.up) return {mbps:0,why:st?st.why:''};
  let mbps=Math.min(SPEED[l.cable]||1000, portSpeed(l.a), portSpeed(l.b));
  let why='Negotiated at the slowest of the two ports and the cable.';
  if(l.cable==='cat6'&&mbps>1000&&l.len>55){ mbps=1000; why='Cat6 reaches 10 Gbps only up to about 55 m; beyond that it runs at 1 Gbps.'; }
  if(l.badCrimp){ mbps=100; why='Only two pairs are connected, so the link falls back to 100 Mbps.'; }
  return {mbps,why};
}
function wifiSpeed(devId){
  const a=M.assoc[devId]; if(!a||!a.ap) return {mbps:0,why:'Not connected'};
  const ap=S.dev[a.ap]; const dist=Math.hypot(S.dev[devId].x-ap.x, S.dev[devId].y-ap.y);
  const band=(N.types[S.dev[devId].type].wifi||['2.4']).includes('5')&&ap.cfg.bands!=='2.4' ? '5':'2.4';
  let mbps = band==='5'?866:144;
  let why = band==='5'?'5 GHz, 80 MHz channel.':'2.4 GHz only, so the ceiling is much lower.';
  if(dist>45){ mbps=Math.round(mbps*0.35); why+=' The device is far from the access point, so the rate drops.'; }
  else if(dist>25){ mbps=Math.round(mbps*0.6); why+=' Distance reduces the rate.'; }
  return {mbps,why,band};
}
/* metres per floor-plan unit: the plan is 40 m wide */
const PLAN_M=40;
const distanceM=(a,b)=>{ const dx=(a.x-b.x)*PLAN_M/100, dy=(a.y-b.y)*PLAN_M/100*0.6; return Math.max(1,Math.round(Math.hypot(dx,dy)+2)); };
/* links on the path from a device to the first router, through switches only (breadth-first) */
function pathToRouter(from){
  const prev={}, seen=new Set([from]), q=[from];
  while(q.length){ const x=q.shift();
    if(x!==from&&S.dev[x].type==='router'){ const out=[]; let y=x; while(prev[y]){ out.push(prev[y].l); y=prev[y].x; } return out; }
    if(x!==from&&!(S.dev[x].type==='switch'||S.dev[x].type==='poeswitch')) continue;
    S.links.forEach(l=>{ if(!M.linkState[l.id]||!M.linkState[l.id].up) return; const y=l.a===x?l.b:(l.b===x?l.a:null); if(!y||seen.has(y)||!S.dev[y]) return; seen.add(y); prev[y]={x,l}; q.push(y); }); }
  return [];
}
function speedTest(devId){
  const h=M.hosts[devId]; if(!h||!h.up||!h.ip||h.apipa) return {down:0,up:0,why:'No working IP address, so there is nothing to test.'};
  const plan=N.isp;
  const r=reach(devId,'8.8.8.8'); if(!r.ok) return {down:0,up:0,why:'No route to the internet.'};
  let cap=plan.down, why='Full plan speed: every link on the way is faster than the internet plan.';
  const path=[];
  const wired=S.links.find(l=>(l.a===devId||l.b===devId)&&M.linkState[l.id].up);
  if(wired){ const ls=linkSpeed(wired); path.push(ls.mbps); if(ls.mbps<plan.down) why='Limited by the link to this device: '+ls.why; }
  else { const ws=wifiSpeed(devId); path.push(ws.mbps); if(ws.mbps<plan.down) why='Limited by Wi-Fi: '+ws.why; }
  // only the links on the way from this device to the router (and the router's WAN link) limit the test
  const start=wired?devId:(M.assoc[devId]&&M.assoc[devId].ap);
  const hops=start?pathToRouter(start):[];
  const wan=S.links.find(l=>M.linkState[l.id].up&&((S.dev[l.a].type==='router'&&l.ap==='WAN')||(S.dev[l.b].type==='router'&&l.bp==='WAN')));
  if(wan) hops.push(wan);
  hops.forEach(l=>{ if(l===wired) return; const ls=linkSpeed(l); if(!ls.mbps) return; if(ls.mbps<Math.min(plan.down,...path)) why='Limited by the link from '+l.a+' to '+l.b+': '+ls.why; path.push(ls.mbps); });
  cap=Math.min(plan.down, ...path.filter(Boolean));
  const down=Math.round(cap*0.92), up=Math.round(Math.min(plan.up, cap)*0.9);
  return {down,up,why,latency: 6+Math.round(Math.random()*6)};
}
return {setState,getS,getM,compute,pingCmd,ipconfig,nslookup,reach,resolveName,entitiesAt,linkSpeed,wifiSpeed,distanceM,speedTest,defaultCfg,addDevice,loadScenario,loadSolved,nodeKey,H,mac,ipN,nIP,validMask,sameNet,isPrivate,PLAN_M};
})();
