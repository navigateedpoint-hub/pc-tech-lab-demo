/* Station 3 demo scenes: the cable on the bench, the wire order, the crimping tool and the tester. */
window.S3Scenes=(function(){
const A=window.Art, P=A.P, D=window.CBD, DR=window.CbDraw, C=window.Common, esc=Demo.esc;
const NAMES={wo:'white-orange',o:'orange',wg:'white-green',g:'green',wb:'white-blue',b:'blue',wbr:'white-brown',br:'brown'};
const cssWire=c=>{ const col=D.colors[c]; return col[1].startsWith('repeating')?`repeating-linear-gradient(0deg,#F4F4F2 0 9px,${col[2]} 9px 16px)`:col[2]; };

function bench(s,b){
  let g=DR.bench(s,b.end||'A',{noHead:!!b.focus});
  if(s.labeled){ g=C.addTo(g,`<g><path d="M150 137 v26" stroke="#8C969E" stroke-width="1"/><rect x="118" y="160" width="64" height="22" rx="3" fill="#FFF6CC" stroke="#C9B458"/><text x="150" y="175" text-anchor="middle" font-size="11" font-weight="700" fill="#3A2F00">A-102-3</text></g>`); }
  return C.main(g);
}
/* arranging the eight wires, left to right = pins 1 to 8, clip away from you */
function order(s,b){
  const end=b.end||'A', e=s.ends[end], std=D.tasks[s.task].ends[end]==='A'?D.T568A:D.T568B;
  const placed=e.order, left=std.filter(w=>!placed.includes(w));
  const pool=[...left].sort((x,y)=>Object.keys(NAMES).indexOf(x)-Object.keys(NAMES).indexOf(y));
  const slot=(i)=>{ const w=placed[i]; return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px">
      <div style="width:min(44px,8.5vw);height:min(150px,30vw);border-radius:22px;${w?`background:${cssWire(w)};border:2px solid #20282D`:`border:2px dashed ${i===placed.length?'#F4C430':'#8C969E'};background:transparent`}"></div>
      <div style="font-weight:700">${i+1}</div><div style="font-size:clamp(.6rem,1.8vw,.78rem);color:var(--ink-2);min-height:2.2em;text-align:center;max-width:64px;overflow-wrap:anywhere">${w?NAMES[w]:''}</div></div>`; };
  const loose=pool.map(w=>`<div data-t="w-${w}" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px;border-radius:10px">
      <div style="width:min(36px,7vw);height:min(96px,20vw);border-radius:18px;background:${cssWire(w)};border:2px solid #20282D"></div><div style="font-size:clamp(.6rem,1.8vw,.78rem);text-align:center;max-width:64px">${NAMES[w]}</div></div>`).join('');
  return `<div style="display:flex;flex-direction:column;gap:18px;width:100%;max-width:820px">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-weight:700"><span>End ${end}: T568${D.tasks[s.task].ends[end]}</span><span style="color:var(--ink-2);font-weight:400">Clip facing away · pin 1 on the left</span></div>
    <div style="display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:3px;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px 10px">${std.map((w,i)=>slot(i)).join('')}</div>
    <div style="font-size:.9rem;color:var(--ink-2)">${left.length?'Loose wires':'All eight wires are in order.'}</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;min-height:130px">${loose}</div></div>`;
}
/* crimping tool holding the plug */
function crimp(s,b){
  const end=b.end||'A'; const done=s.ends[end].crimped;
  let g=A.svg('tool-crimper',{view:'side',state:{squeezed:!!s._squeeze&&!done?true:false}});
  g=C.addTo(g,`<g><rect x="10" y="35" width="20" height="10" rx="1.5" fill="url(#m-clear)" stroke="#9DB3C0" stroke-width=".5"/><path d="M10 40 C -6 40 -10 52 -20 70" stroke="#2F6FC0" stroke-width="4" fill="none"/>`+
    (done?`<text x="20" y="0" text-anchor="middle" font-size="5.5" font-weight="700" fill="#1C7F52">✓ crimped</text>`:'')+`</g>`);
  return C.main(g.replace('viewBox="-5 -5 190 100"','viewBox="-28 -8 216 106"'));
}
/* the tester: master and remote, with the lights stepping through pins 1 to 8 */
function tester(s,b){
  const r=s.result, on=!!s.testerOn, plugged=!!s.pluggedTester;
  const want=s.task==='crossover'?[2,5,0,3,4,1,6,7]:[0,1,2,3,4,5,6,7];
  let g=`<svg data-main viewBox="-8 -4 252 136" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cable tester">`+
    `<style>.chase{opacity:0;animation:chase 4.8s linear infinite}@keyframes chase{0%,11.5%{opacity:1}12.5%,100%{opacity:0}}@media (prefers-reduced-motion:reduce){.chase{animation:none;opacity:1}}</style>`;
  g+=P.shadow(118,102,110,3);
  if(plugged) g+=`<path d="M33 79 C33 124, 173 124, 173 79" fill="none" stroke="#173F6E" stroke-width="7"/><path d="M33 79 C33 124, 173 124, 173 79" fill="none" stroke="#2F6FC0" stroke-width="5"/>`;
  const unit=(x,lbl,remote)=>{ let u=`<rect x="${x}" y="6" width="96" height="92" rx="8" fill="url(#m-black)"/><rect x="${x+2}" y="8" width="92" height="14" rx="6" fill="url(#m-gloss)"/><rect x="${x+6}" y="14" width="84" height="26" rx="3" fill="#101417"/>`;
    for(let i=0;i<8;i++){ const px=x+13+i*10; u+=P.led(px,25,{r:3,lit:false})+P.text(px,36.5,String(i+1),{a:'middle',s:5,f:'#AEB8BF'}); }
    u+=P.led(x+83,50,{r:2.4,lit:on,color:'g'})+P.text(x+83,59,'G',{a:'middle',s:4.4,f:'#AEB8BF'});
    u+=P.rj45(x+22,54,{w:22,h:19,plug:plugged})+P.text(x+48,92,lbl,{a:'middle',s:6,f:'#DDE4E8',w:700});
    if(!remote) u+=`<rect x="${x+56}" y="60" width="18" height="10" rx="3" fill="url(#m-red)"/>`+P.text(x+65,78,'ON · AUTO',{a:'middle',s:4.2,f:'#AEB8BF'});
    return u; };
  g+=unit(0,'MASTER (end A)',false)+unit(140,'REMOTE (end B)',true);
  if(on&&r){ for(let i=0;i<8;i++){ const d=`style="animation-delay:${(i*0.6).toFixed(1)}s"`;
      g+=`<circle class="chase" ${d} cx="${13+i*10}" cy="25" r="3" fill="url(#m-led-g)" filter="url(#f-glow)"/>`;
      const sh=r.shorts.find(p=>p.includes(i+1));
      if(sh) sh.forEach(pn=>g+=`<circle class="chase" ${d} cx="${153+(pn-1)*10}" cy="25" r="3" fill="url(#m-led-r)" filter="url(#f-glow)"/>`);
      else if(!r.opens.includes(i+1)&&r.map[i]!=null) g+=`<circle class="chase" ${d} cx="${153+r.map[i]*10}" cy="25" r="3" fill="url(#m-led-${r.map[i]===want[i]?'g':'a'})" filter="url(#f-glow)"/>`; } }
  return g+'</svg>';
}
const FIT=(w,h)=>`<div data-fit="${w}" style="width:100%;max-width:${w}px;display:flex;justify-content:center">${h}</div>`;
function render(s,b,o){
  switch(b.scene){
    case 'bench': return bench(s,b);
    case 'order': return FIT(780,order(s,b));
    case 'crimp': return crimp(s,b);
    case 'tester': return tester(s,b);
    case 'part': return C.part(s,b);
    case 'pick': return C.pick(s,b,o);
    case 'intro': return C.intro(s,b);
    case 'doc': return C.doc(s,b);
  }
  return 'Missing scene '+esc(b.scene);
}
return {render,NAMES};
})();
