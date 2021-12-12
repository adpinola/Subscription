import React, { FC, useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { AbiItem } from 'web3-utils';
import Home from './components/Home';
import Admin from './components/Admin';
import Subscriber from './components/Subscriber';
import useSubscriptionContract from './hooks/useSubscriptionContract';
import { abi, networks } from './assets/Subscription.json';

const contractAddress = networks['5777'].address;

const myAddress = '0x7da6A85aE424B55Fa9A69e96489bcCdead21b066';

const App: FC = () => {
  const subscriptionContract = useSubscriptionContract(abi as AbiItem[], contractAddress);

  useEffect(() => {
    const printData = async () => {
      console.log(await subscriptionContract.getAllContractData(myAddress));
    };
    printData();
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/subscriber" element={<Subscriber />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
