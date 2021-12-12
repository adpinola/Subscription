import React, { FC } from 'react';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import ISubscriptionContract from '../services/ethereum/ISubscriptionContract';
import useSubscriptionContract from '../hooks/useSubscriptionContract';
import useWeb3 from '../hooks/useWeb3';
import { abi, networks } from '../assets/Subscription.json';

const contractAddress = networks['5777'].address;

const SubscriptionContext = React.createContext<ISubscriptionContract | undefined>(undefined);
const Web3Context = React.createContext<Web3 | undefined>(undefined);

interface ISmartContractContextProvider {
  children: React.ReactNode;
}

const SmartContractContextProvider: FC<ISmartContractContextProvider> = (props) => {
  const web3 = useWeb3();
  const contractInstance = useSubscriptionContract(web3 as Web3, abi as AbiItem[], contractAddress);
  return (
    <Web3Context.Provider value={web3}>
      <SubscriptionContext.Provider value={contractInstance}>{props.children}</SubscriptionContext.Provider>
    </Web3Context.Provider>
  );
};

function useSubscriptionContext() {
  const context = React.useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within an SmartContractContextProvider');
  }
  return context;
}

function useWeb3Context() {
  const context = React.useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3Context must be used within an SmartContractContextProvider');
  }
  return context;
}

export { SmartContractContextProvider, useSubscriptionContext, useWeb3Context };
