/* Server Setup: the server corner of the office (front) and the back of the server, UPS and switch (for cabling). */
window.RoomScene=(function(){
const A=window.Art, P=A.P;
const esc=Demo.esc;
const T=(x,y,t,o={})=>P.text(x,y,t,Object.assign({s:11,f:'#2A3540',w:700},o));
const hit=(id,x,y,w,h,label)=>`<rect class="hit" data-zone="${id}" x="${x}" y="${y}" width="${w}" height="${h}" rx="3" tabindex="0" role="button" aria-label="${esc(label)}"/>`;
const at=(x,y,sc,inner)=>`<g class="nohit" transform="translate(${x} ${y}) scale(${sc})">${inner}</g>`;
const defs=`<defs><linearGradient id="rm-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9EEF1"/><stop offset="1" stop-color="#D3DBE0"/></linearGradient>
  <linearGradient id="rm-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9A58C"/><stop offset="1" stop-color="#9C876D"/></linearGradient>
  <linearGradient id="rm-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9825A"/><stop offset="1" stop-color="#7F5E3E"/></linearGradient></defs>`;

/* front: shelf with router and switch, the server console on a small table, the server and UPS on the floor, the technician's laptop */
function front(s){
  const on=!!s.on, ups=!!s.ups, W=s.track!=='U';
  let g=`<svg data-main class="art notip" viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Server corner of the office">${defs}`;
  g+=`<rect x="0" y="0" width="900" height="305" fill="url(#rm-wall)"/><rect x="0" y="305" width="900" height="115" fill="url(#rm-floor)"/>`;
  /* wall shelf: router and switch from Station 4 */
  g+=`<rect x="36" y="92" width="270" height="7" rx="2" fill="url(#rm-wood)"/><rect x="36" y="160" width="270" height="7" rx="2" fill="url(#rm-wood)"/>`;
  g+=at(48,22,.9,A.inner('router','front',{on:true}));
  g+=at(62,112,1,A.inner('switch','front',{on:true,links:[1,1,1,1,1,!!(s.cab&&s.cab.lan)],traffic:true}));
  g+=T(171,186,'Router and switch (Station 4)',{a:'middle',s:9,f:'#56616A',w:400});
  /* technician's laptop on a side desk */
  g+=`<rect x="20" y="300" width="250" height="10" rx="2" fill="url(#rm-wood)"/><rect x="34" y="310" width="8" height="100" fill="#6B4E33"/><rect x="248" y="310" width="8" height="100" fill="#6B4E33"/>`;
  g+=at(48,178,.6,A.inner('laptop','front',{on:true}));
  g+=T(145,328,'Technician’s laptop',{a:'middle',s:9,f:'#56616A',w:400});
  /* console table with monitor and keyboard */
  g+=`<rect x="352" y="282" width="236" height="9" rx="2" fill="url(#rm-wood)"/><rect x="364" y="291" width="7" height="119" fill="#6B4E33"/><rect x="570" y="291" width="7" height="119" fill="#6B4E33"/>`;
  g+=at(376,120,.58,A.inner('monitor','front',{on:on,screen:on?(W?'#1B4F8C':'#101418'):undefined}));
  if(on) g+=W?`<text x="469" y="190" text-anchor="middle" font-size="9" fill="#DCE8F5" font-family="Segoe UI,Arial">${s.mon==='lock'||s.mon==='lock2'?'Press Ctrl+Alt+Delete':'Server Manager'}</text>`:`<text x="389" y="150" font-size="7" fill="#C9D2D8" font-family="monospace">srv-01 login: _</text>`;
  g+=`<rect x="404" y="266" width="132" height="13" rx="3" fill="#2A3036"/>`+[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<rect x="${408+i*11.6}" y="269" width="9" height="3" rx=".6" fill="#5A636A"/><rect x="${408+i*11.6}" y="274" width="9" height="3" rx=".6" fill="#5A636A"/>`).join('');
  g+=T(470,304,'Server console',{a:'middle',s:9,f:'#56616A',w:400});
  /* server and UPS on the floor */
  g+=at(612,122,.72,A.inner('server','front',{on,link:on&&s.cab&&s.cab.lan,disk:on}));
  g+=at(770,226,.8,A.inner('ups','front',{on:ups}));
  g+=T(676,116,'SRV-01',{a:'middle',s:11});
  g+=T(814,220,'UPS',{a:'middle',s:11});
  g+=hit('SRV_BTN',624,138,19,19,'Server power button')+hit('UPS_BTN',805,284,18,18,'UPS power button');
  return g+'</svg>';
}
/* back: server rear, UPS rear and the switch ports */
function back(s){
  const c=s.cab||{};
  let g=`<svg data-main class="art notip" viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Back of the server, the UPS and the switch">${defs}`;
  g+=`<rect x="0" y="0" width="760" height="380" fill="url(#rm-wall)"/><rect x="0" y="330" width="760" height="50" fill="url(#rm-floor)"/>`;
  g+=at(40,20,.78,A.inner('server','back',{on:!!s.on,link:!!(s.on&&c.lan),power:!!c.pwrSrv,plugs:{LAN1:c.lanSrv?'blue':false}}));
  g+=at(230,120,1,A.inner('ups','back',{out:{out1:!!c.pwr}}));
  g+=at(380,60,1.7,A.inner('switch','back',{plugs:{P1:true,P2:true,P3:true,P4:true,P5:true,P6:!!c.lan}}));
  g+=T(110,16,'Back of SRV-01',{a:'middle',s:11})+T(285,112,'Back of the UPS',{a:'middle',s:11})+T(558,50,'Office switch (back)',{a:'middle',s:11});
  g+=T(558,180,'P1 router · P2 PC-01 · P3 PC-02 · P4 printer · P5 NAS',{a:'middle',s:9,f:'#56616A',w:400});
  /* cords */
  if(c.pwrSrv&&c.pwr) g+=P.cableRun('M135 244 C 135 300 200 300 262 178',{w:5,color:'#20262B'});
  else if(c.pwrSrv) g+=P.cableRun('M135 244 C 135 300 170 326 220 330',{w:5,color:'#20262B'});
  if(c.lanSrv&&c.lan) g+=P.cableRun('M62 82 C 30 160 40 320 220 352 S 600 360 636 118',{w:4,color:'#2F7FD8'});
  else if(c.lanSrv) g+=P.cableRun('M62 82 C 30 160 40 300 120 345',{w:4,color:'#2F7FD8'});
  g+=hit('SRV_PWR',123,227,23,20,'Server power inlet')+hit('UPS_OUT1',246,152,32,28,'UPS battery outlet 1')+hit('SRV_LAN1',53,67,19,17,'Server LAN 1')+hit('SW_P6',621,91,30,27,'Switch port 6');
  return g+'</svg>';
}
return {front,back};
})();
