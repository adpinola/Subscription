// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Admin from './components/Admin';
import Subscriber from './components/Subscriber';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAccount, useSubscriptionContext } from './context/SmartContractContext';

const App: FC = () => {
  // const contract = useSubscriptionContext();
  const account = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // const checkIfIsOwner = useCallback(async (): Promise<boolean> => {
  //   const contractData = await contract.getAllContractData(account);
  //   if (contractData.owner.toUpperCase() === account.toUpperCase()) {
  //     return true;
  //   }
  //   return false;
  // }, [contract, account]);

  // const checkIfIsSubscribed = useCallback(async (): Promise<boolean> => {
  //   return contract.amISubscribed(account);
  // }, [contract, account]);

  // const checkAccount = useCallback(async () => {
  //   console.log({ account });
  //   if (!account) return;
  //   const ownership = await checkIfIsOwner();
  //   const subscription = await checkIfIsSubscribed();
  //   setIsOwner(ownership);
  //   setIsSubscribed(subscription);
  // }, [account, checkIfIsOwner, checkIfIsSubscribed]);

  // // useEffect(() => {
  // //   checkAccount();
  // // }, [checkAccount]);

  const onSuccess = () => {
    setIsSubscribed(true);
  };

  useEffect(() => {
    setIsOwner(false);
    setIsSubscribed(false);
  }, [account]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onSuccess={onSuccess} />} />
          <Route path="/admin" element={<PrivateRoute authCondition={isOwner} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="/" element={<PrivateRoute authCondition={isSubscribed} />}>
            <Route path="/" element={<Subscriber />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
