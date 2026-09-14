(function(root){
  'use strict';
  if(!Array.isArray(root.BET_CATALOG))root.BET_CATALOG=[];
  const known=new Set(root.BET_CATALOG.map(item=>item.id));
  const extra=[
    {
      id:'bet-awards-2026-marathon-1',title:'BET Awards 2026 — All-Day Marathon, Hours 1–6',year:2026,
      collection:'BET Awards 2026 · Performances · Interviews · Culture',category:'culture',
      videoId:'0Z2x4abBr4Q',slotSeconds:21600,sourceStart:0,cleared:true,source:'BETNetworks'
    },
    {
      id:'bet-awards-2026-marathon-2',title:'BET Awards 2026 — All-Day Marathon, Hours 7–12',year:2026,
      collection:'BET Awards 2026 · Performances · Interviews · Culture',category:'music',
      videoId:'0Z2x4abBr4Q',slotSeconds:21600,sourceStart:21600,cleared:true,source:'BETNetworks'
    },
    {
      id:'bet-awards-2026-marathon-3',title:'BET Awards 2026 — All-Day Marathon, Hours 13–18',year:2026,
      collection:'BET Awards 2026 · Performances · Interviews · Culture',category:'culture',
      videoId:'0Z2x4abBr4Q',slotSeconds:21600,sourceStart:43200,cleared:true,source:'BETNetworks'
    },
    {
      id:'bet-awards-2026-marathon-4',title:'BET Awards 2026 — All-Day Marathon, Hours 19–24',year:2026,
      collection:'BET Awards 2026 · Performances · Interviews · Culture',category:'music',
      videoId:'0Z2x4abBr4Q',slotSeconds:21600,sourceStart:64800,cleared:true,source:'BETNetworks'
    },
    {
      id:'bet-awards-2021-performances',title:'BET Awards 2021 — Performances',year:2021,
      collection:'BET Awards · Music Performances',category:'music',
      videoId:'blJ31fGbQZE',slotSeconds:3600,sourceStart:0,cleared:true,source:'BETNetworks'
    },
    {
      id:'hagler-duran-1983',title:'Marvin Hagler vs Roberto Duran — Classic Fight',year:1983,
      collection:'Championship Boxing · Middleweight Classics',category:'boxing',
      videoId:'50gRxreUjYw',slotSeconds:3600,sourceStart:0,cleared:true,source:'Top Rank Boxing'
    },
    {
      id:'top-rank-best-2019',title:'Top Rank — Best Fights of 2019',year:2019,
      collection:'Boxing Yearbook · Best Fights',category:'boxing',
      videoId:'LfLLSfjDfv4',slotSeconds:7200,sourceStart:0,cleared:true,source:'Top Rank Boxing'
    },
    {
      id:'roy-jones-thomas-tate',title:'Roy Jones Jr. vs Thomas Tate — Full Fight',year:1994,
      collection:'Boxing Classics · Roy Jones Jr.',category:'boxing',
      videoId:'KCYlQAegMlU',slotSeconds:3600,sourceStart:0,cleared:true,source:'Top Rank Boxing'
    }
  ];
  extra.forEach(item=>{if(!known.has(item.id)){known.add(item.id);root.BET_CATALOG.push(item)}});
})(window);
