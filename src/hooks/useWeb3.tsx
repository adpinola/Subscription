import { useState } from 'react';
import Web3 from 'web3';

const useWeb3 = () => {
  const [web3] = useState<Web3>(new Web3((window as any).ethereum));
  return web3;
};

export default useWeb3;
