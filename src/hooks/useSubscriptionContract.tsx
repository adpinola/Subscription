import { useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { ISubscriptionContract, SubscriptionContract } from '../services/ethereum/SubscriptionContract';

const useSubscriptionContract = (abi: AbiItem[], address: string) => {
  const web3 = new Web3((window as any).web3.currentProvider);
  const [contractInstance] = useState<ISubscriptionContract>(new SubscriptionContract(web3, abi, address));
  return contractInstance;
};

export default useSubscriptionContract;
