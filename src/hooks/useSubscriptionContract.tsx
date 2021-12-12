import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import SubscriptionContract from '../services/ethereum/SubscriptionContract';
import ISubscriptionContract from '../services/ethereum/ISubscriptionContract';

const useSubscriptionContract = (provider: Web3, abi: AbiItem[], address: string) => {
  useEffect(() => {
    if (provider) {
      setContractInstance(new SubscriptionContract(provider, abi, address));
    }
  }, [provider, abi, address]);

  const [contractInstance, setContractInstance] = useState<ISubscriptionContract>();
  return contractInstance;
};

export default useSubscriptionContract;
