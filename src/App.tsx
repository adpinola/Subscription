import React, { FC, useCallback, useEffect, useState } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import Admin from './components/Admin';
import Subscriber from './components/Subscriber';
import { useAccount, useSubscriptionContext } from './context/SmartContractContext';

const App: FC = () => {
  const contract = useSubscriptionContext();
  const account = useAccount();
  const [isOwner, setIsOwner] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(true);

  const checkAccount = useCallback(async () => {
    const checkIfIsOwner = async (): Promise<boolean> => {
      const contractData = await contract.getAllContractData(account);
      if (contractData.owner.toUpperCase() === account.toUpperCase()) {
        return true;
      }
      return false;
    };

    const checkIfIsSubscribed = async (): Promise<boolean> => {
      return contract.amISubscribed(account);
    };
    if (!account) return;
    const ownership = await checkIfIsOwner();
    const subscription = await checkIfIsSubscribed();
    console.log({ ownership, subscription });
    setIsOwner(ownership);
    setIsSubscribed(subscription);
  }, [account, contract]);

  useEffect(() => {
    checkAccount();
  }, [checkAccount]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<PrivateRoute authCondition={isOwner} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="/subscriber" element={<PrivateRoute authCondition={isSubscribed} />}>
            <Route path="/subscriber" element={<Subscriber />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
