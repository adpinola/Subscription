import React, { FC } from 'react';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import ISubscriptionContract from '../services/ethereum/ISubscriptionContract';
import useSubscriptionContract from '../hooks/useSubscriptionContract';
import useWeb3 from '../hooks/useWeb3';
import { abi, networks } from '../assets/Subscription.json';

const newtworkId = process.env.REACT_APP_EHTEREUM_NETWORK_ID;
const contractAddress = (networks as any)[newtworkId as string].address;

const SubscriptionContext = React.createContext<ISubscriptionContract | undefined>(undefined);
const MetaMaskContext = React.createContext<(() => Promise<void>) | undefined>(undefined);
const AccountContext = React.createContext<string>('');

interface ISmartContractContextProvider {
  children: React.ReactNode;
}

const SmartContractContextProvider: FC<ISmartContractContextProvider> = (props) => {
  const { web3, account, connectToMetaMask } = useWeb3();
  const contractInstance = useSubscriptionContract(web3 as Web3, abi as AbiItem[], contractAddress);
  return (
    <AccountContext.Provider value={account}>
      <MetaMaskContext.Provider value={connectToMetaMask}>
        <SubscriptionContext.Provider value={contractInstance}>{props.children}</SubscriptionContext.Provider>
      </MetaMaskContext.Provider>
    </AccountContext.Provider>
  );
};

function useSubscriptionContext() {
  const context = React.useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within an SmartContractContextProvider');
  }
  return context;
}

function useMetaMask() {
  const context = React.useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask must be used within an SmartContractContextProvider');
  }
  return context;
}

function useAccount() {
  const context = React.useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an SmartContractContextProvider');
  }
  return context;
}

export { SmartContractContextProvider, useSubscriptionContext, useMetaMask, useAccount };
