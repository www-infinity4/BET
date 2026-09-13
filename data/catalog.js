(function(root){
  "use strict";

  root.INFINITY_CHANNEL = { id:"BET", name:"BET", tagline:"Black entertainment, sports, music and culture — only the good stuff." };

  // Curated from official/verified rights-holder channels. "slotSeconds" is the
  // station window; long marathons use a sourceStart so the channel can air a
  // strong section without pretending a clip is a complete movie or fight.
  root.BET_CATALOG = [
    {
      id:"jordan-last-shot-1998", title:"Michael Jordan — 1998 Finals Game 6: The Last Shot",
      year:1998, collection:"NBA Classic · Chicago Bulls", category:"basketball",
      videoId:"92fLApYaCGI", slotSeconds:7010, sourceStart:0, cleared:true,
      source:"NBA"
    },
    {
      id:"jordan-55-msg", title:"Michael Jordan Drops 55 at Madison Square Garden — Bulls vs Knicks",
      year:1995, collection:"NBA Classic · Chicago Bulls", category:"basketball",
      videoId:"lO2yOETR2jQ", slotSeconds:6989, sourceStart:0, cleared:true,
      source:"NBA"
    },
    {
      id:"iverson-60", title:"Allen Iverson 60-Point Classic — 76ers vs Magic",
      year:2005, collection:"NBA Classic · Allen Iverson", category:"basketball",
      videoId:"nayC5nSm8Eo", slotSeconds:6033, sourceStart:0, cleared:true,
      source:"NBA"
    },
    {
      id:"jordan-kobe-1997", title:"Michael Jordan vs Kobe Bryant — Bulls vs Lakers Classic",
      year:1997, collection:"NBA Classic", category:"basketball",
      videoId:"qdr-ne7UNTo", slotSeconds:7200, sourceStart:0, cleared:true,
      source:"NBA archive"
    },
    {
      id:"ali-dunn", title:"Muhammad Ali vs Richard Dunn — Full Fight",
      year:1976, collection:"Championship Boxing · Muhammad Ali", category:"boxing",
      videoId:"WcrnAUTEHlc", slotSeconds:3300, sourceStart:0, cleared:true,
      source:"Top Rank Boxing"
    },
    {
      id:"hagler-leonard", title:"Sugar Ray Leonard vs Marvin Hagler — Full Fight",
      year:1987, collection:"Championship Boxing", category:"boxing",
      videoId:"zH1U1jC0Lgc", slotSeconds:2701, sourceStart:0, cleared:true,
      source:"Top Rank Boxing"
    },
    {
      id:"foreman-frazier", title:"George Foreman vs Joe Frazier I — Full Fight",
      year:1973, collection:"Heavyweight Classics", category:"boxing",
      videoId:"vkflIMkS23k", slotSeconds:2700, sourceStart:0, cleared:true,
      source:"ESPN Throwback"
    },
    {
      id:"roy-jones-toney", title:"Roy Jones Jr. vs James Toney — Full Fight Replay",
      year:1994, collection:"Boxing Classics", category:"boxing",
      videoId:"V-tkMTHp0t4", slotSeconds:4200, sourceStart:0, cleared:true,
      source:"TNT Sports Boxing"
    },
    {
      id:"mayweather-judah", title:"Floyd Mayweather vs Zab Judah — Full Fight",
      year:2006, collection:"Boxing Classics · No Commentary", category:"boxing",
      videoId:"Hivpd15aiQ4", slotSeconds:4500, sourceStart:0, cleared:true,
      source:"Top Rank Boxing"
    },
    {
      id:"hearns-shields", title:"Thomas Hearns vs Randy Shields — Full Fight",
      year:1986, collection:"Boxing Classics", category:"boxing",
      videoId:"vN6TICQbuWE", slotSeconds:4200, sourceStart:0, cleared:true,
      source:"Top Rank Boxing"
    },
    {
      id:"ali-spinks-saga", title:"Muhammad Ali vs Leon Spinks — The Entire Saga",
      year:1978, collection:"Heavyweight Classics", category:"boxing",
      videoId:"LzQf5lb4gbg", slotSeconds:5905, sourceStart:0, cleared:true,
      source:"Top Rank Boxing"
    },
    {
      id:"pacquiao-bradley", title:"Manny Pacquiao vs Timothy Bradley III — Full Experience",
      year:2016, collection:"Boxing Classics", category:"boxing",
      videoId:"XkEg78SfKcg", slotSeconds:6900, sourceStart:0, cleared:true,
      source:"Top Rank Boxing"
    },
    {
      id:"mason-nakathila", title:"Abdullah Mason vs Jeremia Nakathila — Full Fight",
      year:2025, collection:"Modern Boxing", category:"boxing",
      videoId:"VZ73C6RwPnI", slotSeconds:3600, sourceStart:0, cleared:true,
      source:"Top Rank Boxing"
    },
    {
      id:"mason-ko-marathon", title:"Abdullah Mason — Two Hours of Knockouts",
      year:2026, collection:"Modern Boxing Marathon", category:"boxing",
      videoId:"Ma-WasvTXVw", slotSeconds:7200, sourceStart:0, cleared:true,
      source:"Top Rank Boxing"
    },
    {
      id:"crawford-marathon", title:"Terence ‘Bud’ Crawford — Fight Marathon",
      year:2026, collection:"Modern Boxing Marathon", category:"boxing",
      videoId:"fIO9N3nsMXY", slotSeconds:7200, sourceStart:0, cleared:true,
      source:"Top Rank Boxing"
    },
    {
      id:"bet-hiphop-marathon-a", title:"BET Hip Hop Awards — Best Performances Marathon",
      year:2021, collection:"BET Music · Performance Marathon", category:"music",
      videoId:"ANk6LohdPc0", slotSeconds:7200, sourceStart:0, cleared:true,
      source:"BETNetworks"
    },
    {
      id:"bet-hiphop-marathon-b", title:"BET Hip Hop Awards — Best Performances Marathon, Part II",
      year:2021, collection:"BET Music · Performance Marathon", category:"music",
      videoId:"ANk6LohdPc0", slotSeconds:7200, sourceStart:7200, cleared:true,
      source:"BETNetworks"
    },
    {
      id:"bet-hiphop-marathon-c", title:"BET Hip Hop Awards — Best Performances Marathon, Part III",
      year:2021, collection:"BET Music · Performance Marathon", category:"music",
      videoId:"ANk6LohdPc0", slotSeconds:7200, sourceStart:14400, cleared:true,
      source:"BETNetworks"
    },
    {
      id:"bet-awards-2026-red-carpet", title:"BET Awards 2026 — Red Carpet Live",
      year:2026, collection:"BET Awards · Culture", category:"culture",
      videoId:"oVFvCNFYGFM", slotSeconds:5400, sourceStart:0, cleared:true,
      source:"BETNetworks"
    },
    {
      id:"tyson-spotlight", title:"Mike Tyson Spotlight — Young Tyson Unleashed",
      year:1980, collection:"Heavyweight Spotlight", category:"boxing",
      videoId:"Iyg9nWjoD-s", slotSeconds:1200, sourceStart:0, cleared:true,
      source:"Top Rank Boxing", note:"Official Tyson spotlight; not labeled as a full fight."
    }
  ];

  root.BET_PREMIUM_TARGETS = [
    { title:"Space Jam (1996)", note:"Featured movie target — schedule only when a legitimate full-length playback source is available." },
    { title:"Mike Tyson — complete classic fights", note:"Priority target — only sources that genuinely contain the complete bout." }
  ];
})(window);
