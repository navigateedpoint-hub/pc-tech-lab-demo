/* Station 1 guided demo: PC Assembly. Build A (office PC) and Build B (graphics workstation). */
(function(){
const E=window.AsmEngine;

/* focus boxes (viewBox coordinates) */
const F={
  benchStud:[0,0,170,120], benchSocket:[40,30,150,106], benchDimm:[118,24,170,160], benchM2:[36,96,160,100], benchFan:[84,6,160,110], benchCooler:[40,20,160,120],
  caseIO:[0,10,150,110], caseStray:[30,40,300,280], caseHdmi:[0,50,150,110],
  bATX:[176,30,120,100], bEPS:[28,8,140,100], bJFP:[150,188,136,82], bUSB3:[180,108,116,84], bAUD:[24,196,140,74], bFAN1:[24,92,140,90], bLEDs:[196,96,100,72], bPCIE:[24,150,180,100], bGPUPWR:[96,112,196,118], bSATA:[200,160,100,90],
};

function make(build){
  const b=[]; const add=(ch,t,say,o={})=>b.push(Object.assign({ch,t,say},o));
  const isB=build==='B';

  /* ===== 1. Prepare the workbench ===== */
  add('prep','Check the parts and tools',(isB?'Build B is a graphics workstation: the basic parts plus a tower cooler, a hard drive, a SATA SSD, a graphics card and a front fan.':'Build A is an office PC.')+' Open each item to see what it does and what it looks like.',
    {scene:'intro',explore:true,items:isB?[['motherboard','Motherboard'],['cpu-i5-12400','CPU'],['ram-ddr4','2 × memory'],['nvme','NVMe SSD'],['cooler-tower','Tower cooler'],['tool-thermal-paste','Thermal paste'],['hdd','Hard drive'],['ssd25','SATA SSD'],['gpu','Graphics card'],['psu-650','650 W PSU'],['fan120','Front fan'],['pc','Case'],['tool-esd-strap','Wrist strap'],['tool-screwdriver','Screwdriver'],['tool-zip-ties','Cable ties']]
      :[['motherboard','Motherboard'],['cpu-i5-12400','CPU'],['ram-ddr4','2 × memory'],['nvme','NVMe SSD'],['cooler-intel','Stock cooler'],['psu-550','550 W PSU'],['pc','Case'],['tool-esd-strap','Wrist strap'],['tool-screwdriver','Screwdriver'],['tool-zip-ties','Cable ties']]});
  add('prep','Start with the motherboard','Every other part must match the motherboard. Its specification tells you three things: the <b>CPU socket</b> (LGA1700), the <b>memory type</b> (DDR4) and the <b>size</b> (Micro-ATX, 244 × 244 mm).',
    {scene:'part',art:'motherboard',target:'part:SOCKET',label:'The CPU socket',act:s=>{},ok:'This is an LGA1700 socket for Intel Core 12th to 14th gen processors.',photo:'motherboard'});
  add('prep','Choose the CPU that fits','Two CPUs came in the box. Pick the one whose socket matches the board.',
    {scene:'pick',target:'cpu-i5-12400',label:'Choose this CPU',options:[
      {id:'cpu-i5-12400',art:'cpu-i5-12400',view:'top',name:'Intel Core i5-12400',sub:'Socket LGA1700',good:true,verdict:'Same socket as the board'},
      {id:'cpu-r5-7600',art:'cpu-r5-7600',name:'AMD Ryzen 5 7600',sub:'Socket AM5',good:false,verdict:'AM5 does not fit LGA1700'}],
      act:s=>{s.compatCpu=true;},ok:'The i5-12400 is LGA1700, like the board. The Ryzen 5 7600 needs an AM5 board and would never fit.',photo:'cpu-i5-12400'});
  add('prep','Choose the memory that fits','Now the memory. The board has DDR4 slots.',
    {scene:'pick',target:'ram-ddr4',label:'Choose this memory',options:[
      {id:'ram-ddr4',art:'ram-ddr4',name:'8 GB DDR4-3200',sub:'DDR4 · notch off-centre',good:true,verdict:'Matches the DDR4 slots'},
      {id:'ram-ddr5',art:'ram-ddr5',name:'16 GB DDR5-6000',sub:'DDR5 · notch near the centre',good:false,verdict:'The notch will not line up'}],
      act:s=>{s.compat=true;},ok:'DDR4 matches. DDR5 has its notch in a different place, so it physically cannot go into a DDR4 slot.',photo:'ram-ddr4'});
  add('prep','Protect the parts from static','Your body can carry thousands of volts of static without you feeling it. Clip the anti-static wrist strap to the grounding stud on the ESD mat.',
    {scene:'bench',focus:F.benchStud,hot:[8,6,22,22],label:'Grounding stud',act:s=>{s.esd=true;},ok:'You and the mat are now at the same potential, so no spark can jump into a chip.',
     tip:'Work with the PC unplugged. Hold boards by the edges and never touch gold contacts.',photo:'tool-esd-strap'});
  add('prep','Take out the motherboard','Take the board out of its anti-static bag and lay it flat on top of its box.',
    {scene:'bench',target:'zone:BOX',label:'Motherboard in its bag',act:s=>{s.onBox=true;},ok:'The cardboard box is firm and does not conduct: the board will not bend while you press parts in.',
     tip:'Never work on top of the anti-static bag: the outside of many bags is slightly conductive.'});

  /* ===== 2. Install the CPU ===== */
  add('cpu','Look at the socket','Under the metal load plate are 1,700 tiny spring contacts, protected by a black plastic cap. The lever on the right holds everything shut.',
    {scene:'socket'});
  add('cpu','Find pin 1 on the socket','A small triangle printed at one corner of the socket marks pin 1.',
    {scene:'socket',hot:[33,17,18,18],label:'Socket triangle',act:s=>{},ok:'The CPU goes in with its own triangle in this same corner.'});
  add('cpu','Unhook the lever','Press the lever down and push it slightly outward, away from the socket, so it slips out from under its hook.',
    {scene:'socket',hot:[172,30,26,146],label:'Socket lever',act:s=>{s.lever='free';},ok:'The lever is free of its hook.'});
  add('cpu','Lift the lever','Swing the lever all the way up.',
    {scene:'socket',hot:[172,20,34,156],label:'Lift the lever',act:s=>{s.lever='up';},ok:'The load plate is now released.'});
  add('cpu','Open the load plate','Lift the load plate. The black cap is clipped to it and goes up with it.',
    {scene:'socket',hot:[50,30,120,140],label:'Load plate',act:s=>{s.plate='up';},ok:'The contacts are exposed. Do not touch them: one bent contact can stop the PC from working.',
     tip:'Do not pull the cap off by hand. It pops off by itself when you close the lever.'});
  add('cpu','Find pin 1 on the CPU','The small gold triangle in one corner marks pin 1. The notches on the long edges only match the socket one way.',
    {scene:'part',art:'cpu-i5-12400',view:'top',target:'part:triangle',label:'Pin 1 triangle',act:s=>{},ok:'Turn the CPU so this triangle sits in the same corner as the socket triangle.',photo:'q:LGA1700 CPU pin 1 triangle socket alignment'});
  add('cpu','Place the CPU','Hold the CPU by its edges, line up the triangles and lower it straight down into the socket.',
    {scene:'socket',hot:[60,40,100,120],label:'Lower the CPU here',act:s=>{s.cpu=s.cpuModel; s.cpuRot=0;},ok:'It drops in flat with no pressure at all. The notches sit on the socket keys.',
     tip:'Never slide the CPU across the socket or press it down. Both bend the contacts.'});
  add('cpu','Lower the load plate','Close the load plate over the CPU. Its front edge slides under the screw head.',
    {scene:'socket',hot:[48,0,124,30],label:'Close the plate',act:s=>{s.plate='down';},ok:'The plate rests on the CPU. The cap is still on top of it.'});
  add('cpu','Lock the lever','Push the lever down firmly and hook it back under its tab.',
    {scene:'socket',hot:[172,10,40,166],label:'Push the lever down',act:s=>{s.lever='down'; s.cover=false; s.socketClosed=true; s.coverStored=false;},ok:'Firm pressure is normal. The cap popped off by itself.',
     tip:'If the lever needs extreme force, stop: the CPU may be turned the wrong way.'});
  add('cpu','Keep the cap','Put the protective cap in the motherboard box.',
    {scene:'socket',hot:[210,124,78,58],label:'The popped-off cap',act:s=>{s.coverStored=true;},ok:'Keep it: a board sent back for warranty must have the cap on the socket.'});

  /* ===== 3. Memory ===== */
  add('ram','Four memory slots','From the CPU outward they are DIMMA1, DIMMA2, DIMMB1 and DIMMB2. Which two should you use?',
    {scene:'bench',focus:F.benchDimm});
  add('ram','Check the manual','The manual lists the slots to use for two sticks.',
    {scene:'manual',target:'row2',label:'Two modules',act:s=>{s.slotsKnown=true;},ok:'DIMMA2 and DIMMB2. One stick on each channel gives dual-channel mode, double the memory bandwidth.',
     tip:'Putting both sticks side by side in A1 and A2 runs them in single-channel mode.'});
  add('ram','Open the DIMMA2 latch','Push the latch at the end of the slot outward.',
    {scene:'bench',focus:F.benchDimm,target:'zone:DIMMA2',label:'DIMMA2',act:s=>{s.dimm.DIMMA2.open=true;},ok:'The slot is open.'});
  add('ram','Open the DIMMB2 latch','Now open the latch on DIMMB2, the fourth slot.',
    {scene:'bench',focus:F.benchDimm,target:'zone:DIMMB2',label:'DIMMB2',act:s=>{s.dimm.DIMMB2.open=true;},ok:'Both slots are ready.'});
  add('ram','Find the notch','The notch in the gold edge is off-centre. It must line up with the key inside the slot.',
    {scene:'part',art:'ram-ddr4',target:'part:pcb',label:'The notch',act:s=>{},ok:'Turn the stick until the notch lines up with the key. It only fits one way.',photo:'ram-ddr4'});
  add('ram','Insert the first stick','Line up the notch and press both ends of the stick straight down into DIMMA2 until the latch clicks shut.',
    {scene:'bench',focus:F.benchDimm,target:'zone:DIMMA2',label:'Press into DIMMA2',act:s=>{Object.assign(s.dimm.DIMMA2,{stick:'ram-ddr4-8',seated:true,open:false});},ok:'The latch closed by itself: the stick is fully seated.',
     tip:'Do not rock the stick in from one end. It can end up half-seated and the PC will not start.'});
  add('ram','Insert the second stick','Do the same in DIMMB2.',
    {scene:'bench',focus:F.benchDimm,target:'zone:DIMMB2',label:'Press into DIMMB2',act:s=>{Object.assign(s.dimm.DIMMB2,{stick:'ram-ddr4-8',seated:true,open:false});},ok:'16 GB in dual-channel mode.'});

  /* ===== 4. M.2 SSD ===== */
  add('m2','The M2_1 slot','Below the CPU is M2_1. It is wired straight to the CPU (PCIe 4.0 x4): the fastest place for the system drive.',
    {scene:'bench',focus:F.benchM2,tip:'If a slot has a heatsink over it, unscrew the heatsink first and peel the plastic film off its thermal pad.'});
  add('m2','Remove the M.2 screw','Unscrew the tiny screw at the far end of the slot and keep it safe.',
    {scene:'bench',focus:F.benchM2,hot:[146,134,14,14],label:'M.2 screw',act:s=>{s.m2Screw=false;},ok:'The screw is out. It is easy to lose: put it in a parts tray.'});
  add('m2','Look at the connector','The gap in the gold contacts is the M key. It matches the key in the slot.',
    {scene:'part',art:'nvme',target:'part:keyM',label:'M key',act:s=>{},ok:'“2280” means 22 mm wide and 80 mm long, which matches the screw position.',photo:'nvme'});
  add('m2','Insert the SSD','Slide the SSD into the slot at an angle of about 30 degrees.',
    {scene:'bench',focus:F.benchM2,target:'zone:M2_1',label:'M2_1 slot',act:s=>{s.m2=true;},ok:'The SSD rests at an angle. That is normal before it is screwed down.'});
  add('m2','Screw it down','Press the end of the SSD down and put the screw back in.',
    {scene:'bench',focus:F.benchM2,hot:[146,130,16,18],label:'Screw it down',act:s=>{s.m2Secured=true; s.m2Screw=true;},ok:'The SSD lies flat and is held by the screw. Snug is enough.'});

  /* ===== 5. Cooler ===== */
  if(!isB){
    add('cooler','Thermal paste is already there','The stock cooler comes with thermal paste already applied to its base. Do not wipe it off and do not add more.',
      {scene:'part',art:'cooler-intel',view:'base',target:'part:paste',label:'Pre-applied paste',act:s=>{},ok:'The paste fills tiny gaps between the CPU and the cooler so heat can flow.',photo:'cooler-intel'});
    add('cooler','Place the cooler','Turn the cooler so its fan cable points towards CPU_FAN1, then set it on the CPU with the four push pins over the four holes.',
      {scene:'bench',focus:F.benchCooler,target:'zone:SOCKET',label:'Set the cooler on the CPU',act:s=>{s.cooler='cl-intel'; s.paste='pre'; s.filmOff=true; s.coolerLocked=false;},ok:'All four pins sit over their holes.'});
    add('cooler','Press the push pins','Press two diagonally opposite pins until each clicks, then the other two.',
      {scene:'bench',focus:F.benchCooler,target:'zone:SOCKET',label:'Press the pins diagonally',act:s=>{s.coolerLocked=true;},ok:'Pressing in diagonal order keeps the pressure even on the CPU.',
       tip:'Check from behind the board that all four pins came through. A loose pin lets the CPU overheat.'});
  } else {
    add('cooler','The tower cooler','A tower cooler is heavy. It needs a backplate behind the motherboard and its own mounting bracket.',
      {scene:'part',art:'cooler-tower',view:'side',target:'part:heatpipes',label:'Heat pipes',act:s=>{},ok:'Copper heat pipes carry the heat up into the aluminium fins.',photo:'cooler-tower'});
    add('cooler','Fit the mounting bracket','Put the backplate behind the socket, then screw the standoffs and the two bars on the front.',
      {scene:'bench',focus:F.benchCooler,target:'zone:SOCKET',label:'Fit the bracket',act:s=>{s.bracket=true;},ok:'The bracket is ready to take the cooler.'});
    add('cooler','Apply thermal paste','Put one pea-sized drop of paste in the centre of the CPU.',
      {scene:'paste',hot:[40,40,70,70],label:'Centre of the CPU',act:s=>{s.paste='ok';},ok:'The cooler’s pressure spreads it into a thin layer.',tip:'Too much paste spills over the edges; none at all leaves air gaps and the CPU overheats.',photo:'tool-thermal-paste'});
    add('cooler','Peel off the film','Turn the cooler over and peel the plastic film off its base.',
      {scene:'paste',hot:[176,20,114,114],label:'Protective film',act:s=>{s.filmOff=true;},ok:'Left on, the film blocks the heat completely and the CPU reaches 95 °C within minutes.'});
    add('cooler','Mount the cooler','Lower the cooler straight onto the CPU and tighten its two screws a little at a time, alternating sides.',
      {scene:'bench',focus:F.benchCooler,target:'zone:SOCKET',label:'Mount the cooler',act:s=>{s.cooler='cl-tower'; s.coolerLocked=true;},ok:'Even pressure, fans blowing towards the back of the case.'});
  }
  add('cooler','Plug in the fan','Plug the cooler’s fan cable into CPU_FAN1.',
    {scene:'bench',focus:F.benchFan,target:'zone:CPU_FAN1',label:'CPU_FAN1',act:s=>{s.cables.CPU_FAN1=true;},ok:'The board controls the fan speed from here. Without it, it shows a CPU fan error at every start.',
     tip:'Keep the cable away from the fan blades.',photo:'cb-fan-4pin'});

  /* ===== 6. Prepare the case ===== */
  add('caseprep','Remove the side panel','Undo the thumbscrews and lift off the glass side panel.',
    {scene:'case',view:'case',target:'zone:PANEL',label:'Glass side panel',act:s=>{s.panelOn=false; s.panelWasOff=true;},ok:'Lay the glass flat on a soft cloth, away from the edge of the table.'});
  add('caseprep','Standoffs','The brass standoffs lift the motherboard off the metal tray. There must be one under every mounting hole, and none anywhere else.',
    {scene:'case',view:'case'});
  add('caseprep','Remove the extra standoff','This standoff has no hole above it in a Micro-ATX board. Unscrew it.',
    {scene:'case',view:'case',focus:F.caseStray,hot:[146,219,20,20],label:'Extra standoff',act:s=>{s.strayStandoff=false; s.standoffs=true;},ok:'A standoff where there is no hole touches the back of the board and can short it.'});
  add('caseprep','Fit the I/O shield','Snap the I/O shield into the opening from inside the case, right way up (audio jacks at the bottom).',
    {scene:'case',view:'case',focus:F.caseIO,target:'zone:IOCUT',label:'I/O opening',act:s=>{s.io=true;},ok:'Press all four corners until it clicks. The shield grounds the ports and keeps out dust.',photo:'part-io-shield'});

  /* ===== 7. Mount the motherboard ===== */
  add('mount','Lower the motherboard','Tilt the board, slide its rear ports into the I/O shield, then lower it onto the standoffs.',
    {scene:'case',view:'case',target:'zone:TRAY',label:'Lower the board here',act:s=>{s.mbInCase=true;},ok:'The ports line up with the shield and every hole sits over a standoff.'});
  add('mount','Screw it in','Drive the screws in a cross pattern, snug but not tight.',
    {scene:'case',view:'case',target:'zone:TRAY',label:'Motherboard screws',act:s=>{s.mbScrews=true;},ok:'Overtightening can crack the board.',tip:'Use the fine-thread M3 motherboard screws, not the coarse case screws.'});

  /* ===== 8. PSU ===== */
  add('psu','Which way does the fan go?','The PSU sits at the bottom. Its fan faces <b>down</b> so it pulls cool air through the filter under the case.',
    {scene:'part',art:isB?'psu-650':'psu-550',view:'fan',target:'part:fan',label:'PSU fan',act:s=>{},ok:'Fan down, over the dust filter.',photo:isB?'psu-650':'psu-550'});
  add('psu','Slide in the PSU','Slide the power supply into its bay, fan facing down.',
    {scene:'case',view:'case-lower',target:'zone:PSU',label:'PSU bay',act:s=>{s.psu=true; s.psuFanDown=true;},ok:'The switch and power socket face out of the back of the case.'});
  add('psu','Screw it in and switch it off','Fit the four screws at the back, and set the PSU switch to O (off).',
    {scene:'case',view:'case-lower',target:'zone:PSU',label:'Screws and switch',act:s=>{s.psuSecured=true; s.psuOn=false;},ok:'It stays at O until everything is connected and ready to test.'});

  /* ===== B: drives ===== */
  if(isB){
    add('drives','Hard drive into the cage','Slide the 3.5-inch hard drive into the drive cage, connectors facing the back.',
      {scene:'case',view:'case',target:'zone:BAY35',label:'3.5" drive cage',act:s=>{s.hdd=true;},ok:'Secure it with the rails or screws of the cage.',photo:'hdd'});
    add('drives','SATA SSD','Screw the 2.5-inch SSD to its mount on the shroud.',
      {scene:'case',view:'case',target:'zone:BAY25',label:'2.5" SSD mount',act:s=>{s.ssd25=true;},ok:'An SSD has no moving parts, so any orientation is fine.',photo:'ssd25'});
    add('drives','SATA data cables','Connect both drives to the SATA ports on the motherboard with the thin red data cables.',
      {scene:'case',view:'case',focus:F.bSATA,target:'zone:SATA',label:'SATA ports',act:s=>{s.sataData.BAY35=true; s.sataData.BAY25=true;},ok:'The L-shaped connector only fits one way.',photo:'cb-sata-data'});
    add('drives','SATA power','Connect a SATA power cable from the PSU to each drive.',
      {scene:'case',view:'case',target:'zone:BAY35',label:'Drive power',act:s=>{s.sataPwr.BAY35=true; s.sataPwr.BAY25=true;},ok:'A drive needs both cables: data to the board and power from the PSU.',photo:'cb-sata-power'});
    /* ===== B: GPU ===== */
    add('gpu','Remove two slot covers','The graphics card is two slots wide. Remove the two covers level with PCI_E1.',
      {scene:'case',view:'case',target:'zone:SLOTS',label:'Slot covers',act:s=>{s.slotCovers=true;},ok:'Keep the covers in case the card is ever removed.'});
    add('gpu','Insert the graphics card','Open the slot latch, line the card up with PCI_E1 and press it straight down until the latch clicks.',
      {scene:'case',view:'case',focus:F.bPCIE,target:'zone:PCI_E1',label:'PCI_E1 slot',act:s=>{s.gpu=true;},ok:'The long x16 slot nearest the CPU is wired to the CPU for full speed.',photo:'gpu'});
    add('gpu','Screw the bracket','Screw the card’s bracket to the case.',
      {scene:'case',view:'case',target:'zone:SLOTS',label:'Card bracket',act:s=>{s.gpuScrewed=true;},ok:'The screw carries the card’s weight at the back.'});
  }

  /* ===== 9. Power cables ===== */
  add('power','The 24-pin connector','The widest cable powers the motherboard. The clip on its side latches over a tab on the header.',
    {scene:'part',art:'cb-atx24',target:'part:wires',label:'24-pin cable',act:s=>{},ok:'20+4: the extra 4 pins clip onto the side for older boards.',photo:'cb-atx24'});
  add('power','Plug in the 24-pin','Push it into ATX_PWR1 until the clip clicks.',
    {scene:'case',view:'case-board',focus:F.bATX,target:'zone:ATX_PWR1',label:'ATX_PWR1',act:s=>{s.cables.ATX_PWR1=true;},ok:'A half-seated 24-pin can overheat and melt.'});
  add('power','The CPU power connector','The 8-pin EPS cable is marked CPU. It looks like the PCIe cable for graphics cards, but the two are wired differently.',
    {scene:'part',art:'cb-eps8',target:'part:wires',label:'CPU 8-pin cable',act:s=>{},ok:'Never force a PCIe cable into the CPU header.',photo:'cb-eps8'});
  add('power','Plug in the CPU power','Run it through the top cut-out and plug it into CPU_PWR1 at the top left.',
    {scene:'case',view:'case-board',focus:F.bEPS,target:'zone:CPU_PWR1',label:'CPU_PWR1',act:s=>{s.cables.CPU_PWR1=true;},ok:'Without it the fans spin but the CPU gets no power: no picture, CPU debug light on.'});
  if(isB) add('power','Graphics card power','Plug the PCIe 8-pin cable into the top edge of the graphics card.',
    {scene:'case',view:'case-board',focus:F.bGPUPWR,hot:[228,157,24,16],label:'Card power socket',act:s=>{s.cables.GPU=true;},ok:'Without it the card has no power: VGA debug light, no picture.',photo:'cb-pcie8'});

  /* ===== 10. Front panel ===== */
  add('front','JFP1: the case buttons and lights','Bottom right of the board. Ten pins, one missing. Pin 1 has a square outline.',
    {scene:'case',view:'case-board',focus:F.bJFP});
  add('front','The pin map','Odd pins on the bottom row, even pins on the top. The manual shows what each pair does.',
    {scene:'jfp',photo:'cb-front-panel'});
  add('front','POWER SW','Plug the POWER SW connector onto pins 6 and 8.',
    {scene:'jfp',hot:[88,28,54,24],label:'Pins 6 and 8',act:s=>{s.jfp.PWR={a:6,b:8,plus:6};},ok:'Switches have no + or −: either way round works.'});
  add('front','RESET SW','Plug RESET SW onto pins 5 and 7.',
    {scene:'jfp',hot:[88,58,54,24],label:'Pins 5 and 7',act:s=>{s.jfp.RST={a:5,b:7,plus:5};},ok:'Reset restarts the PC instantly.'});
  add('front','POWER LED','Plug POWER LED onto pins 2 (+) and 4 (−). The coloured wire is +.',
    {scene:'jfp',hot:[28,28,54,24],label:'Pins 2 and 4',act:s=>{s.jfp.PLED={a:2,b:4,plus:2};},ok:'LEDs only light one way round. If it stays dark, turn the plug around.'});
  add('front','HDD LED','Plug HDD LED onto pins 1 (+) and 3 (−).',
    {scene:'jfp',hot:[28,58,54,24],label:'Pins 1 and 3',act:s=>{s.jfp.HDD={a:1,b:3,plus:1};},ok:'All four front-panel plugs are in.'});
  add('front','Front USB 3.0','The thick blue cable has one blocked hole: that is its key. Plug it into JUSB3.',
    {scene:'case',view:'case-board',focus:F.bUSB3,target:'zone:JUSB3',label:'JUSB3',act:s=>{s.cables.JUSB3=true;},ok:'Line up the key and press straight in. The pins bend easily.',photo:'cb-usb3-header'});
  add('front','Front audio','Plug the HD AUDIO cable into JAUD1 at the bottom left.',
    {scene:'case',view:'case-board',focus:F.bAUD,target:'zone:JAUD1',label:'JAUD1',act:s=>{s.cables.JAUD1=true;},ok:'The headphone and microphone jacks on the case now work.',photo:'cb-hd-audio'});
  add('front','Rear fan','Plug the rear exhaust fan into SYS_FAN1.',
    {scene:'case',view:'case-board',focus:F.bFAN1,target:'zone:SYS_FAN1',label:'SYS_FAN1',act:s=>{s.cables.SYS_FAN1=true;},ok:'The rear fan pushes warm air out of the case.'});
  if(isB) add('front','Front intake fan','Mount the 120 mm fan at the front with its label facing inward, so it blows air into the case. Plug it into SYS_FAN2.',
    {scene:'case',view:'case',target:'zone:FRONTFAN',label:'Front fan mount',act:s=>{s.frontFan='in'; s.cables.SYS_FAN2=true;},ok:'Cool air in at the front, warm air out at the back and top.',photo:'fan120'});

  /* ===== 11. First boot ===== */
  if(!isB) add('boot','Connect the monitor','Build A has no graphics card, so the monitor goes on the motherboard’s HDMI port.',
    {scene:'case',view:'case',focus:F.caseHdmi,target:'zone:IOHDMI',label:'Motherboard HDMI',act:s=>{s.display='IOHDMI';},ok:'The i5-12400 has built-in graphics, so the board’s video ports work.'});
  else add('boot','Connect the monitor','With a graphics card, the monitor goes on the card’s outputs, not on the motherboard.',
    {scene:'case',view:'case',target:'zone:GPUOUT',label:'Graphics card ports',act:s=>{s.display='GPUOUT';},ok:'The board’s own video ports are switched off when a graphics card is installed.'});
  add('boot','Power cord and switch','Plug in the power cord and set the PSU switch to I (on).',
    {scene:'case',view:'case-lower',target:'zone:PSU',label:'Cord and switch',act:s=>{s.cord=true; s.psuOn=true;},ok:'The PSU is live. Nothing starts until you press the power button.'});
  add('boot','Press the power button','Press the power button on the front of the case.',
    {scene:'desk',target:'part:power-btn',label:'Power button',act:s=>{s.poweredOn=true; s.posted=true;},ok:'Fans spin, the power light comes on and the board runs its power-on self-test (POST).'});
  add('boot','Watch the debug lights','During POST these lights come on one by one: CPU, DRAM, VGA, BOOT. A light that stays on points to the problem.',
    {scene:'case',view:'case-board',focus:F.bLEDs,act:s=>{s._leds={BOOT:true};},tip:'BOOT staying on is expected here: there is no operating system yet.'});
  add('boot','Enter the UEFI setup','While the logo shows, press Delete.',
    {scene:'desk',target:'key-del',label:'Press Del',act:s=>{s.inUefi=true; s._leds={};},ok:'You are in the UEFI setup, the firmware of the motherboard.'});
  const tiles=[['cpu','Check the CPU','Is the processor you installed named here?','Intel Core i5-12400: the CPU and its power cable are fine.'],
    ['mem','Check the memory','You installed two 8 GB sticks. Does the total match, and is it dual channel?','16 GB in dual channel: both sticks are seated in the right slots.'],
    ['stor','Check the storage',isB?'Three drives were installed. Are all three listed?':'Is the NVMe SSD listed?',isB?'All three drives are listed, so every data and power cable is in.':'The NVMe SSD is listed: it is seated and screwed down.'],
    ['temp','Check the temperature','At idle a CPU with a working cooler sits at about 30–45 °C.','36 °C: the cooler is mounted well and the paste is doing its job.'],
    ['fan','Check the fans','Each fan header should report a speed.','Both fans report their speed. A fan at 0 RPM would mean a loose or wrong header.']];
  tiles.forEach(([id,t,say,ok])=>add('boot',t,say,{scene:'uefi',target:id,label:t.replace('Check the ',''),act:s=>{s.seen=Object.assign({},s.seen,{[id]:true});},ok}));
  add('boot','No operating system yet','The boot list is empty. That is expected: the next station installs Windows.',
    {scene:'uefi',target:'boot',label:'Boot priority',act:s=>{s.uefiChecked=true;},ok:'The hardware is complete and working.'});

  /* ===== 12. Finish ===== */
  add('finish','Shut down','Leave the setup and switch the PC off before closing the case.',
    {scene:'desk',target:'part:power-btn',label:'Power button',act:s=>{s.poweredOn=false; s.posted=false; s.inUefi=false;},ok:'The PC is off.'});
  add('finish','Tidy the cables','Route cables behind the motherboard tray and tie them with cable ties, away from the fans.',
    {scene:'case',view:'case',target:'zone:TRAY',label:'Cable ties',act:s=>{s.tidy=true;},ok:'Tidy cables let air flow and make later repairs easier.',photo:'tool-zip-ties'});
  add('finish','Put the side panel back','Fit the glass panel and do up its thumbscrews.',
    {scene:'case',view:'case',hot:[6,6,408,468],label:'Fit the side panel',act:s=>{s.panelOn=true;},ok:isB?'Build B is finished.':'Build A is finished and ready for Station 2: installing Windows.'});
  return b;
}
function chapters(build){
  const isB=build==='B';
  const c=[
    {id:'prep',title:'Prepare the workbench',ends:'Parts checked, wrist strap on, motherboard lying on its box.'},
    {id:'cpu',title:'Install the CPU',ends:'The CPU is locked in the socket and the cap is stored.'},
    {id:'ram',title:'Install the memory',ends:'Two sticks in DIMMA2 and DIMMB2, running in dual channel.'},
    {id:'m2',title:'Install the M.2 SSD',ends:'The NVMe SSD is in M2_1 and screwed down.'},
    {id:'cooler',title:'Mount the CPU cooler',ends:'The cooler is firmly mounted and its fan is plugged in.'},
    {id:'caseprep',title:'Prepare the case',ends:'Side panel off, standoffs correct, I/O shield fitted.'},
    {id:'mount',title:'Mount the motherboard',ends:'The motherboard is screwed onto the standoffs.'},
    {id:'psu',title:'Install the power supply',ends:'The PSU is in, fan down, switched off.'},
  ];
  if(isB) c.push({id:'drives',title:'Install the drives',ends:'Hard drive and SATA SSD mounted and cabled.'},{id:'gpu',title:'Install the graphics card',ends:'The card is locked in PCI_E1 and screwed to the case.'});
  c.push({id:'power',title:'Connect the power cables',ends:'The motherboard, CPU'+(isB?' and graphics card':'')+' have power.'},
    {id:'front',title:'Front panel, USB, audio and fans',ends:'Buttons, lights, front ports and fans are connected.'},
    {id:'boot',title:'First boot and UEFI check',ends:'The PC passes POST and every part shows in UEFI.'},
    {id:'finish',title:'Tidy and close',ends:'Cables tied, side panel back on.'});
  return c;
}
const init=build=>()=>Object.assign(E.fresh(build),{seen:{},_leds:{}});
const AREA={benchStud:'ESD mat corner',benchSocket:'CPU socket',benchDimm:'Memory slots',benchM2:'M.2 slot (M2_1)',benchFan:'CPU_FAN1 header',benchCooler:'CPU socket and cooler',
  caseIO:'Rear I/O opening',caseStray:'Standoffs on the tray',caseHdmi:'Rear ports',bATX:'ATX_PWR1 (24-pin)',bEPS:'CPU_PWR1 (8-pin)',bJFP:'JFP1 front-panel header',bUSB3:'JUSB3 header',
  bAUD:'JAUD1 header',bFAN1:'SYS_FAN1 header',bLEDs:'EZ Debug LEDs',bPCIE:'PCI_E1 slot',bGPUPWR:'Graphics card power socket',bSATA:'SATA ports'};
const areaOf=new Map(Object.entries(F).map(([k,v])=>[v,AREA[k]]));
function where(s,b){
  let p;
  switch(b.scene){
    case 'intro': p=['Parts table']; break;
    case 'pick': p=['Parts table','Compatibility check']; break;
    case 'part': p=['Close-up',Art.def(b.art).name]; break;
    case 'bench': p=['Workbench',s.onBox?'Motherboard on its box':'Motherboard box']; break;
    case 'case': p=b.view==='case-board'?['Inside the case','Motherboard']:b.view==='case-lower'?['Inside the case','Bottom: PSU bay']:['Case, side panel '+(s.panelOn?'on':'off')]; break;
    case 'socket': p=['Motherboard','CPU socket (close-up)']; break;
    case 'paste': p=['Motherboard','CPU top and cooler base']; break;
    case 'jfp': p=['Motherboard','JFP1 header (close-up)']; break;
    case 'manual': p=['Motherboard manual','Memory page']; break;
    case 'desk': p=['Desk','Monitor, keyboard and PC']; break;
    case 'uefi': p=['Monitor','UEFI setup']; break;
    default: p=[];
  }
  const a=b.focus&&areaOf.get(b.focus); if(a) p.push(a);
  return p;
}
/* "see the actual image" for how things look once they are installed */
const INSTALLED={
  'Open the load plate':'LGA1700 socket open load plate',
  'Lock the lever':'Intel LGA1700 CPU installed in socket lever closed',
  'Keep the cap':'LGA1700 socket protective cover',
  'Insert the second stick':'two DDR4 RAM sticks installed dual channel motherboard',
  'Screw it down':'M.2 NVMe SSD installed on motherboard',
  'Press the push pins':'Intel stock cooler installed on motherboard',
  'Mount the cooler':'tower CPU cooler installed on motherboard',
  'Plug in the fan':'CPU cooler fan cable plugged into CPU_FAN header',
  'Remove the extra standoff':'motherboard standoffs in PC case',
  'Fit the I/O shield':'I/O shield installed in PC case',
  'Screw it in':'micro ATX motherboard installed in PC case',
  'Screw it in and switch it off':'power supply installed in PC case fan down',
  'Plug in the 24-pin':'24 pin ATX power connector plugged into motherboard',
  'Plug in the CPU power':'8 pin CPU EPS power connector plugged into motherboard',
  'HDD LED':'front panel connectors plugged into motherboard header',
  'Front USB 3.0':'USB 3.0 front panel header plugged into motherboard',
  'Front audio':'HD audio front panel connector plugged into motherboard',
  'Rear fan':'case fan cable plugged into SYS_FAN header',
  'Insert the graphics card':'graphics card installed in PCIe slot',
  'Graphics card power':'PCIe 8 pin power cable connected to graphics card',
  'SATA power':'hard drive installed in drive cage SATA cables connected',
  'Watch the debug lights':'MSI EZ Debug LED motherboard',
  'Enter the UEFI setup':'MSI Click BIOS EZ mode',
  'Tidy the cables':'PC cable management behind motherboard tray',
  'Put the side panel back':'finished PC build tempered glass side panel',
};
function withPhotos(list){ list.forEach(x=>{ if(INSTALLED[x.t]) x.photo='q:'+INSTALLED[x.t]; }); return list; }
Demo.start({
  id:'s1', station:'Station 1', title:'PC Assembly',
  tracks:{A:{name:'Build A: Office PC',chapters:chapters('A'),beats:withPhotos(make('A')),init:init('A')},
          B:{name:'Build B: Graphics workstation',chapters:chapters('B'),beats:withPhotos(make('B')),init:init('B')}},
  where,
  render:S1Scenes.render,
  finishText:'You have seen every step of building a PC, from the parts check to the first boot.',
  next:{href:'station2.html',label:'Station 2: OS Installation'},
});
})();
