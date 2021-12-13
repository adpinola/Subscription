import { useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import SubscriptionContract from '../services/ethereum/SubscriptionContract';
import ISubscriptionContract from '../services/ethereum/ISubscriptionContract';

const useSubscriptionContract = (provider: Web3, abi: AbiItem[], address: string) => {
  const [contractInstance] = useState<ISubscriptionContract>(new SubscriptionContract(provider, abi, address));
  return contractInstance;
};

export default useSubscriptionContract;
