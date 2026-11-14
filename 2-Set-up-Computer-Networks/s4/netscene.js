/* Station 4 drawings: back-panel connection view using the shared device art */
window.NetScene=(function(){
const N=window.NET, A=window.Art;
/* which drawing and which side shows the network ports */
const PANEL_VIEW={ont:['ont','back'],router:['router','back'],switch:['switch','back'],poeswitch:['poeswitch','back'],pc:['pc','back'],
  laptop:['laptop','side'],printer:['printer','back'],nas:['nas','back'],ap:['ap','back'],camera:['camera','side'],voip:['voip','back'],iot:['iot','side']};
const PANEL_BOX={router:[-4,110,258,60]};
/* the device as it looks right now: lights follow the live network state */
const STATUS_VIEW={ont:'top',router:'front',switch:'front',poeswitch:'front',ap:'top',printer:'front',nas:'front',camera:'side',voip:'front',iot:'front',pc:'front',laptop:'front'};

/* panel(devId,type,used[],side,sel) → {node, note}; free ports carry data-port/data-dev and are focusable */
function panel(devId, type, used, side, sel, live){
  const p=N.panels[type]||{title:N.types[type].name,ports:[],note:''};
  const [art,view]=PANEL_VIEW[type]||[type,null];
  const plugs={}; used.forEach(u=>plugs[u]=true);
  const st=Object.assign({on:true,plugs,link:used.length>0}, live||{});
  const wrap=document.createElement('div'); wrap.className='panel-art';
  const title=document.createElement('div'); title.className='panel-title'; title.textContent=p.title; wrap.append(title);
  const card=document.createElement('div'); card.className='panel-card';
  card.innerHTML=A.has(art)?A.svg(art,{view,state:st,explore:true,label:p.title,box:PANEL_BOX[type]}):'';
  wrap.append(card);
  const svg=card.querySelector('svg');
  const chips=document.createElement('div'); chips.className='port-chips'; chips.setAttribute('role','group'); chips.setAttribute('aria-label','Ports on '+devId);
  p.ports.forEach(port=>{
    const taken=used.includes(port.id), isSel=sel===port.id;
    const g=svg&&svg.querySelector(`[data-part="${CSS.escape(port.id)}"]`);
    if(g){
      g.classList.add(taken?'port-used':port.fixed?'port-fixed':'port-free'); if(isSel) g.classList.add('port-sel');
      if(!taken&&!port.fixed){ g.setAttribute('data-port',port.id); g.setAttribute('data-dev',devId); g.setAttribute('tabindex','0'); g.setAttribute('role','button');
        g.setAttribute('aria-label',port.label+' on '+devId+(isSel?' (selected)':'')); }
    }
    const b=document.createElement('button'); b.type='button'; b.className='port-chip'+(taken?' used':'')+(isSel?' sel':'')+(port.fixed?' fixed':'');
    b.textContent=port.label+(taken?' · in use':'')+(port.fixed?' · fixed':'');
    if(taken||port.fixed) b.disabled=true; else { b.dataset.port=port.id; b.dataset.dev=devId; b.setAttribute('aria-pressed',String(isSel)); }
    chips.append(b);
  });
  wrap.append(chips);
  return {node:wrap, note:p.note};
}

/* live status drawing of a device (lights, fans, screen) */
function status(d, M, S){
  const type=d.type, art=type; if(!A.has(art)) return null;
  const view=STATUS_VIEW[type]; const t=N.types[type];
  const links=S_links(d.id,M,S);
  const st={on:M.powered?M.powered[d.id]!==false:true};
  if(type==='router'){ const r=M.routers&&M.routers[d.id]; const wanUp=links.some(l=>l.port==='WAN'&&l.up);
    Object.assign(st,{wan:wanUp,internet:!!(r&&r.internet),lan:links.some(l=>l.port!=='WAN'&&l.up),wifi:true}); }
  if(type==='ont'){ ['LAN1','LAN2','LAN3','LAN4'].forEach((p,i)=>st['lan'+(i+1)]=links.some(l=>l.port===p&&l.up)); st.wlan=false; }
  if(type==='switch'||type==='poeswitch'){ st.links=t.ports.map(p=>links.some(l=>l.port===p&&l.up)); st.traffic=true;
    if(type==='poeswitch'){ st.poe=t.ports.map(p=>links.some(l=>l.port===p&&l.up&&l.pd)); const used=links.filter(l=>l.pd).reduce((a,l)=>a+l.pd,0); st.poemax=used>t.poe*0.9; } }
  if(type==='pc'||type==='laptop'||type==='printer'||type==='nas'||type==='voip'||type==='camera'||type==='ap'){ st.link=links.some(l=>l.up); }
  if(type==='ap'){ st.on=M.powered?!!M.powered[d.id]:true; }
  if(type==='printer'||type==='voip'){ const h=M.hosts&&M.hosts[d.id]; st.ip=h&&h.ip||''; }
  return A.svg(art,{view,state:st,explore:true,cls:'status-art'});
}
function S_links(id,M,S){
  return S.links.filter(l=>l.a===id||l.b===id).map(l=>{ const other=l.a===id?l.b:l.a; const ot=S.dev[other]&&N.types[S.dev[other].type];
    return {port:l.a===id?l.ap:l.bp, up:!!(M.linkState[l.id]&&M.linkState[l.id].up), pd:ot&&ot.needsPoe||0}; });
}
return {panel,status,PANEL_VIEW,STATUS_VIEW,PANEL_BOX};
})();
