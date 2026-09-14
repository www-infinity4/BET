(function(){
  'use strict';

  const catalog=(Array.isArray(window.BET_CATALOG)?window.BET_CATALOG:[]).filter(item=>item&&item.cleared&&item.videoId);
  const $=id=>document.getElementById(id);
  const els={
    clock:$('stationClock'),title:$('nowTitle'),mode:$('modeLabel'),programTime:$('programTime'),player:$('player'),enter:$('enterButton'),
    card:$('stationCard'),cardLabel:$('stationCardLabel'),cardTitle:$('stationCardTitle'),cardCountdown:$('stationCardCountdown'),
    startOver:$('startOverButton'),rewind:$('rewindButton'),live:$('liveButton'),share:$('shareButton'),shareStatus:$('shareStatus'),
    progress:$('progressBar'),position:$('positionLabel'),remaining:$('remainingLabel'),next:$('nextCards'),guide:$('guideRows'),guideDate:$('guideDate'),premium:$('premiumTargets')
  };

  let player=null,playerReady=false,apiRequested=false,entered=false,mode='live',shiftBaseMs=0,shiftStartMs=0,loadedKey='',sourceEnded=false;
  let schedule=[],scheduleAnchor=0,currentGuideDay='';

  function hash(text){let value=2166136261;for(let i=0;i<text.length;i++)value=Math.imul(value^text.charCodeAt(i),16777619);return value>>>0}
  function seededShuffle(items,seedText){
    const copy=items.slice();let seed=hash(seedText);
    const random=()=>{seed+=0x6D2B79F5;let t=seed;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};
    for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy;
  }
  function localMidnight(ms){const d=new Date(ms);d.setHours(0,0,0,0);return d.getTime()}
  function weekAnchor(ms){const d=new Date(localMidnight(ms));const day=d.getDay();const back=(day+6)%7;d.setDate(d.getDate()-back);return d.getTime()}
  function dayKey(ms){const d=new Date(ms);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function fmtTime(ms){return new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit'}).format(new Date(ms))}
  function fmtDuration(sec){const m=Math.max(0,Math.ceil(sec/60));return m>=60?`${Math.floor(m/60)}h ${m%60}m`:`${m} min`}
  function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}
  function art(program){return program.posterUrl||`https://i.ytimg.com/vi/${program.videoId}/maxresdefault.jpg`}

  function alternateCategories(items){
    const pool=items.slice(),out=[];
    while(pool.length){
      const prev=out[out.length-1];
      let pick=0;
      if(prev){const different=pool.findIndex(item=>item.category!==prev.category&&item.id!==prev.id);if(different>=0)pick=different}
      out.push(pool.splice(pick,1)[0]);
    }
    return out;
  }

  function cycleFor(anchor,cycle,last){
    let order=alternateCategories(seededShuffle(catalog,`BET:${dayKey(anchor)}:cycle:${cycle}`));
    if(last&&order.length>1&&order[0].id===last.id){const i=order.findIndex(item=>item.id!==last.id&&item.category!==last.category);if(i>0)[order[0],order[i]]=[order[i],order[0]]}
    return order;
  }

  function buildSchedule(ms){
    const anchor=weekAnchor(ms),end=anchor+14*86400000,out=[];
    if(!catalog.length)return{anchor,out};
    let cursor=anchor,cycle=0,last=null,order=[];
    while(cursor<end){
      if(!order.length)order=cycleFor(anchor,cycle++,last);
      const program=order.shift();
      const requested=Math.max(600,Math.min(21600,Number(program.slotSeconds)||3600));
      const seconds=Math.min(requested,Math.floor((end-cursor)/1000));
      out.push({id:`${dayKey(cursor)}-${String(out.length).padStart(3,'0')}`,program,startsAtMs:cursor,endsAtMs:cursor+seconds*1000,seconds});
      cursor+=seconds*1000;last=program;
    }
    return{anchor,out};
  }

  function ensureSchedule(ms){
    const anchor=weekAnchor(ms);
    if(schedule.length&&scheduleAnchor===anchor)return;
    const built=buildSchedule(ms);scheduleAnchor=built.anchor;schedule=built.out;loadedKey='';sourceEnded=false;renderWeeklyGuide();renderDayGuide(ms);
  }
  function activeMs(){return mode==='live'?Date.now():shiftBaseMs+(Date.now()-shiftStartMs)}
  function currentBlock(ms){return schedule.find(item=>ms>=item.startsAtMs&&ms<item.endsAtMs)||schedule[schedule.length-1]}
  function dayItems(ms){const start=localMidnight(ms),end=start+86400000;return schedule.filter(item=>item.startsAtMs<end&&item.endsAtMs>start)}

  function renderDayGuide(ms){
    if(!els.guide)return;const key=dayKey(ms);if(currentGuideDay===key&&els.guide.children.length)return;currentGuideDay=key;
    const items=dayItems(ms);els.guideDate.textContent=new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric'}).format(new Date(ms));
    els.guide.innerHTML=items.map(item=>`<article class="guide-row" data-id="${item.id}" style="--guide-art:url('${art(item.program)}')"><time>${fmtTime(item.startsAtMs)}</time><div><strong>${esc(item.program.title)}</strong><span>${esc(item.program.collection)} · ${esc(item.program.source)}</span></div></article>`).join('');
  }

  function renderWeeklyGuide(){
    const existing=document.getElementById('betWeeklyGuide');if(existing)existing.remove();
    const host=document.querySelector('.guide');if(!host)return;
    const section=document.createElement('section');section.id='betWeeklyGuide';section.className='guide bet-weekly-guide';
    const today=localMidnight(Date.now());
    let html='<div class="section-heading guide-heading"><div><p>LOCKED WEEKLY ROTATION · EVERY ITEM BEFORE REPEAT</p><h2>BET 7-day guide</h2></div></div><div class="bet-week-days">';
    for(let day=0;day<7;day++){
      const ms=today+day*86400000,items=dayItems(ms);
      html+=`<section class="bet-week-day"><h3>${new Intl.DateTimeFormat('en-US',{weekday:'long',month:'short',day:'numeric'}).format(new Date(ms))}</h3><div class="guide-rows">${items.map(item=>`<article class="guide-row" style="--guide-art:url('${art(item.program)}')"><time>${fmtTime(item.startsAtMs)}</time><div><strong>${esc(item.program.title)}</strong><span>${esc(item.program.category||'BET')} · ${esc(item.program.source)}</span></div></article>`).join('')}</div></section>`;
    }
    html+='</div>';section.innerHTML=html;host.after(section);
  }

  function renderNext(block){
    if(!block||!els.next)return;const index=schedule.findIndex(item=>item.id===block.id);
    els.next.innerHTML=[1,2,3].map(step=>{const item=schedule[index+step]||schedule[(index+step)%schedule.length];return`<article class="next-card" style="--card-art:url('${art(item.program)}')"><time>${fmtTime(item.startsAtMs)}</time><div><h3>${esc(item.program.title)}</h3><p>${esc(item.program.collection)}</p></div></article>`}).join('');
  }
  function renderPremium(){const targets=Array.isArray(window.BET_PREMIUM_TARGETS)?window.BET_PREMIUM_TARGETS:[];if(els.premium&&targets.length)els.premium.innerHTML=targets.map(t=>`<article><strong>${esc(t.title)}</strong><span>${esc(t.note)}</span></article>`).join('')}
  function showCard(label,title,countdown){if(!els.card)return;els.card.hidden=false;els.cardLabel.textContent=label;els.cardTitle.textContent=title;els.cardCountdown.textContent=countdown||''}
  function hideCard(){if(els.card)els.card.hidden=true}

  function loadProgram(block,elapsed){
    if(!entered||!block||!playerReady)return;const program=block.program,key=`${block.id}:${program.videoId}:${program.sourceStart||0}`;
    if(loadedKey!==key){loadedKey=key;sourceEnded=false;hideCard();player.loadVideoById({videoId:program.videoId,startSeconds:(Number(program.sourceStart)||0)+elapsed});return}
    if(sourceEnded){showCard('BET',program.title,'Source completed. The station remains synchronized and moves on at the scheduled time.');return}
    if(mode==='live'&&player.getPlayerState&&player.getPlayerState()===YT.PlayerState.PLAYING){const target=(Number(program.sourceStart)||0)+elapsed,drift=target-player.getCurrentTime();if(Math.abs(drift)>4)player.seekTo(target,true)}
  }

  function tick(){
    const now=activeMs();ensureSchedule(now);renderDayGuide(now);const block=currentBlock(now);if(!block)return;
    const elapsed=Math.max(0,Math.floor((now-block.startsAtMs)/1000)),remaining=Math.max(0,Math.floor((block.endsAtMs-now)/1000));
    els.clock.textContent=`${fmtTime(Date.now())} local`;els.mode.textContent=mode==='live'?'LIVE BET':'TIME SHIFTED';els.title.textContent=block.program.title;els.programTime.textContent=`${fmtTime(block.startsAtMs)}–${fmtTime(block.endsAtMs)}`;
    els.position.textContent=mode==='live'?'Synced to the BET station clock':`${fmtDuration(elapsed)} from start`;els.remaining.textContent=`${fmtDuration(remaining)} remaining`;els.progress.style.width=`${Math.min(100,(elapsed/block.seconds)*100)}%`;
    document.body.style.setProperty('--program-art',`url('${art(block.program)}')`);document.querySelectorAll('#guideRows .guide-row').forEach(row=>row.classList.toggle('current',row.dataset.id===block.id));renderNext(block);loadProgram(block,elapsed);
  }

  function loadYouTube(){if(apiRequested||playerReady)return;apiRequested=true;if(window.YT&&window.YT.Player){window.onYouTubeIframeAPIReady();return}const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.referrerPolicy='strict-origin-when-cross-origin';document.head.appendChild(script)}
  function enter(){entered=true;els.enter.hidden=true;loadYouTube();tick()}
  function startOver(){const live=currentBlock(Date.now());if(!live)return;mode='shift';shiftBaseMs=live.startsAtMs;shiftStartMs=Date.now();loadedKey='';tick()}
  function rewind(){mode='shift';shiftBaseMs=Math.max(scheduleAnchor,activeMs()-30000);shiftStartMs=Date.now();loadedKey='';tick()}
  function joinLive(){mode='live';loadedKey='';sourceEnded=false;tick()}

  function localShareCredit(reference){
    const attemptId=`bet-share-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    if(window.ControlPhi&&typeof window.ControlPhi.ensureShareCredit==='function')return window.ControlPhi.ensureShareCredit(reference,'web_share_api');
    return{progressToNextCoin:0,awarded:0};
  }
  async function share(){
    const block=currentBlock(Date.now()),title=block?block.program.title:'BET',payload={title:`${title} · BET`,text:`Watch ${title} on BET.`,url:location.href};
    if(!navigator.share){try{await navigator.clipboard.writeText(payload.url);els.shareStatus.textContent='BET link copied.'}catch(_){els.shareStatus.textContent='Sharing is unavailable in this browser.'}return}
    try{await navigator.share(payload);const result=localShareCredit(payload.url);els.shareStatus.textContent=result?.awarded?'Shared · 1 StarCoin completed!':`Shared · StarCoin progress ${result?.progressToNextCoin??0}/10`}catch(error){if(!error||error.name!=='AbortError')els.shareStatus.textContent='Share did not complete.'}
  }

  window.onYouTubeIframeAPIReady=function(){
    player=new YT.Player('player',{width:'100%',height:'100%',playerVars:{playsinline:1,controls:1,enablejsapi:1,rel:0,origin:location.origin,widget_referrer:location.href},events:{
      onReady:()=>{playerReady=true;player.unMute();player.setVolume(100);tick()},
      onStateChange:event=>{if(event.data===YT.PlayerState.ENDED)sourceEnded=true},
      onError:()=>{const block=currentBlock(activeMs());showCard('SOURCE UNAVAILABLE',block?block.program.title:'BET','This source cannot play here right now. The guide and station clock remain intact.')}
    }})
  };

  els.enter?.addEventListener('click',enter);els.startOver?.addEventListener('click',startOver);els.rewind?.addEventListener('click',rewind);els.live?.addEventListener('click',joinLive);els.share?.addEventListener('click',share);
  renderPremium();ensureSchedule(Date.now());tick();setInterval(tick,1000);
})();
