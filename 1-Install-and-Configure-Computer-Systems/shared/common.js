/* Scenes shared by all stations: one part big, choose between parts, a table of parts, a document page. */
window.Common=(function(){
const A=window.Art, esc=Demo.esc;
const main=svg=>svg.replace('<svg ','<svg data-main ');
const addTo=(svg,extra)=>svg.replace(/<\/svg>\s*$/,extra+'</svg>');
function part(s,b){ return main(A.svg(b.art,{view:b.view,cls:'part-view',state:Object.assign({on:false},b.state||{}),label:A.def(b.art).name})); }
function pick(s,b,o){
  const chosen=o.done&&o.beat===b; const cols=Math.min(b.options.length,4);
  return `<div class="sc-grid" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">`+b.options.map(op=>{
    const cls=chosen?(op.good?' good':' bad'):'';
    const pic=op.art?A.svg(op.art,{view:op.view,state:Object.assign({on:false},op.state||{}),label:op.name}):(op.big?`<div style="font-size:2.4rem;font-weight:700;padding:.6rem 0">${esc(op.big)}</div>`:'');
    return `<div class="sc-card${cls}" data-t="${esc(op.id)}">${pic}<div class="nm">${esc(op.name)}</div><div class="sb">${esc(op.sub||'')}</div>`+
      (chosen?`<div class="verdict">${op.good?'✓ ':'✗ '}${esc(op.verdict||'')}</div>`:'')+`</div>`; }).join('')+`</div>`;
}
function intro(s,b){ return `<div class="sc-thumbs" data-fith>`+b.items.map(([t,l,st])=>`<div class="it"${b.explore?` data-mat="${t}" role="button" tabindex="0"`:''}>${A.thumb(t,{label:l,state:Object.assign({on:true},st||{})})}<div>${esc(l)}</div></div>`).join('')+`</div>`; }
function doc(s,b){ return `<div class="sc-doc">${typeof b.doc==='function'?b.doc(s):b.doc}</div>`; }
return {part,pick,intro,doc,main,addTo};
})();
