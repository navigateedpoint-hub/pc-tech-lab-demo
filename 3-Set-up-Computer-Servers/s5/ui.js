/* Server Setup: building blocks for the recreated screens (windows, dialogs, wizards, terminals) and the monitor and laptop frames. */
window.UI=(function(){
const esc=Demo.esc;
const dt=id=>id?` data-t="${id}"`:'';
/* any clickable span */
const t=(id,html,style='')=>`<span${dt(id)} style="${style}">${html}</span>`;
/* classic Windows Server button; def = default (blue ring), dis = greyed */
const wbtn=(id,label,o={})=>`<span${dt(id)} style="display:inline-block;min-width:78px;text-align:center;padding:.2rem .7rem;border:1px solid ${o.def?'#0067C0':'#ADADAD'};background:${o.dis?'#F4F4F4':'#E5E5E5'};color:${o.dis?'#A3A3A3':'#111'};font-size:.78rem;border-radius:2px;${o.def?'box-shadow:inset 0 0 0 1px #0067C0;':''}${o.style||''}">${label}</span>`;
/* Windows 11 accent button */
const abtn=(id,label,o={})=>`<span${dt(id)} style="display:inline-block;padding:.32rem 1.1rem;border-radius:4px;background:${o.light?'#FBFBFB':'#0067C0'};color:${o.light?'#1b1b1b':'#fff'};border:1px solid ${o.light?'#D1D1D1':'#0067C0'};font-size:.82rem;font-weight:600;${o.style||''}">${label}</span>`;
const link=(id,label,style='')=>`<span${dt(id)} style="color:#0067C0;text-decoration:underline;${style}">${label}</span>`;
const field=(id,label,val,o={})=>`<div style="margin:${o.m||'.3rem 0'};${o.inline?'display:grid;grid-template-columns:'+(o.lw||'150px')+' 1fr;align-items:center;gap:8px':''}"><div style="font-size:.76rem;color:#333">${label}</div>`+
  `<div${dt(id)} style="border:1px solid #9C9C9C;border-bottom:${o.win11?'2px solid #0067C0':'1px solid #9C9C9C'};border-radius:${o.win11?'4px':'1px'};padding:.12rem .4rem;background:${o.dis?'#F0F0F0':'#fff'};min-height:1.45em;font-size:.8rem;${o.mono?'font-family:var(--mono);':''}${o.style||''}">${val==null||val===''?'&nbsp;':val}</div></div>`;
const check=(id,label,on,o={})=>`<div${dt(id)} style="display:flex;gap:7px;align-items:flex-start;margin:${o.m||'.25rem 0'};font-size:.8rem;${o.dis?'color:#9A9A9A':''}"><span style="display:inline-grid;place-items:center;width:13px;height:13px;border:1px solid ${on?'#0067C0':'#555'};background:${on?'#0067C0':'#fff'};color:#fff;font-size:.62rem;flex:none;margin-top:2px">${on?'✓':''}</span><span>${label}${o.sub?`<div style="font-size:.72rem;color:#666">${o.sub}</div>`:''}</span></div>`;
const radio=(id,label,on,sub,o={})=>`<div${dt(id)} style="display:flex;gap:7px;align-items:flex-start;margin:${o.m||'.3rem 0'};font-size:.8rem"><span style="display:inline-grid;place-items:center;width:13px;height:13px;border-radius:50%;border:1px solid ${on?'#0067C0':'#555'};flex:none;margin-top:2px">${on?'<span style="width:7px;height:7px;border-radius:50%;background:#0067C0"></span>':''}</span><span>${label}${sub?`<div style="font-size:.72rem;color:#666">${sub}</div>`:''}</span></div>`;
const tabs=(list,cur)=>`<div style="display:flex;gap:0;border-bottom:1px solid #ADADAD;margin-bottom:8px;font-size:.76rem;flex-wrap:wrap">${list.map(([id,l])=>`<span${dt(id)} style="padding:.2rem .55rem;border:1px solid ${l===cur?'#ADADAD':'transparent'};border-bottom:${l===cur?'1px solid #fff':'none'};margin-bottom:-1px;background:${l===cur?'#fff':'transparent'}">${l}</span>`).join('')}</div>`;
/* a desktop window (Windows Server look) */
const win=(title,body,o={})=>`<div style="position:absolute;left:${o.l||'4%'};top:${o.t||'4%'};width:${o.w||'92%'};height:${o.h||'84%'};background:#fff;border:1px solid #7A7A7A;box-shadow:0 8px 28px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden;color:#1b1b1b;font-family:'Segoe UI',Arial,sans-serif;z-index:${o.z||1}">
  <div style="display:flex;justify-content:space-between;align-items:center;padding:.22rem .6rem;background:${o.bar||'#fff'};border-bottom:1px solid #E1E1E1;font-size:.78rem;flex:none"><span>${o.icon?o.icon+' ':''}${title}</span><span style="color:#555;letter-spacing:.6em">—☐✕</span></div>
  ${o.menu?`<div style="display:flex;gap:14px;padding:.15rem .6rem;font-size:.76rem;border-bottom:1px solid #EEE;flex:none">${o.menu}</div>`:''}
  <div style="flex:1;position:relative;overflow:hidden">${body}</div></div>`;
/* a dialog box on top of a window */
const dlg=(title,body,buttons,o={})=>`<div style="position:absolute;left:${o.l||'50%'};top:${o.t||'50%'};transform:translate(${o.l?'0':'-50%'},${o.t?'0':'-50%'});width:${o.w||'52%'};background:#F0F0F0;border:1px solid #6E6E6E;box-shadow:0 10px 34px rgba(0,0,0,.45);color:#1b1b1b;font-family:'Segoe UI',Arial,sans-serif;z-index:${o.z||5}">
  <div style="display:flex;justify-content:space-between;padding:.25rem .6rem;background:#fff;font-size:.78rem"><span>${title}</span><span style="color:#555">✕</span></div>
  <div style="padding:10px 14px;font-size:.8rem;background:${o.bg||'#F0F0F0'}">${body}</div>
  ${buttons?`<div style="display:flex;justify-content:flex-end;gap:6px;padding:8px 12px;border-top:1px solid #DADADA">${buttons}</div>`:''}</div>`;
/* Server Manager style wizard: steps on the left, destination server top right */
const wizard=(title,steps,cur,heading,body,buttons,o={})=>win(title,`<div style="display:grid;grid-template-columns:170px 1fr;height:100%">
   <div style="background:#F3F3F3;border-right:1px solid #E1E1E1;padding:52px 0 0;font-size:.76rem">${steps.map(s=>`<div style="padding:.22rem .9rem;${s===cur?'background:#fff;border-left:3px solid #0067C0;font-weight:700':'color:'+(o.done&&o.done.includes(s)?'#1b1b1b':'#6A6A6A')}">${s}</div>`).join('')}</div>
   <div style="display:flex;flex-direction:column;min-width:0">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:10px 16px 4px"><div style="font-size:1.25rem;font-weight:300;color:#1b1b1b">${heading}</div><div style="font-size:.66rem;color:#555;text-align:right">${o.dest===false?'':'DESTINATION SERVER<br><b>'+(o.dest||'SRV-01')+'</b>'}</div></div>
    <div style="flex:1;padding:4px 16px;font-size:.8rem;overflow:hidden">${body}</div>
    <div style="display:flex;justify-content:flex-end;gap:6px;padding:8px 12px;border-top:1px solid #E1E1E1">${buttons}</div></div></div>`,Object.assign({l:'8%',t:'5%',w:'84%',h:'84%'},o.pos||{}));
/* the usual wizard buttons */
const wzb=(o={})=>wbtn(o.prev===false?'':'wz-prev','&lt; Previous',{dis:o.prev===false})+wbtn(o.nextId||'wz-next',o.next||'Next &gt;',{def:!o.inst,dis:o.next===false})+(o.install!==undefined?wbtn('wz-install','Install',{def:o.inst,dis:!o.inst}):'')+wbtn('','Cancel');
/* a tree row */
const node=(id,depth,icon,label,o={})=>`<div${dt(id)} style="padding:.08rem .3rem .08rem ${.3+depth*1}rem;font-size:.76rem;white-space:nowrap;${o.sel?'background:#CCE8FF;':''}${o.bold?'font-weight:700;':''}">${o.exp===undefined?'&nbsp;&nbsp;':o.exp?'▾':'▸'} ${icon} ${label}</div>`;
/* a table */
const table=(cols,rows,o={})=>`<table style="width:100%;border-collapse:collapse;font-size:${o.fs||'.76rem'}"><tr>${cols.map(c=>`<th style="text-align:left;font-weight:400;color:#333;border-bottom:1px solid #DADADA;padding:.15rem .3rem">${c}</th>`).join('')}</tr>`+
  rows.map(r=>`<tr${dt(r.id)} style="${r.sel?'background:#CCE8FF':''}">${r.c.map(x=>`<td style="padding:.15rem .3rem;border-bottom:1px solid #F2F2F2">${x}</td>`).join('')}</tr>`).join('')+`</table>`;
/* a context menu */
const menu=(items,o={})=>`<div style="position:absolute;left:${o.l};top:${o.t};background:#F2F2F2;border:1px solid #A0A0A0;box-shadow:2px 3px 10px rgba(0,0,0,.3);font-size:.76rem;padding:2px 0;min-width:${o.w||'190px'};z-index:6">${items.map(i=>i==='-'?'<div style="border-top:1px solid #D7D7D7;margin:2px 4px"></div>':`<div${dt(i[0])} style="padding:.18rem 1.4rem;${i[2]?'background:#91C9F7':''}">${i[1]}</div>`).join('')}</div>`;
/* a text terminal; lines are [prompt, command, output]; pending is the command waiting to be typed */
function term(lines,pending,o={}){
  const P=o.prompt||'$ ';
  const fmt=x=>String(x).replace(/\[\[(.+?)\]\]/g,'<span style="background:#264F2A;color:#fff">$1</span>').replace(/\{\{(.+?)\}\}/g,'<span style="color:#FF8A80">$1</span>');
  const body=(lines||[]).slice(-(o.max||40)).map(l=>`<span style="color:${o.pc||'#8AE234'}">${esc(l[0])}</span>${esc(l[1])}${l[2]?'\n'+fmt(l[2]):''}`).join('\n');
  const cur=pending!=null?`${body?'\n':''}<span style="color:${o.pc||'#8AE234'}">${esc(o.curPrompt||P)}</span><span data-t="term-line" style="border-bottom:1px dashed #888;padding-bottom:1px">${esc(pending)}</span><span style="background:#ddd;color:#ddd">_</span>`:(o.idle?`${body?'\n':''}<span style="color:${o.pc||'#8AE234'}">${esc(o.curPrompt||P)}</span><span style="background:#ddd;color:#ddd">_</span>`:'');
  return `<pre style="margin:0;position:absolute;inset:0;background:${o.bg||'#0C0C0C'};color:#E6E6E6;font-family:var(--mono);font-size:${o.fs||'.72rem'};line-height:1.32;padding:10px 12px;white-space:pre-wrap;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end">${o.head?`<div style="color:#9FB2C2">${esc(o.head)}</div>`:''}<div>${body}${cur}</div></pre>`;
}
/* GNU nano */
function nano(file,lines,o={}){
  const hl=o.hl||[], add=o.add||[];
  const rows=lines.map((l,i)=>`<div style="${add.includes(i)?'background:#264F2A;':''}${hl.includes(i)?'background:#3A3A12;':''}min-height:1.3em;white-space:pre">${esc(l)||' '}</div>`).join('');
  return `<div style="position:absolute;inset:0;background:#0C0C0C;color:#E6E6E6;font-family:var(--mono);font-size:${o.fs||'.7rem'};display:flex;flex-direction:column">
   <div style="background:#D3D7CF;color:#111;display:flex;justify-content:space-between;padding:1px 8px"><span>GNU nano</span><b>${esc(file)}</b><span>${o.modified?'Modified':''}</span></div>
   <div data-t="nano-body" style="flex:1;padding:6px 10px;overflow:hidden">${rows}</div>
   ${o.msg?`<div style="text-align:center"><span style="background:#D3D7CF;color:#111;padding:0 6px">${esc(o.msg)}</span></div>`:''}
   <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:2px 8px;padding:3px 8px;font-size:.92em">${[['^G','Help'],['^O','Write Out','nano-save'],['^F','Where Is'],['^K','Cut'],['^T','Execute'],['^C','Location'],['^X','Exit','nano-exit'],['^R','Read File'],['^\\','Replace'],['^U','Paste'],['^J','Justify'],['^/','Go To Line']].map(([k,l,id])=>`<span${dt(id)}><span style="background:#D3D7CF;color:#111">${k}</span> ${l}</span>`).join('')}</div></div>`;
}
/* keys under a monitor */
const keyRow=keys=>keys&&keys.length?`<div style="display:flex;gap:8px;padding:8px 12px;border-radius:10px;background:#2A3036;margin-top:10px">${keys.map(([k,id])=>`<span data-t="${id}" style="display:inline-grid;place-items:center;min-width:52px;height:38px;padding:0 10px;border-radius:6px;background:linear-gradient(#F4F6F7,#D5DBDF);border:1px solid #9AA3AA;box-shadow:0 3px 0 #8A949B;font-weight:700;color:#1b2328;white-space:nowrap">${k}</span>`).join('')}</div>`:'';
function monFrame(inner,o={}){
  return `<div style="width:100%;max-width:1080px;display:flex;flex-direction:column;align-items:center">
    <div style="width:100%;aspect-ratio:16/9;background:#111;border-radius:10px;padding:10px 10px 18px;position:relative">
      <div style="position:relative;width:100%;height:100%;overflow:hidden;background:#000;font-family:'Segoe UI',Arial,sans-serif">${inner}</div>
      <div style="position:absolute;right:16px;bottom:5px;width:5px;height:5px;border-radius:50%;background:#EAF4FF"></div></div>
    <div style="width:70px;height:22px;background:linear-gradient(90deg,#3A4148,#5A636A,#3A4148)"></div><div style="width:180px;height:9px;border-radius:5px;background:#2A3036"></div>${keyRow(o.keys)}
    <div style="font-size:.85rem;color:var(--ink-2);margin-top:6px">${o.caption||''}</div></div>`;
}
function lapFrame(inner,o={}){
  return `<div style="width:100%;max-width:1080px;display:flex;flex-direction:column;align-items:center">
   <div style="width:100%;aspect-ratio:16/10;background:#1E2328;border-radius:14px 14px 4px 4px;padding:10px 10px 8px">
    <div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:3px;background:linear-gradient(135deg,#2F62B8,#86B1EE);font-family:'Segoe UI',Arial,sans-serif;color:#1b1b1b">${inner}</div></div>
   <div style="width:106%;height:14px;background:linear-gradient(#C9D0D5,#8E989F);border-radius:0 0 12px 12px"></div>
   <div style="font-size:.85rem;color:var(--ink-2);margin-top:6px">${o.caption||'Technician’s laptop'}</div></div>`;
}
/* Windows 11 / Server 2025 taskbar */
function taskbar(items,o={}){
  return `<div style="position:absolute;left:0;right:0;bottom:0;height:34px;background:${o.dark?'rgba(32,32,32,.94)':'rgba(243,243,243,.96)'};display:flex;justify-content:${o.left?'flex-start':'center'};align-items:center;gap:.2rem;padding:0 8px;color:${o.dark?'#fff':'#1b1b1b'};z-index:3">
    <span style="display:inline-grid;place-items:center;width:30px;height:28px;color:#0067C0;font-size:1rem">⊞</span>${items.map(([id,l,active])=>`<span${dt(id)} style="display:inline-grid;place-items:center;height:28px;padding:0 .55rem;border-radius:5px;font-size:.74rem;${active?'background:'+(o.dark?'rgba(255,255,255,.12)':'#fff')+';border:1px solid '+(o.dark?'transparent':'#DADADA'):''}">${l}</span>`).join('')}
    <span style="position:absolute;right:10px;font-size:.7rem;text-align:right;line-height:1.15">${o.clock||'10:42 AM<br>11/14/2026'}</span></div>`;
}
return {t,wbtn,abtn,link,field,check,radio,tabs,win,dlg,wizard,wzb,node,table,menu,term,nano,keyRow,monFrame,lapFrame,taskbar,esc};
})();
