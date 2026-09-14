(function(){
  'use strict';
  if(window.__INFINITY_DEPLOY_SAFE_REMOTE__)return;
  window.__INFINITY_DEPLOY_SAFE_REMOTE__=true;

  const ROOT='https://www-infinity4.github.io/';
  const REGISTRY='https://raw.githubusercontent.com/www-infinity4/Control-Phi/main/channels.json';
  const fallback=[
    ['Omni TV','Omni-TV'],['Hermit TV','Hermit-TV'],['Star Launcher','Star-Launcher'],['HBO','HBO'],['Starz','Starz'],['Cinemax','Cinemax'],['Showtime','Showtime'],['Encore','Encore'],['Cartoon Network','Cartoon-Network'],['WGN','WGN'],['TNT','TNT'],['NBC','NBC'],['FOX','FOX'],['FX','FX'],['Nickelodeon','Nickelodeon'],['FSN','FSN'],['ESPN','ESPN'],['MTV','MTV'],['VH1','VH1'],['AMC','AMC'],['Disney','Disney'],['USA','USA'],['Comedy Central','Comedy-Central'],['BET','BET'],['Discovery','Discovery'],['Nintendo TV','Nintendo-TV'],['Chiller','Chiller'],['TBS','TBS'],['ABC','ABC'],['CBS','CBS'],['PBS','PBS'],['History Channel','History-Channel'],['CNN','CNN'],['Trump TV','Trump-TV'],['ShopLC','ShopLC'],['Ozzy TV','Ozzy-TV'],['CCR TV','CCR-TV'],['Motor TV','Motor-TV'],['Physics TV','Physics-TV'],['Adventure TV','Adventure-TV'],['Trigger TV','Trigger-TV'],['Time Surfers','Time-Surfers'],['Syncord','Syncord'],['Astraflix','Astraflix'],['Vintech','Vintech'],['Flix Blender','Flix-Blender'],['Abstractia','Abstractia-'],['Animasync','Animasync'],['SeekSync','SeekSync'],['News Phi','News-Phi'],['Omni Phi','Omni-Phi'],['Infinity Phi','C13b0/phi'],['StarQuest','TV-Database']
  ].map(([name,path])=>({name,path}));

  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const href=item=>ROOT+encodeURIComponent(clean(item.path)).replace(/%2F/gi,'/')+'/';
  const esc=v=>clean(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function mount(){
    if(!document.body||document.getElementById('controlPhiButton'))return;
    const style=document.createElement('style');
    style.id='deploySafeChannelRemoteStyle';
    style.textContent=`#controlPhiButton{position:fixed;top:max(8px,env(safe-area-inset-top));right:8px;z-index:2147483645;min-width:108px;height:44px;padding:0 12px;border:1px solid rgba(255,255,255,.42);border-radius:14px;color:#fff;background:linear-gradient(145deg,#27a85f,#096d3d);box-shadow:0 9px 25px rgba(0,0,0,.38);font:900 18px/1 system-ui;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px}#controlPhiButton::after{content:'Channels';font:900 12px/1 system-ui;letter-spacing:.04em;text-transform:uppercase}#controlPhiPanel{position:fixed;inset:0 0 0 auto;z-index:2147483646;width:min(390px,92vw);padding:max(18px,env(safe-area-inset-top)) 16px max(24px,env(safe-area-inset-bottom));overflow:auto;color:#fff;background:linear-gradient(180deg,#07150f,#090811);box-shadow:-25px 0 80px rgba(0,0,0,.58);transform:translateX(105%);transition:transform .22s ease;font-family:Inter,system-ui,sans-serif}#controlPhiPanel.open{transform:translateX(0)}.cp-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.cp-head strong{font-size:1.25rem}.cp-head button{width:44px;height:44px;border:1px solid #ffffff42;border-radius:13px;color:#fff;background:#ffffff10;font-size:1.5rem}.cp-note{margin:0 0 13px;padding:11px 13px;border:1px solid #63d99544;border-radius:13px;color:#d9f5e5;background:#0b39241f;font-size:.84rem;line-height:1.4}.cp-search{width:100%;min-height:50px;margin-bottom:13px;padding:0 14px;border:1px solid #63d99566;border-radius:14px;outline:0;color:#fff;background:#ffffff0b;font:inherit}.cp-search::placeholder{color:#9cb1a5}.cp-links{display:grid;grid-template-columns:1fr 1fr;gap:9px}.cp-links a{min-height:48px;padding:12px;display:flex;align-items:center;border:1px solid #ffffff18;border-radius:13px;color:#fff;background:#ffffff0b;text-decoration:none;font-weight:750}.cp-links a:hover,.cp-links a:focus{border-color:#64e29a;background:#17482e}.cp-status{margin:13px 2px 0;color:#9fb2a8;font:600 12px/1.4 system-ui}@media(max-width:430px){.cp-links{grid-template-columns:1fr}}`;
    document.head.appendChild(style);

    const button=document.createElement('button');button.id='controlPhiButton';button.type='button';button.textContent='☰';button.setAttribute('aria-label','Open Channels');button.setAttribute('aria-expanded','false');
    const panel=document.createElement('aside');panel.id='controlPhiPanel';panel.setAttribute('aria-hidden','true');panel.innerHTML='<div class="cp-head"><strong>Channels</strong><button type="button" aria-label="Close Channels">×</button></div><p class="cp-note">Shared Infinity remote. Channel names come from the Control Phi registry, with a built-in fallback so the remote still works if that service is not deployed.</p><input class="cp-search" type="search" placeholder="Search channels, News Phi, Omni…"><nav class="cp-links" aria-label="Channels"></nav><p class="cp-status">Loading shared registry…</p>';
    document.body.append(button,panel);
    const nav=panel.querySelector('.cp-links'),input=panel.querySelector('.cp-search'),status=panel.querySelector('.cp-status');
    const render=items=>{nav.innerHTML=items.map(item=>`<a href="${href(item)}" data-search="${esc([item.name,item.path,item.type,(item.genres||[]).join(' ')].join(' ').toLowerCase())}">${esc(item.name)}</a>`).join('');};
    render(fallback);status.textContent=`${fallback.length} destinations ready · fallback registry`;
    fetch(REGISTRY+'?remote='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(data=>{const items=Array.isArray(data.channels)&&data.channels.length?data.channels:fallback;render(items);status.textContent=`${items.length} destinations · Control Phi registry v${data.version??'live'}`;}).catch(()=>{});
    const open=()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false');button.setAttribute('aria-expanded','true')};
    const close=()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true');button.setAttribute('aria-expanded','false')};
    button.addEventListener('click',()=>panel.classList.contains('open')?close():open());panel.querySelector('.cp-head button').addEventListener('click',close);panel.addEventListener('click',e=>{if(e.target.closest('a[href]'))close()});
    input.addEventListener('input',()=>{const q=clean(input.value).toLowerCase();nav.querySelectorAll('a').forEach(a=>a.hidden=!!q&&!a.dataset.search.includes(q));});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
