import { useState, useEffect } from 'react';
import Web3 from 'web3';

const useWeb3 = () => {
  const [account, setAccount] = useState<string>('');
  const [web3] = useState<Web3>(new Web3((window as any).ethereum));

  const connectToMetaMask = async () => {
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);
  };

  useEffect(() => {
    const accountsChangedCallback = (event: string[]): void => {
      setAccount(event[0]);
    };

    const getAccountData = async () => {
      const accounts = await web3.eth.getAccounts();
      if (!accounts.length) return;
      setAccount(accounts[0]);
    };

    if (web3) {
      (web3.currentProvider as any).on('accountsChanged', accountsChangedCallback);
      getAccountData();
    }
    return () => {
      (web3.currentProvider as any).off('accountsChanged', accountsChangedCallback);
    };
  }, [web3]);

  return { web3, account, connectToMetaMask };
};

export default useWeb3;
