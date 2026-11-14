/* Station 3 guided demo: Cable Termination. Straight-through (T568B both ends) and crossover (T568A / T568B). */
(function(){
const E=window.CbEngine, D=window.CBD, N=S3Scenes.NAMES;
const H={strip:[396,88,90,56], pairs:[246,86,136,62], wires:[246,92,100,50], plug:[244,60,170,112], reelCut:[556,104,50,40]};
const FZ={strip:[180,40,400,170], pairs:[140,40,330,150], plug:[140,30,340,160]};

function pinSay(i,w){ const n=N[w];
  return [`Pin 1 is <b>${n}</b>. Start on the left, with the plug’s clip facing away from you.`,
    `Its partner, <b>${n}</b>, goes on pin 2. Pins 1 and 2 are one pair.`,
    `Pin 3 is <b>${n}</b>.`,
    `Pin 4 is <b>${n}</b>. The blue pair sits in the middle, on pins 4 and 5.`,
    `Pin 5 is <b>${n}</b>, blue’s partner.`,
    `Pin 6 is <b>${n}</b>. It pairs with pin 3, so this pair is split around the blue pair.`,
    `Pin 7 is <b>${n}</b>.`,
    `Pin 8 is <b>${n}</b>. The brown pair always ends the row.`][i]; }

function make(task){
  const b=[]; const add=(ch,t,say,o={})=>b.push(Object.assign({ch,t,say},o));
  const X=task==='crossover';
  const stdA=X?D.T568A:D.T568B, stdB=D.T568B;

  /* ===== plan ===== */
  add('plan','The job',X?'Make a crossover cable: T568A at one end and T568B at the other. It links two PCs directly, or two old switches.':'Make a straight-through patch cable: T568B at both ends. It is the normal cable from a PC to a switch or a wall outlet.',
    {scene:'intro',explore:true,items:[['cb-utp-roll','Cat6 cable box'],['rj45-plug','RJ45 plugs'],['tool-stripper','Cable stripper'],['tool-crimper','Crimping tool'],['tool-cable-tester','Cable tester']]});
  b[b.length-1].say+=' Open each tool to see what it does and what it looks like.';
  add('plan','Choose the cable','Three cables are on the shelf. Pick the one that is right for a permanent office run.',
    {scene:'pick',target:'cat6',label:'Choose this cable',options:[
      {id:'cat6',art:'cb-utp-roll',name:'Cat6 U/UTP solid copper',sub:'23 AWG · 305 m box',good:true,verdict:'Solid copper, standards compliant'},
      {id:'cca',art:'cb-cat6',name:'Cat6 “CCA”',sub:'Copper-clad aluminium',good:false,verdict:'Brittle, fails with PoE, not compliant'},
      {id:'flat',art:'cb-cat5e',name:'Flat patch cable',sub:'No twisted pairs',good:false,verdict:'Picks up noise, cannot be certified'}],
      act:s=>{s.cable='cat6';},ok:'Solid copper Cat6 carries 1 Gbps to 100 m and can carry PoE.',photo:'cb-utp-roll'});
  add('plan','Measure with slack','The run from the wall outlet to the switch is 9 m. How much will you cut?',
    {scene:'pick',target:'10',label:'Choose this length',options:[
      {id:'9',big:'9 m',name:'Exactly the run',good:false,verdict:'No slack to route it or to re-terminate'},
      {id:'10',big:'10 m',name:'Run plus about 10 %',good:true,verdict:'Enough slack at both ends'},
      {id:'15',big:'15 m',name:'Plenty extra',good:false,verdict:'Ends up coiled behind the rack'}],
      act:s=>{s.length=10;},ok:'Add about 10 per cent. The whole channel, patch leads included, must stay under 100 m.'});
  add('plan','Cut the cable','Cut the cable square with the cutter on the crimping tool.',
    {scene:'bench',hot:H.reelCut,label:'Cut here',act:s=>{s.cut=true;},ok:'A square cut keeps the eight wires the same length later.',
     tip:'Never kink the cable or bend it tighter than four times its thickness.'});

  /* ===== strip ===== */
  add('strip','The right tool','Use a cable stripper, not a knife. Its blade is set to cut only the jacket.',
    {scene:'part',art:'tool-stripper',target:'part:blade',label:'Adjustable blade',act:s=>{},ok:'A knife easily nicks a copper wire, and a nicked wire breaks weeks later.',photo:'tool-stripper'});
  add('strip','Strip the jacket','Clamp the stripper about 25–30 mm from the end of the cable, turn it once around, then pull the jacket off.',
    {scene:'bench',end:'A',focus:FZ.strip,hot:H.strip,label:'Strip about 28 mm',act:s=>{Object.assign(s.ends.A,{stripped:true,stripLen:28,nicked:false});},ok:'28 mm of jacket is off. The four twisted pairs are free.'});
  add('strip','Look at the pairs','Four twisted pairs: orange, green, blue and brown, each with a white-striped partner. Check there is no shiny copper showing.',
    {scene:'bench',end:'A',focus:FZ.pairs,tip:'If you see a bright copper mark, a wire is nicked. Cut the end off and strip again.'});
  add('strip','Cut the rip cord and spline','Snip the nylon rip cord and the plastic spline (the cross in the middle of Cat6) back to the jacket.',
    {scene:'bench',end:'A',focus:FZ.pairs,hot:H.pairs,label:'Rip cord and spline',act:s=>{s.ends.A.cleaned=true;},ok:'Nothing is left to push the wires out of line inside the plug.'});

  /* ===== arrange end A ===== */
  add('arrange','Untwist the pairs','Untwist the pairs and straighten the wires, but only as far as you need.',
    {scene:'bench',end:'A',focus:FZ.pairs,hot:H.pairs,label:'Untwist',act:s=>{s.ends.A.untwisted=true;},ok:'The twists cancel noise between the pairs, so they must continue as close to the plug as possible.',
     tip:'Keep the untwisted part under about 13 mm. More can pass a simple tester but fail at gigabit.'});
  add('arrange',`The T568${X?'A':'B'} order`,X?'This end uses T568A: white-green, green, white-orange, blue, white-blue, orange, white-brown, brown.':'T568B is: white-orange, orange, white-green, blue, white-blue, green, white-brown, brown. Now place them one by one.',
    {scene:'order',end:'A'});
  stdA.forEach((w,i)=>add('arrange',`Pin ${i+1}: ${N[w]}`,pinSay(i,w),{scene:'order',end:'A',target:'w-'+w,label:N[w],act:s=>{s.ends.A.order.push(w);},ok:i===7?'All eight wires are in order.':''}));
  add('arrange','Flatten the row','Hold the eight wires flat and tight between your thumb and finger, in this order.',
    {scene:'bench',end:'A',focus:FZ.pairs,tip:'A wire that slips out of line while you trim or insert is the most common mistake. Keep hold of them.'});

  /* ===== insert end A ===== */
  add('insert','Trim the wires','Trim all eight straight across, leaving about 13 mm in front of the jacket.',
    {scene:'bench',end:'A',focus:FZ.pairs,hot:H.wires,label:'Trim to 13 mm',act:s=>{s.ends.A.trim=13;},ok:'All eight are the same length, so they reach the contacts together.',
     tip:'Too long and the jacket stays outside the plug. Too short and the far wires never reach the contacts.'});
  add('insert','Insert into the plug','Hold the plug with the clip facing down and push the wires in until they touch the front.',
    {scene:'bench',end:'A',focus:FZ.pairs,hot:H.wires,label:'Push into the plug',act:s=>{s.ends.A.inserted=true; s.ends.A.jacketIn=true;},ok:'Each wire ran into its own channel and the jacket is inside the plug.',photo:'rj45-plug'});
  add('insert','Check through the plug','Look through the clear plug: the colour order, all eight touching the front, and the jacket under the strain relief.',
    {scene:'bench',end:'A',focus:FZ.plug,hot:H.plug,label:'Check the plug',act:s=>{s.ends.A.checked=true;},ok:'This is the last moment a mistake costs nothing. After crimping, the plug can only be cut off.'});

  /* ===== crimp end A ===== */
  add('crimp','The crimping tool','The 8P die is for RJ45 plugs; the smaller 6P die is for phone plugs.',
    {scene:'part',art:'tool-crimper',target:'part:head',label:'8P die',act:s=>{},ok:'Put the plug into the 8P die until it clicks.',photo:'tool-crimper'});
  add('crimp','Crimp','Squeeze the handles firmly until the ratchet releases.',
    {scene:'crimp',end:'A',hot:[100,14,80,56],label:'Squeeze',act:s=>{s.ends.A.crimped=true;},ok:'The eight contacts pierced the insulation into the copper, and the strain relief gripped the jacket.',
     tip:'A half squeeze leaves contacts that work now and fail later when the cable moves.'});
  add('crimp','Pull test','Pull gently on the cable. The plug must not move.',
    {scene:'bench',end:'A',focus:FZ.plug,hot:H.plug,label:'Pull gently',act:s=>{},ok:'End A is done.'});

  /* ===== end B ===== */
  add('endb','Strip end B','Go to the other end of the cable. Strip 28 mm, cut the rip cord and spline, and untwist the pairs.',
    {scene:'bench',end:'B',focus:FZ.strip,hot:H.strip,label:'Strip end B',act:s=>{Object.assign(s.ends.B,{stripped:true,stripLen:28,cleaned:true,untwisted:true});},ok:'End B is ready to arrange.'});
  if(X){
    add('endb','End B uses T568B','For a crossover, the second end uses the other standard: T568B.',{scene:'order',end:'B'});
    stdB.forEach((w,i)=>add('endb',`Pin ${i+1}: ${N[w]}`,pinSay(i,w),{scene:'order',end:'B',target:'w-'+w,label:N[w],act:s=>{s.ends.B.order.push(w);},ok:i===7?'The orange and green pairs are now swapped between the two ends: that is what makes it a crossover.':''}));
  } else {
    add('endb','Same order again','Straight-through means the same standard at both ends. Arrange end B in T568B too.',
      {scene:'order',end:'B',target:'w-wo',label:'Start with white-orange',act:s=>{s.ends.B.order=[...D.T568B];},ok:'White-orange, orange, white-green, blue, white-blue, green, white-brown, brown: the same as end A.',
       tip:'Using a different standard at each end by mistake turns the cable into a crossover.'});
  }
  add('endb','Trim and insert','Trim to 13 mm, insert with the clip down, and check through the plug.',
    {scene:'bench',end:'B',focus:FZ.pairs,hot:H.wires,label:'Trim and insert',act:s=>{Object.assign(s.ends.B,{trim:13,inserted:true,jacketIn:true,checked:true});},ok:'Both ends look the same through the plug.'});
  add('endb','Crimp end B','Crimp the second plug the same way.',
    {scene:'crimp',end:'B',hot:[100,14,80,56],label:'Squeeze',act:s=>{s.ends.B.crimped=true;},ok:'The cable is finished. Now prove it works.',
     tip:'If the job needs boots, slide them onto the cable before inserting the wires.'});

  /* ===== test ===== */
  add('test','Plug in the tester','Plug end A into the master unit and end B into the remote unit.',
    {scene:'tester',hot:[18,50,30,28],label:'Master port',act:s=>{s.pluggedTester=true;},ok:'Both ends are connected.',photo:'tool-cable-tester'});
  add('test','Switch it on','Slide the switch to ON.',
    {scene:'tester',hot:[52,56,26,18],label:'ON switch',act:s=>{s.testerOn=true; s.tested=true; s.result=E.test(s);},ok:'The master sends a signal down each wire in turn.'});
  add('test','Read the lights',X?'Pin 1 at the master lights pin 3 at the remote, 2 lights 6, 3 lights 1 and 6 lights 2: the orange and green pairs are swapped, as a crossover should be.':'The lights step 1 to 8 on both units together. That is a correct straight-through cable.',
    {scene:'tester'});
  add('test','What faults look like','A light that never comes on is an <b>open</b> (a wire not reaching its contact). Two lights at once is a <b>short</b>. Lights out of step are <b>crossed wires</b>.',
    {scene:'tester',tip:'A tester checks the order only. A split pair can pass it and still fail at gigabit; only a certifier measures that.'});
  add('test','Label both ends','Write the same label on both ends, for example the room and outlet number.',
    {scene:'bench',end:'A',focus:FZ.plug,hot:H.plug,label:'Label the cable',act:s=>{s.labeled=true;},ok:'Record it in the network log too. You will use this log at Station 4.'});
  return b;
}
function where(s,b){
  switch(b.scene){
    case 'intro': return ['Tool table'];
    case 'pick': return ['Tool table','Choose'];
    case 'part': return ['Close-up',Art.def(b.art).name];
    case 'bench': return ['Workbench', s.cut?`Cable end ${b.end||'A'}`:'Cable box'].concat(b.focus?[s.ends[b.end||'A'].inserted?'The plug (close-up)':s.ends[b.end||'A'].stripped?'The wires (close-up)':'The jacket (close-up)']:[]);
    case 'order': return ['Workbench',`End ${b.end||'A'}`,'Wire order'];
    case 'crimp': return ['Crimping tool',`Plug on end ${b.end||'A'}`];
    case 'tester': return ['Cable tester'];
  }
  return [];
}
const INSTALLED={'Strip the jacket':'stripped Cat6 cable twisted pairs','Cut the rip cord and spline':'Cat6 cable spline rip cord','Untwist the pairs':'untwisted Cat6 wires straightened',
  'The T568B order':'T568B wiring order diagram','The T568A order':'T568A wiring order diagram','Flatten the row':'RJ45 T568B wires flattened in order','Insert into the plug':'RJ45 wires inserted into plug before crimping',
  'Check through the plug':'RJ45 plug wires reach front contacts T568B','Crimp':'crimped RJ45 connector close up','Pull test':'finished RJ45 patch cable end','Switch it on':'RJ45 LAN cable tester lights',
  'Read the lights':'RJ45 cable tester lights 1 to 8','Label both ends':'network cable labels both ends'};
function withPhotos(list){ list.forEach(x=>{ if(INSTALLED[x.t]) x.photo='q:'+INSTALLED[x.t]; }); return list; }
const CH=[
  {id:'plan',title:'Plan, measure and cut',ends:'The right cable is chosen and cut to 10 m.'},
  {id:'strip',title:'Strip the jacket',ends:'About 28 mm of jacket removed with no nicked wires.'},
  {id:'arrange',title:'Untwist and arrange end A',ends:'The eight wires are flat and in the correct order.'},
  {id:'insert',title:'Trim and insert end A',ends:'Wires trimmed to 13 mm, pushed to the front, jacket inside the plug.'},
  {id:'crimp',title:'Crimp end A',ends:'End A is crimped and holds.'},
  {id:'endb',title:'Terminate end B',ends:'End B is stripped, arranged, inserted and crimped.'},
  {id:'test',title:'Test and label',ends:'The cable passes the tester and is labelled at both ends.'},
];
Demo.start({
  id:'s3', station:'Station 3', title:'Cable Termination',
  tracks:{straight:{name:'Straight-through (T568B)',chapters:CH,beats:withPhotos(make('straight')),init:()=>E.fresh('straight')},
          crossover:{name:'Crossover (T568A / T568B)',chapters:CH,beats:withPhotos(make('crossover')),init:()=>E.fresh('crossover')}},
  where,
  render:S3Scenes.render,
  finishText:'You have made and tested a network cable, from choosing the cable to labelling it.',
  next:{href:'station4.html',label:'Station 4: Network Setup'},
});
})();
