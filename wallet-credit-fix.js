(function betWalletCreditFix(){
  'use strict';

  const GUEST_KEY='starquest_guest_profile_v1';
  const SESSION_KEY='starquest_session';
  const USERS_KEY='starquest_users';
  const SOURCE='bet-wallet-credit';

  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};

  function store(){
    const session=read(SESSION_KEY,null);
    const users=read(USERS_KEY,{});
    if(session&&session.key&&users&&users[session.key]){
      return {
        profile:users[session.key],
        save(profile){users[session.key]=profile;write(USERS_KEY,users)}
      };
    }
    const guest=read(GUEST_KEY,{key:'__guest__',username:'Guest',tokens:0,shareCount:0,pendingShareCredits:0,shareEvents:[],ledger:[]});
    return {profile:guest,save(profile){write(GUEST_KEY,profile)}};
  }

  function normalize(profile){
    const wallet=profile&&typeof profile==='object'?profile:{};
    wallet.tokens=Math.max(0,Number(wallet.tokens)||0);
    wallet.shareCount=Math.max(0,Number(wallet.shareCount)||0);
    wallet.pendingShareCredits=Math.max(0,Number(wallet.pendingShareCredits)||0);
    wallet.shareEvents=Array.isArray(wallet.shareEvents)?wallet.shareEvents:[];
    wallet.ledger=Array.isArray(wallet.ledger)?wallet.ledger:[];
    return wallet;
  }

  function credit(reference='',method='web_share_api'){
    const walletStore=store();
    const wallet=normalize(walletStore.profile);
    const now=Date.now();

    // Only dedupe receipts written by this BET credit path. Other recent share
    // events must never suppress a legitimate +1/10 credit.
    const duplicate=wallet.shareEvents.find(event=>
      event&&event.source===SOURCE&&
      event.contentId===String(reference||location.href)&&
      Math.abs(now-Number(event.createdAt||0))<2500
    );
    if(duplicate){
      const snapshot={balance:wallet.tokens,progressToNextCoin:wallet.pendingShareCredits,shareCount:wallet.shareCount,awarded:0,alreadyRecorded:true,source:SOURCE};
      window.ControlPhi?.refreshWallet?.();
      return snapshot;
    }

    const attemptId=`bet-credit-${now.toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    wallet.shareCount+=1;
    wallet.pendingShareCredits+=1;
    wallet.shareEvents.push({
      id:attemptId,
      attemptId,
      contentId:String(reference||location.href),
      method,
      confirmed:true,
      verified:true,
      credited:true,
      source:SOURCE,
      createdAt:now
    });

    let awarded=0;
    while(wallet.pendingShareCredits>=10){
      wallet.pendingShareCredits-=10;
      wallet.tokens+=1;
      awarded+=1;
    }

    wallet.ledger.push({
      id:`tx-${attemptId}`,
      type:awarded?'share_reward':'share_credit',
      amount:awarded,
      balance:wallet.tokens,
      pendingShareCredits:wallet.pendingShareCredits,
      reason:awarded?'Share reward: 10 completed shares':`Confirmed BET share ${wallet.pendingShareCredits}/10`,
      referenceId:attemptId,
      source:SOURCE,
      createdAt:now
    });

    wallet.shareEvents=wallet.shareEvents.slice(-250);
    wallet.ledger=wallet.ledger.slice(-500);
    walletStore.save(wallet);

    const detail={balance:wallet.tokens,progressToNextCoin:wallet.pendingShareCredits,shareCount:wallet.shareCount,awarded,source:SOURCE};
    window.dispatchEvent(new CustomEvent('starquest:share-progress',{detail}));
    window.dispatchEvent(new CustomEvent('controlphi:wallet-change',{detail}));
    window.ControlPhi?.refreshWallet?.();
    return detail;
  }

  function install(){
    if(!window.ControlPhi){setTimeout(install,50);return;}
    window.ControlPhi.ensureShareCredit=credit;
    window.BETWalletCredit={credit};
  }

  install();
})();
