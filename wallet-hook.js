(function betWalletHook(){
  'use strict';

  function snapshot(){
    if(window.ControlPhi&&typeof window.ControlPhi.wallet==='function'){
      return window.ControlPhi.wallet();
    }
    return {balance:0,progressToNextCoin:0,username:'Guest'};
  }

  function render(){
    const button=document.getElementById('betWalletButton');
    if(!button)return;
    const state=snapshot();
    const balance=Number(state.balance)||0;
    const progress=Number(state.progressToNextCoin)||0;
    button.innerHTML=`Wallet · <strong>${balance} ⭐</strong> · <span>${progress}/10</span>`;
    button.setAttribute('aria-label',`Open StarCoin wallet. Balance ${balance}. Share progress ${progress} of 10.`);
  }

  function openSharedWallet(){
    if(window.ControlPhi&&typeof window.ControlPhi.refreshWallet==='function')window.ControlPhi.refreshWallet();
    const sharedButton=document.getElementById('controlPhiWalletButton');
    if(sharedButton){sharedButton.click();render();return;}
    render();
  }

  function install(){
    const controls=document.querySelector('.controls');
    if(!controls||document.getElementById('betWalletButton')){render();return;}
    const button=document.createElement('button');
    button.id='betWalletButton';
    button.type='button';
    button.className='infinity-wallet-button';
    button.addEventListener('click',openSharedWallet);
    const status=document.getElementById('shareStatus');
    controls.insertBefore(button,status||null);
    render();
  }

  window.addEventListener('controlphi:wallet-change',render);
  window.addEventListener('starquest:share-progress',render);
  window.addEventListener('storage',render);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  setTimeout(install,0);
})();
